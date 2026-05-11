import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

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