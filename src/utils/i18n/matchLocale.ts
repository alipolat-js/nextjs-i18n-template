import { i18n } from "@/i18n.config";

/**
 * Matches a preferred language with available locales
 * @param preferredLanguages Array of preferred languages (e.g. ['en-US', 'en', 'fr'])
 * @returns Matched locale or default locale
 */
export function matchLocale(
  preferredLanguages: string[]
): string {
  // First try exact match
  for (const lang of preferredLanguages) {
    if (i18n.locales.includes(lang)) {
      return lang;
    }
  }

  // Then try language code match (e.g. 'en-US' -> 'en')
  for (const lang of preferredLanguages) {
    const languageCode = lang.split('-')[0];
    const match = i18n.locales.find(locale => locale.startsWith(languageCode));
    if (match) {
      return match;
    }
  }

  // Fall back to default locale
  return i18n.defaultLocale;
} 