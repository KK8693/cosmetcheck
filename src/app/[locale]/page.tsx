import { HeroSection } from '@/sections/HeroSection'
import { HowItWorksSection } from '@/sections/HowItWorksSection'
import { UseCasesSection } from '@/sections/UseCasesSection'
import { FeaturesSection } from '@/sections/FeaturesSection'
import { InteractiveDemo } from '@/components/InteractiveDemo'
import { PricingSection } from '@/sections/PricingSection'
import { FAQSection } from '@/sections/FAQSection'
import { FooterCTASection } from '@/sections/FooterCTASection'
import { Logo } from '@/components/Logo'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'

// Enable static rendering for this page
export function generateStaticParams() {
  return [
    { locale: 'zh' },
    { locale: 'en' },
    { locale: 'pt-BR' },
    { locale: 'es-MX' },
  ]
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
      <HeroSection />
      <HowItWorksSection />
      <UseCasesSection />
      <FeaturesSection />
      <InteractiveDemo />
      <PricingSection />
      <FAQSection />
      <FooterCTASection />

      {/* Footer */}
      <footer className="bg-[#08080C] text-gray-400 py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Logo size={28} />
                <span className="text-white font-bold text-xl">CosmetCheck</span>
              </div>
              <p className="text-sm">拉美美妆合规检测专家，让出海更简单。</p>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">产品</div>
              <ul className="space-y-2 text-sm">
                <li>合规检测</li>
                <li>AI Listing生成</li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">定价</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">资源</div>
              <ul className="space-y-2 text-sm">
                <li>法规知识库</li>
                <li>帮助中心</li>
                <li>API文档</li>
              </ul>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">法律</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link></li>
                <li>服务条款</li>
                <li>GDPR/LGPD/LFPDPPP</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center flex items-center justify-center gap-2">
            <Logo size={16} />
            <span>© 2025 CosmetCheck. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}