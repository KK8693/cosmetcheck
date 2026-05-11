import { FAQSection } from '@/sections/FAQSection'
import { setRequestLocale } from 'next-intl/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'FAQ - CosmetCheck',
  description: '常见问题解答：CosmetCheck 美妆合规检测服务',
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
