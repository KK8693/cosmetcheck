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
      canonical: `/${locale}/terms`,
    },
    title: messages.legal.terms.title,
  }
}

export default async function TermsPage({
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
          {messages.legal.terms.title}
        </h1>
        <p
          className="text-black mb-12"
          dangerouslySetInnerHTML={{
            __html: messages.legal.terms.lastUpdated,
          }}
        />

        <div className="max-w-none text-black">
          <div dangerouslySetInnerHTML={{ __html: messages.legal.terms.s1 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.terms.s2 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.terms.s3 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.terms.s4 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.terms.s5 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.terms.s6 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.terms.s7 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.terms.s8 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.terms.s9 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.terms.s10 }} />
        </div>
      </div>
    </div>
  )
}
