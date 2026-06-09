import Link from 'next/link'
import { getAllIngredients, getStatusColor, getIngredientCount, getIngredientCountsByStatus } from '@/lib/ingredient-data'
import { categoryLabels, categoryIndex } from '@/data/category-index'
import { statusLabels } from '@/data/status-index'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Cosmetic Ingredients Database | Brazil ANVISA & Mexico COFEPRIS Status',
    description: 'Search 2,000+ cosmetic ingredients for regulatory status in Brazil (ANVISA) and Mexico (COFEPRIS). Check banned, restricted, and allowed ingredients.',
    keywords: 'cosmetic ingredients database, ANVISA banned list, COFEPRIS cosmetics, Brazil cosmetic regulation, Mexico cosmetic regulation',
    openGraph: {
      title: 'Cosmetic Ingredients Database | CosmetCheck',
      description: 'Search 2,000+ ingredients for Brazil & Mexico compliance.',
      type: 'website',
    },
    alternates: {
      canonical: 'https://cosmetcheck.com/ingredients',
    },
  }
}

export default async function IngredientsPage() {
  const allIngredients = getAllIngredients()
  const total = getIngredientCount()
  const counts = getIngredientCountsByStatus()

  const brazilOverview = {
    banned: counts.brazil.banned,
    restricted: counts.brazil.restricted,
    allowed: counts.brazil.allowed,
  }
  const mexicoOverview = {
    banned: counts.mexico.banned,
    restricted: counts.mexico.restricted,
    allowed: counts.mexico.allowed,
  }

  const brazilRate = Math.round(((brazilOverview.banned + brazilOverview.restricted) / total) * 100)
  const mexicoRate = Math.round(((mexicoOverview.banned + mexicoOverview.restricted) / total) * 100)

  // Category filter links
  const categoryLinks = Object.entries(categoryIndex).map(([slug, slugs]) => (
    { slug, label: categoryLabels[slug] ?? slug, count: slugs.length }
  ))

  // Status filter links
  const statusLinks = [
    { country: 'brazil', status: 'banned', label: 'Brazil Banned', count: counts.brazil.banned },
    { country: 'brazil', status: 'restricted', label: 'Brazil Restricted', count: counts.brazil.restricted },
    { country: 'mexico', status: 'banned', label: 'Mexico Banned', count: counts.mexico.banned },
    { country: 'mexico', status: 'restricted', label: 'Mexico Restricted', count: counts.mexico.restricted },
  ]


  
          {/* Category Filters */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white/80 mb-3">Browse by Category</h2>
            <div className="flex flex-wrap gap-2">
              {categoryLinks.map((cat) => (
                <a
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1A1A24] border border-[#252530] hover:border-[#0A4D8C]/40 hover:text-[#1E6BB8] transition-colors text-sm text-white/70"
                >
                  <span>{cat.label}</span>
                  <span className="text-xs text-white/30 bg-[#0F1419] px-1.5 py-0.5 rounded">{cat.count}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Status Filters */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white/80 mb-3">Browse by Status</h2>
            <div className="flex flex-wrap gap-2">
              {statusLinks.map((s) => (
                <a
                  key={`${s.country}-${s.status}`}
                  href={`/status/${s.country}/${s.status}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1A1A24] border border-[#252530] hover:border-[#0A4D8C]/40 hover:text-[#1E6BB8] transition-colors text-sm text-white/70"
                >
                  <span>{s.label}</span>
                  <span className="text-xs text-white/30 bg-[#0F1419] px-1.5 py-0.5 rounded">{s.count}</span>
                </a>
              ))}
            </div>
          </div>

          const letterGroups: Record<string, typeof allIngredients> = {}
  allIngredients.forEach((ing) => {
    const first = ing.name[0]?.toUpperCase() || '#'
    if (!letterGroups[first]) letterGroups[first] = []
    letterGroups[first].push(ing)
  })
  const sortedLetters = Object.keys(letterGroups).sort()

  const topKeywords = allIngredients
    .filter(i => i.brazilStatus === 'banned' || i.mexicoStatus === 'banned')
    .slice(0, 12)
    .map(i => i.name)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How many cosmetic ingredients are regulated in Brazil?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `In Brazil, ANVISA regulates approximately ${total} cosmetic ingredients. ${brazilOverview.banned} are banned, ${brazilOverview.restricted} are restricted, and ${brazilOverview.allowed} are allowed.`,
        },
      },
      {
        '@type': 'Question',
        name: 'How many cosmetic ingredients are restricted in Mexico?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `In Mexico, COFEPRIS regulates approximately ${total} cosmetic ingredients. ${mexicoOverview.banned} are banned, ${mexicoOverview.restricted} are restricted, and ${mexicoOverview.allowed} are allowed.`,
        },
      },
      {
        '@type': 'Question',
        name: 'What are the most commonly banned cosmetic ingredients in Brazil and Mexico?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Some of the most commonly banned ingredients include: ${topKeywords.join(', ')}. These ingredients are prohibited due to safety concerns such as carcinogenicity, skin irritation, or hormonal disruption.`,
        },
      },
    ],
  }

  const webAppData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'CosmetCheck Ingredient Database',
    applicationCategory: 'HealthApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }

  return (
    <>
      {/* Simple Server Component Header — avoids Navbar Client Component SSR issues */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F1419]/80 backdrop-blur-md border-b border-[#2A3038]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <svg viewBox="0 0 64 64" className="w-7 h-7" aria-label="CosmetCheck Logo">
              <path d="M32 4L8 16v16c0 13.2 10.3 25.2 24 28 13.7-2.8 24-14.8 24-28V16L32 4z" fill="var(--logo-fill)" />
              <path d="M38 20h-8c-4.4 0-8 3.6-8 8s3.6 8 8 8h8" stroke="var(--logo-stroke)" strokeWidth="4" fill="none" strokeLinecap="round" />
            </svg>
            CosmetCheck
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/batch" className="hover:text-white transition-colors">Check</Link>
            <Link href="/guides" className="hover:text-white transition-colors">Guides</Link>
          </nav>
          <a
            href="/batch"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-[#0F1419] text-sm font-semibold rounded-lg transition-colors"
          >
            Check Now
          </a>
        </div>
      </header>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppData) }}
      />

      <main className="min-h-screen bg-[#0F1419]">
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1F26] border border-[#2A3038] mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-slate-400">{total.toLocaleString()}+ Ingredients</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#E8ECF0] mb-6">
                Cosmetic Ingredients Database
              </h1>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Search {total.toLocaleString()}+ cosmetic ingredients for regulatory status in{' '}
                <span className="text-emerald-400 font-semibold">Brazil (ANVISA)</span> and{' '}
                <span className="text-amber-400 font-semibold">Mexico (COFEPRIS)</span>. Check banned, restricted, and allowed ingredients instantly.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
              <div className="p-6 rounded-xl bg-[#1A1F26] border border-[#2A3038]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <span className="text-emerald-400 font-bold">BR</span>
                  </div>
                  <h2 className="text-lg font-semibold text-[#E8ECF0]">Brazil – ANVISA</h2>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-rose-400">{brazilRate}%</span>
                  <span className="text-sm text-slate-400">regulated rate</span>
                </div>
                <div className="text-sm text-slate-500">
                  <span className="text-rose-400 font-medium">{brazilOverview.banned} banned</span> ·{' '}
                  <span className="text-amber-400 font-medium">{brazilOverview.restricted} restricted</span> ·{' '}
                  <span className="text-emerald-400 font-medium">{brazilOverview.allowed} allowed</span>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-[#1A1F26] border border-[#2A3038]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <span className="text-amber-400 font-bold">MX</span>
                  </div>
                  <h2 className="text-lg font-semibold text-[#E8ECF0]">Mexico – COFEPRIS</h2>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-rose-400">{mexicoRate}%</span>
                  <span className="text-sm text-slate-400">regulated rate</span>
                </div>
                <div className="text-sm text-slate-500">
                  <span className="text-rose-400 font-medium">{mexicoOverview.banned} banned</span> ·{' '}
                  <span className="text-amber-400 font-medium">{mexicoOverview.restricted} restricted</span> ·{' '}
                  <span className="text-emerald-400 font-medium">{mexicoOverview.allowed} allowed</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1F26] rounded-2xl border border-[#2A3038] overflow-hidden">
              <div className="p-6 border-b border-[#2A3038]">
                <h2 className="text-2xl font-bold text-[#E8ECF0] mb-2">
                  Complete Ingredient Directory
                </h2>
                <p className="text-slate-400">
                  Browse all {total.toLocaleString()} ingredients by name. Click any ingredient to view detailed regulatory status.
                </p>
              </div>

              <div className="p-4 overflow-x-auto border-b border-[#2A3038]">
                <div className="flex gap-2 min-w-max">
                  {sortedLetters.map(letter => (
                    <a
                      key={letter}
                      href={`#letter-${letter}`}
                      className="px-3 py-1.5 rounded-lg bg-[#0F1419] hover:bg-[#2A3038] text-slate-300 hover:text-[#E8ECF0] text-sm font-medium transition-colors"
                    >
                      {letter}
                    </a>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {sortedLetters.map(letter => (
                  <div key={letter} id={`letter-${letter}`} className="mb-8 last:mb-0">
                    <h3 className="text-2xl font-bold text-emerald-400 mb-4 sticky top-0 bg-[#1A1F26] py-2 border-b border-[#2A3038]">
                      {letter}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-2">
                      {letterGroups[letter].map(ingredient => {
                        const brazilColor = getStatusColor(ingredient.brazilStatus)
                        const mexicoColor = getStatusColor(ingredient.mexicoStatus ?? 'pending')
                        return (
                          <Link
                            key={ingredient.slug}
                            href={`/ingredient/${ingredient.slug}`}
                            className="group flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-[#0F1419] transition-colors"
                          >
                            <span className="text-sm text-[#E8ECF0] group-hover:text-emerald-400 transition-colors truncate">
                              {ingredient.name}
                            </span>
                            <span className="flex gap-1 shrink-0">
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${brazilColor.bg} ${brazilColor.text}`}
                                title={`Brazil: ${ingredient.brazilStatus}`}
                              >
                                BR
                              </span>
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${mexicoColor.bg} ${mexicoColor.text}`}
                                title={`Mexico: ${ingredient.mexicoStatus ?? 'pending'}`}
                              >
                                MX
                              </span>
                            </span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 text-center bg-[#1A1F26] rounded-2xl border border-[#2A3038] p-8">
              <h2 className="text-2xl font-bold text-[#E8ECF0] mb-4">
                Need Compliance Checking for Your Products?
              </h2>
              <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
                Upload your ingredient lists and get instant compliance reports for Brazil ANVISA and Mexico COFEPRIS regulations.
              </p>
              <Link
                href="/batch"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-[#0F1419] font-semibold rounded-xl transition-all"
              >
                Check Your Products
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Simple Server Component Footer */}
      <footer className="bg-[#08080C] text-gray-400 py-12 border-t border-[#2A3038]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <svg viewBox="0 0 64 64" className="w-7 h-7" aria-label="CosmetCheck Logo">
                  <path d="M32 4L8 16v16c0 13.2 10.3 25.2 24 28 13.7-2.8 24-14.8 24-28V16L32 4z" fill="var(--logo-fill)" />
                  <path d="M38 20h-8c-4.4 0-8 3.6-8 8s3.6 8 8 8h8" stroke="var(--logo-stroke)" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
                <span className="text-white font-bold text-xl">CosmetCheck</span>
              </div>
              <p className="text-sm">AI-powered cosmetic compliance for Brazil & Mexico.</p>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">Product</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/pricing" className="hover:text-white transition-colors">Compliance Check</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">AI Listing</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">Company</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">Resources</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/faq" className="hover:text-white transition-colors">Knowledge Base</Link></li>
                <li><Link href="/guides" className="hover:text-white transition-colors">Guides</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">Legal</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            © 2025 CosmetCheck. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}
