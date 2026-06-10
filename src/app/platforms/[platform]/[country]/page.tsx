import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getAllPlatformCountryCombinations,
  getPlatformCountryGuide,
  getPlatformGuide,
} from '@/data/platform-guides'
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Shield,
  ClipboardCheck,
  Ban,
  FileText,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react'

export function generateStaticParams() {
  return getAllPlatformCountryCombinations()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ platform: string; country: string }>
}): Promise<Metadata> {
  const { platform, country } = await params
  const platformData = getPlatformGuide(platform)
  const data = getPlatformCountryGuide(platform, country as 'brazil' | 'mexico')
  if (!platformData || !data) {
    return { title: 'Platform Guide Not Found | CosmetCheck' }
  }

  const countryName = country === 'brazil' ? 'Brazil' : 'Mexico'
  const regulator = country === 'brazil' ? 'ANVISA' : 'COFEPRIS'

  return {
    title: `${platformData.name} Cosmetics Requirements in ${countryName} | 2025 Seller Guide | CosmetCheck`,
    description: `Complete compliance guide for selling cosmetics on ${platformData.name} in ${countryName}. ${regulator} requirements, prohibited products, seller checklist, and category-specific restrictions.`,
    alternates: {
      canonical: `https://cosmetcheck.com/platforms/${platform}/${country}`,
      languages: {
        'en': `/platforms/${platform}/${country}`,
        'zh-CN': `/zh/platforms/${platform}/${country}`,
        'pt-BR': `/pt-BR/platforms/${platform}/${country}`,
        'es': `/es/platforms/${platform}/${country}`,
        'x-default': `/en/platforms/${platform}/${country}`,
      },
    },
  }
}

