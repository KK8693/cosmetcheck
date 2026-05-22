'use client'

import { useState, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/AuthModal'
import { AlertTriangle, Info, CheckCircle, XCircle, Zap, Shield, X, Lock, CreditCard, Users, Loader2, ShoppingBag, Store, Globe, Smartphone, Package, Truck } from 'lucide-react'

interface ViolationItem {
  ruleId: string
  category: string
  severity: string
  message: string
  suggestion: string
  source: string
  matchedText?: string
  position?: { start: number; end: number }
  contextSnippet?: string
  sourceField?: string
  allSourceFields?: string[]
  confidence?: 'high' | 'medium' | 'low'
}

interface CheckResult {
  isCompliant: boolean
  violations: ViolationItem[]
  warnings: ViolationItem[]
  info: ViolationItem[]
  summary: {
    totalIssues: number
    criticalCount: number
    warningCount: number
    infoCount: number
  }
  regulationVersion: number
}


// P4.3: Group violations by category for organized display
const categoryOrder = ['ingredient', 'claim', 'label', 'packaging']

function HighlightText({ text, matchedText }: { text: string; matchedText: string }) {
  if (!text || !matchedText) return <span>{text}</span>
  const lowerText = text.toLowerCase()
  const lowerMatch = matchedText.toLowerCase()
  const idx = lowerText.indexOf(lowerMatch)
  if (idx === -1) return <span>{text}</span>
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 rounded px-0.5 font-semibold text-yellow-900">{text.slice(idx, idx + matchedText.length)}</mark>
      {text.slice(idx + matchedText.length)}
    </span>
  )
}



function groupByCategory(items: ViolationItem[]): [string, ViolationItem[]][] {
  const groups = new Map<string, ViolationItem[]>()
  for (const item of items) {
    const cat = item.category || 'other'
    if (!groups.has(cat)) groups.set(cat, [])
    groups.get(cat)!.push(item)
  }
  // Sort by categoryOrder, then alphabetically
  return Array.from(groups.entries()).sort((a, b) => {
    const idxA = categoryOrder.indexOf(a[0])
    const idxB = categoryOrder.indexOf(b[0])
    if (idxA !== -1 && idxB !== -1) return idxA - idxB
    if (idxA !== -1) return -1
    if (idxB !== -1) return 1
    return a[0].localeCompare(b[0])
  })
}


