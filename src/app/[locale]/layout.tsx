import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import { CookieConsent } from '@/components/CookieConsent'
import { Navbar } from '@/components/Navbar'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'

// Required for Cloudflare Pages
export const runtime = 'edge'

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
    },
    featureList: [
      'ANVISA 合规检测',
      'COFEPRIS 合规检测',
      'AI Listing 生成',
      '批量 CSV 检测',
      '法规更新通知',
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NextIntlClientProvider messages={messages}>
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
      </NextIntlClientProvider>
    </>
  )
}
