import { Middleware } from "@/types/middleware";

// Context for middleware functions
export interface IMiddlewareContext {
  params: Record<string, string>;
  storage: Map<string, any>;
  log: (message: string, ...args: any[]) => void;
  error: (message: string, error: any) => void;
  warn: (message: string, ...args: any[]) => void;
}

// Route pattern matcher
export interface IRoutePattern {
  pattern: string | RegExp;
  middleware: Middleware[];
}

// Global middleware configuration
export interface IGlobalMiddlewareConfig {
  before?: Middleware[];
  after?: Middleware[];
}