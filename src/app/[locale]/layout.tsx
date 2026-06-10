import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import { CookieConsent } from '@/components/CookieConsent'
import { Navbar } from '@/components/Navbar'
import ChatWidget from '@/components/ChatWidget'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// Required for Cloudflare Pages
export const runtime = 'edge'

const localeMeta: Record<string, Metadata> = {
  zh: {
    title: { default: 'CosmetCheck - 拉美美妆合规检测专家', template: '%s | CosmetCheck' },
    description: '一键检测巴西/墨西哥等5国美妆合规，AI自动生成高转化Listing。免费开始，避免ANVISA/COFEPRIS下架罚款。',
    keywords: 'ANVISA, COFEPRIS, 美妆合规, 巴西美妆, 墨西哥美妆, 化妆品检测, Listing生成',
    openGraph: {
      title: 'CosmetCheck - 拉美美妆合规检测专家',
      description: '一键检测巴西/墨西哥等5国美妆合规，AI自动生成高转化Listing。免费开始，避免ANVISA/COFEPRIS下架罚款。',
      locale: 'zh_CN',
      type: 'website',
      siteName: 'CosmetCheck',
      images: [{ url: 'https://cosmetcheck.com/og-image.png', width: 1200, height: 630, alt: 'CosmetCheck - 拉美美妆合规检测专家' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'CosmetCheck - 拉美美妆合规检测专家',
      description: '一键检测巴西/墨西哥等5国美妆合规，AI自动生成高转化Listing',
      images: ['https://cosmetcheck.com/og-image.png'],
    },
  },
  en: {
    title: { default: 'CosmetCheck — LatAm Beauty Compliance AI', template: '%s | CosmetCheck' },
    description: 'One-click compliance check for Brazil, Mexico and 4 other countries. AI auto-generates high-converting Listings. Start free, avoid ANVISA/COFEPRIS penalties.',
    keywords: 'ANVISA, COFEPRIS, beauty compliance, Brazil cosmetics, Mexico cosmetics, cosmetic compliance, listing generation, LATAM',
    openGraph: {
      title: 'CosmetCheck — LatAm Beauty Compliance AI',
      description: 'One-click compliance check for Brazil, Mexico and 4 other countries. AI auto-generates high-converting Listings. Start free, avoid ANVISA/COFEPRIS penalties.',
      locale: 'en_US',
      type: 'website',
      siteName: 'CosmetCheck',
      images: [{ url: 'https://cosmetcheck.com/og-image.png', width: 1200, height: 630, alt: 'CosmetCheck — LatAm Beauty Compliance AI' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'CosmetCheck — LatAm Beauty Compliance AI',
      description: 'One-click compliance check for Brazil, Mexico and 4 other countries. AI auto-generates high-converting Listings.',
      images: ['https://cosmetcheck.com/og-image.png'],
    },
  },
  'pt-BR': {
    title: { default: 'CosmetCheck — Compliance de Beleza LatAm', template: '%s | CosmetCheck' },
    description: 'Verificação de conformidade com um clique para Brasil, México e 4 países. Listings de alta conversão gerados por IA. Comece grátis, evite multas da ANVISA/COFEPRIS.',
    keywords: 'ANVISA, COFEPRIS, conformidade cosmética, cosméticos Brasil, cosméticos México, teste de conformidade, geração de listing',
    openGraph: {
      title: 'CosmetCheck — Compliance de Beleza LatAm',
      description: 'Verificação de conformidade com um clique para Brasil, México e 4 países. Listings de alta conversão gerados por IA. Comece grátis, evite multas.',
      locale: 'pt_BR',
      type: 'website',
      siteName: 'CosmetCheck',
      images: [{ url: 'https://cosmetcheck.com/og-image.png', width: 1200, height: 630, alt: 'CosmetCheck — Compliance de Beleza LatAm' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'CosmetCheck — Compliance de Beleza LatAm',
      description: 'Verificação de conformidade com um clique para Brasil, México e 4 países. Listings de alta conversão gerados por IA.',
      images: ['https://cosmetcheck.com/og-image.png'],
    },
  },
  'es-MX': {
    title: { default: 'CosmetCheck — Cumplimiento de Belleza LatAm', template: '%s | CosmetCheck' },
    description: 'Verificación de cumplimiento con un clic para Brasil, México y 4 países más. Listings de alta conversión generados por IA. Empieza gratis, evita multas de COFEPRIS/ANVISA.',
    keywords: 'ANVISA, COFEPRIS, cumplimiento cosmético, cosméticos Brasil, cosméticos México, prueba de cumplimiento, generación de listing',
    openGraph: {
      title: 'CosmetCheck — Cumplimiento de Belleza LatAm',
      description: 'Verificación de cumplimiento con un clic para Brasil, México y 4 países más. Listings de alta conversión generados por IA. Empieza gratis, evita multas.',
      locale: 'es_MX',
      type: 'website',
      siteName: 'CosmetCheck',
      images: [{ url: 'https://cosmetcheck.com/og-image.png', width: 1200, height: 630, alt: 'CosmetCheck — Cumplimiento de Belleza LatAm' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'CosmetCheck — Cumplimiento de Belleza LatAm',
      description: 'Verificación de cumplimiento con un clic para Brasil, México y 4 países más. Listings de alta conversión generados por IA.',
      images: ['https://cosmetcheck.com/og-image.png'],
    },
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const base = localeMeta[locale] || localeMeta['en']
  return {
    ...base,
    alternates: {
      canonical: `https://cosmetcheck.com/${locale}`,
      languages: {
        'zh-CN': '/zh',
        'en': '/en',
        'pt-BR': '/pt-BR',
        'es-MX': '/es-MX',
        'x-default': '/en',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    },
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  // Validate locale
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound()
  }
  
  // Enable static rendering for this locale
  setRequestLocale(locale)
  
  const messages = await getMessages()
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'CosmetCheck',
    alternateName: ['美妆合规检测', 'Cosméticos Compliance'],
    description: '一键检测巴西/墨西哥等5国美妆合规，AI自动生成高转化Listing',
    url: 'https://cosmetcheck.com',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    availableOn: 'https://cosmetcheck.com',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: '2025-01-01',
      description: '免费版每月10次检测',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '200',
      bestRating: '5',
    },
    provider: {
      '@type': 'Organization',
      name: 'CosmetCheck',
      url: 'https://cosmetcheck.com',
      logo: 'https://cosmetcheck.com/logo.png',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['zh', 'pt-BR', 'es-MX', 'en'],
      },
    },
    featureList: [
      'ANVISA 合规检测',
      'COFEPRIS 合规检测',
      'AI Listing 生成',
      '批量 CSV 检测',
      '法规更新通知',
    ],
    potentialAction: {
      '@type': 'UseAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://cosmetcheck.com/{locale}',
        urlInputParameter: 'locale',
      },
    },
    areaServed: [
      { '@type': 'Country', name: 'Brazil', alternateName: 'BR' },
      { '@type': 'Country', name: 'Mexico', alternateName: 'MX' },
      { '@type': 'Country', name: 'Colombia', alternateName: 'CO' },
      { '@type': 'Country', name: 'Argentina', alternateName: 'AR' },
      { '@type': 'Country', name: 'Chile', alternateName: 'CL' },
    ],
    serviceType: 'Cosmetic Compliance Checking',
  }

  // Localized schema for FAQ page
  const faqJsonLd = locale === 'zh' || locale === 'pt-BR' || locale === 'es-MX' ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'CosmetCheck 支持哪些国家的美妆法规检测？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '支持巴西(ANVISA)、墨西哥(COFEPRIS)、哥伦比亚、阿根廷、智利等拉美5国法规检测。',
        },
      },
      {
        '@type': 'Question',
        name: 'AI Listing 生成需要付费吗？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '免费版每月可生成10条Listing，付费版无限制并支持批量生成。',
        },
      },
    ],
  } : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NextIntlClientProvider messages={messages} locale={locale}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <Navbar />
              {children}
              <CookieConsent />
              <ChatWidget />
            </AuthProvider>
          </ThemeProvider>
      </NextIntlClientProvider>
    </>
  )
}
