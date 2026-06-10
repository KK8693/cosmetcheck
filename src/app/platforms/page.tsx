import Link from 'next/link'
import { getAllPlatformSlugs, getPlatformGuide } from '@/data/platform-guides'
import type { Metadata } from 'next'
import { Globe, ArrowRight, ShoppingBag, ExternalLink } from 'lucide-react'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Cosmetic E-commerce Platform Compliance | Amazon, Mercado Livre, Shopee | CosmetCheck',
    description:
      'Complete compliance guides for selling cosmetics on Amazon, Mercado Livre, and Shopee in Brazil and Mexico. ANVISA and COFEPRIS requirements, seller checklists, and prohibited products.',
    keywords:
      'sell cosmetics Amazon Brazil, Mercado Livre cosmetics Mexico, Shopee cosmetics LATAM, ANVISA platform requirements, COFEPRIS marketplace compliance, cosmetic e-commerce Brazil Mexico',
    openGraph: {
      title: 'Cosmetic Platform Compliance Guides | CosmetCheck',
      description:
        'Navigate cosmetic compliance requirements for Amazon, Mercado Livre, and Shopee in Brazil & Mexico.',
      url: 'https://cosmetcheck.com/platforms',
      siteName: 'CosmetCheck',
      type: 'website',
    },
    alternates: {
      canonical: 'https://cosmetcheck.com/platforms',
      languages: {
        'en': '/platforms',
        'zh-CN': '/zh/platforms',
        'pt-BR': '/pt-BR/platforms',
        'es': '/es/platforms',
        'x-default': '/en/platforms',
      },
    },
  }
}

