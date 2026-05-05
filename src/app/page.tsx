import { HeroSection } from '@/sections/HeroSection'
import { HowItWorksSection } from '@/sections/HowItWorksSection'
import { UseCasesSection } from '@/sections/UseCasesSection'
import { FeaturesSection } from '@/sections/FeaturesSection'
import { InteractiveDemo } from '@/components/InteractiveDemo'
import { PricingSection } from '@/sections/PricingSection'
import { FAQSection } from '@/sections/FAQSection'
import { FooterCTASection } from '@/sections/FooterCTASection'

export default function HomePage() {
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
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-white font-bold text-xl mb-4">CosmetCheck</div>
              <p className="text-sm">拉美美妆合规检测专家，让出海更简单。</p>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">产品</div>
              <ul className="space-y-2 text-sm">
                <li>合规检测</li>
                <li>AI Listing生成</li>
                <li><a href="/pricing" className="hover:text-white transition-colors">定价</a></li>
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
                <li><a href="/privacy" className="hover:text-white transition-colors">隐私政策</a></li>
                <li>服务条款</li>
                <li>GDPR/LGPD/LFPDPPP</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            © 2025 CosmetCheck. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
