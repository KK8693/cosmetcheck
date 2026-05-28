import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllSlugs } from '@/lib/blog-data'
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
  const post = await getPostBySlug(slug)

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
      },
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params
  const post = await getPostBySlug(slug)

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
  }

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

        {/* Article content */}
        <article
          className="text-gray-300 leading-relaxed [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:mb-4 [&_p]:text-gray-300 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_a]:text-[#00A86B] [&_a]:no-underline [&_a:hover]:underline [&_strong]:text-white [&_table]:w-full [&_table]:border-collapse [&_table]:mb-4 [&_th]:text-white [&_th]:border [&_th]:border-gray-700 [&_th]:p-3 [&_th]:text-left [&_td]:border [&_td]:border-gray-700 [&_td]:p-3 [&_td]:text-gray-300"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

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
