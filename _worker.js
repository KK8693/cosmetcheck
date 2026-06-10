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

    // Paths that should NOT get locale redirects (unlocalized routes)
    const unlocalizedPrefixes = [
      '/ingredients', '/ingredient', '/category',
      '/status', '/regulation', '/products', '/platforms'
    ]
    function isUnlocalizedPath(path) {
      return unlocalizedPrefixes.some(prefix => path === prefix || path.startsWith(prefix + '/'))
    }

    // Check if pathname starts with a valid locale
    const pathSegments = pathname.split('/').filter(Boolean)
    const firstSegment = pathSegments[0]

    // If no locale in path, redirect to default locale
    if (!firstSegment || !locales.includes(firstSegment)) {
      // Skip API routes, static files, and unlocalized paths
      if (!pathname.startsWith('/api/') && 
          !pathname.includes('.') && 
          pathname !== '/favicon.ico' &&
          !isUnlocalizedPath(pathname)) {
        const newUrl = new URL(request.url)
        newUrl.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
        return Response.redirect(newUrl.toString(), 301)
      }
    }

    // Pass through to Next.js worker
    const response = await fetch(request)

    // Cache product type and platform pages for 1 hour with 24h stale-while-revalidate
    // Match both direct paths and locale-prefixed paths
    const isProductPage = pathname.startsWith('/products/') ||
      (locales.includes(firstSegment) && pathname.startsWith(`/${firstSegment}/products/`))
    const isPlatformPage = pathname.startsWith('/platforms/') ||
      (locales.includes(firstSegment) && pathname.startsWith(`/${firstSegment}/platforms/`))

    if (isProductPage || isPlatformPage) {
      const cachedResponse = new Response(response.body, response)
      cachedResponse.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
      return cachedResponse
    }

    return response
  }
}