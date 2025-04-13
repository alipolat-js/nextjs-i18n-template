export const i18n: I18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'de', 'tr'],
  translationsPath: '@/resources/translations',
  localesLocation: '@/resources/locales.json',
  cookieOptions: {
    name: 'lang',
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none' as "none" | "lax" | "strict",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  autoDetect: true,
  api: {
    headers: ['Accept-Language'],
  },
  hocLoader: {
    enabled: true,
    uiComponentLocation: '/components/ui/i18n/loader.tsx',
  },
  cache: {
    enabled: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  debug: {
    enabled: true,
  }
};
