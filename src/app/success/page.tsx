'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'

function SuccessContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'pending' | 'confirmed'>('pending')
  
  const subscriptionId = searchParams.get('subscription_id')
  const token = searchParams.get('token')

  useEffect(() => {
    if (subscriptionId) {
      fetch(`/api/paypal/subscription?subscription_id=${subscriptionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'ACTIVE') {
            setStatus('confirmed')
          }
        })
        .catch(console.error)
    }
  }, [subscriptionId])

  if (token && !subscriptionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A4D8C]">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold mb-4">处理中...</h1>
          <p className="text-white/80">正在确认您的支付，请稍候。</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0A4D8C] to-[#00A86B]">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          {status === 'confirmed' ? '🎉 订阅成功！' : '✅ 支付已完成'}
        </h1>
        
        <p className="text-lg text-white/80 mb-8">
          {status === 'confirmed' 
            ? '感谢您的订阅！您现在可以享受 Pro 会员的所有特权。'
            : '我们正在确认您的订阅，请稍候。'}
        </p>

        {subscriptionId && (
          <p className="text-sm text-white/60 mb-8">
            订阅ID: {subscriptionId}
          </p>
        )}
        
        <div className="space-y-4">
          <Link href="/">
            <button className="w-full bg-white text-[#0A4D8C] font-bold py-3 px-6 rounded-lg hover:bg-white/90 transition">
              返回首页
            </button>
          </Link>
          
          {status === 'pending' && (
            <p className="text-sm text-white/60">
              如果页面没有自动更新，请稍后刷新或联系客服。
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0A4D8C]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}