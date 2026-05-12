'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SubscribeButton from '@/components/SubscribeButton'
import { Link } from '@/i18n/routing'
import { useTranslations, useLocale } from 'next-intl'
import { AlertTriangle, PiggyBank, Clock, TrendingUp } from 'lucide-react'

export function PricingSection() {
  const t = useTranslations('pricing')
  const locale = useLocale()

  const freeFeatures = t.raw('free.features') as Array<{ text: string; active: boolean }>
  const proFeatures = t.raw('pro.features') as Array<{ text: string; active: boolean }>

  // Months of Pro subscription equivalent to one ANVISA fine, locale-aware
  const monthsByLocale: Record<string, string> = {
    'en': '58',
    'zh': '58',
    'pt-BR': '56',
    'es-MX': '56',
  }
  const months = monthsByLocale[locale] || '58'

  const stats = [
    {
      num: t('stats.savedFine.num'),
      label: t('stats.savedFine.label'),
      desc: t('stats.savedFine.desc'),
      icon: PiggyBank,
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
    {
      num: t('stats.savedTime.num'),
      label: t('stats.savedTime.label'),
      desc: t('stats.savedTime.desc'),
      icon: Clock,
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
    },
    {
      num: t('stats.approvalRate.num'),
      label: t('stats.approvalRate.label'),
      desc: t('stats.approvalRate.desc'),
      icon: TrendingUp,
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
    },
  ]

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-[#0A4D8C] via-[#0a5d8c] to-[#00A86B]">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-semibold text-white mb-4">
            {t('valueFirst')}
          </div>
          <h2 className="text-3xl font-bold text-white md:text-4xl mb-4">
            {t('subtitle')}
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {t('subtitleDesc')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="border-2 border-[#252530] bg-[#1A1A24]">
            <CardContent className="p-8">
              <div className="inline-block rounded-full bg-[#252530] px-3 py-1 text-xs font-bold text-gray-300 mb-4">
                {t('free.badge')}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{t('free.name')}</h3>
              <div className="flex items-baseline mb-2">
                <span className="text-3xl md:text-4xl font-extrabold text-white">{t('free.price')}</span>
                <span className="text-gray-400 ml-2">{t('free.period')}</span>
              </div>
              <p className="text-sm text-gray-400 mb-6">{t('free.desc')}</p>
              <ul className="space-y-3 mb-8">
                {freeFeatures.map((item, idx) => (
                  <li key={idx} className={`flex items-center ${item.active ? 'text-gray-300' : 'text-gray-600'}`}>
                    {item.active ? (
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={item.active ? '' : 'line-through'}>{item.text}</span>
                  </li>
                ))}
              </ul>
              <Link href="/pricing">
                <Button variant="outline" className="w-full font-semibold text-[#0A4D8C] border-[#0A4D8C]/30 hover:bg-[#0A4D8C]/5">
                  {t('free.cta')}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-[#00A86B]/50 relative overflow-hidden bg-[#1A1A24]">
            {/* Recommended badge */}
            <div className="absolute -top-px -right-14">
              <div className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 text-sm font-bold px-10 py-2 rotate-45 shadow-lg">
                {t('pro.recommend')}
              </div>
            </div>
            {/* Urgency pulse bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-red-500 to-red-400 animate-pulse" />
            <CardContent className="p-8">
              <div className="inline-block rounded-full bg-red-900/30 px-3 py-1 text-xs font-bold text-red-400 mb-4 animate-pulse">
                {t('pro.badge')}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{t('pro.name')}</h3>
              <div className="flex items-baseline mb-2">
                <span className="text-lg text-gray-500 line-through mr-2">{t('pro.priceOriginal')}</span>
                <span className="text-4xl md:text-5xl font-extrabold text-white">{t('pro.price')}</span>
                <span className="text-gray-400 ml-2">{t('pro.period')}</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">{t('pro.desc')}</p>
              <p className="text-xs text-gray-500 mb-4">{t('pro.taxNote')}</p>
              <div className="mb-6 rounded-lg bg-red-900/20 border border-red-800/30 p-3">
                <p className="text-red-400 text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {t('pro.warning', { months })}
                </p>
              </div>
              <ul className="space-y-3 mb-8">
                {proFeatures.map((item, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item.text}
                  </li>
                ))}
              </ul>
              <SubscribeButton
                className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-bold shadow-lg shadow-amber-500/25"
              >
                {t('pro.cta')}
              </SubscribeButton>
            </CardContent>
          </Card>
        </div>

        {/* Stats row */}
        <div className="mt-12 md:mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#1A1A24]/80 backdrop-blur-sm rounded-2xl border border-[#252530] p-6 text-center hover:border-[#00A86B]/30 transition-colors"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${item.iconBg} mb-4`}>
                <item.icon className={`w-6 h-6 ${item.iconColor}`} />
              </div>
              <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">{item.num}</p>
              <p className="font-semibold text-white/90 mb-1">{item.label}</p>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
