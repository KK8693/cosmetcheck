/**
 * Disclaimer page - i18n version
 * Bypasses next-intl entirely; reads directly from messagesMap via params.locale
 */
import { messagesMap } from '@/i18n/request'

export const runtime = 'edge'

export default async function DisclaimerPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = messagesMap[locale] || messagesMap['en']

  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom max-w-3xl py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {messages.legal.disclaimer.title}
        </h1>
        <p
          className="text-gray-500 mb-12"
          dangerouslySetInnerHTML={{
            __html: messages.legal.disclaimer.lastUpdated,
          }}
        />

        <div className="prose prose-gray max-w-none">
          <div dangerouslySetInnerHTML={{ __html: messages.legal.disclaimer.s1 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.disclaimer.s2 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.disclaimer.s3 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.disclaimer.s4 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.disclaimer.s5 }} />
        </div>
      </div>
    </div>
  )
}