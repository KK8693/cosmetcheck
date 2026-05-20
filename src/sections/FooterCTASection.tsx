'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'

export function FooterCTASection() {
  const t = useTranslations('cta')
  const tCommon = useTranslations('common')

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError(t('emailInvalid'))
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t('subscribeError'))
      } else {
        setSuccess(true)
        setEmail('')
      }
    } catch {
      setError(t('subscribeError'))
    } finally {
      setLoading(false)
    }
  }

  const emailHref = 'mailto:support@cosmetcheck.com?subject=Support%20Request'

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-[#0A4D8C] via-[#1E6BB8] to-[#00A86B] text-white">
      <div className="container-custom text-center">
        <div className="mb-4 inline-flex items-center rounded-full bg-red-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg animate-bounce">
          {t('badge')}
        </div>
        <h2 className="text-3xl font-bold md:text-4xl mb-4">
          {t('title')}
        </h2>
        <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
          {t('subtitle')}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
            className="border-white/20 bg-white/10 text-white placeholder:text-white/50 h-12 text-base"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-bold h-12 px-8 whitespace-nowrap shadow-lg shadow-amber-500/25 animate-pulse-subtle disabled:opacity-60"
          >
            {loading ? tCommon('submitting') : t('button')}
          </Button>
        </form>
        {error && (
          <p className="mt-3 text-sm text-red-300">{error}</p>
        )}
        {success && (
          <p className="mt-3 text-sm text-green-300">{t('subscribeSuccess')}</p>
        )}
        <div className="mt-6 flex flex-col items-center gap-4">
          <span className="text-white/50 text-sm">{t('or')}</span>
          <a
            href={emailHref}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            {t('emailContact')}
          </a>
        </div>
        <p className="mt-6 text-sm text-white/60">
          {t('noCreditCard')}
        </p>
      </div>
    </section>
  )
}
