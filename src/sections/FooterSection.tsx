import { Logo } from '@/components/Logo'
import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'

export async function FooterSection() {
  const t = await getTranslations('footer')

  return (
    <footer className="bg-[#08080C] text-gray-400 py-12">
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo size={28} />
              <span className="text-white font-bold text-xl">CosmetCheck</span>
            </div>
            <p className="text-sm">{t('tagline')}</p>
          </div>
          <div>
            <div className="text-white font-semibold mb-4">{t('product')}</div>
            <ul className="space-y-2 text-sm">
              <li>{t('complianceCheck')}</li>
              <li>{t('aiListing')}</li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  {t('pricing')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-white font-semibold mb-4">{t('resources')}</div>
            <ul className="space-y-2 text-sm">
              <li>{t('knowledgeBase')}</li>
              <li>{t('helpCenter')}</li>
              <li>{t('apiDocs')}</li>
            </ul>
          </div>
          <div>
            <div className="text-white font-semibold mb-4">{t('legal')}</div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-white transition-colors">
                  {t('cookiePolicy')}
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-white transition-colors">
                  {t('refund')}
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white transition-colors">
                  {t('disclaimer')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-sm text-center flex items-center justify-center gap-2">
          <Logo size={16} />
          <span>{t('copyright')}</span>
        </div>
      </div>
    </footer>
  )
}
