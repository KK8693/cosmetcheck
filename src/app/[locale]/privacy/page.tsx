/**
 * Privacy Policy page - i18n version
 */
'use client'

import { useTranslations } from 'next-intl'

export const runtime = 'edge'

export default function PrivacyPage() {
  const t = useTranslations('legal')

  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom max-w-3xl py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('privacy.title')}</h1>
        <p className="text-gray-500 mb-12" dangerouslySetInnerHTML={{ __html: t('privacy.lastUpdated') }} />

        <div className="prose prose-gray max-w-none">
          <div dangerouslySetInnerHTML={{ __html: t('privacy.s1') }} />
          <div dangerouslySetInnerHTML={{ __html: t('privacy.s2') }} />
          <div dangerouslySetInnerHTML={{ __html: t('privacy.s3') }} />
          <div dangerouslySetInnerHTML={{ __html: t('privacy.s4') }} />
          <div dangerouslySetInnerHTML={{ __html: t('privacy.s5') }} />
          <div dangerouslySetInnerHTML={{ __html: t('privacy.s6') }} />
          <div dangerouslySetInnerHTML={{ __html: t('privacy.s7') }} />
          <div dangerouslySetInnerHTML={{ __html: t('privacy.s8') }} />
        </div>
      </div>
    </div>
  )
}
