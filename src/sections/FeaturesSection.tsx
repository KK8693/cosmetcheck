'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

export function FeaturesSection() {
  const t = useTranslations('features')

  const features = [
    {
      icon: '/assets/icons/icon-shield.svg',
      title: t('autoBlockTitle'),
      desc: t('autoBlockDesc'),
    },
    {
      icon: '/assets/icons/icon-globe.svg',
      title: t('listingTitle'),
      desc: t('listingDesc'),
    },
    {
      icon: '/assets/icons/icon-bolt.svg',
      title: t('highlightTitle'),
      desc: t('highlightDesc'),
    },
    {
      icon: '/assets/icons/icon-gift.svg',
      title: t('freeTryTitle'),
      desc: t('freeTryDesc'),
    },
  ]

  return (
    <section id="features" className="py-20 bg-[#252530]">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white md:text-4xl mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gray-700/50 bg-[#1E1E28] p-6 hover:border-[#0A4D8C]/50 hover:shadow-lg hover:shadow-[#0A4D8C]/10 transition-all"
            >
              <div className="mb-4">
                <Image src={item.icon} alt="" width={48} height={48} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}