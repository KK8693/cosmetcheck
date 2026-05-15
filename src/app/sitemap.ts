import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cosmetcheck.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['zh', 'en', 'pt-BR', 'es-MX']
  const currentDate = new Date()

  // 主页面
  const routes = [
    '',
    '/features',
    '/pricing',
    '/blog',
  ]

  // 生成所有语言版本的 sitemap
  const sitemapEntries: MetadataRoute.Sitemap = []

  // 添加默认语言版本
  for (const route of routes) {
    sitemapEntries.push({
      url: `${baseUrl}${route}`,
      lastModified: currentDate,
      changeFrequency: route === '' ? 'weekly' : 'monthly',
      priority: route === '' ? 1.0 : 0.8,
    })
  }

  // 添加多语言版本
  for (const locale of locales) {
    if (locale === 'en') continue // en 作为默认语言已添加

    for (const route of routes) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: currentDate,
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 0.9 : 0.7,
        alternates: {
          languages: {
            'en': `${baseUrl}${route}`,
            'zh': `${baseUrl}/zh${route}`,
            'pt-BR': `${baseUrl}/pt-BR${route}`,
            'es-MX': `${baseUrl}/es-MX${route}`,
          },
        },
      })
    }
  }

  return sitemapEntries
}