'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

function splitUseCase(text: string) {
  const idx = text.search(/[:：]/)
  if (idx === -1) return { title: text, desc: '' }
  return { title: text.slice(0, idx).trim(), desc: text.slice(idx + 1).trim() }
}

export function UseCasesSection() {
  const t = useTranslations('useCases')
  const items = t.raw('items') as Record<string, string>
  const keys = Object.keys(items)

  return (
    <section className="py-20 bg-[#1E1E28]">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white md:text-4xl mb-4">
            {t('title')}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {keys.map((key, idx) => {
            const { title, desc } = splitUseCase(items[key])
            return (
              <Card
                key={idx}
                className="border-0 shadow-sm hover:shadow-md transition-all bg-[#252530] border-l-4 border-l-[#0A4D8C]"
              >
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-gray-400 leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
