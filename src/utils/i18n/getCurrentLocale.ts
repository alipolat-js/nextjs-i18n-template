import { i18n } from '@/i18n.config';
import { cookies } from 'next/headers';
import { detectLocalePreferenceFromHeader } from './detectLocalePreferenceFromHeader';
import { detectLocalePreferenceFromCookie } from './detectLocalePreferenceFromCookie';
import { NextRequest } from 'next/server';
import { LocaleDetails } from '@/types/i18n';
import { getLocaleDetails } from './getLocaleDetails';

/**
 * Get current locale from server-side using next/headers
 * @returns LocaleDetails object
 * 
 * @example
 * // In a Server Component or Route Handler
 * // Using Promise
 * const localeDetails = await getCurrentLocale();
 * console.log(localeDetails);
 * // {
 * //   languageCode: "en",
 * //   languageTag: "en-US",
 * //   originalName: "English",
 * //   charset: "utf-8",
 * //   direction: "ltr",
 * //   currencyUnit: "USD",
 * //   currencySymbol: "$"
 * // }
 * 
 * // Using callback
 * getCurrentLocale((details) => {
 *   console.log(details);
 * });
 */
async function fromServer(): Promise<LocaleDetails> {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get(i18n.cookieOptions.name)?.value;
  
  if (langCookie && i18n.locales.includes(langCookie)) {
    return getLocaleDetails(langCookie);
  }

  return getLocaleDetails(i18n.defaultLocale);
}

/**
 * Get current locale from API routes using NextRequest
 * @param request NextRequest object
 * @returns LocaleDetails object
 * 
 * @example
 * // In an API Route Handler
 * // Using Promise
 * export async function GET(request: NextRequest) {
 *   const localeDetails = await getCurrentLocale(request);
 *   return Response.json({ localeDetails });
 * }
 * 
 * // Using callback
 * export function GET(request: NextRequest) {
 *   getCurrentLocale(request, (localeDetails) => {
 *     return Response.json({ localeDetails });
 *   });
 * }
 */
async function fromAPI(request: NextRequest): Promise<LocaleDetails> {
  // Try to get language preference from cookies first
  const cookieLocale = detectLocalePreferenceFromCookie(request);
  
  if (cookieLocale) {
    return getLocaleDetails(cookieLocale);
  }

  // If no cookie, detect from headers
  const headerLocale = i18n.autoDetect 
    ? detectLocalePreferenceFromHeader(request) 
    : i18n.defaultLocale;

  return getLocaleDetails(headerLocale);
}

/**
 * Get current locale from client-side
 * @returns LocaleDetails object
 * 
 * @example
 * // In a Client Component
 * 'use client';
 * 
 * import { useEffect, useState } from 'react';
 * 
 * export default function LocaleDisplay() {
 *   const [localeDetails, setLocaleDetails] = useState<LocaleDetails | null>(null);
 * 
 *   useEffect(() => {
 *     // Using Promise
 *     const getLocale = async () => {
 *       const details = await getCurrentLocale();
 *       setLocaleDetails(details);
 *     };
 *     getLocale();
 * 
 *     // Or using callback
 *     getCurrentLocale((details) => {
 *       setLocaleDetails(details);
 *     });
 *   }, []);
 * 
 *   if (!localeDetails) return null;
 * 
 *   return (
 *     <div>
 *       <p>Language: {localeDetails.originalName}</p>
 *       <p>Currency: {localeDetails.currencySymbol}</p>
 *     </div>
 *   );
 * }
 */
function fromClient(): LocaleDetails {
  // Get locale from cookie
  const cookies = document.cookie.split(';');
  const langCookie = cookies.find(cookie => cookie.trim().startsWith(`${i18n.cookieOptions.name}=`));
  
  if (langCookie) {
    const locale = langCookie.split('=')[1].trim();
    if (i18n.locales.includes(locale)) {
      return getLocaleDetails(locale);
    }
  }

  // If no valid cookie found, try to get from browser language
  if (i18n.autoDetect) {
    const browserLang = navigator.language.split('-')[0];
    const matchedLocale = i18n.locales.find(locale => locale.startsWith(browserLang));
    
    if (matchedLocale) {
      return getLocaleDetails(matchedLocale);
    }
  }

  // Fallback to default locale
  return getLocaleDetails(i18n.defaultLocale);
}

/**
 * Get current locale details (works on both client and server)
 * @param request Optional NextRequest object for API routes
 * @param onLoad Optional callback function that receives the locale details
 * @returns Promise<LocaleDetails> if no callback is provided
 * 
 * @example
 * // Server Component - Using Promise
 * const localeDetails = await getCurrentLocale();
 * 
 * // Server Component - Using callback
 * getCurrentLocale((details) => {
 *   console.log(details);
 * });
 * 
 * // API Route - Using Promise
 * const localeDetails = await getCurrentLocale(request);
 * 
 * // API Route - Using callback
 * getCurrentLocale(request, (details) => {
 *   return Response.json({ details });
 * });
 * 
 * // Client Component - Using Promise
 * const localeDetails = await getCurrentLocale();
 * 
 * // Client Component - Using callback
 * getCurrentLocale((details) => {
 *   console.log(details);
 * });
 * 
 * // Example response for English locale:
 * // {
 * //   languageCode: "en",
 * //   languageTag: "en-US",
 * //   originalName: "English",
 * //   charset: "utf-8",
 * //   direction: "ltr",
 * //   currencyUnit: "USD",
 * //   currencySymbol: "$"
 * // }
 */
export async function getCurrentLocale(
  request?: NextRequest,
  onLoad?: (details: LocaleDetails) => void
): Promise<LocaleDetails | void> {
  let details: LocaleDetails;

  if (typeof window === 'undefined') {
    if (request) {
      details = await fromAPI(request);
    } else {
      details = await fromServer();
    }
  } else {
    details = fromClient();
  }

  if (onLoad) {
    onLoad(details);
    return;
  }

  return details;
}
