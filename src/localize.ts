import en from './translations/en.json';
import sv from './translations/sv.json';

export type HassLike = { locale?: { language?: string }; language?: string } | undefined;

export function localize(hass: HassLike, path: string, vars?: Record<string, any>): string {
  const lang = hass?.locale?.language || hass?.language || 'en';
  const dict = String(lang).toLowerCase().startsWith('sv') ? (sv as any) : (en as any);
  const value = path.split('.').reduce((acc: any, key: string) => (acc ? acc[key] : undefined), dict) || path;
  if (!vars) return value;
  return Object.entries(vars).reduce((str, [k, v]) => str.replaceAll(`{${k}}`, String(v)), value);
}
