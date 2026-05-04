'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Card, CardContent } from './ui/card'

const DEMO_INGREDIENTS = 'Aqua, Glycerin, Niacinamide, Hydroquinone, Parfum'

type Step = 'idle' | 'scanning' | 'violation' | 'fixed'

export function InteractiveDemo() {
  const [step, setStep] = useState<Step>('idle')
  const [country, setCountry] = useState<'BR' | 'MX'>('BR')

  const runDemo = () => {
    setStep('scanning')
    
    // Step 1: Scanning (1.5s)
    setTimeout(() => {
      setStep('violation')
      
      // Step 2: Show violation (1.5s)
      setTimeout(() => {
        setStep('fixed')
      }, 1500)
    }, 1500)
  }

  const resetDemo = () => {
    setStep('idle')
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">
            30 秒看懂：你的产品会不会被下架
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            输入一个真实成分，看 AI 如何 3 步拦截风险 → 生成合规 Listing
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Input Area */}
          <Card className="border-2 border-gray-100">
            <CardContent className="p-6">
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                输入产品成分
              </Label>
              <textarea
                defaultValue={DEMO_INGREDIENTS}
                className="w-full h-24 px-4 py-3 rounded-lg border border-gray-200 text-sm font-mono bg-gray-50 mb-4 resize-none"
                placeholder="输入成分，用逗号分隔"
                readOnly
              />
              
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setCountry('BR')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    country === 'BR'
                      ? 'bg-[#7c3aed] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  🇧🇷 巴西 ANVISA
                </button>
                <button
                  onClick={() => setCountry('MX')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    country === 'MX'
                      ? 'bg-[#7c3aed] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                  className="w-full font-semibold"
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
          <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
            {/* Mac window header */}
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-gray-500">CosmetCheck Demo</span>
            </div>
            
            {/* Result content */}
            <div className="p-6 font-mono text-sm min-h-[280px]">
              {step === 'idle' && (
                <div className="text-gray-400 text-center py-12">
                  <p className="text-4xl mb-4">🔍</p>
                  <p>点击左侧按钮开始演示</p>
                </div>
              )}

              {step === 'scanning' && (
                <div className="space-y-2">
                  <p className="text-gray-600">$ cosmetcheck scan --country={country}</p>
                  <p className="text-blue-600 animate-pulse">▋ 扫描成分中...</p>
                  <p className="text-gray-500">分析 5 种成分...</p>
                </div>
              )}

              {step === 'violation' && (
                <div className="space-y-3">
                  <p className="text-gray-600">$ cosmetcheck scan --country={country}</p>
                  <p className="text-green-600">✓ 扫描完成</p>
                  <hr className="border-gray-200" />
                  <p className="text-red-600 font-bold">❌ 检测到违规成分</p>
                  <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                    <p className="text-red-700">
                      <span className="line-through">Hydroquinone</span> 
                      <span className="text-red-500 ml-2">⚠️ 禁用成分</span>
                    </p>
                    <p className="text-red-600 text-xs mt-2">
                      法规：ANVISA RDC 15/2013 禁止 Hydroquinone 用于美白产品
                    </p>
                  </div>
                </div>
              )}

              {step === 'fixed' && (
                <div className="space-y-3">
                  <p className="text-gray-600">$ cosmetcheck scan --country={country}</p>
                  <p className="text-green-600">✓ 扫描完成</p>
                  <hr className="border-gray-200" />
                  <p className="text-red-600">❌ 检测到违规成分 → 自动替换</p>
                  <div className="bg-red-50 rounded-lg p-3 border border-red-200 mb-3">
                    <p className="text-red-700">
                      <span className="line-through">Hydroquinone</span> 
                      <span className="text-green-600 ml-2">✓ 已替换为 Alpha Arbutin</span>
                    </p>
                  </div>
                  <p className="text-green-600 font-bold">✓ AI 生成合规 Listing</p>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <p className="text-gray-900 font-semibold">
                      Sérum Clareador com Alpha Arbutin - 30ml
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      ⚠️ 此产品符合 ANVISA 法规要求
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