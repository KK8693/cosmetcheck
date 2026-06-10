import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getAllPlatformSlugs,
  getPlatformGuide,
} from '@/data/platform-guides'
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Globe,
  Shield,
  ClipboardCheck,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react'

export function generateStaticParams() {
  return getAllPlatformSlugs().map((platform) => ({ platform }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ platform: string }>
}): Promise<Metadata> {
  const { platform } = await params
  const data = getPlatformGuide(platform)
  if (!data) {
    return { title: 'Platform Not Found | CosmetCheck' }
  }

  return {
    title: `${data.name} Cosmetics Seller Guide | Brazil & Mexico | CosmetCheck`,
    description: data.description,
    alternates: {
      canonical: `https://cosmetcheck.com/platforms/${platform}`,
      languages: {
        'en': `/platforms/${platform}`,
        'zh-CN': `/zh/platforms/${platform}`,
        'pt-BR': `/pt-BR/platforms/${platform}`,
        'es': `/es/platforms/${platform}`,
        'x-default': `/en/platforms/${platform}`,
      },
    },
  }
}

export default async function PlatformOverviewPage({
  params,
}: {
  params: Promise<{ platform: string }>
}) {
  const { platform } = await params
  const data = getPlatformGuide(platform)

  if (!data) {
    notFound()
  }

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://cosmetcheck.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Platforms',
        item: 'https://cosmetcheck.com/platforms',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: data.name,
        item: `https://cosmetcheck.com/platforms/${platform}`,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#0F1419] text-[#E8ECF0]">
      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Simple Server Component Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F1419]/80 backdrop-blur-md border-b border-[#2A3038]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <svg viewBox="0 0 64 64" className="w-7 h-7" aria-label="CosmetCheck Logo">
              <path d="M32 4L8 16v16c0 13.2 10.3 25.2 24 28 13.7-2.8 24-14.8 24-28V16L32 4z" fill="var(--logo-fill)" />
              <path d="M38 20h-8c-4.4 0-8 3.6-8 8s3.6 8 8 8h8" stroke="var(--logo-stroke)" strokeWidth="4" fill="none" strokeLinecap="round" />
            </svg>
            CosmetCheck
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="/batch" className="hover:text-white transition-colors">Check</a>
            <a href="/guides" className="hover:text-white transition-colors">Guides</a>
          </nav>
          <a
            href="/batch"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-[#0F1419] text-sm font-semibold rounded-lg transition-colors"
          >
            Check Now
          </a>
        </div>
      </header>

      {/* Breadcrumb + Back */}
      <section className="pt-28 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/platforms"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Platforms
          </Link>
          <nav className="flex items-center gap-2 text-sm text-white/40">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/platforms" className="hover:text-white/70 transition-colors">Platforms</Link>
            <span>/</span>
            <span className="text-white/70">{data.name}</span>
          </nav>
        </div>
      </section>

      {/* Hero / H1 */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl px-6 sm:px-8 py-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#0A4D8C]/10 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-7 h-7 text-[#1E6BB8]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-heading">
                  Sell Cosmetics on {data.name}
                </h1>
                <p className="text-sm text-white/50 mt-2 leading-relaxed">
                  {data.description}
                </p>
                <a
                  href={data.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-[#1E6BB8] hover:text-[#4A9EFF] transition-colors mt-2"
                >
                  Visit Seller Center <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Country Cards */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#1E6BB8]" />
            Country-Specific Requirements
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {data.countries.map((c) => (
              <div
                key={c.country}
                className="bg-[#1A1A24] border border-[#252530] rounded-2xl overflow-hidden hover:border-[#0A4D8C]/40 transition-all"
              >
                <div className="px-6 py-5 border-b border-[#252530]">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.country === 'brazil' ? '🇧🇷' : '🇲🇽'}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white/90">
                        {c.countryName}
                      </h3>
                      <p className="text-sm text-white/40 font-mono">{c.marketplaceUrl}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-sm text-white/60 leading-relaxed">
                    {c.overview}
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0F1419] rounded-xl p-3 border border-[#252530]">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-white/40">Registration</span>
                      </div>
                      <span className={`text-sm font-medium ${c.cosmeticsPolicy.registrationRequired ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {c.cosmeticsPolicy.registrationRequired ? 'Required' : 'Not Required'}
                      </span>
                    </div>
                    <div className="bg-[#0F1419] rounded-xl p-3 border border-[#252530]">
                      <div className="flex items-center gap-2 mb-1">
                        <ClipboardCheck className="w-4 h-4 text-[#1E6BB8]" />
                        <span className="text-xs text-white/40">Tax ID</span>
                      </div>
                      <span className={`text-sm font-medium ${c.sellerRequirements.taxIdRequired ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {c.sellerRequirements.taxIdRequired ? 'Required' : 'Optional'}
                      </span>
                    </div>
                  </div>

                  {/* Top Restrictions */}
                  <div>
                    <p className="text-xs text-white/40 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      Key Restrictions
                    </p>
                    <ul className="space-y-1.5">
                      {c.cosmeticsPolicy.restrictions.slice(0, 3).map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                          <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/platforms/${platform}/${c.country}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0A4D8C]/10 border border-[#0A4D8C]/20 hover:bg-[#0A4D8C]/20 text-[#1E6BB8] text-sm font-medium rounded-xl transition-all w-full justify-center"
                  >
                    View Full {c.countryName} Guide
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Checklist Preview */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white/90 mb-5 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Universal Compliance Checklist
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Verify product has valid local regulatory registration (ANVISA/COFEPRIS)',
                'Translate all labels, warnings, and instructions to local language',
                'Review product descriptions for prohibited medical claims',
                'Cross-check all ingredients against local banned/restricted lists',
                'Include registration numbers in product images and listings',
                'Set up local tax documentation (CNPJ for Brazil, RFC for Mexico)',
                'Ensure packaging meets local labeling standards (NOM-141 for Mexico)',
                'Arrange proper import documentation and customs clearance',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs text-emerald-400 font-medium">{i + 1}</span>
                  </span>
                  <span className="text-sm text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#0A4D8C]/20 to-[#00A86B]/10 border border-[#0A4D8C]/30 rounded-2xl p-8 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0A4D8C]/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-[#1E6BB8]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Verify Your Ingredients Before Listing
            </h2>
            <p className="text-white/50 mb-8 max-w-xl mx-auto">
              Check your cosmetic ingredients against ANVISA and COFEPRIS regulations to avoid listing rejections and account suspensions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/batch"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-[#0F1419] font-semibold rounded-xl transition-all"
              >
                Check Your Product
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A24] hover:bg-[#252530] text-white/80 font-medium rounded-xl border border-[#252530] transition-all"
              >
                Browse Product Types
              </Link>
            </div>
          </div>
        </div>
      </section>

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