export default async function PlatformsIndexPage() {
  const slugs = getAllPlatformSlugs()
  const platforms = slugs.map((slug) => getPlatformGuide(slug)!).filter(Boolean)

  return (
    <div className="min-h-screen bg-[#0F1419] text-[#E8ECF0]">
      {/* Simple Server Component Header */}
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

      <main className="min-h-screen">
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1F26] border border-[#2A3038] mb-6">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-400">E-commerce Platforms</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#E8ECF0] mb-6">
                Sell Cosmetics on Latin America&apos;s Top Platforms
              </h1>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Navigate compliance requirements for{' '}
                <span className="text-emerald-400 font-semibold">Amazon, Mercado Livre, and Shopee</span>{' '}
                in{' '}
                <span className="text-amber-400 font-semibold">Brazil (ANVISA)</span> and{' '}
                <span className="text-amber-400 font-semibold">Mexico (COFEPRIS)</span>.
                Platform-specific seller guides, checklists, and prohibited product lists.
              </p>
            </div>

            {/* Platform Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
              {platforms.map((platform) => (
                <div
                  key={platform.slug}
                  className="group bg-[#1A1A24] border border-[#252530] rounded-2xl p-6 hover:border-[#0A4D8C]/40 transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0A4D8C]/10 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-6 h-6 text-[#1E6BB8]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {platform.name}
                      </h3>
                      <a
                        href={platform.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/40 hover:text-[#1E6BB8] transition-colors inline-flex items-center gap-1"
                      >
                        {platform.website.replace('https://', '')}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <p className="text-sm text-white/50 mb-6 leading-relaxed">
                    {platform.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    {platform.countries.map((c) => (
                      <div key={c.country} className="flex items-center gap-3 text-sm">
                        <span className="text-lg">{c.country === 'brazil' ? '🇧🇷' : '🇲🇽'}</span>
                        <span className="text-white/70">{c.countryName}</span>
                        <span className="text-white/30">{c.marketplaceUrl}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-[#252530]">
                    {platform.countries.map((c) => (
                      <Link
                        key={c.country}
                        href={`/platforms/${platform.slug}/${c.country}`}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F1419] border border-[#252530] transition-all text-sm ${
                          c.country === 'brazil'
                            ? 'hover:border-emerald-500/30 hover:text-emerald-400 text-white/60'
                            : 'hover:border-amber-500/30 hover:text-amber-400 text-white/60'
                        }`}
                      >
                        <span className="text-base">{c.country === 'brazil' ? '🇧🇷' : '🇲🇽'}</span>
                        {c.countryName}
                      </Link>
                    ))}
                    <Link
                      href={`/platforms/${platform.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A4D8C]/10 border border-[#0A4D8C]/20 hover:border-[#0A4D8C]/40 text-[#1E6BB8] text-sm transition-all ml-auto"
                    >
                      Overview
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Compare Section */}
            <div className="bg-[#1A1F26] rounded-2xl border border-[#2A3038] p-8 mb-16">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#E8ECF0]">
                    Compare Platform Requirements
                  </h2>
                  <p className="text-slate-400 mt-1">
                    Side-by-side comparison of registration, fees, and compliance across Amazon, Mercado Livre, and Shopee.
                  </p>
                </div>
                <Link
                  href="/platforms/compare"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A4D8C]/10 border border-[#0A4D8C]/20 hover:bg-[#0A4D8C]/20 text-[#1E6BB8] font-medium rounded-xl transition-all shrink-0"
                >
                  Compare Platforms
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#252530] text-white/40">
                      <th className="text-left px-4 py-3 font-medium">Requirement</th>
                      <th className="text-left px-4 py-3 font-medium">Amazon</th>
                      <th className="text-left px-4 py-3 font-medium">Mercado Livre</th>
                      <th className="text-left px-4 py-3 font-medium">Shopee</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/70">
                    <tr className="border-b border-[#252530]">
                      <td className="px-4 py-3 text-white/60">Brazil Registration</td>
                      <td className="px-4 py-3">ANVISA + PTR</td>
                      <td className="px-4 py-3">ANVISA + PTR</td>
                      <td className="px-4 py-3">ANVISA + PTR</td>
                    </tr>
                    <tr className="border-b border-[#252530]">
                      <td className="px-4 py-3 text-white/60">Mexico Registration</td>
                      <td className="px-4 py-3">COFEPRIS + NOM-141</td>
                      <td className="px-4 py-3">COFEPRIS + NOM-141</td>
                      <td className="px-4 py-3">COFEPRIS + NOM-141</td>
                    </tr>
                    <tr className="border-b border-[#252530]">
                      <td className="px-4 py-3 text-white/60">Local Entity Required</td>
                      <td className="px-4 py-3">No (rep needed)</td>
                      <td className="px-4 py-3">No (rep needed)</td>
                      <td className="px-4 py-3">No (rep needed)</td>
                    </tr>
                    <tr className="border-b border-[#252530]">
                      <td className="px-4 py-3 text-white/60">Tax ID Required</td>
                      <td className="px-4 py-3">CNPJ / RFC</td>
                      <td className="px-4 py-3">CNPJ / RFC</td>
                      <td className="px-4 py-3">CNPJ / RFC</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-white/60">Commission</td>
                      <td className="px-4 py-3">~8-15%</td>
                      <td className="px-4 py-3">~10-20%</td>
                      <td className="px-4 py-3">~5-15%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center bg-gradient-to-br from-[#0A4D8C]/20 to-[#00A86B]/10 border border-[#0A4D8C]/30 rounded-2xl p-8 sm:p-12">
              <div className="w-16 h-16 rounded-2xl bg-[#0A4D8C]/20 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-[#1E6BB8]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Check Your Product Compliance First
              </h2>
              <p className="text-white/50 mb-8 max-w-xl mx-auto">
                Before listing on any platform, verify your ingredients comply with ANVISA and COFEPRIS regulations. Get an instant compliance report.
              </p>
              <Link
                href="/batch"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-[#0F1419] font-semibold rounded-xl transition-all"
              >
                Check Your Ingredients
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="bg-[#08080C] text-gray-400 py-12 border-t border-[#2A3038]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 64 64" className="w-6 h-6" aria-label="CosmetCheck Logo">
                <path d="M32 4L8 16v16c0 13.2 10.3 25.2 24 28 13.7-2.8 24-14.8 24-28V16L32 4z" fill="var(--logo-fill)" />
                <path d="M38 20h-8c-4.4 0-8 3.6-8 8s3.6 8 8 8h8" stroke="var(--logo-stroke)" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
              <span className="text-white font-bold text-lg">CosmetCheck</span>
            </div>
            <p className="text-sm text-white/30">
              © 2025 CosmetCheck. AI-powered cosmetic compliance for Brazil & Mexico.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
