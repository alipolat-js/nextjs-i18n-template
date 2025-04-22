/**
 * Asynchronously loads translation data for a specific language code.
 *
 * @async
 * @function getTranslationsWithLanguageCode
 * @param {((translations: Record<string, any>) => object) | null | undefined} onTranslationsLoad - An optional callback function to be executed after the translations are loaded. It receives the loaded translation object as its argument.
 * @param {string} languageCode - The code of the language to load (e.g., "en", "tr"). This code is used to construct the path to the translation file.
 * @returns {Promise<Record<string, any>>} A Promise that resolves to the loaded translation data as a plain JavaScript object. The Promise may reject if an error occurs during the import.
 *
 * @example
 * // Basic usage: Logging translations to the console
 * async function example1() {
 * try {
 * const translations = await getTranslationsWithLanguageCode(null, "en");
 * console.log("English translations:", translations);
 * } catch (error) {
 * console.error("Error loading translations:", error);
 * }
 * }
 *
 * example1();
 *
 * @example
 * // Using `onTranslationsLoad`: Updating a state (React example)
 * import React, { useState, useEffect } from 'react';
 * import { getTranslationsWithLanguageCode } from './getTranslationsWithLanguageCode';
 *
 * function MyComponent() {
 * const [translations, setTranslations] = useState(null);
 * const currentLanguage = 'fr';
 *
 * useEffect(() => {
 * async function loadTranslations() {
 * try {
 * await getTranslationsWithLanguageCode(setTranslations, currentLanguage);
 * } catch (error) {
 * console.error('Error loading translations:', error);
 * }
 * }
 *
 * loadTranslations();
 * }, [currentLanguage]);
 *
 * if (translations) {
 * return (
 * <div>
 * <h1>{translations.greeting}</h1>
 * <p>{translations.description}</p>
 * </div>
 * );
 * }
 *
 * return <p>Loading translations...</p>;
 * }
 *
 * @example
 * // Using Promises (.then and .catch)
 * function example3(language) {
 * getTranslationsWithLanguageCode(null, language)
 * .then(translations => {
 * console.log(`${language} translations (Promise):`, translations);
 * })
 * .catch(error => {
 * console.error(`Error loading ${language} translations (Promise):`, error);
 * });
 * }
 *
 * example3('de');
 */

export async function getTranslationsWithLanguageCode(
  onTranslationsLoad: ((translations: Record<string, any>) => object) | null | undefined,
  languageCode: string | any,
) : Promise<Record<string, any>>  {
  const module = await import(`../../resources/translations/${languageCode}.json`);

  if(onTranslationsLoad) {
    onTranslationsLoad(module.default)
  }
  
  return module.default
}