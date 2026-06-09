import { FAQSection } from '@/sections/FAQSection'
import { messagesMap } from '@/i18n/request'
import { setRequestLocale } from 'next-intl/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = messagesMap[locale] || messagesMap['en']
  return {
    alternates: {
      canonical: `https://cosmetcheck.com/${locale}/faq`,
      languages: {
        'en': `/en/faq`,
        'zh-CN': `/zh/faq`,
        'pt-BR': `/pt-BR/faq`,
        'es-MX': `/es-MX/faq`,
      },
    },
    title: messages.faq?.title || 'FAQ',
  }
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="min-h-screen pt-20">
      <FAQSection />
    </div>
  )
}
