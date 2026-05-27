// src/lib/analytics.ts
// GA4 event tracking wrapper with TypeScript type safety

// Minimal gtag type declaration (avoids @types/gtag.js dependency)
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void
    __analytics_debug?: boolean
    __analytics?: Record<string, unknown>
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AnalyticsEventName =
  | 'sign_up'
  | 'login'
  | 'product_upload'
  | 'analysis_start'
  | 'analysis_complete'
  | 'report_view'
  | 'report_export'
  | 'subscription_initiated'
  | 'subscription_completed'
  | 'subscription_cancelled'
  | 'checkout_abandoned'
  | 'feature_used'
  | 'help_doc_viewed'
  | 'support_ticket_created'
  | 'quota_warning'

export interface EventParamsMap {
  sign_up: { method: 'email' | 'google' }
  login: { method: 'email' | 'google' }
  product_upload: { product_type: string; source: 'manual' | 'file' }
  analysis_start: { regulation: 'anvisa' | 'cofepris' }
  analysis_complete: { regulation: 'anvisa' | 'cofepris'; result_status: 'pass' | 'fail' | 'warn' }
  report_view: { regulation: 'anvisa' | 'cofepris' }
  report_export: { format: 'pdf' | 'excel' | 'json' }
  subscription_initiated: { plan: 'monthly' | 'yearly'; provider?: 'stripe' | 'paypal' }
  subscription_completed: { plan: 'monthly' | 'yearly'; value: number; currency: string; provider: 'stripe' | 'paypal' }
  subscription_cancelled: { plan: 'monthly' | 'yearly'; reason?: string }
  checkout_abandoned: { plan: 'monthly' | 'yearly'; time_on_page: number }
  feature_used: { feature_name: string }
  help_doc_viewed: { doc_title: string }
  support_ticket_created: { category: string }
  quota_warning: { percent: 80 | 100 }
}

export interface AnalyticsDimensions {
  user_type: 'free' | 'trial' | 'paid'
  preferred_language: 'pt-BR' | 'es-MX' | 'en'
  signup_source: 'organic' | 'referral' | 'direct' | 'social'
  first_referral_domain?: string
}

// ---------------------------------------------------------------------------
// Environment / Config
// ---------------------------------------------------------------------------

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const isDev = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
)

function isGtagAvailable(): boolean {
  return typeof window !== 'undefined' && typeof (window as unknown as Record<string, unknown>).gtag === 'function'
}

function getGtag(): Window['gtag'] | undefined {
  if (isGtagAvailable()) {
    return window.gtag
  }
  return undefined
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function debugLog(eventName: string, params: Record<string, unknown>): void {
  // eslint-disable-next-line no-console
  console.log(`[Analytics] ${eventName}`, params)
}

function isDebugMode(): boolean {
  if (typeof window === 'undefined') return false
  return isDev || (window as unknown as Record<string, unknown>).__analytics_debug === true
}

// ---------------------------------------------------------------------------
// Signup Source Capture
// ---------------------------------------------------------------------------

const REFERRER_KEY = 'cc_first_referrer'
const SOURCE_KEY = 'cc_signup_source'
const DOMAIN_KEY = 'cc_first_referral_domain'

function classifySource(referrer: string): AnalyticsDimensions['signup_source'] {
  if (!referrer) return 'direct'
  try {
    const url = new URL(referrer)
    const hostname = url.hostname.toLowerCase()
    const socialDomains = [
      'facebook.com',
      'twitter.com',
      'x.com',
      'instagram.com',
      'linkedin.com',
      'youtube.com',
      'tiktok.com',
      'reddit.com',
      't.co',
    ]
    if (socialDomains.some((d) => hostname.includes(d))) return 'social'
    if (hostname.includes('google.')) return 'organic'
    if (hostname.includes('bing.')) return 'organic'
    return 'referral'
  } catch {
    return 'direct'
  }
}

export function captureSignupSource(): { source: AnalyticsDimensions['signup_source']; domain?: string } {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { source: 'direct' }
  }

  try {
    const existing = localStorage.getItem(REFERRER_KEY)
    if (existing) {
      const source = (localStorage.getItem(SOURCE_KEY) as AnalyticsDimensions['signup_source']) || 'direct'
      const domain = localStorage.getItem(DOMAIN_KEY) || undefined
      return { source, domain }
    }

    const referrer = document.referrer || ''
    const source = classifySource(referrer)
    const domain = referrer ? new URL(referrer).hostname : undefined

    localStorage.setItem(REFERRER_KEY, referrer)
    localStorage.setItem(SOURCE_KEY, source)
    if (domain) localStorage.setItem(DOMAIN_KEY, domain)

    return { source, domain }
  } catch {
    return { source: 'direct' }
  }
}