interface GeneratedListing {
  title: string
  description: string
  bulletPoints: string[]
  ingredientList: string[]
  complianceNotes: string[]
  warnings: string[]
  language: 'pt-BR' | 'es-MX'
}
export function HeroSection() {
  const t = useTranslations('hero')
  const tCommon = useTranslations('common')
  const tDemo = useTranslations('demo')
  const locale = useLocale()

  // ── 翻译与辅助组件（内部定义，避免硬编码中文）──
  const categoryLabels: Record<string, string> = {
    ingredient: t('categoryLabels.ingredient'),
    claim: t('categoryLabels.claim'),
    label: t('categoryLabels.label'),
    packaging: t('categoryLabels.packaging'),
  }

  function ConfidenceBadge({ confidence }: { confidence?: 'high' | 'medium' | 'low' }) {
    if (!confidence) return null
    const configs = {
      high: { label: t('confidenceBadge.high'), color: 'text-red-600', bg: 'bg-red-50', dot: '●' },
      medium: { label: t('confidenceBadge.medium'), color: 'text-amber-600', bg: 'bg-amber-50', dot: '◐' },
      low: { label: t('confidenceBadge.low'), color: 'text-gray-500', bg: 'bg-gray-50', dot: '○' },
    }
    const cfg = configs[confidence]
    return (
      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${cfg.bg} ${cfg.color}`}>
        <span>{cfg.dot}</span>
        {cfg.label}
      </span>
    )
  }

  function formatSourceFields(fields?: string[]): string {
    if (!fields || fields.length === 0) return ''
    const labelMap: Record<string, string> = {
      ingredients: t('sourceFields.ingredients'),
      description: t('sourceFields.description'),
      label: t('sourceFields.label'),
    }
    return ' · ' + fields.map(f => labelMap[f] || f).join(', ')
  }

  function extractSentence(text: string, matchedText: string): string {
    if (!text || !matchedText) return text
    const lowerText = text.toLowerCase()
    const lowerMatch = matchedText.toLowerCase()
    const idx = lowerText.indexOf(lowerMatch)
    if (idx === -1) return text

    const sentenceDelimiters = /[.!?\u3002\uff01\uff1f\u000a]/
    // 向前找句子开头
    let start = 0
    for (let i = idx - 1; i >= 0; i--) {
      if (sentenceDelimiters.test(text[i])) {
        start = i + 1
        break
      }
    }

    // 向后找句子结尾
    let end = text.length
    for (let i = idx + matchedText.length; i < text.length; i++) {
      if (sentenceDelimiters.test(text[i])) {
        end = i + 1
        break
      }
    }

    return text.substring(start, end).trim()
  }

  function SourceHighlight({ violation, ingredients, productBenefits, productName }: {
    violation: ViolationItem
    ingredients: string
    productBenefits: string
    productName: string
  }) {
    const fields = violation.allSourceFields?.length ? violation.allSourceFields : [violation.sourceField].filter(Boolean)
    if (!fields || fields.length === 0) return null

    const sourceMap: Record<string, string> = {
      ingredients,
      description: productBenefits,
      label: '',
    }

    return (
      <div className="mt-2 space-y-1">
        {fields.map(field => {
          const sourceText = sourceMap[field as string] || (field === 'description' ? productBenefits : '')
          if (!sourceText || !violation.matchedText) return null

          // 优先使用 API 返回的 contextSnippet，否则提取单句
          const displayText = violation.contextSnippet
            ? violation.contextSnippet.replace(/【(.+?)】/g, '$1')
            : extractSentence(sourceText, violation.matchedText)

          return (
            <div key={field} className="text-xs bg-gray-100 rounded p-2">
              <span className="font-medium text-gray-500 uppercase text-[10px]">
                {field === 'ingredients' ? t('sourceFields.ingredients') : field === 'description' ? t('sourceFields.description') : field === 'label' ? t('sourceFields.label') : field}
              </span>
              <p className="text-gray-700 mt-0.5">
                <HighlightText text={displayText} matchedText={violation.matchedText} />
              </p>
            </div>
          )
        })}
      </div>
    )
  }
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

  // Multi-step progress tracking (P2-16) — derived state, no setState in effect
  const currentStep = useMemo(() => {
    if (generatedListing || isGenerating) return 3
    if (checkResult || isChecking) return 2
    if (productName.trim() || ingredients.trim() || productBenefits.trim()) return 1
    return 0
  }, [generatedListing, isGenerating, checkResult, isChecking, productName, ingredients, productBenefits])
  const totalSteps = 3
  const stepLabels = [
    t('step1Label') || 'Input Product Info',
    t('step2Label') || 'AI Compliance Check', 
    t('step3Label') || 'Generate Listing'
  ]

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
  // Don't show demo if we're currently checking (isChecking)
  const resultToShow = !isChecking && showDemo && !checkResult ? demoResult : checkResult
  
  // Show loading state while checking
  const isShowingResult = isChecking || resultToShow

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
          productName,
          ingredients,
          description: productBenefits,
          country,
          locale,
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
      } else if (res.status === 403) {
        setGenerateError(data.message || t('errors.proRequired'))
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
    <div className="min-h-screen bg-[#0F1419] pt-20 md:pt-24">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F1419] via-[#0F1520] to-[#0F1419] text-white">
        {/* Gradient glow effects for visual guidance (P2-17) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(255,184,0,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(10,77,140,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[5%] w-[300px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(255,184,0,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        <div className="container-custom relative py-8 md:py-10">
          <div className="mx-auto max-w-full md:max-w-4xl text-center">
            {/* SocialProofBar — 已移除，待接入真实数据后恢复 */}
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              {t('title')} <span className="hidden md:block"> </span> {t('titleLine2')}
            </h1>

            {/* Logo 墙 — 弧形排列 + SVG 图标 */}
            <div className="mb-6">
              <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-3 font-medium">
                {t('trustedBy')}
              </p>
              <div 
                className="inline-flex flex-wrap justify-center items-end gap-2 sm:gap-3 rounded-xl border border-white/10 bg-[#1A1A24]/60 backdrop-blur-sm px-5 py-3"
                style={{ perspective: '600px' }}
              >
                {[
                  { name: 'Amazon', icon: ShoppingBag, rotate: -12 },
                  { name: 'Mercado Livre', icon: Store, rotate: -6 },
                  { name: 'Shopee', icon: Globe, rotate: -2 },
                  { name: 'TikTok Shop', icon: Smartphone, rotate: 2 },
                  { name: 'SHEIN', icon: Package, rotate: 6 },
                  { name: 'Magalu', icon: Truck, rotate: 12 },
                ].map(({ name, icon: Icon, rotate }) => (
                  <span
                    key={name}
                    className="inline-flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-[#9CA3AF] hover:text-white transition-all duration-300 cursor-default"
                    title={name}
                    style={{ transform: `rotate(${rotate}deg)`, transformOrigin: 'bottom center' }}
                  >
                    <Icon className="w-5 h-5 opacity-70" />
                    <span className="text-[10px] leading-tight">{name}</span>
                  </span>
                ))}
                <span className="text-xs text-[#6B7280] self-center ml-1">{t('andMorePlatforms')}</span>
              </div>
            </div>

            <p className="mx-auto mb-6 max-w-full md:max-w-2xl text-lg text-white/90 md:text-xl">
              {t('subtitleShort')}
            </p>

            {/* Multi-step Progress Bar (P2-16) */}
            <div className="mx-auto w-full max-w-full md:max-w-xl mb-6">
              <div className="flex items-center justify-between relative">
                {/* Background line */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2" />
                {/* Active line */}
                <div 
                  className="absolute top-1/2 left-0 h-0.5 bg-[#FFB800] -translate-y-1/2 transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                />
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                  <div key={step} className="relative z-10 flex flex-col items-center gap-1.5">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        step < currentStep 
                          ? 'bg-[#FFB800] text-[#0F1419]' 
                          : step === currentStep 
                            ? 'bg-[#FFB800] text-[#0F1419] ring-2 ring-[#FFB800]/40 shadow-lg shadow-amber-500/20'
                            : 'bg-[#1A1A24] text-white/40 border border-white/10'
                      }`}
                    >
                      {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                    </div>
                    <span className={`text-[10px] font-medium whitespace-nowrap ${
                      step <= currentStep ? 'text-white/80' : 'text-white/30'
                    }`}>
                      {stepLabels[step - 1]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Demo - 输入框容器加背景/边框增加呼吸空间 */}
            <div className="mx-auto w-full max-w-full md:max-w-xl rounded-2xl bg-white/5 backdrop-blur-xl border border-white/15 p-4 md:p-6 text-left shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="mb-4">
                <Label className="text-white/80 text-sm">{t('form.inputProductInfo')}</Label>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={() => { setCountry('BR'); setCheckResult(null); setShowDemo(true) }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                    country === 'BR'
                      ? 'bg-[#FFB800] text-[#0F1419] shadow-lg shadow-amber-500/20'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {t('brazilAnvisa')}
                </button>
                <button
                  onClick={() => { setCountry('MX'); setCheckResult(null); setShowDemo(true) }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                    country === 'MX'
                      ? 'bg-[#FFB800] text-[#0F1419] shadow-lg shadow-amber-500/20'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
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
                  className="w-full border-white/20 bg-white/10 text-white placeholder:text-[#6B7280] min-h-[60px] resize-none pr-10 text-base focus:border-[#FFB800]/40 focus:ring-2 focus:ring-[#FFB800]/30 focus:shadow-[0_0_12px_rgba(255,184,0,0.15)] transition-all"
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
                  className="w-full border-white/20 bg-white/10 text-white placeholder:text-[#6B7280] min-h-[80px] resize-none pr-10 text-base focus:border-[#FFB800]/40 focus:ring-2 focus:ring-[#FFB800]/30 focus:shadow-[0_0_12px_rgba(255,184,0,0.15)] transition-all"
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
                  className="w-full border-white/20 bg-white/10 text-white placeholder:text-[#6B7280] min-h-[60px] resize-none pr-10 text-base focus:border-[#FFB800]/40 focus:ring-2 focus:ring-[#FFB800]/30 focus:shadow-[0_0_12px_rgba(255,184,0,0.15)] transition-all"
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
                  className="w-full sm:flex-1 border-white/30 text-white hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-lg font-medium min-h-[48px] transition-all duration-200 active:translate-y-0"
                >
                  {isChecking ? t('checking') : t('checkFirst')}
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full sm:flex-1 bg-gradient-to-r from-[#FFB800] to-[#F59E0B] text-[#0F1419] hover:from-[#F59E0B] hover:to-[#D97706] font-bold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 min-h-[48px]"
                >
                  {isGenerating ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> AI 正在生成...</> : <><Zap className="w-4 h-4 mr-1" /> {t('freeGenerateListing')}</>}
                </Button>
              </div>

              {/* 信任密度 */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#9CA3AF]">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#00A86B]" /> SSL 加密传输
                </span>
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-[#FFB800]" /> 无需信用卡
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#0A4D8C]" /> 1,200+ 跨境卖家已使用
                </span>
              </div>
            </div>

            {/* Check Results - Show loading state when checking, otherwise show result */}
            {isChecking && (
              <div className="mx-auto max-w-full md:max-w-xl mt-6 rounded-2xl bg-white p-4 md:p-6 text-left text-gray-900">
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-500">{t('checking')}...</span>
                </div>
              </div>
            )}
            
            {resultToShow && !isChecking && (
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
                    {groupByCategory(resultToShow.violations).map(([category, items]) => (
                      <div key={category} className="space-y-2">
                        <h5 className="text-xs font-medium text-red-500/70 uppercase tracking-wide">{categoryLabels[category] || category}</h5>
                        {items.map((v, i) => (
                          <div key={i} className="bg-red-50 rounded-lg p-3 text-sm">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-red-700 flex-1">{v.message}</p>
                              <div className="shrink-0 flex items-center gap-1">
                                <ConfidenceBadge confidence={v.confidence} />
                                {v.matchedText && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700 border border-red-200">
                                    {v.matchedText}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-red-600/80 mt-1">{t('suggestion')}: {v.suggestion}</p>
                            {(v.sourceField || (v.allSourceFields && v.allSourceFields.length > 0)) && (
                              <p className="text-red-500/60 text-xs mt-1">
                                {t('sourceFieldLabel')}{formatSourceFields(v.allSourceFields || [v.sourceField!])}
                              </p>
                            )}
                            <SourceHighlight violation={v} ingredients={ingredients} productBenefits={productBenefits} productName={productName} />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {resultToShow.warnings.length > 0 && (
                  <div className="space-y-3 mb-4">
                    <h4 className="text-sm font-semibold text-amber-600 flex items-center"><AlertTriangle className="w-4 h-4 mr-1" /> {t('warningIssues')}</h4>
                    {groupByCategory(resultToShow.warnings).map(([category, items]) => (
                      <div key={category} className="space-y-2">
                        <h5 className="text-xs font-medium text-amber-500/70 uppercase tracking-wide">{categoryLabels[category] || category}</h5>
                        {items.map((v, i) => (
                          <div key={i} className="bg-amber-50 rounded-lg p-3 text-sm">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-amber-700 flex-1">{v.message}</p>
                              <div className="shrink-0 flex items-center gap-1">
                                <ConfidenceBadge confidence={v.confidence} />
                                {v.matchedText && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700 border border-amber-200">
                                    {v.matchedText}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-amber-600/80 mt-1">{t('suggestion')}: {v.suggestion}</p>
                            {(v.sourceField || (v.allSourceFields && v.allSourceFields.length > 0)) && (
                              <p className="text-amber-500/60 text-xs mt-1">
                                {t('sourceFieldLabel')}{formatSourceFields(v.allSourceFields || [v.sourceField!])}
                              </p>
                            )}
                            <SourceHighlight violation={v} ingredients={ingredients} productBenefits={productBenefits} productName={productName} />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {resultToShow.info.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-blue-600 flex items-center"><Info className="w-4 h-4 mr-1" /> {t('info')}</h4>
                    {groupByCategory(resultToShow.info).map(([category, items]) => (
                      <div key={category} className="space-y-2">
                        <h5 className="text-xs font-medium text-blue-500/70 uppercase tracking-wide">{categoryLabels[category] || category}</h5>
                        {items.map((v, i) => (
                          <div key={i} className="bg-blue-50 rounded-lg p-3 text-sm">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-blue-700 flex-1">{v.message}</p>
                              <div className="shrink-0 flex items-center gap-1">
                                <ConfidenceBadge confidence={v.confidence} />
                                {v.matchedText && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                    {v.matchedText}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-blue-600/80 mt-1">{t('suggestion')}: {v.suggestion}</p>
                            {(v.sourceField || (v.allSourceFields && v.allSourceFields.length > 0)) && (
                              <p className="text-blue-500/60 text-xs mt-1">
                                {t('sourceFieldLabel')}{formatSourceFields(v.allSourceFields || [v.sourceField!])}
                              </p>
                            )}
                            <SourceHighlight violation={v} ingredients={ingredients} productBenefits={productBenefits} productName={productName} />
                          </div>
                        ))}
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const fullText = [
                          generatedListing.title,
                          '',
                          generatedListing.description,
                          '',
                          ...generatedListing.bulletPoints.map((bp, i) => `${i + 1}. ${bp}`),
                          '',
                          generatedListing.ingredientList.length > 0 ? 'Ingredientes:' : '',
                          ...generatedListing.ingredientList,
                          '',
                          generatedListing.complianceNotes.length > 0 ? 'Observações de conformidade:' : '',
                          ...generatedListing.complianceNotes,
                          '',
                          generatedListing.warnings.length > 0 ? 'Avisos:' : '',
                          ...generatedListing.warnings,
                        ].filter(Boolean).join('\n')
                        copyToClipboard(fullText)
                      }}
                      className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#0A4D8C]/10 text-[#0A4D8C] hover:bg-[#0A4D8C]/20 transition-colors"
                    >
                      {t('copyAllListing') || t('copyAll')}
                    </button>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#0A4D8C]/10 text-[#0A4D8C]">
                      {generatedListing.language === 'pt-BR' ? `🇧🇷 ${t('ptBr')}` : `🇲🇽 ${t('esMx')}`}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs font-semibold text-gray-500">{t('productName')}</Label>
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

                {/* Ingredient List (honest, code-generated) */}
                {generatedListing.ingredientList.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs font-semibold text-gray-500">{tDemo('ingredients')}</Label>
                      <button
                        onClick={() => copyToClipboard(generatedListing.ingredientList.join('\n'))}
                        className="text-xs text-[#0A4D8C] hover:underline"
                      >
                        {t('copyAll')}
                      </button>
                    </div>
                    <ul className="space-y-1">
                      {generatedListing.ingredientList.map((ing, i) => {
                        const isProhibited = ing.includes('🔴 PROIBIDO')
                        const isRestricted = ing.includes('⚠️ RESTRITO')
                        return (
                          <li
                            key={i}
                            className={`text-sm rounded-lg p-2 ${
                              isProhibited
                                ? 'bg-red-50 text-red-700'
                                : isRestricted
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-gray-50 text-gray-700'
                            }`}
                          >
                            {ing}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}

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