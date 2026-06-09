import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllIngredients, getStatusColor, getStatusIcon } from '@/lib/ingredient-data'
import { categoryLabels, categoryIndex } from '@/data/category-index'
import { ArrowLeft, FlaskConical } from 'lucide-react'

export function generateStaticParams() {
  return Object.keys(categoryIndex).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const label = categoryLabels[slug] ?? slug
  return {
    title: `${label} Ingredients | Brazil ANVISA & Mexico COFEPRIS Status | CosmetCheck`,
    description: `Browse ${label} ingredients regulated in Brazil and Mexico. Check ANVISA and COFEPRIS ban/restriction status, concentration limits, and compliant alternatives.`,
    openGraph: {
      title: `${label} Ingredients | CosmetCheck`,
      description: `Browse regulated ${label} ingredients for Brazil & Mexico compliance.`,
      type: 'website',
      images: [{ url: `https://cosmetcheck.com/og/category-${slug}.png`, width: 1200, height: 630, alt: `${label} ingredients regulated in Brazil and Mexico` }],
    },
    alternates: {
      canonical: `https://cosmetcheck.com/category/${slug}`,
    },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const slugs = categoryIndex[slug]
  if (!slugs) {
    notFound()
  }

  const allIngredients = getAllIngredients()
  const ingredients = allIngredients.filter((i) => slugs.includes(i.slug))
  const label = categoryLabels[slug] ?? slug

  const brazilBanned = ingredients.filter((i) => i.brazilStatus === 'banned').length
  const brazilRestricted = ingredients.filter((i) => i.brazilStatus === 'restricted').length
  const mexicoBanned = ingredients.filter((i) => i.mexicoStatus === 'banned').length
  const mexicoRestricted = ingredients.filter((i) => i.mexicoStatus === 'restricted').length

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
          <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-2">{label}</h1>
          <p className="text-white/50 mb-6">
            {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} in this category
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <StatCard label="Brazil Banned" value={brazilBanned} color="text-red-400" />
            <StatCard label="Brazil Restricted" value={brazilRestricted} color="text-amber-400" />
            <StatCard label="Mexico Banned" value={mexicoBanned} color="text-red-400" />
            <StatCard label="Mexico Restricted" value={mexicoRestricted} color="text-amber-400" />
          </div>

          {/* Ingredients Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ingredients.map((ing) => {
              const colors = getStatusColor(ing.brazilStatus)
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
                  {ing.mexicoStatus && (
                    <p className="text-xs text-white/30 mt-2">
                      Mexico: {getStatusColor(ing.mexicoStatus).label}
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

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-[#1A1A24] border border-[#252530] rounded-xl p-4 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-white/40 mt-1">{label}</p>
    </div>
  )
}