export function getStoredSignupSource(): { source: AnalyticsDimensions['signup_source']; domain?: string } {
  if (typeof window === 'undefined') return { source: 'direct' }
  try {
    const source = (localStorage.getItem(SOURCE_KEY) as AnalyticsDimensions['signup_source']) || 'direct'
    const domain = localStorage.getItem(DOMAIN_KEY) || undefined
    return { source, domain }
  } catch {
    return { source: 'direct' }
  }
}

// ---------------------------------------------------------------------------
// Core Tracking Functions
// ---------------------------------------------------------------------------

export function trackEvent<T extends AnalyticsEventName>(
  eventName: T,
  params: EventParamsMap[T]
): void {
  const gtag = getGtag()
  const payload: Record<string, unknown> = { ...params }

  if (isDebugMode()) {
    debugLog(eventName, payload)
  }

  // Attach custom dimensions to every event
  const stored = getStoredSignupSource()
  if (stored.source) payload.signup_source = stored.source
  if (stored.domain) payload.first_referral_domain = stored.domain

  if (gtag && GA_ID) {
    try {
      gtag('event', eventName, payload)
    } catch (err) {
      // Silently fail in production; log in dev
      if (isDev) console.warn('[Analytics] gtag event failed:', err)
    }
  }
}

export function setUserId(userId: string | null): void {
  const gtag = getGtag()
  if (!gtag || !GA_ID) return

  try {
    if (userId) {
      gtag('config', GA_ID, {
        user_id: userId,
      })
      if (isDebugMode()) debugLog('set_user_id', { user_id: userId })
    } else {
      // Reset user_id on logout
      gtag('config', GA_ID, {
        user_id: undefined,
      })
    }
  } catch (err) {
    if (isDev) console.warn('[Analytics] setUserId failed:', err)
  }
}

export function setUserProperties(props: Partial<AnalyticsDimensions>): void {
  const gtag = getGtag()
  if (!gtag || !GA_ID) return

  try {
    gtag('set', 'user_properties', props)
    if (isDebugMode()) debugLog('set_user_properties', props)
  } catch (err) {
    if (isDev) console.warn('[Analytics] setUserProperties failed:', err)
  }
}

export function setPageView(pagePath: string, pageTitle?: string): void {
  const gtag = getGtag()
  if (!gtag || !GA_ID) return

  try {
    gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle || document?.title,
      page_location: window?.location?.href,
    })
    if (isDebugMode()) debugLog('page_view', { page_path: pagePath })
  } catch (err) {
    if (isDev) console.warn('[Analytics] setPageView failed:', err)
  }
}

// ---------------------------------------------------------------------------
// Anonymous ID helpers
// ---------------------------------------------------------------------------

const ANON_ID_KEY = 'cc_anon_id'

export function getOrCreateAnonymousId(): string {
  if (typeof window === 'undefined') return 'anonymous_server'
  try {
    let id = sessionStorage.getItem(ANON_ID_KEY)
    if (!id) {
      id = `anon_${crypto.randomUUID?.() ?? `${Date.now()}_${Math.random().toString(36).slice(2)}`}`
      sessionStorage.setItem(ANON_ID_KEY, id)
    }
    return id
  } catch {
    return 'anonymous_fallback'
  }
}

export function clearAnonymousId(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(ANON_ID_KEY)
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Debug utilities (exposed on window for manual testing)
// ---------------------------------------------------------------------------

if (typeof window !== 'undefined') {
  try {
    (window as unknown as Record<string, unknown>).__analytics = {
      trackEvent,
      setUserId,
      setUserProperties,
      setPageView,
      captureSignupSource,
      getStoredSignupSource,
      getOrCreateAnonymousId,
    }
  } catch {
    // ignore
  }
}
