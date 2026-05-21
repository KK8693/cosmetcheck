'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from '@/i18n/routing'

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

const STORAGE_KEY = 'cookie_consent'
const STORAGE_DATE_KEY = 'cookie_consent_date'

/** Parse stored consent value with backward compatibility */
function parseStoredConsent(value: string | null): CookiePreferences | null {
  if (!value) return null
  try {
    const parsed = JSON.parse(value)
    if (parsed && typeof parsed === 'object' && 'essential' in parsed) {
      return parsed as CookiePreferences
    }
  } catch {
    // Old format: 'accepted' | 'declined'
    if (value === 'accepted') {
      return { essential: true, analytics: true, marketing: true }
    }
    if (value === 'declined') {
      return { essential: true, analytics: false, marketing: false }
    }
  }
  return null
}

export function useCookieConsent(): CookiePreferences | null {
  const [consent, setConsent] = useState<CookiePreferences | null>(() => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem(STORAGE_KEY)
    return parseStoredConsent(stored)
  })

  return consent
}

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  })
  const t = useTranslations('cookie')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      setTimeout(() => setShowConsent(true), 1000)
    }
  }, [])

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    localStorage.setItem(STORAGE_DATE_KEY, new Date().toISOString())
    setShowConsent(false)
  }

  const handleAcceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true })
  }

  const handleDeclineAll = () => {
    saveConsent({ essential: true, analytics: false, marketing: false })
  }

  const handleAcceptSelected = () => {
    saveConsent(preferences)
  }

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return // cannot toggle essential
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  if (!showConsent) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-2xl border border-white/10 bg-[#1A1A24]">
        <CardContent className="p-4">
          <h3 className="font-semibold text-white mb-2">{t('title')}</h3>
          <p className="text-sm text-gray-400 mb-4">{t('description')}</p>

          {showCustomize && (
            <div className="space-y-3 mb-4 border-t border-white/10 pt-3">
              {/* Essential */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={preferences.essential}
                  disabled
                  className="mt-1 h-4 w-4 text-[#fbbf24] rounded border-gray-600 bg-gray-700"
                />
                <div>
                  <p className="text-sm font-medium text-white">{t('essential')}</p>
                  <p className="text-xs text-gray-500">{t('essentialDesc')}</p>
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={() => togglePreference('analytics')}
                  className="mt-1 h-4 w-4 text-[#fbbf24] rounded border-gray-600 bg-gray-700 cursor-pointer"
                />
                <div>
                  <p className="text-sm font-medium text-white">{t('analytics')}</p>
                  <p className="text-xs text-gray-500">{t('analyticsDesc')}</p>
                </div>
              </div>

              {/* Marketing */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={() => togglePreference('marketing')}
                  className="mt-1 h-4 w-4 text-[#fbbf24] rounded border-gray-600 bg-gray-700 cursor-pointer"
                />
                <div>
                  <p className="text-sm font-medium text-white">{t('marketing')}</p>
                  <p className="text-xs text-gray-500">{t('marketingDesc')}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {!showCustomize ? (
              <>
                <Button size="sm" onClick={handleAcceptAll} className="bg-[#fbbf24] text-black hover:bg-[#f59e0b] font-semibold">
                  {t('accept')}
                </Button>
                <Button size="sm" variant="outline" onClick={handleDeclineAll} className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white">
                  {t('decline')}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowCustomize(true)} className="text-gray-400 hover:text-white hover:bg-white/5">
                  {t('customize')}
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" onClick={handleAcceptSelected} className="bg-[#fbbf24] text-black hover:bg-[#f59e0b] font-semibold">
                  {t('acceptSelected')}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowCustomize(false)} className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white">
                  {t('decline')}
                </Button>
              </>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-3">
            <Link href="/cookie-policy" className="underline hover:text-[#fbbf24] transition-colors">
              {t('policy')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
