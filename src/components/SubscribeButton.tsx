'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useLocale } from 'next-intl'
import { getPlanId } from '@/lib/paypal'

interface SubscribeButtonProps {
  children: React.ReactNode
  variant?: 'default' | 'outline'
  className?: string
  billingCycle?: 'monthly' | 'yearly'
}

export default function SubscribeButton({
  children,
  variant = 'default',
  className,
  billingCycle = 'monthly',
}: SubscribeButtonProps) {
  const locale = useLocale()
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      // Select PayPal plan by locale + billing cycle
      const planIdValue = getPlanId(locale, billingCycle === 'yearly')

      const response = await fetch('/api/paypal/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: planIdValue,
          // TODO: Pass customerId from auth context when available
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription')
      }

      // Redirect to PayPal for approval
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl
      } else {
        throw new Error('No approval URL received')
      }
    } catch (err: Error | unknown) {
      console.error('Subscribe error:', err)
      const message = err instanceof Error ? err.message : 'Payment failed. Please try again.'
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleSubscribe}
      disabled={loading}
    >
      {loading ? '...' : children}
    </Button>
  )
}
