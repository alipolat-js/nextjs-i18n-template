import { NextRequest, NextResponse } from 'next/server';
import { IMiddlewareContext, IRoutePattern, IGlobalMiddlewareConfig } from '@/interfaces/middleware';
import { Middleware } from '@/types/middleware';

/**
 * Creates a middleware orchestrator
 * @param routes - Record of route patterns and their associated middleware
 * @param globalConfig - Global middleware configuration
 * @returns Middleware function
 */
export function createMiddlewareOrchestrator(
  routes: Record<string, Middleware | Middleware[]>,
  globalConfig?: IGlobalMiddlewareConfig
) {
  // Convert route patterns to regex
  const routePatterns: IRoutePattern[] = Object.entries(routes).map(([pattern, middleware]) => {
    // Convert Next.js route pattern to regex
    const regexPattern = pattern
      .replace(/:[a-zA-Z]+/g, '([^/]+)') // Replace :param with capture group
      .replace(/\*/g, '.*'); // Replace * with .*
    
    return {
      pattern: new RegExp(`^${regexPattern}$`),
      middleware: Array.isArray(middleware) ? middleware : [middleware]
    };
  });

  // Main middleware function
  return async function middleware(request: NextRequest) {
    // Create context for middleware functions
    const context: IMiddlewareContext = {
      params: {},
      storage: new Map(),
      log: (message, ...args) => console.log(`[Middleware] ${message}`, ...args),
      error: (message, error) => console.error(`[Middleware Error] ${message}`, error),
      warn: (message, ...args) => console.warn(`[Middleware Warning] ${message}`, ...args)
    };

    // Run global before middleware
    if (globalConfig?.before) {
      for (const middleware of globalConfig.before) {
        const result = await middleware(request, context);
        if (result) return result;
      }
    }

    // Match route and run route-specific middleware
    const pathname = request.nextUrl.pathname;
    for (const { pattern, middleware } of routePatterns) {
      if (pattern instanceof RegExp && pattern.test(pathname)) {
        // Extract params from pathname
        const matches = pathname.match(pattern);
        if (matches) {
          // Extract param names from pattern
          const paramNames = pattern.toString().match(/:[a-zA-Z]+/g) || [];
          paramNames.forEach((param, index) => {
            const paramName = param.substring(1); // Remove : prefix
            context.params[paramName] = matches[index + 1];
          });
        }

        // Run route middleware
        for (const fn of middleware) {
          const result = await fn(request, context);
          if (result) return result;
        }
      }
    }

    // Run global after middleware
    if (globalConfig?.after) {
      for (const middleware of globalConfig.after) {
        const result = await middleware(request, context);
        if (result) return result;
      }
    }

    // Default response if no middleware returns a response
    return NextResponse.next();
  };
} 