/**
 * Refund Policy page - i18n version
 */

import { useTranslations } from 'next-intl'

export const runtime = 'edge'

export default function RefundPage() {
  const t = useTranslations('legal')

  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom max-w-3xl py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('refund.title')}</h1>
        <p className="text-gray-500 mb-12" dangerouslySetInnerHTML={{ __html: t('refund.lastUpdated') }} />

        <div className="prose prose-gray max-w-none">
          <div dangerouslySetInnerHTML={{ __html: t('refund.s1') }} />
          <div dangerouslySetInnerHTML={{ __html: t('refund.s2') }} />
          <div dangerouslySetInnerHTML={{ __html: t('refund.s3') }} />
          <div dangerouslySetInnerHTML={{ __html: t('refund.s4') }} />
          <div dangerouslySetInnerHTML={{ __html: t('refund.s5') }} />
          <div dangerouslySetInnerHTML={{ __html: t('refund.s6') }} />
        </div>
      </div>
    </div>
  )
}
