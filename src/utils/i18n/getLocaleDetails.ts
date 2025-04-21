import { LocaleDetails } from '@/types/i18n';
import locales from '@/resources/locales.json';


/**
 * Get locale details from locales.json
 * @param locale The locale code
 * @returns LocaleDetails object
 * 
 * @example
 * const localeDetails = await getLocaleDetails("en");
 * console.log(localeDetails);
 * 
 *  // {
 * //   languageCode: "en",
 * //   languageTag: "en-US",
 * //   originalName: "English",
 * //   charset: "utf-8",
 * //   direction: "ltr",
 * //   currencyUnit: "USD",
 * //   currencySymbol: "$"
 * // }
 */
export function getLocaleDetails(locale: string): LocaleDetails {
  return locales.locales[locale as keyof typeof locales.locales];
}