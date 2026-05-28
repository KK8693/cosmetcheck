import { Metadata } from 'next'
import { ReactNode } from 'react'

interface Props {
  params: Promise<{ locale: string }>
  children: ReactNode
}

/**
 * Locale-specific layout metadata.
 * Ensures every locale page gets a correct canonical URL like:
 *   https://cosmetcheck.com/pt-BR/
 *   https://cosmetcheck.com/es-MX/
 *
 * The parent root layout sets metadataBase = https://cosmetcheck.com
 * so a relative canonical '/' here resolves to the full locale path.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  return {
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'zh-CN': '/zh',
        'en': '/en',
        'pt-BR': '/pt-BR',
        'es-MX': '/es-MX',
      },
    },
  }
}

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
