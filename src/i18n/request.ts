import { getRequestConfig } from 'next-intl/server'
import zhMessages from '../../messages/zh.json'
import enMessages from '../../messages/en.json'
import ptBRMessages from '../../messages/pt-BR.json'
import esMXMessages from '../../messages/es-MX.json'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const messagesMap: Record<string, any> = {
  zh: zhMessages,
  en: enMessages,
  'pt-BR': ptBRMessages,
  'es-MX': esMXMessages,
}

const supportedLocales = ['zh', 'en', 'pt-BR', 'es-MX']

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !supportedLocales.includes(locale)) {
    locale = 'zh'
  }

  return {
    locale,
    messages: messagesMap[locale] || messagesMap['zh'],
  }
})
