import BatchContent from './BatchContent'
import { setRequestLocale } from 'next-intl/server'

// Required for Cloudflare Pages
export const runtime = 'edge'

// Force dynamic rendering for Cloudflare Pages compatibility
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Batch Detection — CosmetCheck',
}

export default async function BatchPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="min-h-screen bg-[#0D0D12]">
      <BatchContent />
    </div>
  )
}