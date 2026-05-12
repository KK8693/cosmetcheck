'use client'

import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/AuthModal'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { AlertTriangle, Info, CheckCircle, XCircle, Zap, Shield, X } from 'lucide-react'

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
  const t = useTranslations('hero')
  const tCommon = useTranslations('common')
  const tDemo = useTranslations('demo')
  // Default demo data - Hydroquinone banned ingredient example
  const [ingredients, setIngredients] = useState('')
  const [country, setCountry] = useState<'BR' | 'MX'>('BR')
  const [isChecking, setIsChecking] = useState(false)
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null)
  const [checkError, setCheckError] = useState('')
  const [authOpen, setAuthOpen] = useState(false)
  const { user, signOut, quotaUsed, quotaLimit, setQuotaUsed } = useAuth()

  // AI Generation state
  const [productName, setProductName] = useState('')
  const [productBenefits, setProductBenefits] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedListing, setGeneratedListing] = useState<GeneratedListing | null>(null)
  const [generateError, setGenerateError] = useState('')

  // Default demo result - dynamically shows based on selected country
  const demoResult: CheckResult = (country === 'BR' ? {
    isCompliant: false,
    violations: [
      {
        ruleId: 'ANVISA-RDC-665-2022',
        category: 'ingredient',
        severity: 'critical',
        message: tDemo('hydroquinoneBR'),
        suggestion: tDemo('suggestionBR'),
        source: 'ANVISA RDC 665/2022'
      }
    ],
    warnings: [],
    info: [],
    summary: {
      totalIssues: 1,
      criticalCount: 1,
      warningCount: 0,
      infoCount: 0
    },
    regulationVersion: 2024.1
  } : {
    isCompliant: false,
    violations: [
      {
        ruleId: 'COFEPRIS-NOM-141',
        category: 'ingredient',
        severity: 'critical',
        message: tDemo('hydroquinoneMX'),
        suggestion: tDemo('suggestionMX'),
        source: 'COFEPRIS NOM-141-SSA1/SCF1-2012'
      }
    ],
    warnings: [],
    info: [],
    summary: {
      totalIssues: 1,
      criticalCount: 1,
      warningCount: 0,
      infoCount: 0
    },
    regulationVersion: 2024.1
  }) as CheckResult

  // Show demo result by default on first load
  const [showDemo, setShowDemo] = useState(true)

  // Use demo result if showDemo is true and no real result exists
  const resultToShow = showDemo && !checkResult ? demoResult : checkResult

  const handleCheck = async () => {
    // User is running their own check, hide demo result
    setShowDemo(false)
    
    if (!ingredients.trim()) {
      setCheckError(t('errors.enterIngredients'))
      // 清除旧检测结果，显示空状态
      setCheckResult(null)
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
          description: productBenefits, // 产品功效作为 description 检测
          country,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setCheckResult(data.data)
      } else {
        setCheckError(data.error || t('errors.checkFailed'))
      }
    } catch {
      setCheckError(t('errors.networkError'))
    } finally {
      setIsChecking(false)
    }
  }

  const handleGenerate = async () => {
    if (!productName.trim()) {
      setGenerateError(t('errors.enterProductName'))
      return
    }
    // Check login status
    if (!user) {
      setGenerateError(t('errors.loginRequired'))
      setAuthOpen(true)
      return
    }
    // Check if quota exceeded
    if (quotaUsed >= quotaLimit) {
      setGenerateError(t('errors.quotaExceeded'))
      return
    }
    setGenerateError('')
    setIsGenerating(true)
    setGeneratedListing(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(user?.email && { 'x-user-email': user.email }),
        },
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
        // Update quota display locally (will be refreshed on next auth state change)
        setQuotaUsed(prev => prev + 1)
      } else if (res.status === 429) {
        setGenerateError(t('errors.quotaExceeded'))
      } else {
        setGenerateError(data.error || t('errors.generateFailed'))
      }
    } catch {
      setGenerateError(t('errors.networkError'))
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }
  return (
    <div className="min-h-screen bg-[#0D0D12] pt-16 md:pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0D0D12] via-[#0F1520] to-[#0D0D12] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        <div className="container-custom relative py-12 md:py-16">
          <div className="mx-auto max-w-full md:max-w-4xl text-center">
            {/* SocialProofBar - 增强版数据徽章 */}
            <div className="mb-6 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium backdrop-blur">
              <span className="inline-flex items-center">
                <span className="mr-2 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/80">{t('socialProof.served')}</span>
                <AnimatedCounter end={2000} suffix="+" className="mx-1 font-bold text-white" />
                <span className="text-white/80">{t('socialProof.sellers')}</span>
              </span>
              <span className="hidden sm:inline text-white/30">|</span>
              <span className="text-white/80">
                {t('socialProof.blocked')} <AnimatedCounter end={340000} suffix="+" className="font-bold text-white" /> {t('socialProof.complianceRisks')}
              </span>
              <span className="hidden sm:inline text-white/30">|</span>
              <span className="text-white/80">
                {t('socialProof.coverage')} <span className="font-bold text-white">{t('socialProof.brazilMexico')}</span>
              </span>
            </div>
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              {t('title')} <span className="hidden md:block"> </span> {t('titleLine2')}
            </h1>

            {/* Logo 墙 - 新增 */}
            <div className="mb-8">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-3">
                {t('trustedBy')}
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
            <div className="mx-auto max-w-full md:max-w-2xl mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  tag: t('caseStudies.bannedIngredient'),
                  tagColor: 'text-red-500',
                  body: t('caseStudies.bannedIngredientBody'),
                  result: t('caseStudies.bannedIngredientResult'),
                },
                {
                  tag: t('caseStudies.labelViolation'),
                  tagColor: 'text-amber-500',
                  body: t('caseStudies.labelViolationBody'),
                  result: t('caseStudies.labelViolationResult'),
                },
                {
                  tag: t('caseStudies.copywritingError'),
                  tagColor: 'text-blue-500',
                  body: t('caseStudies.copywritingErrorBody'),
                  result: t('caseStudies.copywritingErrorResult'),
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

            <p className="mx-auto mb-10 max-w-full md:max-w-2xl text-lg text-white/90 md:text-xl">
              {t('subtitleShort')}
            </p>
            <p className="mx-auto mb-6 max-w-full md:max-w-xl text-sm text-amber-400 font-semibold tracking-wide">
              {t('ctaLine')}
            </p>

            {/* Hero Demo */}
            <div className="mx-auto w-full max-w-full md:max-w-xl rounded-2xl bg-white/10 p-4 backdrop-blur-lg md:p-8 text-left">
              <div className="mb-4">
                <Label className="text-white/80 text-sm">{t('form.inputProductInfo')}</Label>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={() => { setCountry('BR'); setCheckResult(null); setShowDemo(true) }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    country === 'BR'
                      ? 'bg-white text-[#0A4D8C]'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {t('brazilAnvisa')}
                </button>
                <button
                  onClick={() => { setCountry('MX'); setCheckResult(null); setShowDemo(true) }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    country === 'MX'
                      ? 'bg-white text-[#0A4D8C]'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {t('mexicoCofeppris')}
                </button>
              </div>

              {/* Product Name */}
              <div className="mb-3 relative">
                <Textarea
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder={t('productNamePlaceholder')}
                  className="w-full border-white/20 bg-white/10 text-white placeholder:text-white/50 min-h-[60px] resize-none pr-10"
                />
                {productName && (
                  <button
                    type="button"
                    onClick={() => setProductName('')}
                    className="absolute right-3 top-3 text-white/50 hover:text-white/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-xs text-white/50 mb-3">
                {t('form.generateHint')}
              </p>

              {/* Ingredients */}
              <div className="mb-3 relative">
                <Textarea
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder={t('ingredientsPlaceholder') + ` (${t('form.optional')})`}
                  className="w-full border-white/20 bg-white/10 text-white placeholder:text-white/50 min-h-[80px] resize-none pr-10"
                />
                {ingredients && (
                  <button
                    type="button"
                    onClick={() => setIngredients('')}
                    className="absolute right-3 top-3 text-white/50 hover:text-white/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Benefits */}
              <div className="mb-3 relative">
                <Textarea
                  value={productBenefits}
                  onChange={(e) => setProductBenefits(e.target.value)}
                  placeholder={t('productBenefitsPlaceholder')}
                  className="w-full border-white/20 bg-white/10 text-white placeholder:text-white/50 min-h-[60px] resize-none pr-10"
                />
                {productBenefits && (
                  <button
                    type="button"
                    onClick={() => setProductBenefits('')}
                    className="absolute right-3 top-3 text-white/50 hover:text-white/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {checkError && <p className="text-red-300 text-sm mb-2">{checkError}</p>}
              {generateError && <p className="text-red-300 text-sm mb-2">{generateError}</p>}

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleCheck}
                  disabled={isChecking}
                  variant="outline"
                  className="w-full sm:flex-1 border-white/30 text-white hover:bg-white/10 font-medium"
                >
                  {isChecking ? t('checking') : t('checkFirst')}
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full sm:flex-1 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-bold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all animate-pulse-subtle"
                >
                  {isGenerating ? t('generating') : <><Zap className="w-4 h-4 mr-1" /> {t('freeGenerateListing')}</>}
                </Button>
              </div>

              <p className="mt-3 text-xs text-white/60 text-center">
                {t('form.zeroBarrier')}
              </p>
            </div>

            {/* Check Results */}
            {resultToShow && (
              <div className="mx-auto max-w-full md:max-w-xl mt-6 rounded-2xl bg-white p-4 md:p-6 text-left text-gray-900">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">{t('testResult')}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      resultToShow.isCompliant
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {resultToShow.isCompliant ? <><CheckCircle className="w-4 h-4 mr-1" /> {t('compliant')}</> : <><XCircle className="w-4 h-4 mr-1" /> {t('nonCompliant')}</>}
                  </span>
                </div>

                {resultToShow.summary.totalIssues > 0 && (
                  <div className="flex gap-4 mb-4 text-sm">
                    {resultToShow.summary.criticalCount > 0 && (
                      <span className="text-red-600 font-medium">
                        <XCircle className="w-4 h-4 mr-1" /> {resultToShow.summary.criticalCount} {t('critical')}
                      </span>
                    )}
                    {resultToShow.summary.warningCount > 0 && (
                      <span className="text-amber-600 font-medium">
                        <AlertTriangle className="w-4 h-4 mr-1" /> {resultToShow.summary.warningCount} {t('warning')}
                      </span>
                    )}
                    {resultToShow.summary.infoCount > 0 && (
                      <span className="text-blue-600 font-medium">
                        <Info className="w-4 h-4 mr-1" /> {resultToShow.summary.infoCount} {t('info')}
                      </span>
                    )}
                  </div>
                )}

                {resultToShow.violations.length > 0 && (
                  <div className="space-y-3 mb-4">
                    <h4 className="text-sm font-semibold text-red-600 flex items-center"><XCircle className="w-4 h-4 mr-1" /> {t('criticalIssues')}</h4>
                    {resultToShow.violations.map((v, i) => (
                      <div key={i} className="bg-red-50 rounded-lg p-3 text-sm">
                        <p className="font-medium text-red-700">{v.message}</p>
                        <p className="text-red-600/80 mt-1">{t('suggestion')}: {v.suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}

                {resultToShow.warnings.length > 0 && (
                  <div className="space-y-3 mb-4">
                    <h4 className="text-sm font-semibold text-amber-600 flex items-center"><AlertTriangle className="w-4 h-4 mr-1" /> {t('warningIssues')}</h4>
                    {resultToShow.warnings.map((v, i) => (
                      <div key={i} className="bg-amber-50 rounded-lg p-3 text-sm">
                        <p className="font-medium text-amber-700">{v.message}</p>
                        <p className="text-amber-600/80 mt-1">{t('suggestion')}: {v.suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}

                {resultToShow.info.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-blue-600 flex items-center"><Info className="w-4 h-4 mr-1" /> {t('info')}</h4>
                    {resultToShow.info.map((v, i) => (
                      <div key={i} className="bg-blue-50 rounded-lg p-3 text-sm">
                        <p className="font-medium text-blue-700">{v.message}</p>
                        <p className="text-blue-600/80 mt-1">{t('suggestion')}: {v.suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}

                {resultToShow.summary.totalIssues === 0 && (
                  <p className="text-green-600 text-sm">{t('noIssuesFound')}</p>
                )}
              </div>
            )}

            {/* Generated Listing */}
            {generatedListing && (
              <div className="mx-auto max-w-full md:max-w-xl mt-6 rounded-2xl bg-white p-4 md:p-6 text-left text-gray-900">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">{t('aiGeneratedListing')}</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#0A4D8C]/10 text-[#0A4D8C]">
                    {generatedListing.language === 'pt-BR' ? `🇧🇷 ${t('ptBr')}` : `🇲🇽 ${t('esMx')}`}
                  </span>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs font-semibold text-gray-500">{t('title')}</Label>
                    <button
                      onClick={() => copyToClipboard(generatedListing.title)}
                      className="text-xs text-[#0A4D8C] hover:underline"
                    >
                      {t('copyBtn')}
                    </button>
                  </div>
                  <p className="text-lg font-bold text-gray-900 bg-gray-50 rounded-lg p-3">
                    {generatedListing.title}
                  </p>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs font-semibold text-gray-500">{t('description')}</Label>
                    <button
                      onClick={() => copyToClipboard(generatedListing.description)}
                      className="text-xs text-[#0A4D8C] hover:underline"
                    >
                      {t('copyBtn')}
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">
                    {generatedListing.description}
                  </p>
                </div>

                {/* Bullet Points */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs font-semibold text-gray-500">{t('bulletPoints')}</Label>
                    <button
                      onClick={() => copyToClipboard(generatedListing.bulletPoints.join('\n'))}
                      className="text-xs text-[#0A4D8C] hover:underline"
                    >
                      {t('copyAll')}
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {generatedListing.bulletPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                        <span className="text-[#0A4D8C] font-bold mt-0.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Compliance Notes */}
                {generatedListing.complianceNotes.length > 0 && (
                  <div className="mb-4">
                    <Label className="text-xs font-semibold text-green-600 mb-2 block flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> {t('complianceNotes')}</Label>
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
                    <Label className="text-xs font-semibold text-amber-600 mb-2 block flex items-center"><AlertTriangle className="w-3 h-3 mr-1" /> {t('complianceWarning')}</Label>
                    {generatedListing.warnings.map((warning, i) => (
                      <p key={i} className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2 mb-1">
                        {warning}
                      </p>
                    ))}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    <AlertTriangle className="w-3 h-3 mr-1" /> {t('disclaimer')}
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