'use client'

import { Logo } from '@/components/Logo'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'

export function FooterSection() {
  const t = useTranslations('footer')

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
          </div>

          {/* Column 2: Product */}
          <div>
            <div className="text-white font-semibold mb-4">{t('product')}</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/pricing" className="group inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                {t('complianceCheck')}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="group inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                {t('aiListing')}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="group inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                {t('pricing')}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </li>
          </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <div className="text-white font-semibold mb-4">{t('company')}</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="group inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                {t('aboutUs')}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </li>
            <li>
              <Link href="/contact" className="group inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                {t('contact')}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </li>
          </ul>
          </div>

          {/* Column 4: Resources */}
          <div>
            <div className="text-white font-semibold mb-4">{t('resources')}</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/faq" className="group inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                {t('knowledgeBase')}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </li>
            <li>
              <Link href="/contact" className="group inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                {t('helpCenter')}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="group inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                {t('apiDocs')}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </li>
          </ul>
          </div>

          {/* Column 5: Legal */}
          <div>
            <div className="text-white font-semibold mb-4">{t('legal')}</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/privacy" className="group inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                {t('privacy')}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </li>
            <li>
              <Link href="/terms" className="group inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                {t('terms')}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </li>
            <li>
              <Link href="/cookie-policy" className="group inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                {t('cookiePolicy')}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </li>
            <li>
              <Link href="/refund" className="group inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                {t('refund')}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </li>
            <li>
              <Link href="/disclaimer" className="group inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                {t('disclaimer')}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
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