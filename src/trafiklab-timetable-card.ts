/*
  Trafiklab Timetable Card
  Home Assistant Lovelace custom card that displays upcoming departures from the Trafiklab integration.
*/

import { css, html, LitElement, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';

// Import editor for HA UI config (bundled together by Vite)
import './trafiklab-timetable-card-editor';
import en from './translations/en.json';
import sv from './translations/sv.json';

type HassEntity = {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
};

type TripAlert = {
  title?: string;
  text?: string;
};

type TripCall = {
  stop?: { name?: string; area_id?: string; id?: string };
  scheduledDeparture?: string;
  realtimeDeparture?: string;
  scheduledArrival?: string;
  realtimeArrival?: string;
  scheduled_platform?: { designation?: string } | null;
  realtime_platform?: { designation?: string } | null;
  alerts?: TripAlert[];
  is_realtime?: boolean;
};

type TripDetails = {
  line?: string;
  transport_mode?: string;
  headsign?: string;
  origin?: string;
  destination?: string;
  calls: TripCall[];
};

type HomeAssistant = {
  states: Record<string, HassEntity>;
  formatEntityState?(entity: HassEntity): string;
  locale?: any;
  language?: string;
  callWS<T>(message: Record<string, unknown>): Promise<T>;
};

export interface TrafiklabTimetableCardConfig {
  type: string;
  entity: string; // sensor entity id
  show_name?: boolean; // show heading with entity friendly name
  max_items?: number; // optional, default 5
}

declare global {
  interface Window {
    customCards?: Array<any>;
  }
  interface HTMLElementTagNameMap {
    'trafiklab-timetable-card': TrafiklabTimetableCard;
  }
}

const CARD_TYPE = 'trafiklab-timetable-card';

// The integration refreshes roughly once a minute, but "in N min" has to keep
// moving between those refreshes, so the card re-renders on its own clock too.
// The display is minute-resolution, so this only has to be fine enough that a
// row flips close to its boundary -- a per-second tick would buy nothing.
const TICK_MS = 10_000;

export class TrafiklabTimetableCard extends LitElement {
  private _hass!: HomeAssistant;
  set hass(hass: HomeAssistant) {
    this._hass = hass;
    this.requestUpdate();
  }
  get hass(): HomeAssistant {
    return this._hass;
  }
  @state() private _config?: TrafiklabTimetableCardConfig;
  @state() private _detailsOpen = false;
  @state() private _alertOpen = false;
  @state() private _tripLoading = false;
  @state() private _tripError?: 'error.trip_missing' | 'error.trip_details';
  @state() private _tripDetails?: TripDetails;
  @state() private _selectedTrip?: any;
  @state() private _selectedAlertCall?: TripCall;
  private _tripRequestId = 0;
  // Dynamic overlay sizing
  private _overlayHeight = 0;
  private _overlayTop = 0;
  private _ticker?: number;

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('visibilitychange', this._onVisibilityChange);
    this._startTicker();
  }

  disconnectedCallback(): void {
    document.removeEventListener('visibilitychange', this._onVisibilityChange);
    this._stopTicker();
    super.disconnectedCallback();
  }

  private _onVisibilityChange = (): void => {
    if (document.hidden) this._stopTicker();
    else {
      // Catch up immediately; a backgrounded tab may have missed many ticks.
      this.requestUpdate();
      this._startTicker();
    }
  };

  private _startTicker(): void {
    if (this._ticker !== undefined || document.hidden) return;
    this._ticker = window.setInterval(() => this.requestUpdate(), TICK_MS);
  }

  private _stopTicker(): void {
    if (this._ticker !== undefined) {
      clearInterval(this._ticker);
      this._ticker = undefined;
    }
  }

  static getStubConfig(): Partial<TrafiklabTimetableCardConfig> {
    return { show_name: true, max_items: 5 };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement('trafiklab-timetable-card-editor');
  }

  setConfig(config: TrafiklabTimetableCardConfig): void {
    if (!config || !config.entity) {
      throw new Error('Required property missing: entity');
    }
    this._config = {
      show_name: true,
      max_items: 5,
      ...config,
      type: CARD_TYPE,
    };
  }

  getCardSize(): number {
    const count = this._getDepartures().length || 1;
    return 1 + Math.min(count, this._config?.max_items ?? 5);
  }

  private _getEntity(): HassEntity | undefined {
    const entityId = this._config?.entity;
    if (!entityId) return undefined;
    return this.hass?.states?.[entityId];
  }

  private _t(path: string, vars?: Record<string, any>): string {
    const lang = this.hass?.locale?.language || this.hass?.language || 'en';
    const dict = String(lang).toLowerCase().startsWith('sv') ? (sv as any) : (en as any);
    const value = path.split('.').reduce((acc: any, key: string) => (acc ? acc[key] : undefined), dict) || path;
    if (!vars) return value;
    return Object.entries(vars).reduce((str, [k, v]) => str.replaceAll(`{${k}}`, String(v)), value);
  }

  private _getDepartures(): any[] {
    const entity = this._getEntity();
    if (!entity) return [];
    const upcoming = entity.attributes?.upcoming as any[] | undefined;
    if (Array.isArray(upcoming)) return upcoming;
    const single = this._mapEntityToItem(entity);
    return single ? [single] : [];
  }

  private _mapEntityToItem(entity: HassEntity) {
    const a = entity.attributes || {};
    if (!('destination' in a) && !('scheduled_time' in a)) return undefined;
    return {
      line: a.line,
      destination: a.destination,
      scheduled_time: a.scheduled_time,
      expected_time: a.expected_time ?? a.scheduled_time,
      time_formatted: a.time_formatted,
      minutes_until: Number(entity.state),
      transport_mode: a.transport_mode,
      real_time: a.real_time,
      delay: a.delay,
      delay_minutes: a.delay_minutes,
      canceled: a.canceled,
      platform: a.platform,
      agency: a.agency,
      trip_id: a.trip_id,
      trip_start_date: a.trip_start_date,
    };
  }

  private _modeLabel(mode: string | undefined): string | undefined {
    if (!mode) return undefined;
    const key = `label.mode_${String(mode).toLowerCase()}`;
    const translated = this._t(key);
    return translated === key ? mode : translated;
  }

  private _iconForMode(mode: string | undefined): string | undefined {
    if (!mode) return undefined;
    switch (String(mode).toLowerCase()) {
      case 'bus':
        return 'mdi:bus';
      case 'metro':
        return 'mdi:subway-variant';
      case 'train':
        return 'mdi:train';
      case 'tram':
        return 'mdi:tram';
      case 'taxi':
        return 'mdi:taxi';
      case 'boat':
        return 'mdi:ferry';
      default:
        return undefined;
    }
  }

  private _platformLabelFor(item: any): string | undefined {
    const p = item?.platform;
    if (p === undefined || p === null || p === '') return undefined;
    const mode = String(item?.transport_mode || '').toLowerCase();
    // Mapping decision:
    // - platform: train, metro
    // - stand: bus, taxi, tram
    // - bay: boat
    const key = mode === 'bus' || mode === 'taxi' || mode === 'tram'
      ? 'label.stand'
      : mode === 'boat'
        ? 'label.bay'
        : 'label.platform';
    return this._t(key, { platform: p });
  }

  private _statusFor(item: any): { label: string; badge: 'ok' | 'delay' | 'cancel'; } {
    if (item.canceled) return { label: this._t('status.cancelled'), badge: 'cancel' };
    const delayMin = typeof item.delay_minutes === 'number' ? item.delay_minutes : (typeof item.delay === 'number' ? Math.round(item.delay / 60) : 0);
    if (delayMin > 0) return { label: this._t('status.delayed', { minutes: delayMin }), badge: 'delay' };
    return { label: this._t('status.on_time'), badge: 'ok' };
  }

  /**
   * Minutes until a departure, derived from its absolute timestamp.
   *
   * `minutes_until` is only accurate at the moment the integration polled it.
   * The integration refreshes about once a minute and floors the value, so the
   * attribute can be a full minute stale by the time it is rendered -- and it
   * sits on 0 for that whole minute, which reads as "leaving now" long after
   * the departure has gone. `expected_time` is absolute, so it stays correct
   * between polls.
   *
   * Falls back to the attribute when there is no usable timestamp.
   */
  private _minutesUntil(item: any): number | undefined {
    const raw = item?.expected_time || item?.scheduled_time;
    if (raw) {
      const at = new Date(raw).getTime();
      if (!Number.isNaN(at)) {
        // Floor, not round: "in 8 min" must mean at least eight minutes.
        // Clamp at 0 so a departure that has just gone reads "Now" rather
        // than counting upwards into negative minutes.
        return Math.max(0, Math.floor((at - Date.now()) / 60000));
      }
    }
    return typeof item?.minutes_until === 'number' ? item.minutes_until : undefined;
  }

  private _formatTimeString(item: any): string {
    if (item.time_formatted) return item.time_formatted;
    const t = item.expected_time || item.scheduled_time;
    if (!t) return '';
    try {
      const date = new Date(t);
      const hour = date.getHours().toString().padStart(2, '0');
      const min = date.getMinutes().toString().padStart(2, '0');
      return `${hour}:${min}`;
    } catch {
      return String(t);
    }
  }

  private _formatUpdated(dt: string): string {
    try {
      const d = new Date(dt);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dt;
    }
  }

  private async _openTripDetails(item: any): Promise<void> {
    const requestId = ++this._tripRequestId;
    const tripId = item?.trip_id;
    const startDate = item?.trip_start_date;
    this._selectedTrip = item;
    this._tripDetails = undefined;
    this._tripError = undefined;
    this._alertOpen = false;
    this._detailsOpen = true;

    if (!tripId || !startDate) {
      this._tripLoading = false;
      this._tripError = 'error.trip_missing';
      return;
    }

    this._tripLoading = true;
    try {
      const result = await this.hass.callWS<Record<string, any>>({
        type: 'call_service',
        domain: 'trafiklab',
        service: 'trip_details',
        service_data: { trip_id: tripId, start_date: startDate },
        return_response: true,
      });
      if (requestId !== this._tripRequestId) return;
      const response = result?.response ?? result;
      if (!Array.isArray(response?.calls)) throw new Error('Invalid trip details response');
      this._tripDetails = response as TripDetails;
    } catch {
      if (requestId === this._tripRequestId) this._tripError = 'error.trip_details';
    } finally {
      if (requestId === this._tripRequestId) this._tripLoading = false;
    }
  }

  private _retryTripDetails(): void {
    if (this._selectedTrip) void this._openTripDetails(this._selectedTrip);
  }

  private _closeDetailsDialog(): void {
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>('#trip-details-dialog');
    if (dialog?.open) dialog.close();
  }

  private _closeAlertDialog(): void {
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>('#stop-alert-dialog');
    if (dialog?.open) dialog.close();
  }

  private _onDetailsDialogClose = (): void => {
    this._tripRequestId++;
    this._detailsOpen = false;
    this._alertOpen = false;
    this._tripLoading = false;
    this._tripDetails = undefined;
    this._tripError = undefined;
    this._selectedTrip = undefined;
    this._selectedAlertCall = undefined;
  };

  private _onAlertDialogClose = (): void => {
    this._alertOpen = false;
    this._selectedAlertCall = undefined;
  };

  private _openStopAlerts(call: TripCall): void {
    this._selectedAlertCall = call;
    this._alertOpen = true;
  }

  private _visibleCalls(): TripCall[] {
    const calls = this._tripDetails?.calls ?? [];
    if (calls.length < 2) return calls;
    const entity = this._getEntity();
    const item = this._selectedTrip;
    const areaId = item?.area_id ?? item?.stop?.area_id ?? entity?.attributes?.area_id ?? entity?.attributes?.stop_id;
    let startIndex = areaId === undefined
      ? -1
      : calls.findIndex((call) => String(call.stop?.area_id ?? call.stop?.id) === String(areaId));
    if (startIndex < 0) {
      const selectedTimes = [item?.scheduled_time, item?.expected_time]
        .map((time) => this._formatTripTime(time))
        .filter((time): time is string => !!time);
      const selectedPlatform = item?.platform ? String(item.platform) : undefined;
      if (selectedTimes.length) {
        startIndex = calls.findIndex((call) => {
          const callTimes = [call.scheduledDeparture, call.realtimeDeparture, call.scheduledArrival, call.realtimeArrival]
            .map((time) => this._formatTripTime(time))
            .filter((time): time is string => !!time);
          if (!selectedTimes.some((time) => callTimes.includes(time))) return false;
          if (!selectedPlatform) return true;
          const platforms = [call.scheduled_platform?.designation, call.realtime_platform?.designation];
          return !platforms.some(Boolean) || platforms.includes(selectedPlatform);
        });
      }
    }
    return calls.slice(startIndex >= 0 ? startIndex : 0);
  }

  private _formatTripTime(value: string | undefined): string | undefined {
    if (!value) return undefined;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private _tripTime(call: TripCall, finalStop: boolean): { scheduled?: string; realtime?: string; differs: boolean } {
    const scheduledValue = finalStop
      ? (call.scheduledArrival ?? call.scheduledDeparture)
      : (call.scheduledDeparture ?? call.scheduledArrival);
    const realtimeValue = finalStop
      ? (call.realtimeArrival ?? call.realtimeDeparture)
      : (call.realtimeDeparture ?? call.realtimeArrival);
    const scheduled = this._formatTripTime(scheduledValue);
    const realtime = call.is_realtime ? this._formatTripTime(realtimeValue) : undefined;
    return { scheduled, realtime, differs: !!scheduled && !!realtime && scheduled !== realtime };
  }

  private _tripPlatform(call: TripCall): { scheduled?: string; realtime?: string; differs: boolean } {
    const scheduled = call.scheduled_platform?.designation;
    const realtime = call.is_realtime ? call.realtime_platform?.designation : undefined;
    return { scheduled, realtime, differs: !!scheduled && !!realtime && scheduled !== realtime };
  }

  private _openMoreInfo(): void {
    const entityId = this._config?.entity;
    if (!entityId) return;
    this.dispatchEvent(
      new CustomEvent('hass-more-info', {
        bubbles: true,
        composed: true,
        detail: { entityId },
      })
    );
  }

  private _onKeyActivate(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._openMoreInfo();
    }
  }

  protected updated(): void {
    const detailsDialog = this.renderRoot.querySelector<HTMLDialogElement>('#trip-details-dialog');
    if (this._detailsOpen && detailsDialog && !detailsDialog.open) detailsDialog.showModal();
    const alertDialog = this.renderRoot.querySelector<HTMLDialogElement>('#stop-alert-dialog');
    if (this._alertOpen && alertDialog && !alertDialog.open) alertDialog.showModal();

    // Compute overlay height to span from top of card (including header) down to just above the first row
    try {
      const list = this.renderRoot.querySelector('.list') as HTMLElement | null;
      const body = this.renderRoot.querySelector('.card-body') as HTMLElement | null;
      const card = this.renderRoot.querySelector('ha-card') as HTMLElement | null;
      if (!list || !body || !card) return;
      const listRect = list.getBoundingClientRect();
      const bodyRect = body.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const headerHeight = Math.max(0, bodyRect.top - cardRect.top);
      const spaceAboveFirstRow = Math.max(0, listRect.top - bodyRect.top);
      const desiredHeight = Math.max(0, headerHeight + spaceAboveFirstRow - 2); // 2px gap above first row
      const desiredTop = -headerHeight;
      if (desiredHeight !== this._overlayHeight || desiredTop !== this._overlayTop) {
        this._overlayHeight = desiredHeight;
        this._overlayTop = desiredTop;
        this.requestUpdate();
      }
    } catch {
      // ignore
    }
  }

  protected render() {
    const entity = this._getEntity();
    if (!this._config) return nothing;

    if (!entity) {
      return html`<ha-card header=${this._t('card.title')}>
        <div class="content error">${this._t('error.entity_not_found', { entity: this._config.entity })}</div>
      </ha-card>`;
    }

    const showHeader = this._config.show_name !== false;
    const header = showHeader ? (entity.attributes?.friendly_name || entity.entity_id) : undefined;
    const departures = this._getDepartures().slice(0, this._config.max_items ?? 5);

    return html`
      <ha-card .header=${showHeader ? (header ?? this._t('card.title')) : undefined}>
        <div class="card-body">
          ${showHeader
            ? html`<div
                    class="header-overlay"
                    style="top: ${this._overlayTop}px; height: ${this._overlayHeight}px;"
                    role="button"
                    tabindex="0"
                    @click=${() => this._openMoreInfo()}
                    @keydown=${(e: KeyboardEvent) => this._onKeyActivate(e)}
                  ></div>`
            : nothing}
        ${departures.length === 0
          ? html`<div class="content empty">${this._t('empty.no_upcoming')}</div>`
          : html`<div class="list" role="list">
              ${departures.map((d) => {
                const status = this._statusFor(d);
                const time = this._formatTimeString(d);
                const min = this._minutesUntil(d);
                const mode = this._modeLabel(d.transport_mode) ?? d.transport_mode;
                const modeIcon = this._iconForMode(d.transport_mode);
                const inLabel = min !== undefined ? (min === 0 ? this._t('label.now') : this._t('label.in_minutes', { minutes: min })) : undefined;
                return html`
                  <div class="row" role="listitem">
                    <button class="row-action" type="button"
                            aria-label=${this._t('label.trip_details_for', { line: d.line ?? '', destination: d.destination ?? '' })}
                            @click=${() => void this._openTripDetails(d)}>
                    <span class="line">
                      <span class="pill">
                        ${modeIcon ? html`<ha-icon class="pill-icon" .icon=${modeIcon}></ha-icon>` : nothing}${d.line ?? ''}
                      </span>
                    </span>
                    <div class="main">
                      <div class="dest">${d.destination ?? ''}</div>
                      <div class="meta">
                        ${this._platformLabelFor(d) ? html`<span class="platform">${this._platformLabelFor(d)}</span>` : nothing}
                        ${mode ? html`<span class="mode-text">${mode}</span>` : nothing}
                        ${d.real_time ? html`<span class="rt">RT</span>` : nothing}
                      </div>
                    </div>
                    <div class="right">
                      <div class="time">${time}</div>
                      ${(inLabel !== undefined || status?.label)
                        ? html`<div class="in-status">
                              ${inLabel ? html`<span class="in">${inLabel}</span>` : nothing}
                              ${inLabel && status?.label ? html`<span class="sep"> - </span>` : nothing}
                              ${status?.label ? html`<span class="status ${status.badge}">${status.label}</span>` : nothing}
                            </div>`
                        : nothing}
                    </div>
                    </button>
                  </div>`;
              })}
            </div>`}
        <div class="footer">
          ${entity.attributes?.attribution ? html`<span class="attr">${entity.attributes.attribution}</span>` : nothing}
          ${entity.attributes?.last_update ? html`<span class="updated">${this._t('label.updated', { time: this._formatUpdated(entity.attributes.last_update) })}</span>` : nothing}
        </div>
        </div>
        ${this._detailsOpen ? html`
          <dialog id="trip-details-dialog" class="dialog" aria-labelledby="trip-dialog-title"
                  @close=${this._onDetailsDialogClose}
                  @click=${(e: MouseEvent) => { if (e.target === e.currentTarget) this._closeDetailsDialog(); }}>
            <div class="dialog-header">
              <div>
                <div class="dialog-kicker">${this._t('trip.details')}</div>
                <h2 id="trip-dialog-title">${this._tripDetails?.line ?? this._selectedTrip?.line ?? this._t('trip.title')}</h2>
                ${this._tripDetails?.headsign || this._selectedTrip?.destination
                  ? html`<div class="dialog-subtitle">${this._tripDetails?.headsign ?? this._selectedTrip?.destination}</div>`
                  : nothing}
              </div>
              <button class="icon-button" type="button" aria-label=${this._t('label.close')} @click=${this._closeDetailsDialog}>
                <ha-icon .icon=${'mdi:close'}></ha-icon>
              </button>
            </div>
            ${this._tripLoading
              ? html`<div class="dialog-state" role="status" aria-live="polite"><span class="spinner"></span>${this._t('trip.loading')}</div>`
              : nothing}
            ${this._tripError
              ? html`<div class="dialog-state error" role="alert">
                  <p>${this._t(this._tripError)}</p>
                  ${this._tripError === 'error.trip_details'
                    ? html`<button class="text-button" type="button" @click=${this._retryTripDetails}>${this._t('label.retry')}</button>`
                    : nothing}
                </div>`
              : nothing}
            ${this._tripDetails ? html`
              <div class="route-summary">
                <span>${this._tripDetails.origin ?? this._t('trip.origin_unknown')}</span>
                <ha-icon .icon=${'mdi:arrow-right'}></ha-icon>
                <span>${this._tripDetails.destination ?? this._t('trip.destination_unknown')}</span>
              </div>
              ${this._visibleCalls().length === 0
                ? html`<div class="dialog-state">${this._t('trip.no_stops')}</div>`
                : html`<ol class="stop-list" aria-label=${this._t('trip.stops')}>
                ${this._visibleCalls().map((call, index, calls) => {
                  const finalStop = index === calls.length - 1;
                  const time = this._tripTime(call, finalStop);
                  const platform = this._tripPlatform(call);
                  const alerts = Array.isArray(call.alerts) ? call.alerts.filter((alert) => alert && (alert.title || alert.text)) : [];
                  return html`<li class="stop-row">
                    <span class="stop-marker" aria-hidden="true">
                      ${call.is_realtime ? html`<span class="realtime-dots"><i></i><i></i><i></i></span>` : nothing}
                    </span>
                    <div class="stop-content">
                      <div class="stop-name">${call.stop?.name ?? this._t('trip.unknown_stop')}</div>
                      <div class="stop-meta">
                        <span class="trip-time-label">${finalStop ? this._t('trip.arrival') : this._t('trip.departure')}</span>
                        ${time.differs
                          ? html`<span class="scheduled crossed-out">${time.scheduled}</span><span class="realtime-value">${time.realtime}</span>`
                          : html`<span>${time.realtime ?? time.scheduled ?? this._t('trip.time_unavailable')}</span>`}
                        ${platform.differs
                          ? html`<span class="platform-values"><span class="crossed-out">${platform.scheduled}</span><span>${this._t('label.platform', { platform: platform.realtime })}</span></span>`
                          : (platform.realtime ?? platform.scheduled)
                            ? html`<span>${this._t('label.platform', { platform: platform.realtime ?? platform.scheduled })}</span>`
                            : nothing}
                      </div>
                    </div>
                    ${alerts.length
                      ? html`<button class="icon-button alert-button" type="button"
                                aria-label=${this._t('alert.button_for_stop', { stop: call.stop?.name ?? this._t('trip.unknown_stop') })}
                                title=${this._t('alert.button_for_stop', { stop: call.stop?.name ?? this._t('trip.unknown_stop') })}
                                @click=${() => this._openStopAlerts(call)}>
                          <ha-icon .icon=${'mdi:information-box-outline'}></ha-icon>
                        </button>`
                      : nothing}
                  </li>`;
                })}
              </ol>`}
            ` : nothing}
          </dialog>
        ` : nothing}
        ${this._alertOpen && this._selectedAlertCall ? html`
          <dialog id="stop-alert-dialog" class="dialog alert-dialog" aria-labelledby="alert-dialog-title"
                  @close=${this._onAlertDialogClose}
                  @click=${(e: MouseEvent) => { if (e.target === e.currentTarget) this._closeAlertDialog(); }}>
            <div class="dialog-header">
              <div>
                <div class="dialog-kicker">${this._t('alert.heading')}</div>
                <h2 id="alert-dialog-title">${this._selectedAlertCall.stop?.name ?? this._t('trip.unknown_stop')}</h2>
              </div>
              <button class="icon-button" type="button" aria-label=${this._t('label.close')} @click=${this._closeAlertDialog}>
                <ha-icon .icon=${'mdi:close'}></ha-icon>
              </button>
            </div>
            <div class="alert-list">
              ${(this._selectedAlertCall.alerts ?? []).filter((alert) => alert && (alert.title || alert.text)).map((alert) => html`
                <article class="alert-item">
                  ${alert.title ? html`<h3>${alert.title}</h3>` : nothing}
                  ${alert.text ? html`<p>${alert.text}</p>` : nothing}
                </article>`)}
            </div>
          </dialog>
        ` : nothing}
      </ha-card>
    `;
  }

  static styles = css`
    ha-card {
      --pill-bg: var(--primary-color);
      --ok: var(--success-color, #0b8457);
      --delay: var(--warning-color, #b36b00);
      --cancel: var(--error-color, #c92a2a);
      /* Size controls for icon and line pill */
      --trafiklab-pill-font-size: 1.6em; /* ~1.6x larger text */
      --trafiklab-pill-icon-size: 1.2em; /* scale icon with text */
      --trafiklab-pill-icon-nudge: -0.05em; /* slight optical centering */
    }
    .card-body { position: relative; }
    .header-overlay { position: absolute; left: 0; right: 0; background: transparent; z-index: 2; }
    .content {
      padding: 12px 16px;
    }
    .error { color: var(--error-color); }
    .empty { color: var(--secondary-text-color); }
    .list { padding: 8px 8px 0; }
    .row {
      padding: 0;
      border-bottom: 1px solid var(--divider-color);
    }
    .row:last-child { border-bottom: none; }
    .row-action {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
      width: 100%;
      padding: 8px;
      border: 0;
      color: inherit;
      background: transparent;
      text-align: left;
      cursor: pointer;
      font: inherit;
    }
    .row-action:hover { background: var(--secondary-background-color); }
    .row-action:focus-visible, .icon-button:focus-visible, .text-button:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .card-header { padding: 16px; font-size: 1.1em; font-weight: 600; cursor: pointer; }
    .pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-width: 28px;
      padding: 4px 12px;
      border-radius: 999px;
      background: var(--pill-bg);
      color: var(--text-primary-color, white);
      font-weight: 600;
      line-height: 1;
      font-size: var(--trafiklab-pill-font-size, 2em);
      cursor: pointer;
    }
    .dest { font-weight: 600; font-size: 1.1em; }
    .meta { color: var(--secondary-text-color); font-size: 0.86em; display: flex; gap: 8px; }
    .pill-icon {
      --mdc-icon-size: var(--trafiklab-pill-icon-size, 1.25em);
      width: var(--trafiklab-pill-icon-size, 1.25em);
      height: var(--trafiklab-pill-icon-size, 1.25em);
      color: var(--text-primary-color, white);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transform: translateY(var(--trafiklab-pill-icon-nudge));
    }
    .right { text-align: right; }
    .time { font-weight: 600; font-size: 1.1em; }
    .in-status { color: var(--secondary-text-color); font-size: 0.9em; display: inline-flex; align-items: baseline; gap: 4px; }
    .status { font-size: 0.86em; }
    .status.ok { color: var(--ok); }
    .status.delay { color: var(--delay); }
    .status.cancel { color: var(--cancel); font-weight: 700; }
    .footer {
      display: flex;
      justify-content: space-between;
      padding: 8px 16px 12px;
      color: var(--secondary-text-color);
      font-size: 0.8em;
    }
    .dialog {
      width: min(640px, calc(100vw - 32px));
      max-width: 640px;
      max-height: min(82vh, 760px);
      margin: auto;
      padding: 0;
      overflow: hidden;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      color: var(--primary-text-color);
      background: var(--card-background-color, var(--ha-card-background, white));
      box-shadow: 0 12px 40px rgb(0 0 0 / 24%);
    }
    .dialog::backdrop { background: rgb(0 0 0 / 45%); }
    .dialog-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; padding: 20px 22px 16px; border-bottom: 1px solid var(--divider-color); }
    .dialog-kicker { color: var(--secondary-text-color); font-size: 0.76em; font-weight: 600; text-transform: uppercase; }
    .dialog-header h2 { margin: 4px 0 0; font-size: 1.3em; line-height: 1.25; }
    .dialog-subtitle { margin-top: 4px; color: var(--secondary-text-color); }
    .icon-button { display: inline-grid; place-items: center; flex: 0 0 40px; width: 40px; height: 40px; padding: 0; border: 0; border-radius: 50%; color: var(--primary-text-color); background: transparent; cursor: pointer; }
    .icon-button:hover { background: var(--secondary-background-color); }
    .icon-button ha-icon { --mdc-icon-size: 22px; }
    .dialog-state { display: flex; align-items: center; gap: 12px; padding: 22px; color: var(--secondary-text-color); }
    .dialog-state.error { display: block; color: var(--error-color); }
    .dialog-state p { margin: 0 0 12px; }
    .spinner { width: 18px; height: 18px; border: 2px solid var(--divider-color); border-top-color: var(--primary-color); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .text-button { padding: 8px 0; border: 0; color: var(--primary-color); background: transparent; font: inherit; font-weight: 600; cursor: pointer; }
    .route-summary { display: flex; align-items: center; gap: 10px; padding: 14px 22px; color: var(--secondary-text-color); background: var(--secondary-background-color); font-weight: 600; }
    .route-summary span { min-width: 0; overflow-wrap: anywhere; }
    .route-summary ha-icon { flex: 0 0 auto; --mdc-icon-size: 18px; }
    .stop-list { max-height: min(58vh, 520px); margin: 0; padding: 12px 16px 18px 22px; overflow: auto; list-style: none; }
    .stop-row { position: relative; display: grid; grid-template-columns: 24px minmax(0, 1fr) 40px; gap: 10px; align-items: center; min-height: 64px; }
    .stop-row:not(:last-child)::before { position: absolute; z-index: 0; top: 30px; bottom: -30px; left: 11px; width: 2px; background: var(--divider-color); content: ''; }
    .stop-marker { z-index: 1; display: grid; place-items: center; width: 24px; height: 24px; border: 2px solid var(--primary-color); border-radius: 50%; background: var(--card-background-color); }
    .stop-content { min-width: 0; padding: 9px 0; }
    .stop-name { font-weight: 600; overflow-wrap: anywhere; }
    .stop-meta { display: flex; flex-wrap: wrap; align-items: baseline; gap: 5px 9px; margin-top: 3px; color: var(--secondary-text-color); font-size: 0.88em; }
    .trip-time-label { color: var(--primary-text-color); font-weight: 600; }
    .realtime-value { color: var(--primary-text-color); font-weight: 700; }
    .crossed-out { text-decoration: line-through; opacity: 0.72; }
    .platform-values { display: inline-flex; gap: 6px; }
    .alert-button { color: var(--primary-color); }
    .alert-button ha-icon { --mdc-icon-size: 24px; }
    .realtime-dots { display: flex; gap: 2px; }
    .realtime-dots i { width: 3px; height: 3px; border-radius: 50%; background: var(--primary-color); animation: bounce 0.9s ease-in-out infinite alternate; }
    .realtime-dots i:nth-child(2) { animation-delay: 0.15s; }
    .realtime-dots i:nth-child(3) { animation-delay: 0.3s; }
    @keyframes bounce { to { transform: translateY(-4px); opacity: 0.45; } }
    .alert-dialog { width: min(480px, calc(100vw - 32px)); }
    .alert-list { max-height: min(60vh, 520px); padding: 6px 22px 20px; overflow: auto; }
    .alert-item { padding: 12px 0; border-bottom: 1px solid var(--divider-color); }
    .alert-item:last-child { border-bottom: 0; }
    .alert-item h3 { margin: 0 0 6px; font-size: 1em; }
    .alert-item p { margin: 0; line-height: 1.5; white-space: pre-wrap; overflow-wrap: anywhere; }
    @media (max-width: 440px) {
      .dialog-header { padding: 16px; }
      .route-summary { padding: 12px 16px; font-size: 0.9em; }
      .stop-list { padding: 8px 12px 16px 16px; }
      .alert-list { padding-inline: 16px; }
      .row-action { gap: 8px; }
    }
  `;
}

customElements.define(CARD_TYPE, TrafiklabTimetableCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: CARD_TYPE,
  name: 'Trafiklab Timetable',
  description: 'Shows upcoming departures from a Trafiklab timetable sensor',
  preview: true,
});
