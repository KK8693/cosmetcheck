'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface SubscribeButtonProps {
  planId?: string
  children: React.ReactNode
  variant?: 'default' | 'outline'
  className?: string
}

export default function SubscribeButton({
  planId,
  children,
  variant = 'default',
  className,
}: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/paypal/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription')
      }

      // Redirect to PayPal for approval
      window.location.href = data.approvalUrl
    } catch (err: Error | unknown) {
      console.error('Subscription error:', err)
      const message = err instanceof Error ? err.message : '支付失败，请重试'
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