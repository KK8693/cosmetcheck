'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { LogOut, Settings, CreditCard, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

interface AccountData {
  id: string
  email: string
  fullName: string | null
  subscriptionTier: string
  subscriptionProvider: string | null
  subscriptionStatus: string | null
  subscriptionPlan: string | null
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  quotaUsed: number
  quotaLimit: number
}

export const runtime = 'edge'

export default function AccountPage() {
  const { user, signOut, loading: authLoading } = useAuth()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('account')
  const commonT = useTranslations('common')

  const [accountData, setAccountData] = useState<AccountData | null>(null)
  const [loading, setLoading] = useState(true)
  const [canceling, setCanceling] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchAccountData = async () => {
    try {
      setLoading(true)
      const { data: session } = await supabase.auth.getSession()
      const token = session?.session?.access_token

      if (!token) {
        setError(commonT('unauthorized'))
        return
      }

      const res = await fetch('/api/account', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error('Failed to fetch account data')
      }

      const data = await res.json()
      setAccountData(data.user)
    } catch {
      setError(t('fetchError'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}`)
      return
    }

    if (user) {
      let cancelled = false
      // Defer setState to avoid synchronous setState-in-effect ESLint error
      Promise.resolve().then(() => {
        if (!cancelled) setLoading(true)
      })
      supabase.auth.getSession().then(({ data: session }) => {
        const token = session?.session?.access_token
        if (!token) {
          if (!cancelled) {
            setError(commonT('unauthorized'))
            setLoading(false)
          }
          return
        }
        fetch('/api/account', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            if (!res.ok) throw new Error('Failed to fetch')
            return res.json()
          })
          .then((data) => {
            if (!cancelled) {
              setAccountData(data.user)
              setLoading(false)
            }
          })
          .catch(() => {
            if (!cancelled) {
              setError(t('fetchError'))
              setLoading(false)
            }
          })
      })
      return () => { cancelled = true }
    }
  }, [user, authLoading, router, locale, commonT, t])

  const handleCancelSubscription = async () => {
    if (!confirm(t('cancelConfirm'))) return

    try {
      setCanceling(true)
      setError('')
      setSuccess('')

      const { data: session } = await supabase.auth.getSession()
      const token = session?.session?.access_token

      if (!token) {
        setError(commonT('unauthorized'))
        return
      }

      const res = await fetch('/api/account/subscription/cancel', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to cancel subscription')
      }

      setSuccess(data.message)
      await fetchAccountData()
    } catch (e) {
      setError(e instanceof Error ? e.message : t('cancelError'))
    } finally {
      setCanceling(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push(`/${locale}`)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00A86B]" />
      </div>
    )
  }

  if (!user) return null

  const isPro = accountData?.subscriptionTier !== 'free'
  const isActive = accountData?.subscriptionStatus === 'active'
  const showCancel = isPro && isActive && !accountData?.cancelAtPeriodEnd

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-[#0F0F1A] pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
          <p className="text-gray-400">{t('subtitle')}</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
            <p className="text-green-300 text-sm">{success}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-[#0A4D8C] to-[#00A86B] rounded-xl flex items-center justify-center text-white font-bold text-xl">
              {accountData?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {accountData?.fullName || accountData?.email?.split('@')[0]}
              </h2>
              <p className="text-gray-400 text-sm">{accountData?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#0F0F1A] rounded-xl p-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{t('plan')}</p>
              <p className="text-white font-semibold capitalize">
                {accountData?.subscriptionTier === 'free'
                  ? t('freePlan')
                  : accountData?.subscriptionPlan || t('proPlan')}
              </p>
            </div>
            <div className="bg-[#0F0F1A] rounded-xl p-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{t('status')}</p>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isActive && !accountData?.cancelAtPeriodEnd
                      ? 'bg-green-500'
                      : accountData?.cancelAtPeriodEnd
                      ? 'bg-yellow-500'
                      : 'bg-gray-500'
                  }`}
                />
                <p className="text-white font-semibold capitalize">
                  {accountData?.cancelAtPeriodEnd
                    ? t('cancelingAtPeriodEnd')
                    : accountData?.subscriptionStatus || t('inactive')}
                </p>
              </div>
            </div>
            <div className="bg-[#0F0F1A] rounded-xl p-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{t('quota')}</p>
              <p className="text-white font-semibold">
                {accountData?.quotaUsed} / {accountData?.quotaLimit}
              </p>
            </div>
            <div className="bg-[#0F0F1A] rounded-xl p-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{t('provider')}</p>
              <p className="text-white font-semibold capitalize">
                {accountData?.subscriptionProvider || '-'}
              </p>
            </div>
          </div>

          {accountData?.currentPeriodEnd && (
            <div className="mt-4 pt-4 border-t border-[#252530]">
              <p className="text-gray-400 text-sm">
                {accountData.cancelAtPeriodEnd
                  ? t('accessUntil', { date: formatDate(accountData.currentPeriodEnd) })
                  : t('nextBilling', { date: formatDate(accountData.currentPeriodEnd) })}
              </p>
            </div>
          )}
        </div>

        {/* Subscription Actions */}
        {showCancel && (
          <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#00A86B]" />
              {t('subscriptionManagement')}
            </h3>
            <p className="text-gray-400 text-sm mb-4">{t('cancelDescription')}</p>
            <button
              onClick={handleCancelSubscription}
              disabled={canceling}
              className="w-full sm:w-auto px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {canceling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('canceling')}
                </>
              ) : (
                t('cancelSubscription')
              )}
            </button>
          </div>
        )}

        {!isPro && (
          <div className="bg-gradient-to-r from-[#0A4D8C]/20 to-[#00A86B]/20 border border-[#00A86B]/30 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">{t('upgradeTitle')}</h3>
            <p className="text-gray-300 text-sm mb-4">{t('upgradeDescription')}</p>
            <Link
              href={`/${locale}/pricing`}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0A4D8C] to-[#00A86B] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              {t('upgradeButton')}
            </Link>
          </div>
        )}

        {/* Danger Zone */}
        <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-400" />
            {t('accountSettings')}
          </h3>
          <button
            onClick={handleSignOut}
            className="w-full sm:w-auto px-6 py-3 bg-[#252530] hover:bg-red-900/20 text-gray-300 hover:text-red-400 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {commonT('logout')}
          </button>
        </div>
      </div>
    </div>
  )
}
