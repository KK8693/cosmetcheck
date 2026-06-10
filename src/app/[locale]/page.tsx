import { Metadata } from 'next'
import { HeroSection } from '@/sections/HeroSection'
import { HowItWorksSection } from '@/sections/HowItWorksSection'
import { UseCasesSection } from '@/sections/UseCasesSection'
import { FeaturesSection } from '@/sections/FeaturesSection'
import { InteractiveDemo } from '@/components/InteractiveDemo'
import { PricingSection } from '@/sections/PricingSection'
import { FAQSection } from '@/sections/FAQSection'
import { FooterCTASection } from '@/sections/FooterCTASection'
import { FooterSection } from '@/sections/FooterSection'
import { HashScrollHandler } from '@/components/HashScrollHandler'
import { setRequestLocale } from 'next-intl/server'

// Required for Cloudflare Pages
export const runtime = 'edge'

// Force dynamic rendering for Cloudflare Pages compatibility
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: {
      absolute: 'CosmetCheck — LatAm Beauty Compliance AI',
    },
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
  }
}

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="min-h-screen">
      <HashScrollHandler />
      <HeroSection />
      <HowItWorksSection />
      <UseCasesSection />
      <FeaturesSection />
      <InteractiveDemo />
      <PricingSection />
      <FAQSection />
      <FooterCTASection />
      <FooterSection />
    </div>
  )
}
