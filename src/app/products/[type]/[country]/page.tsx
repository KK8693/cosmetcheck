import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getAllProductTypeSlugs,
  getProductTypeData,
} from '@/data/product-types'
import { getIngredientBySlug } from '@/lib/ingredient-data'
import ProductComplianceCard from '@/components/ProductComplianceCard'
import ProductTypeFAQ from '@/components/ProductTypeFAQ'
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  FlaskConical,
  FileText,
  Ban,
} from 'lucide-react'

export function generateStaticParams() {
  const types = getAllProductTypeSlugs()
  const countries = ['brazil', 'mexico']
  return types.flatMap((type) =>
    countries.map((country) => ({ type, country }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; country: string }>
}): Promise<Metadata> {
  const { type, country } = await params
  const data = getProductTypeData(type)
  if (!data) {
    return { title: 'Product Not Found | CosmetCheck' }
  }

  const countryName = country === 'brazil' ? 'Brazil' : 'Mexico'
  const productName = data.names.en

  return {
    title: `${productName} Regulation in ${countryName} | ANVISA/COFEPRIS Compliance | CosmetCheck`,
    description: data.descriptions.en,
    alternates: {
      canonical: `https://cosmetcheck.com/products/${type}/${country}`,
      languages: {
        en: `/products/${type}/${country}`,
        'zh-CN': `/zh/products/${type}/${country}`,
        'pt-BR': `/pt-BR/products/${type}/${country}`,
        es: `/es/products/${type}/${country}`,
        'x-default': `/en/products/${type}/${country}`,
      },
    },
  }
}

export default async function ProductTypeCountryPage({
  params,
}: {
  params: Promise<{ type: string; country: string }>
}) {
  const { type, country } = await params
  const data = getProductTypeData(type)

  if (!data || !['brazil', 'mexico'].includes(country)) {
    notFound()
  }

  const countryName = country === 'brazil' ? 'Brazil' : 'Mexico'
  const productName = data.names.en

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
        name: 'Products',
        item: 'https://cosmetcheck.com/products',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: productName,
        item: `https://cosmetcheck.com/products/${type}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: countryName,
        item: `https://cosmetcheck.com/products/${type}/${country}`,
      },
    ],
  }

  // Resolve restricted ingredient details
  const restrictedIngredients = data.commonRestrictedIngredients
    .map((slug) => {
      const ing = getIngredientBySlug(slug)
      if (!ing) return null
      const status =
        country === 'brazil'
          ? ing.status.brazil
          : ing.status.mexico ?? ing.status.brazil
      return {
        slug,
        name: ing.name,
        status: status.status,
        regulation: status.regulation,
        limit: status.limit,
      }
    })
    .filter(Boolean) as {
    slug: string
    name: string
    status: string
    regulation: string
    limit: string | null
  }[]

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
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
          <nav className="flex items-center gap-2 text-sm text-white/40">
            <Link href="/" className="hover:text-white/70 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/products"
              className="hover:text-white/70 transition-colors"
            >
              Products
            </Link>
            <span>/</span>
            <span className="text-white/70">{productName}</span>
            <span>/</span>
            <span className="text-white/70">{countryName}</span>
          </nav>
        </div>
      </section>

      {/* Hero / H1 */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl px-6 sm:px-8 py-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#0A4D8C]/10 flex items-center justify-center shrink-0">
                <FlaskConical className="w-7 h-7 text-[#1E6BB8]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-heading">
                  {productName} Regulatory Requirements in {countryName}
                </h1>
                <p className="text-sm text-white/50 mt-2 leading-relaxed">
                  {data.descriptions.en}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Overview */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ProductComplianceCard data={data} country={country as 'brazil' | 'mexico'} />
        </div>
      </section>

      {/* Restricted Ingredients Table */}
      {restrictedIngredients.length > 0 && (
        <section className="pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl overflow-hidden">
              <div className="px-6 sm:px-8 py-5 border-b border-[#252530] flex items-center gap-3">
                <Ban className="w-5 h-5 text-red-400" />
                <h2 className="text-lg font-semibold text-white/90">
                  Commonly Restricted Ingredients
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#252530] text-white/40">
                      <th className="text-left px-6 py-3 font-medium">Ingredient</th>
                      <th className="text-left px-6 py-3 font-medium">Status</th>
                      <th className="text-left px-6 py-3 font-medium">Regulation</th>
                      <th className="text-left px-6 py-3 font-medium">Limit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restrictedIngredients.map((ing) => (
                      <tr
                        key={ing.slug}
                        className="border-b border-[#252530] last:border-0 hover:bg-[#0F1419]/50 transition-colors"
                      >
                        <td className="px-6 py-3.5">
                          <Link
                            href={`/ingredient/${ing.slug}`}
                            className="text-white/80 hover:text-emerald-400 transition-colors font-medium"
                          >
                            {ing.name}
                          </Link>
                        </td>
                        <td className="px-6 py-3.5">
                          <StatusBadge status={ing.status} />
                        </td>
                        <td className="px-6 py-3.5 text-white/50 font-mono">
                          {ing.regulation}
                        </td>
                        <td className="px-6 py-3.5 text-white/50">
                          {ing.limit ?? 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Label Requirements */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <FileText className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-white/90">
                Label Requirements in {countryName}
              </h2>
            </div>
            <ul className="space-y-3">
              {data.labelRequirements.en.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                  <span className="text-sm text-white/70">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ProductTypeFAQ data={data} country={country as 'brazil' | 'mexico'} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#0A4D8C]/20 to-[#00A86B]/10 border border-[#0A4D8C]/30 rounded-2xl p-8 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0A4D8C]/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-[#1E6BB8]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Check Your Product Ingredients
            </h2>
            <p className="text-white/50 mb-8 max-w-xl mx-auto">
              Paste your ingredient list and get an instant compliance report for Brazil ANVISA and Mexico COFEPRIS regulations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-[#0F1419] font-semibold rounded-xl transition-all"
              >
                Check Your Product
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/status/${country}/banned`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A24] hover:bg-[#252530] text-white/80 font-medium rounded-xl border border-[#252530] transition-all"
              >
                <Ban className="w-4 h-4" />
                View Banned Ingredients in {countryName}
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    banned: 'bg-red-500/10 text-red-400 border border-red-500/20',
    restricted: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    allowed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    prescription: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    pending: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
  }
  const labels: Record<string, string> = {
    banned: 'Banned',
    restricted: 'Restricted',
    allowed: 'Allowed',
    prescription: 'Prescription',
    pending: 'Pending',
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
        styles[status] ?? styles.pending
      }`}
    >
      {labels[status] ?? status}
    </span>
  )
}
