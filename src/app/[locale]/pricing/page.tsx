'use client'

export const runtime = 'edge'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, X, AlertTriangle } from 'lucide-react'
import SubscribeButton from '@/components/SubscribeButton'
import { Link } from '@/i18n/routing'
import { useTranslations, useLocale } from 'next-intl'

export default function PricingPage() {
  const t = useTranslations('pricingPage')
  const locale = useLocale()
  const [yearly, setYearly] = useState(false)

  // Get locale-aware currency config from messages
  const currency = t.raw('currency') as {
    code: string
    symbol: string
    monthlyPrice: string
    monthlyOriginal: string
    yearlyPrice: string
    yearlyOriginal: string
    saveAmount: string
  }

  // Feature comparison list from messages
  const features = t.raw('features') as Array<{ name: string; free: string; pro: string }>

  // FAQ items from messages
  const faqs = t.raw('faq.items') as Array<{ q: string; a: string }>

  // Trust stats from messages
  const trustItems = t.raw('trust') as Record<string, { num: string; label: string; desc: string }>

  // Free / Pro card content
  const freeCard = t.raw('free') as {
    badge: string
    name: string
    desc: string
    features: string[]
    missing: string[]
    cta: string
  }

  const proCard = t.raw('pro') as {
    badge: string
    recommend: string
    name: string
    desc_monthly: string
    desc_yearly: string
    warning: string
    features: string[]
    cta_monthly: string
    cta_yearly: string
  }

  const hero = t.raw('hero') as { badge: string; title: string; subtitle: string }
  const toggle = t.raw('toggle') as { monthly: string; yearly: string; saveBadge: string }
  const comparison = t.raw('comparison') as {
    title: string
    subtitle: string
    headers: { feature: string; free: string; pro: string }
  }
  const cta = t.raw('cta') as { badge: string; title: string; subtitle: string; button: string; note: string }

  // Months calculation for warning text is pre-computed in messages
  const desc = yearly ? proCard.desc_yearly.replace('{save}', currency.saveAmount) : proCard.desc_monthly
  const ctaText = yearly
    ? proCard.cta_yearly.replace('{price}', currency.yearlyPrice)
    : proCard.cta_monthly.replace('{price}', currency.monthlyPrice)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A4D8C] via-[#1E6BB8] to-[#00A86B] text-white py-20 md:py-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        <div className="container-custom relative text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
            <span className="mr-2 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            {hero.badge}
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            {hero.title}
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 md:py-20 bg-[#0D0D12]">
        <div className="container-custom max-w-5xl px-4">
          {/* Toggle */}
          <div className="flex justify-center mb-8 md:mb-12">
            <div className="inline-flex items-center bg-[#1E1E28] rounded-full p-1">
              <button
                onClick={() => setYearly(false)}
                className={`px-4 md:px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  !yearly ? 'bg-white text-[#0D0D12] shadow-sm' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {toggle.monthly}
              </button>
              <button
                onClick={() => setYearly(true)}
                className={`px-4 md:px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  yearly ? 'bg-white text-[#0D0D12] shadow-sm' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {toggle.yearly} <span className="text-[#00A86B] font-bold ml-1">{toggle.saveBadge}</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Free */}
            <Card className="border-2 border-[#252530] bg-[#1A1A24]">
              <CardContent className="p-6 md:p-8">
                <div className="inline-block rounded-full bg-[#252530] px-3 py-1 text-xs font-bold text-gray-300 mb-4">
                  {freeCard.badge}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{freeCard.name}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-3xl md:text-4xl font-extrabold text-white">{currency.symbol}0</span>
                  <span className="text-gray-400 ml-2">/{locale === 'pt-BR' ? 'mês' : locale === 'es-MX' ? 'mes' : locale === 'zh' ? '月' : 'mo'}</span>
                </div>
                <p className="text-sm text-gray-400 mb-6">{freeCard.desc}</p>
                <ul className="space-y-3 mb-8">
                  {freeCard.features.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <Check className="w-5 h-5 text-[#00A86B] mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                  {freeCard.missing.map((item: string, idx: number) => (
                    <li key={`m-${idx}`} className="flex items-center text-gray-300">
                      <X className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0" />
                      <span className="line-through">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/">
                  <Button variant="outline" className="w-full font-semibold text-[#0A4D8C] border-[#0A4D8C]/30 hover:bg-[#0A4D8C]/5">
                    {freeCard.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="border-2 border-[#0A4D8C] relative overflow-hidden bg-gradient-to-b from-[#0A4D8C]/20 to-[#00A86B]/10">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-[#0A4D8C] to-[#00A86B] text-white text-sm font-bold px-4 py-1.5 rounded-bl-lg">
                {proCard.recommend}
              </div>
              <CardContent className="p-6 md:p-8">
                <div className="inline-block rounded-full bg-[#0A4D8C]/30 px-3 py-1 text-xs font-bold text-[#00A86B] mb-4">
                  {proCard.badge}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{proCard.name}</h3>
                <div className="flex items-baseline mb-2">
                  {yearly ? (
                    <>
                      <span className="text-lg text-gray-500 line-through mr-2">{currency.yearlyOriginal}</span>
                      <span className="text-4xl md:text-5xl font-extrabold text-white">{currency.yearlyPrice}</span>
                      <span className="text-gray-400 ml-2">/{locale === 'pt-BR' ? 'ano' : locale === 'es-MX' ? 'año' : locale === 'zh' ? '年' : 'yr'}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg text-gray-500 line-through mr-2">{currency.monthlyOriginal}</span>
                      <span className="text-4xl md:text-5xl font-extrabold text-white">{currency.monthlyPrice}</span>
                      <span className="text-gray-500 ml-2">/{locale === 'pt-BR' ? 'mês' : locale === 'es-MX' ? 'mes' : locale === 'zh' ? '月' : 'mo'}</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-4">{desc}</p>
                <div className="mb-6 rounded-lg bg-red-900/20 border border-red-800/30 p-3">
                  <p className="text-red-400 text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    {proCard.warning}
                  </p>
                </div>
                <ul className="space-y-3 mb-8">
                  {proCard.features.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <Check className="w-5 h-5 text-[#00A86B] mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <SubscribeButton
                  billingCycle={yearly ? 'yearly' : 'monthly'}
                  className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-[#0D0D12] hover:from-[#f59e0b] hover:to-[#d97706] font-bold shadow-lg shadow-amber-500/25"
                >
                  {ctaText}
                </SubscribeButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Comparison */}
      <section className="py-12 md:py-20 bg-[#1A1A24]">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl font-bold text-white text-center mb-4">{comparison.title}</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            {comparison.subtitle}
          </p>
          <div className="border border-[#252530] rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#252530]">
                <tr>
                  <th className="px-6 py-4 font-semibold text-white">{comparison.headers.feature}</th>
                  <th className="px-6 py-4 font-semibold text-white text-center w-32">{comparison.headers.free}</th>
                  <th className="px-6 py-4 font-semibold text-[#0A4D8C] text-center w-32">{comparison.headers.pro}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252530]">
                {features.map((f, i) => (
                  <tr key={i} className="hover:bg-[#252530]/30">
                    <td className="px-6 py-4 text-gray-300 text-sm">{f.name}</td>
                    <td className="px-6 py-4 text-center">
                      {f.free === '✓' ? (
                        <Check className="w-5 h-5 text-[#00A86B] mx-auto" />
                      ) : f.free === '—' ? (
                        <X className="w-5 h-5 text-gray-600 mx-auto" />
                      ) : (
                        <span className="text-gray-400 text-sm">{f.free}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {f.pro === '✓' ? (
                        <Check className="w-5 h-5 text-[#00A86B] mx-auto" />
                      ) : (
                        <span className="text-gray-300 text-sm font-medium">{f.pro}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Money-back / Trust */}
      <section className="py-12 md:py-16 bg-[#1A1A24]">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {Object.values(trustItems).map((item, idx) => (
              <div key={idx} className="bg-[#1A1A24] rounded-2xl border border-[#252530] p-6 text-center">
                <p className="text-3xl font-extrabold text-[#0A4D8C] mb-2">{item.num}</p>
                <p className="font-semibold text-white mb-1">{item.label}</p>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-20 bg-[#0D0D12]">
        <div className="container-custom max-w-3xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">{t('faq.title')}</h2>
          <div className="space-y-4">
            {faqs.map((item, idx) => (
              <div key={idx} className="bg-[#1A1A24] rounded-xl border border-[#252530] p-6">
                <h3 className="font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#0A4D8C] via-[#1E6BB8] to-[#00A86B] text-white text-center">
        <div className="container-custom">
          <div className="mb-4 inline-flex items-center rounded-full bg-red-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg animate-bounce">
            {cta.badge}
          </div>
          <h2 className="text-3xl font-bold md:text-4xl mb-4 text-white">{cta.title}</h2>
          <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
            {cta.subtitle}
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-[#0D0D12] hover:from-[#f59e0b] hover:to-[#d97706] font-bold h-12 px-8 shadow-lg shadow-amber-500/25">
              {cta.button}
            </Button>
          </Link>
          <p className="mt-4 text-sm text-white/60">{cta.note}</p>
        </div>
      </section>
    </div>
  )
}