export default async function PlatformCountryPage({
  params,
}: {
  params: Promise<{ platform: string; country: string }>
}) {
  const { platform, country } = await params
  const platformData = getPlatformGuide(platform)
  const data = getPlatformCountryGuide(platform, country as 'brazil' | 'mexico')

  if (!platformData || !data) {
    notFound()
  }

  const countryName = data.countryName
  const isBrazil = country === 'brazil'
  const regulator = isBrazil ? 'ANVISA' : 'COFEPRIS'
  const flag = isBrazil ? '🇧🇷' : '🇲🇽'

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://cosmetcheck.com' },
      { '@type': 'ListItem', position: 2, name: 'Platforms', item: 'https://cosmetcheck.com/platforms' },
      { '@type': 'ListItem', position: 3, name: platformData.name, item: `https://cosmetcheck.com/platforms/${platform}` },
      { '@type': 'ListItem', position: 4, name: countryName, item: `https://cosmetcheck.com/platforms/${platform}/${country}` },
    ],
  }

  // FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <div className="min-h-screen bg-[#0F1419] text-[#E8ECF0]">
      {/* JSON-LD Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Header */}
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
          <a href="/batch" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-[#0F1419] text-sm font-semibold rounded-lg transition-colors">
            Check Now
          </a>
        </div>
      </header>

      {/* Breadcrumb + Back */}
      <section className="pt-28 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/platforms" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Platforms
          </Link>
          <nav className="flex items-center gap-2 text-sm text-white/40 flex-wrap">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/platforms" className="hover:text-white/70 transition-colors">Platforms</Link>
            <span>/</span>
            <Link href={`/platforms/${platform}`} className="hover:text-white/70 transition-colors">{platformData.name}</Link>
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
                <ShoppingBag className="w-7 h-7 text-[#1E6BB8]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-heading">
                  {platformData.name} Cosmetics Seller Guide — {flag} {countryName}
                </h1>
                <p className="text-sm text-white/50 mt-2 leading-relaxed">
                  {data.overview}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cosmetics Policy */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl overflow-hidden">
            <div className="px-6 sm:px-8 py-6 border-b border-[#252530]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white/90">Cosmetics Policy</h2>
                  <p className="text-sm text-white/40">{regulator} requirements on {platformData.name}</p>
                </div>
              </div>
            </div>
            <div className="p-6 sm:p-8 space-y-5">
              {/* Allowed */}
              <div className="flex items-start gap-3">
                <ClipboardCheck className="w-5 h-5 text-[#1E6BB8] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-white/40 mb-1">Cosmetics Allowed</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${data.cosmeticsPolicy.allowed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {data.cosmeticsPolicy.allowed ? 'Yes — with restrictions' : 'No'}
                  </span>
                </div>
              </div>

              {/* Registration Required */}
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-[#1E6BB8] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-white/40 mb-1">Registration Required</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${data.cosmeticsPolicy.registrationRequired ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    {data.cosmeticsPolicy.registrationRequired ? 'Yes' : 'No'}
                  </span>
                  {data.cosmeticsPolicy.documentsNeeded.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {data.cosmeticsPolicy.documentsNeeded.map((doc, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                          <span className="w-1 h-1 rounded-full bg-[#1E6BB8] mt-1.5 shrink-0" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Restrictions */}
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-white/40 mb-2">Key Restrictions</p>
                  <ul className="space-y-1.5">
                    {data.cosmeticsPolicy.restrictions.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Prohibited Categories */}
              {data.cosmeticsPolicy.prohibitedCategories.length > 0 && (
                <div className="pt-4 border-t border-[#252530]">
                  <div className="flex items-center gap-2 mb-2">
                    <Ban className="w-4 h-4 text-red-400" />
                    <p className="text-sm text-white/40">Prohibited Categories</p>
                  </div>
                  <ul className="space-y-1">
                    {data.cosmeticsPolicy.prohibitedCategories.map((cat, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-400/80">
                        <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
                        {cat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Seller Requirements */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl overflow-hidden">
            <div className="px-6 sm:px-8 py-5 border-b border-[#252530] flex items-center gap-3">
              <ClipboardCheck className="w-5 h-5 text-[#1E6BB8]" />
              <h2 className="text-lg font-semibold text-white/90">Seller Requirements</h2>
            </div>
            <div className="p-6 sm:p-8">
              <div className="grid sm:grid-cols-2 gap-4">
                <ReqCard
                  label="Account Type"
                  value={data.sellerRequirements.accountType}
                  icon={<ShoppingBag className="w-4 h-4 text-[#1E6BB8]" />}
                />
                <ReqCard
                  label="Tax ID Required"
                  value={data.sellerRequirements.taxIdRequired ? 'Yes' : 'No'}
                  status={data.sellerRequirements.taxIdRequired ? 'warning' : 'success'}
                  icon={<FileText className="w-4 h-4 text-[#1E6BB8]" />}
                />
                <ReqCard
                  label="Local Entity Required"
                  value={data.sellerRequirements.localEntityRequired ? 'Yes' : 'No'}
                  status={data.sellerRequirements.localEntityRequired ? 'warning' : 'success'}
                  icon={<Shield className="w-4 h-4 text-[#1E6BB8]" />}
                />
                <ReqCard
                  label="Responsible Technician (PTR)"
                  value={data.sellerRequirements.responsibleTechnicianRequired ? 'Required' : 'Not Required'}
                  status={data.sellerRequirements.responsibleTechnicianRequired ? 'warning' : 'success'}
                  icon={<ClipboardCheck className="w-4 h-4 text-[#1E6BB8]" />}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Listing Requirements */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <FileText className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-white/90">Listing Requirements</h2>
            </div>
            <ul className="space-y-3">
              {data.listingRequirements.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                  <span className="text-sm text-white/70">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Common Violations */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-semibold text-white/90">Common Violations</h2>
            </div>
            <ul className="space-y-3">
              {data.commonViolations.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                  <span className="text-sm text-white/70">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Compliance Checklist */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white/90">Compliance Checklist</h2>
            </div>
            <ul className="space-y-3">
              {data.complianceChecklist.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs text-emerald-400 font-medium">{i + 1}</span>
                  </span>
                  <span className="text-sm text-white/70">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Category Guides */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#1E6BB8]" />
            Category-Specific Requirements
          </h2>
          <div className="space-y-4">
            {data.categoryGuides.map((cat) => (
              <div key={cat.categorySlug} className="bg-[#1A1A24] border border-[#252530] rounded-2xl overflow-hidden">
                <div className="px-6 sm:px-8 py-4 border-b border-[#252530]">
                  <h3 className="text-base font-semibold text-white/90">{cat.categoryName}</h3>
                </div>
                <div className="p-6 sm:p-8 space-y-4">
                  {cat.specificRestrictions.length > 0 && (
                    <div>
                      <p className="text-xs text-white/40 mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        Specific Restrictions
                      </p>
                      <ul className="space-y-1.5">
                        {cat.specificRestrictions.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                            <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {cat.documentationRequired.length > 0 && (
                    <div>
                      <p className="text-xs text-white/40 mb-2 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#1E6BB8]" />
                        Documentation Required
                      </p>
                      <ul className="space-y-1.5">
                        {cat.documentationRequired.map((d, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                            <span className="w-1 h-1 rounded-full bg-[#1E6BB8] mt-1.5 shrink-0" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {cat.examples.length > 0 && (
                    <div className="pt-3 border-t border-[#252530]">
                      <p className="text-xs text-white/40 mb-2">Examples</p>
                      <ul className="space-y-1.5">
                        {cat.examples.map((ex, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                            <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                            {ex}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-5 h-5 text-[#1E6BB8]" />
              <h2 className="text-lg font-semibold text-white/90">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-5">
              {data.faq.map((f, i) => (
                <div key={i} className="border-b border-[#252530] last:border-0 pb-5 last:pb-0">
                  <h3 className="text-sm font-medium text-white/90 mb-2">{f.question}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Regulations */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white/90 mb-4">Related Regulations</h2>
            <div className="flex flex-wrap gap-3">
              {data.relatedRegulations.map((reg) => (
                <Link
                  key={reg}
                  href={reg}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F1419] border border-[#252530] hover:border-[#0A4D8C]/40 hover:text-[#1E6BB8] transition-all text-sm text-white/60 rounded-xl"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {reg}
                </Link>
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
              <Sparkles className="w-8 h-8 text-[#1E6BB8]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Ready to List on {platformData.name}?
            </h2>
            <p className="text-white/50 mb-8 max-w-xl mx-auto">
              Verify your cosmetic ingredients comply with {regulator} regulations before creating your {platformData.name} listings. Avoid rejections and account suspensions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/batch"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-[#0F1419] font-semibold rounded-xl transition-all"
              >
                Check Your Ingredients
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/platforms/${platform}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A24] hover:bg-[#252530] text-white/80 font-medium rounded-xl border border-[#252530] transition-all"
              >
                Back to {platformData.name} Overview
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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

function ReqCard({
  label,
  value,
  status,
  icon,
}: {
  label: string
  value: string
  status?: 'success' | 'warning' | 'default'
  icon: React.ReactNode
}) {
  const statusColors = {
    success: 'text-emerald-400',
    warning: 'text-amber-400',
    default: 'text-white/80',
  }
  return (
    <div className="bg-[#0F1419] rounded-xl p-4 border border-[#252530]">
      <div className="flex items-center gap-2 mb-1.5">
        {icon}
        <span className="text-xs text-white/40">{label}</span>
      </div>
      <span className={`text-sm font-medium ${statusColors[status ?? 'default']}`}>{value}</span>
    </div>
  )
}
