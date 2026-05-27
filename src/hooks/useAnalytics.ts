// src/hooks/useAnalytics.ts
import { useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent, setPageView, type AnalyticsEventName, type EventParamsMap } from '@/lib/analytics'

export function useAnalytics() {
  const pathname = usePathname()

  // Track page views on pathname changes (SPA navigation support)
  useEffect(() => {
    if (pathname) {
      setPageView(pathname)
    }
  }, [pathname])

  const sendEvent = useCallback(<T extends AnalyticsEventName>(
    eventName: T,
    params: EventParamsMap[T]
  ) => {
    trackEvent(eventName, params)
  }, [])

  return {
    trackEvent: sendEvent,
    setPageView,
  }
}
