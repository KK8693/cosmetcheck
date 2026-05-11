'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react'

type Locale = 'zh' | 'en' | 'pt-BR' | 'es-MX'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  isLoading: boolean
}

type Messages = Record<string, unknown>

const translations: Partial<Record<Locale, Messages>> = {}

const I18nContext = createContext<I18nContextType | null>(null)

// Helper to get initial locale
function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'zh'
  const saved = localStorage.getItem('cosmetcheck-locale') as Locale | null
  return (saved && ['zh', 'en', 'pt-BR', 'es-MX'].includes(saved)) ? saved : 'zh'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh')
  const [messages, setMessages] = useState<Messages>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  const loadTranslations = useCallback(async (loc: Locale): Promise<void> => {
    if (translations[loc]) {
      setMessages(translations[loc])
      setIsLoading(false)
      return
    }
    
    try {
      const mod = await import(`../../messages/${loc}.json`) as { default: Messages }
      translations[loc] = mod.default
      setMessages(translations[loc])
    } catch (e) {
      console.error(`Failed to load translations for ${loc}:`, e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /* eslint-disable react-hooks/set-state-in-effect */
  // Initialize on mount
  useEffect(() => {
    setIsHydrated(true)
    const targetLocale = getInitialLocale()
    setLocaleState(targetLocale)
    loadTranslations(targetLocale)
  }, [loadTranslations])

  const handleSetLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== 'undefined') {
      localStorage.setItem('cosmetcheck-locale', newLocale)
    }
    loadTranslations(newLocale)
  }, [loadTranslations])

  const t = useCallback((key: string): string => {
    const keys = key.split('.')
    let value: unknown = messages
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = (value as Record<string, unknown>)[k]
      } else {
        return key
      }
    }
    return typeof value === 'string' ? value : key
  }, [messages])

  const contextValue = useMemo(() => ({
    locale,
    setLocale: handleSetLocale,
    t,
    isLoading
  }), [locale, handleSetLocale, t, isLoading])

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    return {
      locale: 'zh' as Locale,
      setLocale: () => {},
      t: (key: string) => key,
      isLoading: false
    }
  }
  return context
}