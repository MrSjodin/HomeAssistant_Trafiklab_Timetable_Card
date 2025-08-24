# Trafiklab Timetable Card

A Home Assistant Lovelace card that shows upcoming departures from a Trafiklab timetable sensor.

## Features
- Shows type, line, destination, time, minutes until departure, and status (on time / delayed / cancelled)
- Shows the Platform/Stand/Bay where the service departures from or arrives to
- Real-time indicator (RT) when applicable
- Configurable number of items, optional heading
- English and Swedish translations

## Requirements
- Home Assistant 2024.1+ (tested)
- [Trafiklab Integration](https://github.com/MrSjodin/HomeAssistant_Trafiklab_Integration) 0.4.6+

## Installation

### HACS (recommended)
1. Add this repository as a custom repository in HACS (Frontend).
2. Install "Trafiklab Timetable Card".
3. Reload resources when prompted.

### Manual
1. Download `trafiklab-timetable-card.js` from the latest GitHub release.
2. Copy it to `config/www/trafiklab-timetable-card/` on your HA instance.
3. Add a Lovelace resource:
   - URL: `/local/trafiklab-timetable-card/trafiklab-timetable-card.js`
   - Type: `module`
4. Refresh your browser cache (append `?v=1` to resource URL as needed).

## Add the card

You can add the card from the UI (recommended) or via YAML.

### UI (Visual editor)
- Go to Dashboards → Edit Dashboard → Add Card → search for "Trafiklab Timetable".
- Choose the sensor in the CONFIG tab and adjust options.

### YAML example
```yaml
type: custom:trafiklab-timetable-card
entity: sensor.trafiklab_upcoming
show_name: true
max_items: 6
```

## Configuration options
- `entity` (required): Sensor entity id.
- `show_name` (optional, default `true`): Show the sensor's friendly name as the card heading.
- `max_items` (optional, default `5`): Max number of departures to display.

## Sensor data expectations
The card supports two formats:

1) Array format (preferred): `sensor.attributes.upcoming` is a list of departures, where each item may include:
- `line`, `destination`, `scheduled_time`, `expected_time`, `time_formatted`, `minutes_until`, `transport_mode`, `real_time`, `delay_minutes`/`delay`, `canceled`, `platform`, `agency`

2) Single-trip format: Card will map base attributes from the entity itself if `upcoming` is not an array.

## Behaviors
- Status: Derived from `canceled` and `delay_minutes`/`delay`.
- Time: Uses `time_formatted` if provided; otherwise shows `expected_time` or `scheduled_time` as HH:mm.
- Minutes label: Shows localized "Now" when `minutes_until` is 0; otherwise "in X min".
- Platform label:
  - Platform: train, metro
  - Stand: bus, taxi, tram
  - Bay: boat
- Icons: Based on `transport_mode` (mdi icons).

## Accessibility
- Header overlay and line pill are keyboard-activatable (Enter/Space) to open more-info.

## Development
- Install deps: `npm ci`
- Dev server: `npm run dev`
- Build: `npm run build` (output in `dist/`)

The build outputs a single `trafiklab-timetable-card.js` bundle (with a `.map` for debugging). Only the `.js` is required in HA.

## Troubleshooting
- Card not found: Make sure the resource is added and cache is cleared.
- Blank config tab: Ensure HA’s frontend components are loaded; this card falls back to plain inputs if needed.
- No updates: The card re-renders on HA state changes via the `hass` setter; verify the sensor updates and the entity id is correct.

## License
MIT
