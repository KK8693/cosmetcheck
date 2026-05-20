/**
 * Simple translator that reads directly from messagesMap.
 * Bypasses next-intl Context to work around next-on-pages edge function
 * boundary issues where React Context is not shared between layout.func
 * and page.func.
 */
import { messagesMap } from '@/i18n/request'

export function getTranslator(locale: string) {
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
