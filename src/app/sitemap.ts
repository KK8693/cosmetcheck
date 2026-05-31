import { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog-data'
import { translatedPosts } from '@/lib/blog-translated'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cosmetcheck.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['zh', 'en', 'pt-BR', 'es-MX']
  const currentDate = new Date()

  // All blog posts including translations
  const allPosts = [...blogPosts, ...translatedPosts]

  // ── Static routes ─────────────────────────────────────────
  const staticRoutes = [
    { path: '', priority: 1.0, freq: 'weekly' as const },
    { path: '/pricing', priority: 0.9, freq: 'weekly' as const },
    { path: '/about', priority: 0.6, freq: 'monthly' as const },
    { path: '/contact', priority: 0.6, freq: 'monthly' as const },
    { path: '/faq', priority: 0.7, freq: 'monthly' as const },
    { path: '/terms', priority: 0.4, freq: 'yearly' as const },
    { path: '/privacy', priority: 0.4, freq: 'yearly' as const },
    { path: '/refund', priority: 0.4, freq: 'yearly' as const },
    { path: '/disclaimer', priority: 0.4, freq: 'yearly' as const },
    { path: '/cookie-policy', priority: 0.4, freq: 'yearly' as const },
    { path: '/blog', priority: 0.8, freq: 'weekly' as const },
    // Pillar pages (guides)
    { path: '/guides', priority: 0.9, freq: 'weekly' as const },
    { path: '/guides/anvisa-complete-guide', priority: 0.9, freq: 'monthly' as const },
    { path: '/guides/cofepris-complete-guide', priority: 0.9, freq: 'monthly' as const },
    { path: '/guides/sell-cosmetics-latam', priority: 0.9, freq: 'monthly' as const },
    // Landing pages (compliance guides)
    { path: '/compliance/brazil-anvisa', priority: 0.8, freq: 'monthly' as const },
    { path: '/compliance/mexico-cofepris', priority: 0.8, freq: 'monthly' as const },
    { path: '/compliance/anvisa-validator', priority: 0.8, freq: 'monthly' as const },
    { path: '/compliance/cosmetic-prohibition-query', priority: 0.8, freq: 'monthly' as const },
    { path: '/batch', priority: 0.7, freq: 'monthly' as const },
  ]

  // Country-specific pages
  const countryPages = [
    '/brasil',
    '/mexico',
  ]

  // ── Build sitemap ─────────────────────────────────────────
  const sitemapEntries: MetadataRoute.Sitemap = []

  // Default (en) routes
  for (const route of staticRoutes) {
    sitemapEntries.push({
      url: `${baseUrl}${route.path}`,
      lastModified: currentDate,
      changeFrequency: route.freq,
      priority: route.priority,
    })
  }

  // Country pages (no locale prefix)
  for (const path of countryPages) {
    sitemapEntries.push({
      url: `${baseUrl}${path}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  }

  // Multilingual versions with alternates
  for (const locale of locales) {
    if (locale === 'en') continue // already added as default

    for (const route of staticRoutes) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified: currentDate,
        changeFrequency: route.freq,
        priority: route.priority * 0.9, // slightly lower for non-default locale
        alternates: {
          languages: {
            'en': `${baseUrl}${route.path}`,
            'zh': `${baseUrl}/zh${route.path}`,
            'pt-BR': `${baseUrl}/pt-BR${route.path}`,
            'es-MX': `${baseUrl}/es-MX${route.path}`,
          },
        },
      })
    }
  }

  // ── Blog posts ────────────────────────────────────────────
  for (const post of allPosts) {
    // Each post is published in its native locale
    const localeMap: Record<string, string> = {
      'pt-BR': 'pt-BR',
      'es-MX': 'es-MX',
      'en': 'en',
    }
    const loc = localeMap[post.locale] || 'en'

    sitemapEntries.push({
      url: `${baseUrl}/${loc}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly',
      priority: post.featured ? 0.7 : 0.6,
      alternates: {
        languages: {
          [post.locale]: `${baseUrl}/${loc}/blog/${post.slug}`,
        },
      },
    })
  }

  return sitemapEntries
}
