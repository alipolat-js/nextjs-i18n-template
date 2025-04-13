import { i18nMiddleware } from '@/middleware/i18nMiddleware';
import { createMiddlewareOrchestrator } from './utils/middlewares/middlewareOrchestrator'

// Define route-specific middleware
const middlewares = {
  // Apply i18n middleware to all routes
  '/*': i18nMiddleware
};

// Create and export the middleware
export const middleware = createMiddlewareOrchestrator(middlewares);

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
}