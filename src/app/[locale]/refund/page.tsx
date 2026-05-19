/**
 * Refund Policy page - i18n version
 */
'use client'

import { useTranslations } from 'next-intl'

export const runtime = 'edge'

export default function RefundPage() {
  const t = useTranslations('legal.refund')

  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom max-w-3xl py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('title')}</h1>
        <p className="text-gray-500 mb-12" dangerouslySetInnerHTML={{ __html: t('lastUpdated') }} />

        <div className="prose prose-gray max-w-none">
          <div dangerouslySetInnerHTML={{ __html: t('s1') }} />
          <div dangerouslySetInnerHTML={{ __html: t('s2') }} />
          <div dangerouslySetInnerHTML={{ __html: t('s3') }} />
          <div dangerouslySetInnerHTML={{ __html: t('s4') }} />
          <div dangerouslySetInnerHTML={{ __html: t('s5') }} />
          <div dangerouslySetInnerHTML={{ __html: t('s6') }} />
        </div>
      </div>
    </div>
  )
}
