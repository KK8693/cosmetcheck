'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null> | null = null

const getStripe = async () => {
  if (!stripePromise) {
    const { loadStripe } = await import('@stripe/stripe-js')
    stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
      : null
  }
  return stripePromise
}

interface SubscribeButtonProps {
  priceId: string
  children: React.ReactNode
  variant?: 'default' | 'outline'
  className?: string
}

export default function SubscribeButton({
  priceId,
  children,
  variant = 'default',
  className,
}: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    const stripe = await getStripe()
    if (!stripe) {
      alert('Stripe is not configured. Please contact support.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}?success=true`,
          cancelUrl: `${window.location.origin}?canceled=true`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (err: Error | unknown) {
      console.error('Checkout error:', err)
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
