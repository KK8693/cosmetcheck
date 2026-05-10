/**
 * Cloudflare Pages i18n Router
 * Wraps the Next.js worker and handles locale redirects
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const pathname = url.pathname

    // List of valid locales
    const locales = ['zh', 'pt-BR', 'es-MX', 'en']
    const defaultLocale = 'zh'

    // Check if pathname starts with a valid locale
    const pathSegments = pathname.split('/').filter(Boolean)
    const firstSegment = pathSegments[0]

    // If no locale in path, redirect to default locale
    if (!firstSegment || !locales.includes(firstSegment)) {
      // Skip API routes and static files
      if (!pathname.startsWith('/api/') && 
          !pathname.includes('.') && 
          pathname !== '/favicon.ico') {
        // Redirect to default locale (zh)
        const newUrl = new URL(request.url)
        newUrl.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
        return Response.redirect(newUrl.toString(), 301)
      }
    }

    // Pass through to Next.js worker
    return fetch(request)
  }
}