'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { trackEvent, setUserId, captureSignupSource, setUserProperties } from '@/lib/analytics'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  quotaUsed: number
  quotaLimit: number
  setQuotaUsed: (value: number | ((prev: number) => number)) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [quotaUsed, setQuotaUsed] = useState(() => {
    if (typeof window === 'undefined') return 0
    try {
      const stored = localStorage.getItem('cosmetcheck_anonymous_checks')
      return stored ? parseInt(stored, 10) : 0
    } catch {
      return 0
    }
  })
  const [quotaLimit, setQuotaLimit] = useState(10)

  useEffect(() => {
    // Capture signup source on first app load
    captureSignupSource()
  }, [])

  useEffect(() => {
    const fetchQuota = async (userId: string) => {
      try {
      const { data, error } = await supabase
        .from('users')
        .select('quota_used, quota_limit')
        .eq('id', userId)
        .maybeSingle() as { data: { quota_used: number; quota_limit: number } | null; error: Error | null }

        if (error) {
          console.warn('Failed to fetch quota:', error)
          return
        }

        if (data) {
          setQuotaUsed(data.quota_used ?? 0)
          setQuotaLimit(data.quota_limit ?? 10)
        }
      } catch (e) {
        console.warn('Quota fetch error:', e)
      }
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchQuota(session.user.id)
        setUserId(session.user.id)
        setUserProperties({ user_type: 'free' })
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchQuota(session.user.id)
        setUserId(session.user.id)
        setUserProperties({ user_type: 'free' })
        // 【M1b】Store email for abandoned checkout tracking
        if (session.user.email) {
          try { sessionStorage.setItem('cc_user_email', session.user.email) } catch { /* ignore */ }
        }
      } else {
        // Restore anonymous quota from localStorage on logout
        try {
          const stored = localStorage.getItem('cosmetcheck_anonymous_checks')
          setQuotaUsed(stored ? parseInt(stored, 10) : 0)
          sessionStorage.removeItem('cc_user_email')
        } catch {
          setQuotaUsed(0)
        }
        setQuotaLimit(10)
        setUserId(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    trackEvent('login', { method: 'email' })
  }

  const signUp = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    trackEvent('sign_up', { method: 'email' })

    // Store signup source in users table (best-effort)
    const { source, domain } = captureSignupSource()
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await supabase.from('users').update({
          signup_source: source,
          first_referral_domain: domain,
        } as never).eq('id', session.user.id)
      }
    } catch {
      // non-blocking
    }

    // 【M1b】Send onboarding welcome email (non-blocking)
    try {
      const locale = (typeof window !== 'undefined' && window.location.pathname.startsWith('/pt-BR'))
        ? 'pt-BR'
        : (typeof window !== 'undefined' && window.location.pathname.startsWith('/es-MX'))
          ? 'es-MX'
          : 'en'
      fetch('/api/email/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          locale,
          step: 1,
        }),
      }).catch(() => { /* silently fail */ })
    } catch {
      // non-blocking
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      resetPassword,
      quotaUsed,
      quotaLimit,
      setQuotaUsed,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
