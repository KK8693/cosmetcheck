import { messagesMap } from '@/i18n/request'
import { setRequestLocale } from 'next-intl/server'

export const runtime = 'edge'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = messagesMap[locale] || messagesMap['en']
  return {
    alternates: {
      canonical: `https://cosmetcheck.com/${locale}/privacy`,
      languages: {
        'en': `/en/privacy`,
        'zh': `/zh/privacy`,
        'pt-BR': `/pt-BR/privacy`,
        'es-MX': `/es-MX/privacy`,
      },
    },
    title: messages.legal.privacy.title,
  }
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const messages = messagesMap[locale] || messagesMap['en']

  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom max-w-3xl py-20">
        <h1 className="text-4xl font-bold text-black mb-8">
          {messages.legal.privacy.title}
        </h1>
        <p
          className="text-black mb-12"
          dangerouslySetInnerHTML={{
            __html: messages.legal.privacy.lastUpdated,
          }}
        />

        <div className="max-w-none text-black">
          <div dangerouslySetInnerHTML={{ __html: messages.legal.privacy.s1 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.privacy.s2 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.privacy.s3 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.privacy.s4 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.privacy.s5 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.privacy.s6 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.privacy.s7 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.privacy.s8 }} />
        </div>
      </div>
    </div>
  )
}
