/**
 * Privacy Policy page - i18n version
 */
import { getTranslator } from '@/lib/getLegalTranslator'

export const runtime = 'edge'

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = getTranslator(locale)

  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom max-w-3xl py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('legal.privacy.title')}</h1>
        <p className="text-gray-500 mb-12" dangerouslySetInnerHTML={{ __html: t('legal.privacy.lastUpdated') }} />

        <div className="prose prose-gray max-w-none">
          <div dangerouslySetInnerHTML={{ __html: t('legal.privacy.s1') }} />
          <div dangerouslySetInnerHTML={{ __html: t('legal.privacy.s2') }} />
          <div dangerouslySetInnerHTML={{ __html: t('legal.privacy.s3') }} />
          <div dangerouslySetInnerHTML={{ __html: t('legal.privacy.s4') }} />
          <div dangerouslySetInnerHTML={{ __html: t('legal.privacy.s5') }} />
          <div dangerouslySetInnerHTML={{ __html: t('legal.privacy.s6') }} />
          <div dangerouslySetInnerHTML={{ __html: t('legal.privacy.s7') }} />
          <div dangerouslySetInnerHTML={{ __html: t('legal.privacy.s8') }} />
        </div>
      </div>
    </div>
  )
}
