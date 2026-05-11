'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Card, CardContent } from './ui/card'

const DEMO_INGREDIENTS = 'Aqua, Glycerin, Niacinamide, Hydroquinone, Parfum'

type Step = 'idle' | 'scanning' | 'violation' | 'fixed'

export function InteractiveDemo() {
  const [step, setStep] = useState<Step>('idle')
  const [country, setCountry] = useState<'BR' | 'MX'>('BR')
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }

  const runDemo = () => {
    clearAllTimeouts()
    setStep('scanning')
    
    const t1 = setTimeout(() => {
      setStep('violation')
      
      const t2 = setTimeout(() => {
        setStep('fixed')
      }, 1500)
      timeoutsRef.current.push(t2)
    }, 1500)
    timeoutsRef.current.push(t1)
  }

  const resetDemo = () => {
    clearAllTimeouts()
    setStep('idle')
  }

  useEffect(() => {
    return () => clearAllTimeouts()
  }, [])

  return (
    <section className="py-20 bg-[#1A1A24]">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white md:text-4xl mb-4">
            30 秒看懂：你的产品会不会被下架
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            输入一个真实成分，看 AI 如何 3 步拦截风险 → 生成合规 Listing
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Input Area */}
          <Card className="border-2 border-[#00A86B]/30 bg-[#252530] shadow-lg shadow-[#00A86B]/10 hover:border-[#00A86B]/60 transition-all duration-500">
            <CardContent className="p-6">
              <Label className="text-sm font-semibold text-white mb-3 block">
                输入产品成分
              </Label>
              <textarea
                defaultValue={DEMO_INGREDIENTS}
                className="w-full h-24 px-4 py-3 rounded-lg border border-gray-700 text-sm font-mono bg-[#1E1E28] text-white mb-4 resize-none placeholder:text-gray-500"
                placeholder="输入成分，用逗号分隔"
                readOnly
              />
              
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setCountry('BR')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    country === 'BR'
                      ? 'bg-[#0A4D8C] text-white'
                      : 'bg-[#1E1E28] text-gray-300 hover:bg-[#252530]'
                  }`}
                >
                  🇧🇷 巴西 ANVISA
                </button>
                <button
                  onClick={() => setCountry('MX')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    country === 'MX'
                      ? 'bg-[#0A4D8C] text-white'
                      : 'bg-[#1E1E28] text-gray-300 hover:bg-[#252530]'
                  }`}
                >
                  🇲🇽 墨西哥 COFEPRIS
                </button>
              </div>

              {step === 'idle' ? (
                <Button
                  onClick={runDemo}
                  className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-bold py-3"
                >
                  ▶️ 运行检测演示
                </Button>
              ) : (
                <Button
                  onClick={resetDemo}
                  variant="outline"
                  className="w-full font-semibold border-[#0A4D8C] text-white hover:bg-[#0A4D8C]/20"
                >
                  🔄 重新演示
                </Button>
              )}

              <p className="text-xs text-gray-500 mt-3 text-center">
                👆 点击按钮，模拟真实检测流程（无需注册，不消耗次数）
              </p>
            </CardContent>
          </Card>

          {/* Right: Result Preview (Mac window style) */}
          <div className="rounded-2xl border-2 border-[#00A86B]/30 bg-[#1E1E28] shadow-xl shadow-[#00A86B]/10 hover:border-[#00A86B]/60 transition-all duration-500 overflow-hidden">
            {/* Mac window header */}
            <div className="bg-[#252530] px-4 py-3 flex items-center gap-2 border-b border-gray-700">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-gray-500">CosmetCheck Demo</span>
            </div>
            
            {/* Result content */}
            <div className="p-6 font-mono text-sm min-h-[280px]">
              {step === 'idle' && (
                <div className="text-gray-400 text-center py-12">
                  <p className="text-lg">点击左侧按钮开始演示</p>
                </div>
              )}

              {step === 'scanning' && (
                <div className="space-y-2">
                  <p className="text-gray-400">$ cosmetcheck scan --country={country}</p>
                  <p className="text-[#00A86B] animate-pulse">▋ 扫描成分中...</p>
                  <p className="text-gray-500">分析 5 种成分...</p>
                </div>
              )}

              {step === 'violation' && (
                <div className="space-y-3">
                  <p className="text-gray-400">$ cosmetcheck scan --country={country}</p>
                  <p className="text-[#00A86B]">✓ 扫描完成</p>
                  <hr className="border-gray-700" />
                  <p className="text-red-400 font-bold">❌ 检测到违规成分</p>
                  <div className="bg-red-900/20 rounded-lg p-3 border border-red-800/50">
                    <p className="text-red-400">
                      <span className="line-through">Hydroquinone</span> 
                      <span className="text-red-400 ml-2">⚠️ 禁用成分</span>
                    </p>
                    <p className="text-red-400/70 text-xs mt-2">
                      法规：{country === 'BR' ? 'ANVISA RDC 529/2021 禁止 Hydroquinone 用于美白产品' : 'COFEPRIS NOM-141 禁用 Hydroquinone 用于普通化妆品'}
                    </p>
                  </div>
                </div>
              )}

              {step === 'fixed' && (
                <div className="space-y-3">
                  <p className="text-gray-400">$ cosmetcheck scan --country={country}</p>
                  <p className="text-[#00A86B]">✓ 扫描完成</p>
                  <hr className="border-gray-700" />
                  <p className="text-yellow-400">❌ 检测到违规成分 → 自动替换</p>
                  <div className="bg-yellow-900/20 rounded-lg p-3 border border-yellow-800/50 mb-3">
                    <p className="text-yellow-400">
                      <span className="line-through">Hydroquinone</span> 
                      <span className="text-[#00A86B] ml-2">✓ 已替换为 Alpha Arbutin</span>
                    </p>
                  </div>
                  <p className="text-[#00A86B] font-bold">✓ AI 生成合规 Listing</p>
                  <div className="bg-[#00A86B]/10 rounded-lg p-3 border border-[#00A86B]/30">
                    <p className="text-white font-semibold">
                      {country === 'BR' ? 'Sérum Clareador com Alpha Arbutin - 30ml' : 'Suero Clarificante con Alpha Arbutin - 30ml'}
                    </p>
                    <p className="text-[#00A86B] text-xs mt-1">
                      ⚠️ 此产品符合 {country === 'BR' ? 'ANVISA' : 'COFEPRIS'} 法规要求
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}