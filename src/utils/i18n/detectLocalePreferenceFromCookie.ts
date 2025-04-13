import { NextRequest } from 'next/server';
import { i18n } from '@/i18n.config';

/**
 * Detects the preferred locale from cookies
 * @param request NextRequest object
 * @returns Detected locale from cookie or null if not found
 */
export function detectLocalePreferenceFromCookie(request: NextRequest): string | null {
  try {
    const { cookies } = request;
    const { value: langPreference } = cookies.get(i18n.cookieOptions.name) || { value: null };

    if (langPreference && i18n.locales.includes(langPreference)) {
      return langPreference;
    }

    return null;
  } catch (error) {
    return null;
  }
} 