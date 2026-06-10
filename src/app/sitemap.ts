import { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog-data'
import { translatedPosts } from '@/lib/blog-translated'
import { getAllSlugs } from '@/lib/ingredient-data'
import { getAllProductTypeSlugs } from '@/data/product-types'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cosmetcheck.com'
const locales = ['zh', 'en', 'pt-BR', 'es-MX']

// Routes that have [locale] versions
const localizedRoutes = [
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
  { path: '/guides', priority: 0.9, freq: 'weekly' as const },
  { path: '/guides/anvisa-complete-guide', priority: 0.9, freq: 'monthly' as const },
  { path: '/guides/cofepris-complete-guide', priority: 0.9, freq: 'monthly' as const },
  { path: '/guides/sell-cosmetics-latam', priority: 0.9, freq: 'monthly' as const },
  { path: '/compliance/brazil-anvisa', priority: 0.8, freq: 'monthly' as const },
  { path: '/compliance/mexico-cofepris', priority: 0.8, freq: 'monthly' as const },
  { path: '/compliance/anvisa-validator', priority: 0.8, freq: 'monthly' as const },
  { path: '/compliance/cosmetic-prohibition-query', priority: 0.8, freq: 'monthly' as const },
  { path: '/batch', priority: 0.7, freq: 'monthly' as const },
]

// Routes that ONLY exist without locale prefix (no [locale] versions)
const unlocalizedRoutes = [
  { path: '/ingredients', priority: 0.9, freq: 'weekly' as const },
  { path: '/products', priority: 0.8, freq: 'weekly' as const },
  { path: '/category/actives', priority: 0.75, freq: 'weekly' as const },
  { path: '/category/preservative', priority: 0.75, freq: 'weekly' as const },
  { path: '/category/skin_lightening', priority: 0.75, freq: 'weekly' as const },
  { path: '/category/hair_coloring', priority: 0.75, freq: 'weekly' as const },
  { path: '/category/surfactant', priority: 0.75, freq: 'weekly' as const },
  { path: '/category/corticosteroid', priority: 0.75, freq: 'weekly' as const },
  { path: '/category/other', priority: 0.7, freq: 'weekly' as const },
  { path: '/status', priority: 0.8, freq: 'weekly' as const },
  { path: '/status/brazil/banned', priority: 0.75, freq: 'weekly' as const },
  { path: '/status/brazil/restricted', priority: 0.75, freq: 'weekly' as const },
  { path: '/status/mexico/banned', priority: 0.75, freq: 'weekly' as const },
  { path: '/status/mexico/restricted', priority: 0.75, freq: 'weekly' as const },
  { path: '/status/mexico/allowed', priority: 0.6, freq: 'monthly' as const },
  { path: '/brasil', priority: 0.9, freq: 'weekly' as const },
  { path: '/mexico', priority: 0.9, freq: 'weekly' as const },
  { path: '/regulation/brazil', priority: 0.85, freq: 'monthly' as const },
  { path: '/regulation/mexico', priority: 0.85, freq: 'monthly' as const },
]

// Build alternates for a localized path
function buildAlternates(path: string) {
  return {
    languages: {
      'en': `${baseUrl}${path}`,
      'zh-CN': `${baseUrl}/zh${path}`,
      'pt-BR': `${baseUrl}/pt-BR${path}`,
      'es-MX': `${baseUrl}/es-MX${path}`,
    },
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date()
  const allPosts = [...blogPosts, ...translatedPosts]
  const ingredientSlugs = getAllSlugs()
  const entries: MetadataRoute.Sitemap = []

  // ── Localized routes: generate for all locales ──
  for (const route of localizedRoutes) {
    // Default (en) - no locale prefix
    entries.push({
      url: `${baseUrl}${route.path}`,
      lastModified: currentDate,
      changeFrequency: route.freq,
      priority: route.priority,
      alternates: buildAlternates(route.path),
    })

    // Other locales
    for (const locale of locales) {
      if (locale === 'en') continue
      entries.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified: currentDate,
        changeFrequency: route.freq,
        priority: route.priority * 0.9,
        alternates: buildAlternates(route.path),
      })
    }
  }

  // ── Unlocalized routes: only default (en), no locale prefix ──
  for (const route of unlocalizedRoutes) {
    entries.push({
      url: `${baseUrl}${route.path}`,
      lastModified: currentDate,
      changeFrequency: route.freq,
      priority: route.priority,
    })
  }

  // ── Ingredient detail pages (no locale versions) ──
  for (const slug of ingredientSlugs) {
    entries.push({
      url: `${baseUrl}/ingredient/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  // ── Product type × country pages (no locale versions) ──
  const productTypeSlugs = getAllProductTypeSlugs()
  const productCountries = ['brazil', 'mexico']
  for (const typeSlug of productTypeSlugs) {
    for (const pc of productCountries) {
      entries.push({
        url: `${baseUrl}/products/${typeSlug}/${pc}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  // ── Blog posts: group by slug to build proper alternates ──
  const slugToPosts: Record<string, typeof allPosts> = {}
  for (const post of allPosts) {
    if (!slugToPosts[post.slug]) slugToPosts[post.slug] = []
    slugToPosts[post.slug].push(post)
  }

  for (const [slug, posts] of Object.entries(slugToPosts)) {
    const postLocales: Record<string, string> = {}
    for (const post of posts) {
      const loc = post.locale === 'pt-BR' ? 'pt-BR' : post.locale === 'es-MX' ? 'es-MX' : 'en'
      postLocales[loc] = `${baseUrl}/${loc}/blog/${slug}`
    }

    for (const post of posts) {
      const loc = post.locale === 'pt-BR' ? 'pt-BR' : post.locale === 'es-MX' ? 'es-MX' : 'en'
      const languages: Record<string, string> = {}
      for (const [l, url] of Object.entries(postLocales)) {
        const hreflang = l === 'pt-BR' ? 'pt-BR' : l === 'es-MX' ? 'es-MX' : 'en'
        languages[hreflang] = url
      }
      // Also add x-default
      languages['x-default'] = postLocales['en'] || Object.values(postLocales)[0]

      entries.push({
        url: `${baseUrl}/${loc}/blog/${slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'monthly',
        priority: post.featured ? 0.7 : 0.6,
        alternates: { languages },
      })
    }
  }

  return entries
}
