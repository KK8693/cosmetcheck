import { ContactSection } from '@/sections/ContactSection'
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
      canonical: `https://cosmetcheck.com/${locale}/contact`,
    },
    title: messages.contact?.title || 'Contact Us',
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="min-h-screen pt-20">
      <ContactSection />
    </div>
  )
}
