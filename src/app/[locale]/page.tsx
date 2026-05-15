import { HeroSection } from '@/sections/HeroSection'
import { HowItWorksSection } from '@/sections/HowItWorksSection'
import { UseCasesSection } from '@/sections/UseCasesSection'
import { FeaturesSection } from '@/sections/FeaturesSection'
import { InteractiveDemo } from '@/components/InteractiveDemo'
import { PricingSection } from '@/sections/PricingSection'
import { FAQSection } from '@/sections/FAQSection'
import { FooterCTASection } from '@/sections/FooterCTASection'
import { FooterSection } from '@/sections/FooterSection'
import WhatsAppFAB from '@/components/WhatsAppFAB'
import { setRequestLocale } from 'next-intl/server'

// Required for Cloudflare Pages
export const runtime = 'edge'

// Force dynamic rendering for Cloudflare Pages compatibility
export const dynamic = 'force-dynamic'

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <UseCasesSection />
      <FeaturesSection />
      <InteractiveDemo />
      <PricingSection />
      <FAQSection />
      <FooterCTASection />
      <FooterSection />
      <WhatsAppFAB />
    </div>
  )
}
