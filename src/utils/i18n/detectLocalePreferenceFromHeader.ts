import { NextRequest } from 'next/server';
import Negotiator from 'negotiator';
import { i18n } from '@/i18n.config';
import { matchLocale } from '@/utils/i18n/matchLocale';

/**
 * Detects the preferred locale from request headers using Accept-Language
 * @param request NextRequest object
 * @returns Detected locale or default locale
 */
export function detectLocalePreferenceFromHeader(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};

  try {
    // manually copy headers to a plain object
    for (const [key, value] of Object.entries(request.headers)) {
      negotiatorHeaders[key] = value;
    }

    const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

    // match the locale
    return matchLocale(languages);
  } catch {
    return i18n.defaultLocale;
  }
}
