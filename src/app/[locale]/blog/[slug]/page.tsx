import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllSlugs, getPostsByLocale } from '@/lib/blog-data'
import type { BlogLocale } from '@/lib/blog-data'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  const locales: BlogLocale[] = ['pt-BR', 'es-MX', 'en']
  const params: { locale: string; slug: string }[] = []

  for (const locale of locales) {
    for (const slug of slugs) {
      params.push({ locale, slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getPostBySlug(slug, locale as BlogLocale)

  if (!post) {
    return {
      title: 'Not Found',
      description: 'Article not found',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      locale: locale === 'pt-BR' ? 'pt_BR' : locale === 'es-MX' ? 'es_MX' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: `https://cosmetcheck.com/${locale}/blog/${slug}`,
      languages: {
        'pt-BR': `https://cosmetcheck.com/pt-BR/blog/${slug}`,
        'es-MX': `https://cosmetcheck.com/es-MX/blog/${slug}`,
        'en': `https://cosmetcheck.com/en/blog/${slug}`,
        'x-default': 'https://cosmetcheck.com/en',
      },
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params
  const post = await getPostBySlug(slug, locale as BlogLocale)

  if (!post) {
    notFound()
  }

  const isPT = locale === 'pt-BR'
  const isES = locale === 'es-MX'

  const t = {
    backToBlog: isPT ? '← Voltar ao Blog' : isES ? '← Volver al Blog' : '← Back to Blog',
    readingTime: isPT ? 'min de leitura' : isES ? 'min de lectura' : 'min read',
    category: isPT ? 'Categoria' : isES ? 'Categoría' : 'Category',
    tags: isPT ? 'Tags' : isES ? 'Etiquetas' : 'Tags',
    updated: isPT ? 'Atualizado em' : isES ? 'Actualizado el' : 'Updated',
    tryTool: isPT ? 'Verifique seus produtos com CosmetCheck' : isES ? 'Verifique sus productos con CosmetCheck' : 'Check your products with CosmetCheck',
    ctaButton: isPT ? 'Testar Grátis' : isES ? 'Probar Gratis' : 'Try Free',
    share: isPT ? 'Compartilhar' : isES ? 'Compartir' : 'Share',
    relatedPosts: isPT ? 'Artigos Relacionados' : isES ? 'Artículos Relacionados' : 'Related Posts',
    newsletterTitle: isPT
      ? 'Receba Dicas de Compliance na Sua Caixa de Entrada'
      : isES
        ? 'Reciba Consejos de Cumplimiento en Su Bandeja de Entrada'
        : 'Get Compliance Tips in Your Inbox',
    newsletterDesc: isPT
      ? 'Uma vez por semana. Sem spam. Apenas atualizações sobre ANVISA, COFEPRIS e estratégia de mercado.'
      : isES
        ? 'Una vez por semana. Sin spam. Solo actualizaciones sobre ANVISA, COFEPRIS y estrategia de mercado.'
        : 'Once a week. No spam. Just updates on ANVISA, COFEPRIS, and market strategy.',
    newsletterPlaceholder: isPT ? 'Seu e-mail' : isES ? 'Su correo electrónico' : 'Your email',
    newsletterButton: isPT ? 'Inscrever-se' : isES ? 'Suscribirse' : 'Subscribe',
  }

  // Get related posts (same category or shared tags, exclude current)
  const allPosts = await getPostsByLocale(locale as BlogLocale)
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .filter((p) => p.category === post.category || p.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 3)

  // Determine pillar backlink based on slug/tags
  const pillarMap: Record<string, { slug: string; title: Record<string, string> }> = {
    'anvisa-registration-timeline': { slug: 'anvisa-complete-guide', title: { en: 'ANVISA Cosmetics Compliance Guide', 'pt-BR': 'Guia de Conformidade de Cosm\u00e9ticos ANVISA', 'es-MX': 'Gu\u00eda de Cumplimiento de Cosm\u00e9ticos ANVISA' } },
    'anvisa-registration-cost': { slug: 'anvisa-complete-guide', title: { en: 'ANVISA Cosmetics Compliance Guide', 'pt-BR': 'Guia de Conformidade de Cosm\u00e9ticos ANVISA', 'es-MX': 'Gu\u00eda de Cumplimiento de Cosm\u00e9ticos ANVISA' } },
    'anvisa-labeling-requirements': { slug: 'anvisa-complete-guide', title: { en: 'ANVISA Cosmetics Compliance Guide', 'pt-BR': 'Guia de Conformidade de Cosm\u00e9ticos ANVISA', 'es-MX': 'Gu\u00eda de Cumplimiento de Cosm\u00e9ticos ANVISA' } },
    'common-anvisa-rejections': { slug: 'anvisa-complete-guide', title: { en: 'ANVISA Cosmetics Compliance Guide', 'pt-BR': 'Guia de Conformidade de Cosm\u00e9ticos ANVISA', 'es-MX': 'Gu\u00eda de Cumplimiento de Cosm\u00e9ticos ANVISA' } },
    'anvisa-banned-ingredients-list-2025': { slug: 'anvisa-complete-guide', title: { en: 'ANVISA Cosmetics Compliance Guide', 'pt-BR': 'Guia de Conformidade de Cosm\u00e9ticos ANVISA', 'es-MX': 'Gu\u00eda de Cumplimiento de Cosm\u00e9ticos ANVISA' } },
    'how-to-register-cosmetics-brazil-step-by-step': { slug: 'anvisa-complete-guide', title: { en: 'ANVISA Cosmetics Compliance Guide', 'pt-BR': 'Guia de Conformidade de Cosm\u00e9ticos ANVISA', 'es-MX': 'Gu\u00eda de Cumplimiento de Cosm\u00e9ticos ANVISA' } },
    'cofepris-registration-steps': { slug: 'cofepris-complete-guide', title: { en: 'COFEPRIS Cosmetics Registration Guide', 'pt-BR': 'Guia de Registro de Cosm\u00e9ticos COFEPRIS', 'es-MX': 'Gu\u00eda de Registro de Cosm\u00e9ticos COFEPRIS' } },
    'nom-141-labeling': { slug: 'cofepris-complete-guide', title: { en: 'COFEPRIS Cosmetics Registration Guide', 'pt-BR': 'Guia de Registro de Cosm\u00e9ticos COFEPRIS', 'es-MX': 'Gu\u00eda de Registro de Cosm\u00e9ticos COFEPRIS' } },
    'cofepris-cost-breakdown': { slug: 'cofepris-complete-guide', title: { en: 'COFEPRIS Cosmetics Registration Guide', 'pt-BR': 'Guia de Registro de Cosm\u00e9ticos COFEPRIS', 'es-MX': 'Gu\u00eda de Registro de Cosm\u00e9ticos COFEPRIS' } },
    'cofepris-vs-anvisa-key-differences': { slug: 'cofepris-complete-guide', title: { en: 'COFEPRIS Cosmetics Registration Guide', 'pt-BR': 'Guia de Registro de Cosm\u00e9ticos COFEPRIS', 'es-MX': 'Gu\u00eda de Registro de Cosm\u00e9ticos COFEPRIS' } },
    'amazon-brazil-requirements': { slug: 'sell-cosmetics-latam', title: { en: 'Sell Cosmetics in Latin America Guide', 'pt-BR': 'Guia de Venda de Cosm\u00e9ticos na Am\u00e9rica Latina', 'es-MX': 'Gu\u00eda de Venta de Cosm\u00e9ticos en Am\u00e9rica Latina' } },
    'mercado-livre-beauty-rules': { slug: 'sell-cosmetics-latam', title: { en: 'Sell Cosmetics in Latin America Guide', 'pt-BR': 'Guia de Venda de Cosm\u00e9ticos na Am\u00e9rica Latina', 'es-MX': 'Gu\u00eda de Venta de Cosm\u00e9ticos en Am\u00e9rica Latina' } },
    'customs-clearance-brazil': { slug: 'sell-cosmetics-latam', title: { en: 'Sell Cosmetics in Latin America Guide', 'pt-BR': 'Guia de Venda de Cosm\u00e9ticos na Am\u00e9rica Latina', 'es-MX': 'Gu\u00eda de Venta de Cosm\u00e9ticos en Am\u00e9rica Latina' } },
  }
  const backlink = pillarMap[post.slug]
  const backlinkText = isPT
    ? `Este artigo faz parte do guia <strong>${backlink?.title['pt-BR'] ?? ''}</strong>. <a href="/${locale}/guides/${backlink?.slug ?? ''}" class="text-[#00A86B] hover:underline">Leia o guia completo</a> para um roadmap passo a passo.`
    : isES
      ? `Este art\u00edculo es parte de la gu\u00eda <strong>${backlink?.title['es-MX'] ?? ''}</strong>. <a href="/${locale}/guides/${backlink?.slug ?? ''}" class="text-[#00A86B] hover:underline">Lea la gu\u00eda completa</a> para una hoja de ruta paso a paso.`
      : `This article is part of the <strong>${backlink?.title['en'] ?? ''}</strong>. <a href="/${locale}/guides/${backlink?.slug ?? ''}" class="text-[#00A86B] hover:underline">Read the complete guide</a> for a step-by-step roadmap.`

  const shareUrl = encodeURIComponent(`https://cosmetcheck.com/${locale}/blog/${post.slug}`)
  const shareTitle = encodeURIComponent(post.title)

  // Article JSON-LD
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: `https://cosmetcheck.com/og-blog-${post.slug}.png`,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: 'https://cosmetcheck.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CosmetCheck',
      logo: {
        '@type': 'ImageObject',
        url: 'https://cosmetcheck.com/logo.png',
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://cosmetcheck.com/${locale}/blog/${post.slug}`,
    },
    keywords: post.tags.join(', '),
    inLanguage: locale,
    articleSection: post.category,
    wordCount: Math.round(post.content.length / 6),
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
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://cosmetcheck.com/${locale}/blog/${post.slug}`,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#0F1419]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="container-custom max-w-3xl py-8">
        {/* Breadcrumb nav */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href={`/${locale}`} className="hover:text-[#00A86B]">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/blog`} className="hover:text-[#00A86B]">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-300">{post.title}</span>
        </nav>

        {/* Back link */}
        <Link
          href={`/${locale}/blog`}
          className="text-sm text-[#00A86B] hover:underline mb-6 inline-block"
        >
          {t.backToBlog}
        </Link>

        {/* Article header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#0A4D8C]/20 text-[#0A4D8C]">
              {post.category}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(post.publishedAt).toLocaleDateString(
                locale === 'pt-BR' ? 'pt-BR' : locale === 'es-MX' ? 'es-MX' : 'en',
                { year: 'numeric', month: 'long', day: 'numeric' }
              )}
            </span>
            <span className="text-xs text-gray-500">
              {post.readingTime} {t.readingTime}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-gray-300">{post.excerpt}</p>
        </header>

        {/* Social share */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-sm text-gray-400">{t.share}:</span>
          <a
            href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-[#1A1A24] border border-[#252530] flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
            aria-label="Share on X"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-[#1A1A24] border border-[#252530] flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
            aria-label="Share on LinkedIn"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a
            href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-[#1A1A24] border border-[#252530] flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
            aria-label="Share on WhatsApp"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
        </div>

        {/* Pillar backlink */}
        {backlink && (
          <div
            className="mb-6 p-4 rounded-xl bg-[#1A1A24] border border-[#00A86B]/30 text-sm text-gray-300"
            dangerouslySetInnerHTML={{ __html: backlinkText }}
          />
        )}

        {/* Article content */}
        <article
          className="text-gray-300 leading-relaxed [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:mb-4 [&_p]:text-gray-300 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_a]:text-[#00A86B] [&_a]:no-underline [&_a:hover]:underline [&_strong]:text-white [&_table]:w-full [&_table]:border-collapse [&_table]:mb-4 [&_th]:text-white [&_th]:border [&_th]:border-gray-700 [&_th]:p-3 [&_th]:text-left [&_td]:border [&_td]:border-gray-700 [&_td]:p-3 [&_td]:text-gray-300"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Newsletter signup */}
        <div className="my-10 p-6 rounded-xl bg-[#1A1A24] border border-[#252530]">
          <h3 className="text-lg font-bold text-white mb-2">{t.newsletterTitle}</h3>
          <p className="text-sm text-gray-400 mb-4">{t.newsletterDesc}</p>
          <form
            action={`/${locale}/api/email/subscribe`}
            method="POST"
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              name="email"
              placeholder={t.newsletterPlaceholder}
              required
              className="flex-1 px-4 py-3 rounded-lg bg-[#0F1419] border border-[#252530] text-white placeholder-gray-500 focus:outline-none focus:border-[#00A86B]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-[#00A86B] text-white font-semibold hover:bg-[#00A86B]/90 transition-colors whitespace-nowrap"
            >
              {t.newsletterButton}
            </button>
          </form>
        </div>

        {/* Tags */}
        <div className="mt-10 pt-6 border-t border-[#252530]">
          <span className="text-sm font-medium text-gray-400">{t.tags}: </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-[#1A1A24] border border-[#252530] text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-10 pt-6 border-t border-[#252530]">
            <h3 className="text-lg font-bold text-white mb-4">{t.relatedPosts}</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/${locale}/blog/${rp.slug}`}
                  className="bg-[#1A1A24] border border-[#252530] rounded-xl p-4 hover:border-[#0A4D8C]/50 transition-colors"
                >
                  <span className="text-xs font-medium px-2 py-1 rounded bg-[#0A4D8C]/20 text-[#0A4D8C]">
                    {rp.category}
                  </span>
                  <h4 className="text-sm font-semibold text-white mt-2 line-clamp-2">{rp.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{rp.readingTime} {t.readingTime}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 p-6 rounded-xl bg-gradient-to-r from-[#0A4D8C]/20 to-[#00A86B]/20 border border-[#0A4D8C]/30">
          <p className="text-white font-semibold mb-3">{t.tryTool}</p>
          <Link
            href={`/${locale}`}
            className="inline-block px-6 py-3 rounded-lg bg-[#00A86B] text-white font-semibold hover:bg-[#00A86B]/90 transition-colors"
          >
            {t.ctaButton}
          </Link>
        </div>
      </div>
    </div>
  )
}
