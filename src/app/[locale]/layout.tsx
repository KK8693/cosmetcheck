import { ReactNode } from 'react'

interface Props {
  params: Promise<{ locale: string }>
  children: ReactNode
}

/**
 * Locale-specific layout wrapper.
 * Required for [locale] routing to function correctly.
 * Metadata is handled at the page level.
 */
export default function LocaleLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
