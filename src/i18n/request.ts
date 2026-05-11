import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ requestLocale }) => {
  // Allow only supported locales
  let locale = await requestLocale
  
  const supportedLocales = ['zh', 'en', 'pt-BR', 'es-MX']
  
  if (!locale || !supportedLocales.includes(locale)) {
    locale = 'zh'
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  }
})