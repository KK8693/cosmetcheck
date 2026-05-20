'use client'

import { Logo } from '@/components/Logo'
import { Link } from '@/i18n/routing'
import { useTranslations, useLocale } from 'next-intl'
import { Mail } from 'lucide-react'

export function FooterSection() {
  const t = useTranslations('footer')

  const emailHref = 'mailto:support@cosmetcheck.com?subject=Support%20Request'

  return (
    <footer className="bg-[#08080C] text-gray-400 py-12">
      <div className="container-custom">
        {/* 5 Column Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Column 1: Brand + WhatsApp CTA */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Logo size={28} />
              <span className="text-white font-bold text-xl">CosmetCheck</span>
            </div>
            <p className="text-sm">{t('tagline')}</p>
            <a
              href={emailHref}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
          </div>

          {/* Column 2: Product */}
          <div>
            <div className="text-white font-semibold mb-4">{t('product')}</div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  {t('complianceCheck')}
                </Link>
              </li>
              <li>{t('aiListing')}</li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  {t('pricing')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <div className="text-white font-semibold mb-4">{t('company')}</div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  {t('careers')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div>
            <div className="text-white font-semibold mb-4">{t('resources')}</div>
            <ul className="space-y-2 text-sm">
              <li>{t('knowledgeBase')}</li>
              <li>{t('helpCenter')}</li>
              <li>{t('apiDocs')}</li>
            </ul>
          </div>

          {/* Column 5: Legal */}
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

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-sm text-center flex items-center justify-center gap-2">
          <Logo size={16} />
          <span>{t('copyright')}</span>
        </div>
      </div>
    </footer>
  )
}