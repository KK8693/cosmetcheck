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
    <section className="py-12 md:py-20 bg-gradient-to-br from-[#0A4D8C] via-[#1E6BB8] to-[#00A86B] text-white">
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
        <div className="mt-6 flex flex-col items-center gap-4">
          <span className="text-white/50 text-sm">或</span>
          <a
            href="https://wa.me/?text=你好，我想了解CosmetCheck的合规检测服务"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp 快速咨询
          </a>
        </div>
        <p className="mt-6 text-sm text-white/60">
          无需信用卡 · 随时取消 · 免费版永久可用
        </p>
      </div>
    </section>
  )
}
