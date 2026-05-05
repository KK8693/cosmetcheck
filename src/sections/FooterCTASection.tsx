'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function FooterCTASection() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('请输入有效的邮箱地址')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || '订阅失败，请稍后重试')
      } else {
        setSuccess(true)
        setEmail('')
      }
    } catch {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] text-white">
      <div className="container-custom text-center">
        <div className="mb-4 inline-flex items-center rounded-full bg-red-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg animate-bounce">
          🔥 限时福利 · 本月注册送 5 次 Pro 体验
        </div>
        <h2 className="text-3xl font-bold md:text-4xl mb-4">
          今天就开始合规卖货
        </h2>
        <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
          加入 2,000+ 拉美美妆卖家，用AI让合规不再成为出海障碍
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="输入邮箱，免费开始"
            className="border-white/20 bg-white/10 text-white placeholder:text-white/50 h-12 text-base"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-bold h-12 px-8 whitespace-nowrap shadow-lg shadow-amber-500/25 animate-pulse-subtle disabled:opacity-60"
          >
            {loading ? '提交中...' : '立即免费检测'}
          </Button>
        </form>
        {error && (
          <p className="mt-3 text-sm text-red-300">{error}</p>
        )}
        {success && (
          <p className="mt-3 text-sm text-green-300">✅ 订阅成功！请查收邮件确认。</p>
        )}
        <p className="mt-4 text-sm text-white/60">
          无需信用卡 · 随时取消 · 免费版永久可用
        </p>
      </div>
    </section>
  )
}
