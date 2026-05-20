/**
 * Cookie Policy page - i18n version
 * Client Component: reads locale from URL pathname
 */
'use client'

import { usePathname } from 'next/navigation'
import { messagesMap } from '@/i18n/request'

export default function CookiePolicyPage() {
  const pathname = usePathname()
  const locale = pathname?.split('/')[1] || 'en'
  const messages = messagesMap[locale] || messagesMap['en']

  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom max-w-3xl py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {messages.legal.cookies.title}
        </h1>
        <p
          className="text-gray-500 mb-12"
          dangerouslySetInnerHTML={{
            __html: messages.legal.cookies.lastUpdated,
          }}
        />

        <div className="prose prose-gray max-w-none">
          <div dangerouslySetInnerHTML={{ __html: messages.legal.cookies.s1 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.cookies.s2 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.cookies.s3 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.cookies.s4 }} />
          <div dangerouslySetInnerHTML={{ __html: messages.legal.cookies.s5 }} />
        </div>
      </div>
    </div>
  )
}
