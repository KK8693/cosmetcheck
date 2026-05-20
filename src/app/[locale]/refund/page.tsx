/**
 * Refund Policy page - i18n version
 * Client Component: reads locale from URL pathname
 */
'use client'

import { usePathname } from 'next/navigation'
import { messagesMap } from '@/i18n/request'

export default function RefundPage() {
  const pathname = usePathname()
  const locale = pathname?.split('/')[1] || 'en'
  const messages = messagesMap[locale] || messagesMap['en']

  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom max-w-3xl py-20">
        <h1 className="text-4xl font-bold text-black mb-8">
          {messages.legal.refund.title}
        </h1>
        <p
          className="text-black mb-12"
          dangerouslySetInnerHTML={{
            __html: messages.legal.refund.lastUpdated,
          }}
        />

        <div className="max-w-none text-black">
          <div dangerouslySetInnerHTML={{ __html: messages.legal.refund.s1 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.refund.s2 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.refund.s3 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.refund.s4 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.refund.s5 }} />
        </div>
      </div>
    </div>
  )
}
