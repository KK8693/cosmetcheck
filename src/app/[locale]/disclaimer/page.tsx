/**
 * Disclaimer page - i18n version
 */
import { getTranslator } from '@/lib/getLegalTranslator'

export const runtime = 'edge'

export default async function DisclaimerPage() {
  const t = await getTranslator()

  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom max-w-3xl py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('legal.disclaimer.title')}</h1>
        <p className="text-gray-500 mb-12" dangerouslySetInnerHTML={{ __html: t('legal.disclaimer.lastUpdated') }} />

        <div className="prose prose-gray max-w-none">
          <div dangerouslySetInnerHTML={{ __html: t('legal.disclaimer.s1') }} />
          <div dangerouslySetInnerHTML={{ __html: t('legal.disclaimer.s2') }} />
          <div dangerouslySetInnerHTML={{ __html: t('legal.disclaimer.s3') }} />
          <div dangerouslySetInnerHTML={{ __html: t('legal.disclaimer.s4') }} />
          <div dangerouslySetInnerHTML={{ __html: t('legal.disclaimer.s5') }} />
        </div>
      </div>
    </div>
  )
}