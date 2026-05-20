/**
 * Simple translator that reads directly from messagesMap.
 * Uses request headers to get locale, bypassing next-intl Context
 * and next-on-pages edge function param passing issues.
 */
import { headers } from 'next/headers'
import { messagesMap } from '@/i18n/request'

export async function getTranslator() {
  const h = await headers()
  const locale = h.get('X-NEXT-INTL-LOCALE') || 'en'
  const messages = messagesMap[locale] || messagesMap['en']

  return function t(key: string): string {
    const parts = key.split('.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = messages
    for (const part of parts) {
      value = value?.[part]
    }
    return typeof value === 'string' ? value : key
  }
}