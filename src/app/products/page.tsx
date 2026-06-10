import Link from 'next/link'
import { getAllProductTypeSlugs, getProductTypeData } from '@/data/product-types'
import type { Metadata } from 'next'
import { FlaskConical, ArrowRight, Globe } from 'lucide-react'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Cosmetic Product Compliance Guide by Type | CosmetCheck',
    description:
      'Explore cosmetic product compliance requirements by type for Brazil (ANVISA) and Mexico (COFEPRIS). Browse 20+ product categories including skincare, sunscreen, hair dye, and more.',
    keywords:
      'cosmetic product compliance, ANVISA product registration, COFEPRIS product types, Brazil cosmetic categories, Mexico cosmetic regulation by product',
    openGraph: {
      title: 'Cosmetic Product Compliance Guide by Type | CosmetCheck',
      description:
        'Browse compliance requirements for 20+ cosmetic product types in Brazil and Mexico.',
      url: 'https://cosmetcheck.com/products',
      siteName: 'CosmetCheck',
      type: 'website',
    },
    alternates: {
      canonical: 'https://cosmetcheck.com/products',
      languages: {
        'en': '/products',
        'zh-CN': '/zh/products',
        'pt-BR': '/pt-BR/products',
        'es': '/es/products',
        'x-default': '/en/products',
      },
    },
  }
}

export default async function ProductsIndexPage() {
  const slugs = getAllProductTypeSlugs()
  const products = slugs.map((slug) => getProductTypeData(slug)!).filter(Boolean)

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
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-400">Brazil & Mexico</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#E8ECF0] mb-6">
                Cosmetic Product Compliance by Type & Country
              </h1>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Browse regulatory requirements for{' '}
                <span className="text-emerald-400 font-semibold">20 cosmetic product types</span>{' '}
                in{' '}
                <span className="text-amber-400 font-semibold">Brazil (ANVISA)</span> and{' '}
                <span className="text-amber-400 font-semibold">Mexico (COFEPRIS)</span>.
                Select a product category and country to view detailed compliance information.
              </p>
            </div>

            {/* Product Type Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.slug}
                  className="group bg-[#1A1A24] border border-[#252530] rounded-2xl p-6 hover:border-[#0A4D8C]/40 transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0A4D8C]/10 flex items-center justify-center shrink-0">
                      <FlaskConical className="w-5 h-5 text-[#1E6BB8]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {product.names.en}
                      </h3>
                      <p className="text-sm text-white/40 line-clamp-2">
                        {product.descriptions.en}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-[#252530]">
                    <Link
                      href={`/products/${product.slug}/brazil`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F1419] border border-[#252530] hover:border-emerald-500/30 hover:text-emerald-400 transition-all text-sm text-white/60"
                    >
                      <span className="text-base">🇧🇷</span>
                      Brazil
                    </Link>
                    <Link
                      href={`/products/${product.slug}/mexico`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F1419] border border-[#252530] hover:border-amber-500/30 hover:text-amber-400 transition-all text-sm text-white/60"
                    >
                      <span className="text-base">🇲🇽</span>
                      Mexico
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 text-center bg-[#1A1F26] rounded-2xl border border-[#2A3038] p-8">
              <h2 className="text-2xl font-bold text-[#E8ECF0] mb-4">
                Need a Full Ingredient Check?
              </h2>
              <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
                Upload your ingredient list and get an instant compliance report for any product type across Brazil and Mexico regulations.
              </p>
              <Link
                href="/batch"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-[#0F1419] font-semibold rounded-xl transition-all"
              >
                Check Your Products
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
