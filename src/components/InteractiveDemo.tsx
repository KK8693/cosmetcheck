'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Card, CardContent } from './ui/card'

const DEMO_INGREDIENTS = 'Aqua, Glycerin, Niacinamide, Hydroquinone, Parfum'

type Step = 'idle' | 'scanning' | 'violation' | 'fixed'

export function InteractiveDemo() {
  const t = useTranslations('interactiveDemo')
  const tCommon = useTranslations('common')
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
            {t('title')}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Input Area */}
          <Card className="border-2 border-[#00A86B]/30 bg-[#252530] shadow-lg shadow-[#00A86B]/10 hover:border-[#00A86B]/60 transition-all duration-500">
            <CardContent className="p-6">
              <Label className="text-sm font-semibold text-white mb-3 block">
                {t('inputLabel')}
              </Label>
              <textarea
                defaultValue={DEMO_INGREDIENTS}
                className="w-full h-24 px-4 py-3 rounded-lg border border-gray-700 text-sm font-mono bg-[#1E1E28] text-white mb-4 resize-none placeholder:text-gray-500"
                placeholder={t('inputPlaceholder')}
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
                  🇧🇷 {t('brazilAnvisa')}
                </button>
                <button
                  onClick={() => setCountry('MX')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    country === 'MX'
                      ? 'bg-[#0A4D8C] text-white'
                      : 'bg-[#1E1E28] text-gray-300 hover:bg-[#252530]'
                  }`}
                >
                  🇲🇽 {t('mexicoCofepris')}
                </button>
              </div>

              {step === 'idle' ? (
                <Button
                  onClick={runDemo}
                  className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-bold py-3"
                >
                  ▶️ {t('runDemo')}
                </Button>
              ) : (
                <Button
                  onClick={resetDemo}
                  variant="outline"
                  className="w-full font-semibold border-[#0A4D8C] text-white hover:bg-[#0A4D8C]/20"
                >
                  🔄 {t('resetDemo')}
                </Button>
              )}

              <p className="text-xs text-gray-500 mt-3 text-center">
                {t('demoHint')}
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
                  <p className="text-lg">{t('idleMessage')}</p>
                </div>
              )}

              {step === 'scanning' && (
                <div className="space-y-2">
                  <p className="text-gray-400">$ cosmetcheck scan --country={country}</p>
                  <p className="text-[#00A86B] animate-pulse">{t('scanningMessage')}</p>
                  <p className="text-gray-500">{t('analyzingMessage')}</p>
                </div>
              )}

              {step === 'violation' && (
                <div className="space-y-3">
                  <p className="text-gray-400">$ cosmetcheck scan --country={country}</p>
                  <p className="text-[#00A86B]">{t('scanComplete')}</p>
                  <hr className="border-gray-700" />
                  <p className="text-red-400 font-bold">{t('violationDetected')}</p>
                  <div className="bg-red-900/20 rounded-lg p-3 border border-red-800/50">
                    <p className="text-red-400">
                      <span className="line-through">Hydroquinone</span> 
                      <span className="text-red-400 ml-2">{t('bannedIngredient')}</span>
                    </p>
                    <p className="text-red-400/70 text-xs mt-2">
                      {t('regulationInfo', { 
                        country: country === 'BR' ? 'ANVISA' : 'COFEPRIS',
                        regulation: country === 'BR' ? 'RDC 529/2021' : 'NOM-141'
                      })}
                    </p>
                  </div>
                </div>
              )}

              {step === 'fixed' && (
                <div className="space-y-3">
                  <p className="text-gray-400">$ cosmetcheck scan --country={country}</p>
                  <p className="text-[#00A86B]">{t('scanComplete')}</p>
                  <hr className="border-gray-700" />
                  <p className="text-yellow-400">{t('autoReplaced')}</p>
                  <div className="bg-yellow-900/20 rounded-lg p-3 border border-yellow-800/50 mb-3">
                    <p className="text-yellow-400">
                      <span className="line-through">Hydroquinone</span> 
                      <span className="text-[#00A86B] ml-2">{t('replacedWith')}</span>
                    </p>
                  </div>
                  <p className="text-[#00A86B] font-bold">{t('aiGeneratedListing')}</p>
                  <div className="bg-[#00A86B]/10 rounded-lg p-3 border border-[#00A86B]/30">
                    <p className="text-white font-semibold">
                      {country === 'BR' ? t('brProductName') : t('mxProductName')}
                    </p>
                    <p className="text-[#00A86B] text-xs mt-1">
                      {t('complianceConfirmed', { country: country === 'BR' ? 'ANVISA' : 'COFEPRIS' })}
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