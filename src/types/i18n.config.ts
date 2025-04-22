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
  uiComponentLocation: string;
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
  cookieOptions: CookieOptions;
  autoDetect: boolean;
  api: ApiConfig;
  hocLoader: LoaderConfig;
  cache: CacheConfig;
  debug: DebugConfig;
};