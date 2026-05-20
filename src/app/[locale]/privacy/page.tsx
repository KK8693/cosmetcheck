/**
 * Privacy Policy page - i18n version
 * Client Component: directly imports JSON files to ensure they are bundled.
 */
'use client'

import { usePathname } from 'next/navigation'
import zhMessages from '../../../../messages/zh.json'
import enMessages from '../../../../messages/en.json'
import ptBRMessages from '../../../../messages/pt-BR.json'
import esMXMessages from '../../../../messages/es-MX.json'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const messagesMap: Record<string, any> = {
  zh: zhMessages,
  en: enMessages,
  'pt-BR': ptBRMessages,
  'es-MX': esMXMessages,
}

export default function PrivacyPage() {
  const pathname = usePathname()
  const locale = pathname?.split('/')[1] || 'en'
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
