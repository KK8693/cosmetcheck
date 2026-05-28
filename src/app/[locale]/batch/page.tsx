import { BatchContent } from '@/components/batch/BatchContent'
import { setRequestLocale } from 'next-intl/server'
import { messagesMap } from '@/i18n/request'

// Required for Cloudflare Pages
export const runtime = 'edge'

// Force dynamic rendering for Cloudflare Pages compatibility
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
      canonical: `/${locale}/batch`,
    },
    title: messages.batch?.title || 'Batch Detection',
  }
}

export default async function BatchPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="min-h-screen bg-[#0F1419]">
      <BatchContent />
    </div>
  )
}