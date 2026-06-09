import PricingContent from './PricingContent'
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
      canonical: `https://cosmetcheck.com/${locale}/pricing`,
      languages: {
        'en': `/en/pricing`,
        'zh': `/zh/pricing`,
        'pt-BR': `/pt-BR/pricing`,
        'es-MX': `/es-MX/pricing`,
      },
    },
    title: messages.pricingPage?.hero?.title || 'Pricing',
  }
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="min-h-screen">
      <PricingContent />
    </div>
  )
}
