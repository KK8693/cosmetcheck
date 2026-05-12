'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from '@/i18n/routing'

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)
  const t = useTranslations('cookie')

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      // 延迟显示，让页面先加载
      setTimeout(() => setShowConsent(true), 1000)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    localStorage.setItem('cookie_consent_date', new Date().toISOString())
    setShowConsent(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined')
    localStorage.setItem('cookie_consent_date', new Date().toISOString())
    setShowConsent(false)
  }

  if (!showConsent) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-xl border-2 border-blue-100">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2">{t('title')}</h3>
          <p className="text-sm text-gray-600 mb-4">
            {t('description')}
          </p>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAccept}>
              {t('accept')}
            </Button>
            <Button size="sm" variant="outline" onClick={handleDecline}>
              {t('decline')}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            <Link href="/cookie-policy" className="underline hover:text-blue-600">
              {t('policy')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}