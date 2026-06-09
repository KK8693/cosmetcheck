import { AboutSection } from '@/sections/AboutSection'
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
      canonical: `https://cosmetcheck.com/${locale}/about`,
      languages: {
        'en': `/en/about`,
        'zh': `/zh/about`,
        'pt-BR': `/pt-BR/about`,
        'es-MX': `/es-MX/about`,
      },
    },
    title: messages.about?.title || 'About Us',
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="min-h-screen pt-20">
      <AboutSection />
    </div>
  )
}
