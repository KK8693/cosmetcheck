'use client'

import { useState, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  FileUp, 
  ClipboardPaste, 
  Play, 
  RotateCcw, 
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react'

interface BatchItem {
  productId: string
  text: string
  country: 'BR' | 'MX'
}

interface BatchResult {
  index: number
  productId: string
  isCompliant: boolean
  violations: Array<{
    category: string
    severity: string
    message: string
    suggestion?: string
  }>
  summary: {
    totalIssues: number
    criticalCount: number
    warningCount: number
    infoCount: number
  }
}

interface TaskStats {
  taskId: string
  totalCount: number
  completedCount: number
  passedCount: number
  failedCount: number
  criticalCount: number
  warningCount: number
  infoCount: number
  status: string
  results: BatchResult[]
}

export function BatchContent() {
  const t = useTranslations('batch')
  const tCommon = useTranslations('common')
  const router = useRouter()
  
  const [inputMode, setInputMode] = useState<'text' | 'csv'>('text')
  const [inputText, setInputText] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<'BR' | 'MX' | 'BOTH'>('BR')
  const [isDetecting, setIsDetecting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stats, setStats] = useState<TaskStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'compliant' | 'nonCompliant'>('all')
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseInput = useCallback((): BatchItem[] => {
    const lines = inputText.trim().split('\n').filter(line => line.trim())
    const items: BatchItem[] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const parts = line.split('|').map(p => p.trim())
      
      if (parts.length >= 2) {
        const productId = parts[0] || `P${i + 1}`
        const text = parts[1]
        const country = (parts[2]?.toUpperCase() as 'BR' | 'MX') || (selectedCountry === 'BOTH' ? 'BR' : selectedCountry)
        
        if (selectedCountry === 'BOTH') {
          items.push({ productId, text, country: 'BR' })
          items.push({ productId: `${productId}-MX`, text, country: 'MX' })
        } else {
          items.push({ productId, text, country: selectedCountry })
        }
      } else if (line.trim()) {
        // Single column - treat entire line as text
        const country = selectedCountry === 'BOTH' ? 'BR' : selectedCountry
        if (selectedCountry === 'BOTH') {
          items.push({ productId: `P${i + 1}`, text: line, country: 'BR' })
          items.push({ productId: `P${i + 1}-MX`, text: line, country: 'MX' })
        } else {
          items.push({ productId: `P${i + 1}`, text: line, country })
        }
      }
    }
    
    return items
  }, [inputText, selectedCountry])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setInputText(text)
    }
    reader.readAsText(file)
  }

  const startDetection = async () => {
    const items = parseInput()
    
    if (items.length === 0) {
      setError(t('noResults'))
      return
    }
    
    if (items.length > 100) {
      setError('Maximum 100 items per batch')
      return
    }
    
    setIsDetecting(true)
    setProgress(0)
    setError(null)
    setStats(null)
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90))
      }, 200)
      
      const response = await fetch('/api/batch/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      })
      
      clearInterval(progressInterval)
      
      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 403) {
          // Pro required
          setError(errorData.message || t('proRequiredMessage'))
          return
        }
        throw new Error(errorData.error || 'Detection failed')
      }
      
      const data = await response.json()
      setProgress(100)
      
      if (data.success) {
        setStats(data.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsDetecting(false)
    }
  }

  const handleExport = async () => {
    if (!stats) return
    
    try {
      const response = await fetch(`/api/batch/export/${stats.taskId}`, {
        method: 'GET',
      })
      
      if (!response.ok) {
        throw new Error('Export failed')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `batch-results-${stats.taskId}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed')
    }
  }

  const toggleRow = (index: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const clearResults = () => {
    setStats(null)
    setProgress(0)
    setError(null)
    setExpandedRows(new Set())
  }

  const filteredResults = stats?.results.filter(result => {
    if (filter === 'compliant') return result.isCompliant
    if (filter === 'nonCompliant') return !result.isCompliant
    return true
  }) || []

  return (
    <div className="min-h-screen bg-[#0D0D12] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {t('title')}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-800/50 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-300 text-sm">{error}</p>
              {error.includes('Pro') && (
                <Button 
                  onClick={() => router.push('/pricing')}
                  className="mt-2 bg-[#fbbf24] text-black hover:bg-[#f59e0b] font-semibold"
                  size="sm"
                >
                  {t('upgrade')}
                </Button>
              )}
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Input Section */}
        {!stats && (
          <Card className="border border-white/10 bg-[#1A1A24] mb-6">
            <CardContent className="p-6">
              {/* Input Mode Tabs */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setInputMode('text')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    inputMode === 'text' 
                      ? 'bg-[#fbbf24] text-black' 
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <ClipboardPaste className="w-4 h-4" />
                  {t('inputTab')}
                </button>
                <button
                  onClick={() => setInputMode('csv')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    inputMode === 'csv' 
                      ? 'bg-[#fbbf24] text-black' 
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <FileUp className="w-4 h-4" />
                  {t('csvTab')}
                </button>
              </div>

              {/* Input Area */}
              {inputMode === 'text' ? (
                <div className="mb-4">
                  <Label className="text-sm font-semibold text-white mb-2 block">
                    {t('inputTab')}
                  </Label>
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={t('inputPlaceholder')}
                    className="w-full h-48 bg-[#0D0D12] border-gray-700 text-white placeholder:text-gray-500 font-mono text-sm resize-none"
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <Label className="text-sm font-semibold text-white mb-2 block">
                    {t('csvTab')}
                  </Label>
                  <div 
                    className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-gray-500 transition-colors bg-[#0D0D12]"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileUp className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">{t('csvPlaceholder')}</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                  {inputText && (
                    <div className="mt-3">
                      <Textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={t('csvPlaceholder')}
                        className="w-full h-32 bg-[#0D0D12] border-gray-700 text-white placeholder:text-gray-500 font-mono text-sm resize-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Country Selection */}
              <div className="mb-4">
                <Label className="text-sm font-semibold text-white mb-2 block">
                  {t('selectCountry')}
                </Label>
                <div className="flex gap-2">
                  {(['BR', 'MX', 'BOTH'] as const).map((country) => (
                    <button
                      key={country}
                      onClick={() => setSelectedCountry(country)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCountry === country
                          ? 'bg-[#00A86B] text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {country === 'BR' && t('brazil')}
                      {country === 'MX' && t('mexico')}
                      {country === 'BOTH' && t('both')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <Button
                onClick={startDetection}
                disabled={isDetecting || !inputText.trim()}
                className="w-full bg-[#fbbf24] text-black hover:bg-[#f59e0b] font-semibold h-12"
              >
                {isDetecting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t('detecting')}
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    {t('startDetection')}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Progress Bar */}
        {isDetecting && (
          <Card className="border border-white/10 bg-[#1A1A24] mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{t('detecting')}</span>
                <span className="text-sm text-gray-400">{progress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div 
                  className="bg-[#fbbf24] h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {stats && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border border-white/10 bg-[#1A1A24]">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-white">{stats.totalCount}</p>
                  <p className="text-sm text-gray-400">{t('completed')}</p>
                </CardContent>
              </Card>
              <Card className="border border-white/10 bg-[#1A1A24]">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-green-400">{stats.passedCount}</p>
                  <p className="text-sm text-gray-400">{t('passed')}</p>
                </CardContent>
              </Card>
              <Card className="border border-white/10 bg-[#1A1A24]">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-red-400">{stats.failedCount}</p>
                  <p className="text-sm text-gray-400">{t('failed')}</p>
                </CardContent>
              </Card>
              <Card className="border border-white/10 bg-[#1A1A24]">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-400">{stats.criticalCount}</p>
                  <p className="text-sm text-gray-400">{t('critical')}</p>
                </CardContent>
              </Card>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2">
                {(['all', 'compliant', 'nonCompliant'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === f
                        ? 'bg-[#fbbf24] text-black'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {f === 'all' && t('all')}
                    {f === 'compliant' && t('compliant')}
                    {f === 'nonCompliant' && t('nonCompliant')}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('export')}
                </Button>
                <Button
                  onClick={clearResults}
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t('clearResults')}
                </Button>
              </div>
            </div>

            {/* Results Table */}
            <Card className="border border-white/10 bg-[#1A1A24] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#0D0D12]">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">{t('productId')}</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">{t('status')}</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">{t('violations')}</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300 w-24"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((result) => (
                      <>
                        <tr 
                          key={result.index}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-white">
                            {result.productId || `P${result.index + 1}`}
                          </td>
                          <td className="px-4 py-3">
                            {result.isCompliant ? (
                              <span className="inline-flex items-center gap-1 text-green-400 text-sm">
                                <CheckCircle className="w-4 h-4" />
                                {t('compliant')}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-400 text-sm">
                                <XCircle className="w-4 h-4" />
                                {t('nonCompliant')}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              {result.summary.criticalCount > 0 && (
                                <span className="px-2 py-0.5 rounded text-xs bg-red-900/30 text-red-400 border border-red-800/30">
                                  {result.summary.criticalCount} {t('critical')}
                                </span>
                              )}
                              {result.summary.warningCount > 0 && (
                                <span className="px-2 py-0.5 rounded text-xs bg-yellow-900/30 text-yellow-400 border border-yellow-800/30">
                                  {result.summary.warningCount} {t('warning')}
                                </span>
                              )}
                              {result.summary.infoCount > 0 && (
                                <span className="px-2 py-0.5 rounded text-xs bg-blue-900/30 text-blue-400 border border-blue-800/30">
                                  {result.summary.infoCount} {t('info')}
                                </span>
                              )}
                              {result.summary.totalIssues === 0 && (
                                <span className="text-sm text-green-400">-</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleRow(result.index)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              {expandedRows.has(result.index) ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>
                          </td>
                        </tr>
                        {expandedRows.has(result.index) && (
                          <tr className="bg-[#0D0D12]">
                            <td colSpan={4} className="px-4 py-4">
                              <div className="space-y-3">
                                {result.violations.map((violation, vIdx) => (
                                  <div 
                                    key={vIdx}
                                    className={`p-3 rounded-lg border ${
                                      violation.severity === 'critical' 
                                        ? 'border-red-800/30 bg-red-900/10' 
                                        : violation.severity === 'warning'
                                        ? 'border-yellow-800/30 bg-yellow-900/10'
                                        : 'border-blue-800/30 bg-blue-900/10'
                                    }`}
                                  >
                                    <div className="flex items-start gap-2">
                                      {violation.severity === 'critical' && <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                                      {violation.severity === 'warning' && <Info className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />}
                                      {violation.severity === 'info' && <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />}
                                      <div>
                                        <p className="text-sm text-white font-medium">{violation.message}</p>
                                        {violation.suggestion && (
                                          <p className="text-sm text-gray-400 mt-1">{violation.suggestion}</p>
                                        )}
                                        <p className="text-xs text-gray-500 mt-1 capitalize">{violation.category}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {result.violations.length === 0 && (
                                  <p className="text-sm text-green-400">{tCommon('noIssuesFound')}</p>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredResults.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {t('noResults')}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}