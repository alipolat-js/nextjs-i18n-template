import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from '@/i18n.config'
import { detectLocalePreferenceFromHeader } from '@/utils/i18n/detectLocalePreferenceFromHeader'
import { detectLocalePreferenceFromCookie } from '@/utils/i18n/detectLocalePreferenceFromCookie'
import { IMiddlewareContext } from '@/interfaces/middleware'

/**
 * i18n middleware
 * @param request - NextRequest object
 * @param context - IMiddlewareContext object
 * @returns NextResponse object
 */
export async function i18nMiddleware(request: NextRequest, context: IMiddlewareContext) {
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale: string) => !request.nextUrl.pathname.startsWith(`/${locale}/`) && request.nextUrl.pathname !== `/${locale}`
  )

  if (pathnameIsMissingLocale) {
    // Try to get language preference from cookies first
    const cookieLocale = detectLocalePreferenceFromCookie(request)
    
    if (cookieLocale) {
      const responseLang = NextResponse.redirect(
        new URL(
          `/${cookieLocale}${request.nextUrl.pathname.startsWith('/') ? '' : '/'}${request.nextUrl.pathname}${request.nextUrl.search}`,
          request.url
        )
      )

      responseLang.cookies.set(i18n.cookieOptions.name, cookieLocale, i18n.cookieOptions)

      return responseLang
    } else {
      // If no cookie, detect from headers
      const headerLocale = i18n.autoDetect ? detectLocalePreferenceFromHeader(request) : i18n.defaultLocale
      
      const responseLang = NextResponse.redirect(
        new URL(
          `/${headerLocale}${request.nextUrl.pathname.startsWith('/') ? '' : '/'}${request.nextUrl.pathname}${request.nextUrl.search}`,
          request.url
        )
      )

      responseLang.cookies.set(i18n.cookieOptions.name, headerLocale, i18n.cookieOptions)

      return responseLang
    }
  } else {
    // If locale exists in path, update cookie
    const pathLocale = request.nextUrl.pathname.split('/')[1]
    
    // We need to return a response to set the cookie
    // But we want to continue to the next middleware
    // So we'll use NextResponse.next() which allows the request to continue
    const response = NextResponse.next()
    response.cookies.set(i18n.cookieOptions.name, pathLocale, i18n.cookieOptions)
    
    return response
  }
}
