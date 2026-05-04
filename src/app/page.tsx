'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import SubscribeButton from '@/components/SubscribeButton'

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

import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/AuthModal'

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0) // 默认展开第一条
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
4e0d再被下架罚款
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
                  className="flex-1 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-bold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
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

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">三步完成合规检测</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">从成分输入到Listing生成，全程AI辅助，无需法规背景</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: '粘贴产品信息',
                desc: '粘贴产品描述、成分表或上传文档，支持中/英/葡/西语',
                icon: '📋',
              },
              {
                step: '02',
                title: 'AI自动检测合规',
                desc: '实时标记违禁词、浓度超标成分，显示ANVISA/COFEPRIS具体法规条款',
                icon: '🔍',
              },
              {
                step: '03',
                title: '生成高转化Listing',
                desc: '一键生成符合当地法规的葡语/西班牙语Listing，可直接上架',
                icon: '✨',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-8 hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="text-sm font-bold text-[#7c3aed] mb-2">步骤 {item.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">谁在用 CosmetCheck</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">覆盖拉美美妆出海的典型场景</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: '中国卖家出海巴西',
                desc: '不懂葡语也能过ANVISA。AI自动生成合规的葡语Listing，告别翻译软件+人工校对的双重成本。',
                highlight: '巴西站',
              },
              {
                title: '墨西哥本土小品牌',
                desc: '低成本合规，和大品牌同台竞争。COFEPRIS检测+西语Listing，让合规不再是资金门槛。',
                highlight: '墨西哥站',
              },
              {
                title: 'TikTok达人推自有品牌',
                desc: '快速合规上线，不耽误流量变现。从选品到上架48小时完成，赶上每一个流量风口。',
                highlight: '全渠道',
              },
            ].map((item, idx) => (
              <Card key={idx} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-8">
                  <div className="inline-block rounded-full bg-[#7c3aed]/10 px-3 py-1 text-xs font-semibold text-[#7c3aed] mb-4">
                    {item.highlight}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">核心功能</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">专为拉美美妆合规设计的AI检测引擎</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🛡️', title: '上架前自动拦截下架风险', desc: '输入成分秒出风险报告：哪里违规、怎么改、引用哪条法规 — 不让罚款单先到' },
              { icon: '🌐', title: '当地人看了就想买的 Listing', desc: '不是翻译，是按巴西/墨西哥消费者搜索习惯重写标题和卖点，自带合规过滤' },
              { icon: '⚡', title: '违禁词秒标红，附官方条款', desc: 'ANVISA RDC 编号、COFEPRIS NOM 标准直接引用，平台申诉有依据' },
              { icon: '🎁', title: '0 元先测 10 次，再决定', desc: '不用绑卡、不用签合同，测完觉得有用再升级 Pro' },
            ].map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-gray-100 p-6 hover:border-[#7c3aed]/20 transition-colors">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="inline-block rounded-full bg-[#7c3aed]/10 px-4 py-1 text-sm font-semibold text-[#7c3aed] mb-4">
              价值优先
            </div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">
              省下的每一次罚款，都够付一年Pro
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ANVISA单次违规罚款可达 R$ 10,000+，一次Pro订阅即可覆盖全年
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-gray-100">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">$0</span>
                  <span className="text-gray-500 ml-2">/月</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['每月10次合规检测', '基础违禁词检测', '巴西ANVISA规则', '墨西哥COFEPRIS规则'].map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full font-semibold text-[#7c3aed] border-[#7c3aed]/30 hover:bg-[#7c3aed]/5">
              免费试用 10 次
            </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#7c3aed] relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#7c3aed] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                推荐
              </div>
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">$29</span>
                  <span className="text-gray-500 ml-2">/月</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['无限次合规检测', 'AI Listing生成（葡/西语）', '法规更新实时通知', '优先客服支持', '批量检测（CSV导入）'].map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <SubscribeButton
                  priceId="price_pro_monthly"
                  className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-bold shadow-lg shadow-amber-500/25"
                >
                  解锁无限次 — $29/月
                </SubscribeButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">常见问题</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: '你们的数据来源可靠吗？',
                a: '法规数据直接来自 ANVISA RDC 文件、COFEPRIS NOM 标准、INCI 国际命名数据库。每条规则均标注来源文件编号，可追溯验证。',
              },
              {
                q: '法规更新频率？',
                a: '官方源每月自动爬取，人工校验后更新。检测到重大法规变更时（如新禁用成分），48小时内完成规则更新并通知所有Pro用户。',
              },
              {
                q: '免费版够不够用？',
                a: '免费版每月10次检测，适合单品测试和小批量卖家。如果每月检测超过10次，或需要AI生成Listing，建议升级Pro。',
              },
              {
                q: '生成的Listing真的合规吗？',
                a: 'AI生成的Listing基于当前法规版本和官方要求，但建议上架前进行最终人工确认。我们提供规则来源链接供您二次验证。',
              },
              {
                q: '支持哪些平台？',
                a: '当前支持巴西（ANVISA）和墨西哥（COFEPRIS）的合规检测。Listing生成适配 Amazon、Mercado Livre、Shopee 等平台格式。',
              },
              {
                q: '我的产品数据安全吗？',
                a: '所有数据传输使用TLS加密，符合 GDPR、LGPD（巴西）和 LFPDPPP（墨西哥）数据保护要求。我们从不出售用户数据。',
              },
              {
                q: '多久支持其他国家？',
                a: '2025年Q3计划上线阿根廷（ANMAT）和哥伦比亚（INVIMA）。Pro用户可优先体验新市场。',
              },
              {
                q: '可以开发票/退税吗？',
                a: 'Pro订阅支持开具国际发票（Invoice），可用于企业报销和税务抵扣。',
              },
            ].map((item, idx) => (
              <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                >
                  <span className="font-semibold text-gray-900 pr-4">{item.q}</span>
                  <span className={`text-2xl flex-shrink-0 transition-transform ${activeFaq === idx ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] text-white">
        <div className="container-custom text-center">
          {/* 限时徽章 - 新增 */}
          <div className="mb-4 inline-flex items-center rounded-full bg-red-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg animate-bounce">
            🔥 限时福利 · 本月注册送 5 次 Pro 体验
          </div>
          <h2 className="text-3xl font-bold md:text-4xl mb-4">
            今天就开始合规卖货
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
            加入 2,000+ 拉美美妆卖家，用AI让合规不再成为出海障碍
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              type="email"
              placeholder="输入邮箱，免费开始"
              className="border-white/20 bg-white/10 text-white placeholder:text-white/50 h-12 text-base"
            />
            <Button className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-bold h-12 px-8 whitespace-nowrap shadow-lg shadow-amber-500/25">
              立即免费检测
            </Button>
          </div>
          <p className="mt-4 text-sm text-white/60">
            无需信用卡 · 随时取消 · 免费版永久可用
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-white font-bold text-xl mb-4">CosmetCheck</div>
              <p className="text-sm">拉美美妆合规检测专家，让出海更简单。</p>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">产品</div>
              <ul className="space-y-2 text-sm">
                <li>合规检测</li>
                <li>AI Listing生成</li>
                <li>定价</li>
              </ul>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">资源</div>
              <ul className="space-y-2 text-sm">
                <li>法规知识库</li>
                <li>帮助中心</li>
                <li>API文档</li>
              </ul>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">法律</div>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="hover:text-white transition-colors">隐私政策</a></li>
                <li>服务条款</li>
                <li>GDPR/LGPD/LFPDPPP</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            © 2025 CosmetCheck. All rights reserved.
          </div>
        </div>
      </footer>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  )
}
