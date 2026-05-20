'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { Mail } from 'lucide-react'

export default function EmailFAB() {
  const [bounced, setBounced] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setBounced(true), 3000)
    const stopTimer = setTimeout(() => setBounced(false), 4500)
    return () => {
      clearTimeout(timer)
      clearTimeout(stopTimer)
    }
  }, [])

  const href = 'mailto:support@cosmetcheck.com?subject=Support%20Request'

  return (
    <a
      href={href}
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-110 transition-all duration-300 ${bounced ? 'animate-bounce' : ''}`}
      aria-label="Email support"
    >
      <Mail className="w-7 h-7" />
    </a>
  )
}