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

function enforceHttps(request: NextRequest) {
  // Cloudflare forwards the original protocol via x-forwarded-proto
  const proto = request.headers.get('x-forwarded-proto')
  if (proto === 'http') {
    const httpsUrl = new URL(request.url)
    httpsUrl.protocol = 'https'
    return NextResponse.redirect(httpsUrl, 301)
  }
  return null
}

function addSecurityHeaders(response: NextResponse) {
  // HSTS: tell browsers to always use HTTPS for this domain
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )
  return response
}

export default function middleware(request: NextRequest) {
  // 1. Force HTTPS via 301 redirect
  const httpsRedirect = enforceHttps(request)
  if (httpsRedirect) return httpsRedirect

  // 2. Handle locale short-code aliases (pt → pt-BR, es → es-MX)
  const aliasRedirect = handleLocaleAliases(request)
  if (aliasRedirect) return aliasRedirect

  // 3. Run next-intl middleware
  const response = createMiddleware(routing)(request)

  // 4. Add HSTS header to all responses
  return addSecurityHeaders(response)
}

export const config = {
  // Match all pathnames except for
  // - api routes
  // - _next static files
  // - files with extensions
  // - root path (handled by [locale] catch-all)
  matcher: [
    '/(zh|pt|pt-BR|es|es-MX|en)/:path*',
    '/((?!api|_next|favicon.ico|ingredients|ingredient|category|status|regulation|products|platforms|.*\\..*).*)'
  ]
}