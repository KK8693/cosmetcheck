'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/AuthModal'

interface CheckResult {
  isCompliant: boolean
  violations: Array<{
    ruleId: string
    category: string
    severity: string
    message: string
    suggestion: string
    source: string
  }>
  warnings: Array<{
    ruleId: string
    category: string
    severity: string
    message: string
    suggestion: string
    source: string
  }>
  info: Array<{
    ruleId: string
    category: string
    severity: string
    message: string
    suggestion: string
    source: string
  }>
  summary: {
    totalIssues: number
    criticalCount: number
    warningCount: number
    infoCount: number
  }
  regulationVersion: number
}

interface GeneratedListing {
  title: string
  description: string
  bulletPoints: string[]
  complianceNotes: string[]
  warnings: string[]
  language: 'pt-BR' | 'es-MX'
}
export function HeroSection() {
  const [ingredients, setIngredients] = useState('')
  const [country, setCountry] = useState<'BR' | 'MX'>('BR')
  const [isChecking, setIsChecking] = useState(false)
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null)
  const [checkError, setCheckError] = useState('')
  const [authOpen, setAuthOpen] = useState(false)
  const { user, signOut, quotaUsed, quotaLimit } = useAuth()

  // AI Generation state
  const [productName, setProductName] = useState('')
  const [productBenefits, setProductBenefits] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedListing, setGeneratedListing] = useState<GeneratedListing | null>(null)
  const [generateError, setGenerateError] = useState('')

  const handleCheck = async () => {
    if (!ingredients.trim()) {
      setCheckError('请输入产品成分或描述')
      return
    }
    setCheckError('')
    setIsChecking(true)
    setCheckResult(null)

    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients,
          country,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setCheckResult(data.data)
      } else {
        setCheckError(data.error || '检测失败，请稍后再试')
      }
    } catch {
      setCheckError('网络错误，请稍后再试')
    } finally {
      setIsChecking(false)
    }
  }

  const handleGenerate = async () => {
    if (!productName.trim()) {
      setGenerateError('请输入产品名称')
      return
    }
    setGenerateError('')
    setIsGenerating(true)
    setGeneratedListing(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          ingredients,
          benefits: productBenefits,
          category: 'skincare',
          targetCountry: country,
          checkResult: checkResult || undefined,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setGeneratedListing(data.data)
      } else {
        setGenerateError(data.error || '生成失败，请稍后再试')
      }
    } catch {
      setGenerateError('网络错误，请稍后再试')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        <div className="container-custom relative py-20 md:py-28">
          {/* User auth bar */}
          <div className="flex justify-end mb-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/80">
                  已用 {quotaUsed}/{quotaLimit} 次
                </span>
                <button
                  onClick={signOut}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  退出
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-full transition-colors"
              >
                登录 / 注册
              </button>
            )}
          </div>
          <div className="mx-auto max-w-4xl text-center">
            {/* SocialProofBar - 增强版数据徽章 */}
            <div className="mb-6 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium backdrop-blur">
              <span className="inline-flex items-center">
                <span className="mr-2 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/80">已服务</span>
                <span className="mx-1 font-bold text-white">2,000+</span>
                <span className="text-white/80">卖家</span>
              </span>
              <span className="hidden sm:inline text-white/30">|</span>
              <span className="text-white/80">
                拦截 <span className="font-bold text-white">340,000+</span> 次合规风险
              </span>
              <span className="hidden sm:inline text-white/30">|</span>
              <span className="text-white/80">
                覆盖 <span className="font-bold text-white">巴西/墨西哥</span>
              </span>
            </div>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
              拉美卖美妆，<br className="hidden md:block" />
              不再被下架罚款
            </h1>

            {/* Logo 墙 - 新增 */}
            <div className="mb-8">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-3">
                被这些平台的卖家信赖
              </p>
              <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
                {['Amazon Brazil', 'Mercado Livre', 'Shopee', 'TikTok Shop', 'SHEIN'].map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* 真实案例卡 - 新增 */}
            <div className="mx-auto max-w-2xl mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  tag: '❌ 禁用成分',
                  tagColor: 'text-red-300',
                  body: '"某美白霜含 Hydroquinone 2%，直接被 ANVISA 标红"',
                  result: '→ 修改后 48h 重新上架',
                },
                {
                  tag: '⚠️ 标签违规',
                  tagColor: 'text-amber-300',
                  body: '"防晒产品未标注 SPF 值，墨西哥海关扣留"',
                  result: '→ AI 生成合规标签，0 罚款',
                },
                {
                  tag: '📝 文案误触',
                  tagColor: 'text-blue-300',
                  body: '"抗皱文案写错 1 个词，Listing 被下架 7 天"',
                  result: '→ 替换后 CTR 提升 23%',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-white/10 backdrop-blur border border-white/10 p-4 text-left hover:bg-white/15 transition-colors"
                >
                  <p className={`text-xs font-bold ${item.tagColor} mb-2`}>{item.tag}</p>
                  <p className="text-sm text-white/90 leading-relaxed mb-2">{item.body}</p>
                  <p className="text-xs text-green-400 font-semibold">{item.result}</p>
                </div>
              ))}
            </div>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90 md:text-xl">
              一键检测巴西/墨西哥等5国合规，AI自动生成高转化Listing — 免费开始
            </p>

            {/* Hero Demo */}
            <div className="mx-auto max-w-xl rounded-2xl bg-white/10 p-6 backdrop-blur-lg md:p-8 text-left">
              <div className="mb-4">
                <Label className="text-white/80 text-sm">输入产品信息，检测并生成合规Listing</Label>
              </div>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setCountry('BR')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    country === 'BR'
                      ? 'bg-white text-[#7c3aed]'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  巴西 ANVISA
                </button>
                <button
                  onClick={() => setCountry('MX')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    country === 'MX'
                      ? 'bg-white text-[#7c3aed]'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  墨西哥 COFEPRIS
                </button>
              </div>

              {/* Product Name */}
              <div className="mb-3">
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="产品名称（如：Vitamin C Serum）"
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
                />
              </div>

              {/* Ingredients */}
              <div className="mb-3">
                <Textarea
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="成分（如：Aqua, Glycerin, Niacinamide, Vitamin C... 可选）"
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/50 min-h-[80px]"
                />
              </div>

              {/* Benefits */}
              <div className="mb-3">
                <Textarea
                  value={productBenefits}
                  onChange={(e) => setProductBenefits(e.target.value)}
                  placeholder="产品功效（如：美白、保湿、抗衰老... 可选）"
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/50 min-h-[60px]"
                />
              </div>

              {checkError && <p className="text-red-300 text-sm mb-2">{checkError}</p>}
              {generateError && <p className="text-red-300 text-sm mb-2">{generateError}</p>}

              <div className="flex gap-2">
                <Button
                  onClick={handleCheck}
                  disabled={isChecking}
                  variant="outline"
                  className="flex-1 border-white/30 text-white hover:bg-white/10 font-medium"
                >
                  {isChecking ? '检测中...' : '先检测合规'}
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !productName}
                  className="flex-1 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-bold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all animate-pulse-subtle"
                >
                  {isGenerating ? '生成中...' : '🚀 免费生成 Listing'}
                </Button>
              </div>

              <p className="mt-3 text-xs text-white/60 text-center">
                零门槛体验 · 无需注册 · 双语输出
              </p>
            </div>

            {/* Check Results */}
            {checkResult && (
              <div className="mx-auto max-w-xl mt-6 rounded-2xl bg-white p-6 text-left text-gray-900">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">检测结果</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      checkResult.isCompliant
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {checkResult.isCompliant ? '✅ 合规' : '❌ 不合规'}
                  </span>
                </div>

                {checkResult.summary.totalIssues > 0 && (
                  <div className="flex gap-4 mb-4 text-sm">
                    {checkResult.summary.criticalCount > 0 && (
                      <span className="text-red-600 font-medium">
                        ❌ {checkResult.summary.criticalCount} 严重</span>
                    )}
                    {checkResult.summary.warningCount > 0 && (
                      <span className="text-amber-600 font-medium">
                        ⚠️ {checkResult.summary.warningCount} 警告</span>
                    )}
                    {checkResult.summary.infoCount > 0 && (
                      <span className="text-blue-600 font-medium">
                        ℹ️ {checkResult.summary.infoCount} 提示</span>
                    )}
                  </div>
                )}

                {checkResult.violations.length > 0 && (
                  <div className="space-y-3 mb-4">
                    <h4 className="text-sm font-semibold text-red-600">❌ 严重问题（必须修复）</h4>
                    {checkResult.violations.map((v, i) => (
                      <div key={i} className="bg-red-50 rounded-lg p-3 text-sm">
                        <p className="font-medium text-red-700">{v.message}</p>
                        <p className="text-red-600/80 mt-1">建议：{v.suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}

                {checkResult.warnings.length > 0 && (
                  <div className="space-y-3 mb-4">
                    <h4 className="text-sm font-semibold text-amber-600">⚠️ 警告（建议修复）</h4>
                    {checkResult.warnings.map((v, i) => (
                      <div key={i} className="bg-amber-50 rounded-lg p-3 text-sm">
                        <p className="font-medium text-amber-700">{v.message}</p>
                        <p className="text-amber-600/80 mt-1">建议：{v.suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}

                {checkResult.info.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-blue-600">ℹ️ 提示</h4>
                    {checkResult.info.map((v, i) => (
                      <div key={i} className="bg-blue-50 rounded-lg p-3 text-sm">
                        <p className="font-medium text-blue-700">{v.message}</p>
                        <p className="text-blue-600/80 mt-1">建议：{v.suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}

                {checkResult.summary.totalIssues === 0 && (
                  <p className="text-green-600 text-sm">恭喜！暂未发现合规问题。</p>
                )}
              </div>
            )}

            {/* Generated Listing */}
            {generatedListing && (
              <div className="mx-auto max-w-xl mt-6 rounded-2xl bg-white p-6 text-left text-gray-900">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">AI生成的合规Listing</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#7c3aed]/10 text-[#7c3aed]">
                    {generatedListing.language === 'pt-BR' ? '🇧🇷 葡语' : '🇲🇽 西语'}
                  </span>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs font-semibold text-gray-500">标题</Label>
                    <button
                      onClick={() => copyToClipboard(generatedListing.title)}
                      className="text-xs text-[#7c3aed] hover:underline"
                    >
                      复制
                    </button>
                  </div>
                  <p className="text-lg font-bold text-gray-900 bg-gray-50 rounded-lg p-3">
                    {generatedListing.title}
                  </p>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs font-semibold text-gray-500">描述</Label>
                    <button
                      onClick={() => copyToClipboard(generatedListing.description)}
                      className="text-xs text-[#7c3aed] hover:underline"
                    >
                      复制
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">
                    {generatedListing.description}
                  </p>
                </div>

                {/* Bullet Points */}
                <div className="mb-4">
                  <Label className="text-xs font-semibold text-gray-500 mb-2 block">卖点</Label>
                  <ul className="space-y-2">
                    {generatedListing.bulletPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                        <span className="text-[#7c3aed] font-bold mt-0.5">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Compliance Notes */}
                {generatedListing.complianceNotes.length > 0 && (
                  <div className="mb-4">
                    <Label className="text-xs font-semibold text-green-600 mb-2 block">✅ 合规说明</Label>
                    {generatedListing.complianceNotes.map((note, i) => (
                      <p key={i} className="text-xs text-green-700 bg-green-50 rounded-lg p-2 mb-1">
                        {note}
                      </p>
                    ))}
                  </div>
                )}

                {/* Warnings */}
                {generatedListing.warnings.length > 0 && (
                  <div>
                    <Label className="text-xs font-semibold text-amber-600 mb-2 block">⚠️ 注意事项</Label>
                    {generatedListing.warnings.map((warning, i) => (
                      <p key={i} className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2 mb-1">
                        {warning}
                      </p>
                    ))}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    ⚠️ 本Listing由AI生成，仅供参考。上架前请根据当地法规进行最终确认。
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  )
}