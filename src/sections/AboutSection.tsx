'use client'

import { useTranslations } from 'next-intl'

export function AboutSection() {
  const t = useTranslations('about')

  return (
    <section className="py-20 bg-[#252530]">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            {t('title')}
          </h1>
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <p className="text-lg">{t('description')}</p>
            <p className="text-lg">{t('mission')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
