import Link from 'next/link'
import { statusIndex, statusLabels } from '@/data/status-index'
import { getAllIngredients, getStatusColor, getStatusIcon } from '@/lib/ingredient-data'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Ingredient Status by Country | Brazil ANVISA & Mexico COFEPRIS | CosmetCheck',
    description: 'Browse cosmetic ingredients by regulatory status in Brazil and Mexico. View banned, restricted, and allowed ingredients by country.',
    openGraph: {
      title: 'Ingredient Status by Country | CosmetCheck',
      description: 'Browse ingredients by Brazil & Mexico regulatory status.',
      type: 'website',
      images: [{ url: 'https://cosmetcheck.com/og/status-overview.png', width: 1200, height: 630, alt: 'Cosmetic ingredient regulation status guide for Brazil and Mexico' }],
    },
    alternates: {
      canonical: `https://cosmetcheck.com/status`,
    },
  }
}

export default function StatusIndexPage() {
  const allIngredients = getAllIngredients()

  return (
    <div className="min-h-screen bg-[#0F1419] text-[#E8ECF0]">
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
          <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-2">Ingredient Status by Country</h1>
          <p className="text-white/50 mb-8">Browse ingredients by their regulatory status in Brazil and Mexico.</p>

          {(['brazil', 'mexico'] as const).map((country) => (
            <div key={country} className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{country === 'brazil' ? '🇧🇷' : '🇲🇽'}</span>
                <h2 className="text-xl font-semibold">{country === 'brazil' ? 'Brazil (ANVISA)' : 'Mexico (COFEPRIS)'}</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(statusIndex[country] ?? {}).map(([status, slugs]) => {
                  const colors = getStatusColor(status as any)
                  return (
                    <Link
                      key={status}
                      href={`/status/${country}/${status}`}
                      className="group p-5 rounded-xl bg-[#1A1A24] border border-[#252530] hover:border-[#0A4D8C]/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-sm font-medium ${colors.bg} ${colors.text} ${colors.border}`}>
                          {getStatusIcon(status as any)}
                          {colors.label}
                        </span>
                        <span className="text-2xl font-bold text-white/80">{slugs.length}</span>
                      </div>
                      <p className="text-sm text-white/40">{statusLabels[status] ?? status}</p>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

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
