'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

// PayPal Plan IDs (should match .env.local)
const PAYPAL_PLANS = {
  pro_monthly: process.env.NEXT_PUBLIC_PAYPAL_PRO_MONTHLY_PLAN_ID || 'P-1BS751417C578393RNH6VPGA',
}

interface SubscribeButtonProps {
  planId?: string
  children: React.ReactNode
  variant?: 'default' | 'outline'
  className?: string
}

export default function SubscribeButton({
  planId = 'pro_monthly',
  children,
  variant = 'default',
  className,
}: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      // Get the actual Plan ID
      const planIdValue = PAYPAL_PLANS[planId as keyof typeof PAYPAL_PLANS] || planId

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
      {loading ? '处理中...' : children}
    </Button>
  )
}