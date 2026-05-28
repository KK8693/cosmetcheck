import { Metadata } from 'next'
import Link from 'next/link'
import { getPostsByLocale } from '@/lib/blog-data'
import type { BlogLocale } from '@/lib/blog-data'

export const runtime = 'edge'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isPT = locale === 'pt-BR'
  const isES = locale === 'es-MX'

  return {
    title: isPT
      ? 'Blog CosmetCheck | Guias de Compliance para Vendedores de Cosméticos'
      : isES
        ? 'Blog CosmetCheck | Guías de Compliance para Vendedores de Belleza'
        : 'CosmetCheck Blog | Cosmetics Compliance Guides',
    description: isPT
      ? 'Guias práticos sobre ANVISA, COFEPRIS e compliance de cosméticos para sellers da América Latina.'
      : isES
        ? 'Guías prácticas sobre COFEPRIS, ANVISA y compliance de belleza para vendedores de Latinoamérica.'
        : 'Practical guides on ANVISA, COFEPRIS, and cosmetics compliance for LatAm sellers.',
    alternates: {
      canonical: `https://cosmetcheck.com/${locale}/blog`,
      languages: {
        'pt-BR': 'https://cosmetcheck.com/pt-BR/blog',
        'es-MX': 'https://cosmetcheck.com/es-MX/blog',
        'en': 'https://cosmetcheck.com/en/blog',
      },
    },
  }
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params
  const posts = getPostsByLocale(locale as BlogLocale)

  const isPT = locale === 'pt-BR'
  const isES = locale === 'es-MX'

  const t = {
    title: isPT
      ? 'Blog CosmetCheck'
      : isES
        ? 'Blog CosmetCheck'
        : 'CosmetCheck Blog',
    subtitle: isPT
      ? 'Guias de compliance e dicas para vendedores de cosméticos na América Latina'
      : isES
        ? 'Guías de compliance y consejos para vendedores de belleza en Latinoamérica'
        : 'Compliance guides and tips for cosmetics sellers in Latin America',
    readMore: isPT ? 'Ler mais' : isES ? 'Leer más' : 'Read more',
    readingTime: isPT ? 'min de leitura' : isES ? 'min de lectura' : 'min read',
    category: isPT ? 'Categoria' : isES ? 'Categoría' : 'Category',
    noPosts: isPT
      ? 'Nenhum artigo disponível neste idioma ainda.'
      : isES
        ? 'Ningún artículo disponible en este idioma todavía.'
        : 'No articles available in this language yet.',
  }

  // Breadcrumb JSON-LD
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `https://cosmetcheck.com/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `https://cosmetcheck.com/${locale}/blog`,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#0F1419]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#0A4D8C] via-[#1E6BB8] to-[#00A86B]">
        <div className="container-custom text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            {t.title}
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 md:py-20">
        <div className="container-custom max-w-5xl">
          {posts.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              <p>{t.noPosts}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-[#1A1A24] border border-[#252530] rounded-xl overflow-hidden hover:border-[#0A4D8C]/50 transition-colors"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium px-2 py-1 rounded bg-[#0A4D8C]/20 text-[#0A4D8C]">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {post.readingTime} {t.readingTime}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white mb-2 line-clamp-2">
                      <Link
                        href={`/${locale}/blog/${post.slug}`}
                        className="hover:text-[#00A86B] transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(post.publishedAt).toLocaleDateString(
                          locale === 'pt-BR' ? 'pt-BR' : locale === 'es-MX' ? 'es-MX' : 'en',
                          { year: 'numeric', month: 'short', day: 'numeric' }
                        )}
                      </span>
                      <Link
                        href={`/${locale}/blog/${post.slug}`}
                        className="text-sm font-medium text-[#00A86B] hover:underline"
                      >
                        {t.readMore} →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
