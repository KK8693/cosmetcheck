'use client'

import { useState } from 'react'
import { ChevronDown, MessageCircle } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'

type CategoryKey = 'general' | 'pricing' | 'technical'

export function FAQSection() {
  const t = useTranslations('faq')
  const locale = useLocale()
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('general')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)

  const categories = t.raw('categories') as Record<
    CategoryKey,
    { label: string; items: Record<string, { q: string; a: string }> }
  >
  const categoryKeys = Object.keys(categories) as CategoryKey[]

  const currentItems = categories[activeCategory]?.items || {}
  const itemKeys = Object.keys(currentItems)

  const whatsappTextByLocale: Record<string, string> = {
    en: 'Hello, I have a question about CosmetCheck',
    zh: '你好，我想了解CosmetCheck的合规检测服务',
    'pt-BR': 'Olá, tenho uma pergunta sobre o CosmetCheck',
    'es-MX': 'Hola, tengo una pregunta sobre CosmetCheck',
  }
  const whatsappText = whatsappTextByLocale[locale] || whatsappTextByLocale.en
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`

  return (
    <section id="faq" className="py-20 bg-[#0D0D12]">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white md:text-4xl mb-4">
            {t('title')}
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categoryKeys.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat)
                setExpandedFaq(0) // 切换分类后默认展开第一个
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#00A86B] to-[#00C896] text-white shadow-lg shadow-green-500/25'
                  : 'bg-[#1A1A24] text-gray-400 hover:text-white hover:bg-[#252530]'
              }`}
            >
              {categories[cat]?.label}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-12">
          {itemKeys.map((key, idx) => (
            <div
              key={idx}
              className="border border-[#252530] rounded-xl overflow-hidden bg-[#1A1A24] transition-all duration-300 hover:border-[#00A86B]/30"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-[#252530] transition-colors"
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
              >
                <span className="font-medium text-white pr-4">
                  {currentItems[key]?.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform duration-300 ease-out ${
                    expandedFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className="grid transition-all duration-300 ease-out"
                style={{ gridTemplateRows: expandedFaq === idx ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 text-gray-300 leading-relaxed">
                    {currentItems[key]?.a}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div className="flex justify-center">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold hover:from-[#128C7E] hover:to-[#075E54] transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
          >
            <MessageCircle className="w-5 h-5" />
            {t('whatsapp')}
          </a>
        </div>
      </div>
    </section>
  )
}