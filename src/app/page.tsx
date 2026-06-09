import { permanentRedirect } from 'next/navigation'
import { routing } from '@/i18n/routing'

export const runtime = 'edge'

export default function RootPage() {
  permanentRedirect(`/${routing.defaultLocale}`)
}
