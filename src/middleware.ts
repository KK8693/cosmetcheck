import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Locale short-code aliases → full locale codes used in routing
const localeAliases: Record<string, string> = {
  pt: 'pt-BR',
  es: 'es-MX',
}

function handleLocaleAliases(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const firstSegment = pathname.split('/')[1]

  if (localeAliases[firstSegment]) {
    const targetLocale = localeAliases[firstSegment]
    const newPathname = pathname.replace(`/${firstSegment}`, `/${targetLocale}`)
    return NextResponse.redirect(new URL(newPathname, request.url))
  }

  return null
}

export default function middleware(request: NextRequest) {
  const aliasRedirect = handleLocaleAliases(request)
  if (aliasRedirect) return aliasRedirect

  return createMiddleware(routing)(request)
}

export const config = {
  // Match all pathnames except for
  // - api routes
  // - _next static files
  // - files with extensions
  // - root path (handled by [locale] catch-all)
  matcher: [
    '/(zh|pt-BR|es-MX|en)/:path*',
    '/((?!api|_next|favicon.ico|.*\\..*).*)'
  ]
}