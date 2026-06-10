/**
 * Cloudflare Pages i18n Router
 * Wraps the Next.js worker and handles locale redirects
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const pathname = url.pathname

    // 0. Clean malformed URLs (e.g. trailing &)
    if (pathname === '/&' || pathname.endsWith('/&')) {
      const cleanUrl = new URL(request.url)
      cleanUrl.pathname = '/'
      cleanUrl.search = ''
      return Response.redirect(cleanUrl.toString(), 301)
    }

    // 1. Force HTTPS and remove www in a single redirect
    const needsHttps = url.protocol === 'http:'
    const needsNoWww = url.hostname.startsWith('www.')

    if (needsHttps || needsNoWww) {
      const redirectUrl = new URL(request.url)
      redirectUrl.protocol = 'https:'
      redirectUrl.hostname = redirectUrl.hostname.replace(/^www\./, '')

      // If root path, redirect directly to default locale to minimize redirect chains
      if (redirectUrl.pathname === '/') {
        redirectUrl.pathname = '/en'
      }

      return Response.redirect(redirectUrl.toString(), 301)
    }

    // List of valid locales
    const locales = ['zh', 'pt-BR', 'es-MX', 'en']
    const defaultLocale = 'en'

    // Check if pathname starts with a valid locale
    const pathSegments = pathname.split('/').filter(Boolean)
    const firstSegment = pathSegments[0]

    // If no locale in path, redirect to default locale
    if (!firstSegment || !locales.includes(firstSegment)) {
      // Skip API routes and static files
      if (!pathname.startsWith('/api/') && 
          !pathname.includes('.') && 
          pathname !== '/favicon.ico') {
        const newUrl = new URL(request.url)
        newUrl.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
        return Response.redirect(newUrl.toString(), 301)
      }
    }

    // Pass through to Next.js worker
    return fetch(request)
  }
}