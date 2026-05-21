'use client'

import { useTranslations } from 'next-intl'

export default function BatchContent() {
  const t = useTranslations('common')

  return (
    <div className="container-custom py-20 text-center text-white">
      <h1 className="text-3xl font-bold mb-4">Batch Detection</h1>
      <p className="text-white/70">Coming soon.</p>
    </div>
  )
}
