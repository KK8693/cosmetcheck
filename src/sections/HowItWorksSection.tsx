'use client'

import { useTranslations } from 'next-intl'

export function HowItWorksSection() {
  const t = useTranslations('howItWorks')

  const steps = [
    {
      step: '01',
      title: t('step1Title'),
      desc: t('step1Desc'),
      icon: '📋',
    },
    {
      step: '02',
      title: t('step2Title'),
      desc: t('step2Desc'),
      icon: '🔍',
    },
    {
      step: '03',
      title: t('step3Title'),
      desc: t('step3Desc'),
      icon: '✨',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-[#1A1A24]">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white md:text-4xl mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((item) => (
            <div key={item.step} className="relative">
              <div className="absolute -top-4 -left-2 text-6xl font-black text-white/5">
                {item.step}
              </div>
              <div className="relative pt-8">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
              {item.step !== '03' && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-white/20">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}