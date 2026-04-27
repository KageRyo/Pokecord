export const supportedLocales = ["en", "ja", "zh-TW"] as const;

export type AppLocale = (typeof supportedLocales)[number];

export const defaultLocale: AppLocale = "en";

export function isSupportedLocale(value: string): value is AppLocale {
  return supportedLocales.includes(value as AppLocale);
}
