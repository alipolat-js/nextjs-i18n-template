type CookieOptions = {
  name: string;
  path: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "none" | "lax" | "strict";
  maxAge: number;
};

type ApiConfig = {
  headers: string[];
};

type LoaderConfig = {
  enabled: boolean;
  uiPath: string;
};

type CacheConfig = {
  enabled: boolean;
  maxAge: number;
};

type DebugConfig = {
  enabled: boolean;
};

type I18nConfig = {
  defaultLocale: string;
  locales: string[];
  localePath: string;
  cookieOptions: CookieOptions;
  autoDetect: boolean;
  api: ApiConfig;
  loader: LoaderConfig;
  cache: CacheConfig;
  debug: DebugConfig;
};