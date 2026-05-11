import type { Metadata } from 'next'
import { Inter, Space_Grotesk, DM_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import { CookieConsent } from '@/components/CookieConsent'
import { Navbar } from '@/components/Navbar'
import { I18nProvider } from '@/i18n/useI18n'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'

// Required for Cloudflare Pages
export const runtime = 'edge'

const inter = Inter({ subsets: ['latin'], display: 'swap', preload: true })
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  display: 'swap', 
  preload: true,
  variable: '--font-display',
})
const dmSans = DM_Sans({ 
  subsets: ['latin'], 
  display: 'swap', 
  preload: true,
  variable: '--font-body',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://cosmetcheck.com'),
  title: {
    default: 'CosmetCheck - 拉美美妆合规检测专家',
    template: '%s | CosmetCheck',
  },
  description: '一键检测巴西/墨西哥等5国美妆合规，AI自动生成高转化Listing。免费开始，让您的美妆产品顺利进入拉美市场。',
  keywords: 'ANVISA, COFEPRIS, 美妆合规, 巴西美妆, 墨西哥美妆, 化妆品检测, Listing生成',
  authors: [{ name: 'CosmetCheck' }],
  creator: 'CosmetCheck',
  publisher: 'CosmetCheck',
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
  openGraph: {
    title: 'CosmetCheck - 拉美卖美妆，不再被下架罚款',
    description: '一键检测巴西/墨西哥美妆合规，AI自动生成高转化Listing。免费开始，避免ANVISA/COFEPRIS下架罚款。',
    url: 'https://cosmetcheck.com',
    siteName: 'CosmetCheck',
    locale: 'zh_CN',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CosmetCheck - 拉美美妆合规检测专家',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CosmetCheck - 拉美美妆合规检测专家',
    description: '一键检测巴西/墨西哥美妆合规，AI自动生成高转化Listing',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://cosmetcheck.com',
    languages: {
      'zh-CN': 'https://cosmetcheck.com',
      'pt-BR': 'https://cosmetcheck.com/brasil',
      'es-MX': 'https://cosmetcheck.com/mexico',
    },
  },
  verification: {
    google: 'google-site-verification-code', // TODO: Add actual verification code
  },
}

// No generateStaticParams needed - handled by [locale] layouts
// The root layout will fall back to default locale

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale?: string }>
}) {
  // Extract locale - may be undefined for root
  const resolvedParams = await params
  const locale = resolvedParams.locale || routing.defaultLocale
  
  // Enable static rendering for this locale
  setRequestLocale(locale)
  
  const messages = await getMessages()
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'CosmetCheck',
    description: '一键检测巴西/墨西哥等5国美妆合规，AI自动生成高转化Listing',
    url: 'https://cosmetcheck.com',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
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
        telephone: '+55-11-99999-9999',
        contactType: 'customer service',
        availableLanguage: ['Chinese', 'Portuguese', 'Spanish', 'English'],
      },
    },
    featureList: [
      'ANVISA 合规检测',
      'COFEPRIS 合规检测',
      'AI Listing 生成',
      '批量 CSV 检测',
      '法规更新通知',
    ],
    screenshot: 'https://cosmetcheck.com/og-image.png',
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} ${spaceGrotesk.variable} ${dmSans.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <I18nProvider>
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
              </AuthProvider>
            </ThemeProvider>
          </I18nProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}