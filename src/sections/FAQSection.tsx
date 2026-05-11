'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function FAQSection() {
  const t = useTranslations('faq')
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const items = t.raw('items') as Record<string, { q: string; a: string }>
  const faqKeys = Object.keys(items)

  return (
    <section id="faq" className="py-20 bg-[#0D0D12]">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white md:text-4xl mb-4">{t('title')}</h2>
        </div>
        <div className="space-y-4">
          {faqKeys.map((key, idx) => (
            <div key={idx} className="border border-[#252530] rounded-xl overflow-hidden bg-[#1A1A24]">
              <button
                className="w-full flex items-center justify-between p-6 text-left hover:bg-[#252530] transition-colors"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <span className="font-semibold text-white pr-4">{items[key].q}</span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform duration-300 ease-out ${
                    activeFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  activeFaq === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 text-gray-300 leading-relaxed">
                  {items[key].a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
