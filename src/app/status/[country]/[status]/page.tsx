import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllIngredients, getStatusColor, getStatusIcon } from '@/lib/ingredient-data'
import { statusLabels, statusIndex } from '@/data/status-index'
import { ArrowLeft } from 'lucide-react'

export function generateStaticParams() {
  const params: { country: string; status: string }[] = []
  for (const country of ['brazil', 'mexico'] as const) {
    for (const status of Object.keys(statusIndex[country] ?? {})) {
      params.push({ country, status })
    }
  }
  return params
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; status: string }> }): Promise<Metadata> {
  const { country, status } = await params
  const countryLabel = country === 'brazil' ? 'Brazil (ANVISA)' : 'Mexico (COFEPRIS)'
  const statusLabel = statusLabels[status] ?? status
  return {
    title: `${statusLabel} Ingredients in ${countryLabel} | CosmetCheck`,
    description: `Browse all ${statusLabel.toLowerCase()} cosmetic ingredients in ${countryLabel}. Check regulatory details, concentration limits, and find compliant alternatives.`,
    openGraph: {
      title: `${statusLabel} Ingredients | ${countryLabel}`,
      description: `Browse regulated ingredients for ${countryLabel} compliance.`,
      type: 'website',
      images: [{ url: `https://cosmetcheck.com/og/status-${country}-${status}.png`, width: 1200, height: 630, alt: `${statusLabel} cosmetic ingredients in ${countryLabel}` }],
    },
    alternates: {
      canonical: `https://cosmetcheck.com/status/${country}/${status}`,
    },
  }
}

export default async function StatusPage({ params }: { params: Promise<{ country: string; status: string }> }) {
  const { country, status } = await params
  const slugs = statusIndex[country]?.[status]
  if (!slugs) {
    notFound()
  }

  const allIngredients = getAllIngredients()
  const ingredients = allIngredients.filter((i) => slugs.includes(i.slug))
  const countryLabel = country === 'brazil' ? 'Brazil (ANVISA)' : 'Mexico (COFEPRIS)'
  const statusLabel = statusLabels[status] ?? status

  return (
    <div className="min-h-screen bg-[#0F1419] text-[#E8ECF0]">
      {/* Simple Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F1419]/80 backdrop-blur-md border-b border-[#2A3038]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <svg viewBox="0 0 64 64" className="w-7 h-7" aria-label="CosmetCheck Logo">
              <path d="M32 4L8 16v16c0 13.2 10.3 25.2 24 28 13.7-2.8 24-14.8 24-28V16L32 4z" fill="var(--logo-fill)" />
              <path d="M38 20h-8c-4.4 0-8 3.6-8 8s3.6 8 8 8h8" stroke="var(--logo-stroke)" strokeWidth="4" fill="none" strokeLinecap="round" />
            </svg>
            CosmetCheck
          </a>
          <a href="/batch" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-[#0F1419] text-sm font-semibold rounded-lg transition-colors">
            Check Now
          </a>
        </div>
      </header>

      <section className="pt-28 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/ingredients" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Database
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{country === 'brazil' ? '🇧🇷' : '🇲🇽'}</span>
            <h1 className="text-3xl sm:text-4xl font-bold font-heading">{statusLabel}</h1>
          </div>
          <p className="text-white/50 mb-6">
            {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} {status} in {countryLabel}
          </p>

          {/* Ingredients Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ingredients.map((ing) => {
              const colors = getStatusColor(ing.brazilStatus)
              const mxColors = ing.mexicoStatus ? getStatusColor(ing.mexicoStatus) : null
              return (
                <Link
                  key={ing.slug}
                  href={`/ingredient/${ing.slug}`}
                  className="group p-5 rounded-xl bg-[#1A1A24] border border-[#252530] hover:border-[#0A4D8C]/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-white group-hover:text-[#1E6BB8] transition-colors">
                      {ing.name}
                    </h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
                      {getStatusIcon(ing.brazilStatus)}
                      {colors.label}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 font-mono mb-1">{ing.inci}</p>
                  <p className="text-sm text-white/50">{ing.commonUse}</p>
                  {mxColors && (
                    <p className="text-xs text-white/30 mt-2">
                      Mexico: <span className={mxColors.text}>{mxColors.label}</span>
                    </p>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#252530] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">© 2025 CosmetCheck. Data from ANVISA & COFEPRIS.</p>
          <div className="flex gap-6">
            <Link href="/ingredients" className="text-sm text-white/30 hover:text-white/60 transition-colors">Database</Link>
            <Link href="/privacy" className="text-sm text-white/30 hover:text-white/60 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-sm text-white/30 hover:text-white/60 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
