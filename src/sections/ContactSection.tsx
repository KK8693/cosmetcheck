'use client'

import { useTranslations } from 'next-intl'
import { Mail } from 'lucide-react'

export function ContactSection() {
  const t = useTranslations('contact')

  return (
    <section className="py-20 bg-[#252530]">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-8">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-300 mb-10">
            {t('description')}
          </p>
          <a
            href="mailto:support@cosmetcheck.com"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#0A4D8C] text-white text-lg font-medium hover:bg-[#0A4D8C]/80 transition-colors"
          >
            <Mail className="w-5 h-5" />
            support@cosmetcheck.com
          </a>
        </div>
      </div>
    </section>
  )
}
