import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  getIngredientBySlug,
  getAllSlugs,
  getAlternatives,
  getStatusColor,
  getStatusIcon,
} from '@/lib/ingredient-data'
import { getIngredientSEO, getRelatedSlugs } from '@/data/ingredients-seo'
import { categoryLabels } from '@/data/category-index'
import {
  ArrowLeft,
  ArrowRight,
  FlaskConical,
  AlertTriangle,
  ShieldCheck,
  FileText,
  ExternalLink,
  Sparkles,
  Ban,
} from 'lucide-react'

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const ingredient = getIngredientBySlug(slug)
  if (!ingredient) {
    return { title: 'Ingredient Not Found | CosmetCheck' }
  }

  const seo = getIngredientSEO(slug)
  if (seo) {
    return {
      title: seo.metaTitle,
      description: seo.metaDescription,
      keywords: `${ingredient.name} ban Brazil, ${ingredient.name} ANVISA, ${ingredient.name} COFEPRIS, ${ingredient.inci} regulation, cosmetic ingredient compliance`,
      openGraph: {
        title: seo.metaTitle,
        description: seo.metaDescription,
        url: `https://cosmetcheck.com/ingredient/${slug}`,
        siteName: 'CosmetCheck',
        type: 'article',
      },
      alternates: {
        canonical: `https://cosmetcheck.com/ingredient/${slug}`,
      },
    }
  }

  const brazilStatus = ingredient.status.brazil.status
  const isBanned = brazilStatus === 'banned' || ingredient.status.mexico?.status === 'banned'

  return {
    title: `Is ${ingredient.name} Banned in Brazil & Mexico? | ANVISA & COFEPRIS Status | CosmetCheck`,
    description: `${ingredient.name} is ${brazilStatus} in Brazil (${ingredient.status.brazil.regulation})${ingredient.status.mexico ? ` and ${ingredient.status.mexico.status} in Mexico (${ingredient.status.mexico.regulation})` : ''}. ${ingredient.whyBanned ?? ingredient.description.slice(0, 120)}... Find compliant alternatives and check your product free.`,
    keywords: `${ingredient.name} ban Brazil, ${ingredient.name} ANVISA, ${ingredient.name} COFEPRIS, ${ingredient.inci} regulation, cosmetic ingredient compliance`,
    openGraph: {
      title: `${ingredient.name} — ${isBanned ? 'Banned' : 'Restricted'} in Brazil & Mexico`,
      description: `Check regulatory status, find compliant alternatives, and verify your product formula.`,
      url: `https://cosmetcheck.com/ingredient/${slug}`,
      siteName: 'CosmetCheck',
      type: 'article',
    },
    alternates: {
      canonical: `https://cosmetcheck.com/ingredient/${slug}`,
    },
  }
}

export default async function IngredientPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ingredient = getIngredientBySlug(slug)
  if (!ingredient) {
    notFound()
  }

  const alternatives = getAlternatives(ingredient.alternatives)
  const brazilColors = getStatusColor(ingredient.status.brazil.status)
  const mexicoColors = ingredient.status.mexico
    ? getStatusColor(ingredient.status.mexico.status)
    : null

  const isBanned =
    ingredient.status.brazil.status === 'banned' ||
    ingredient.status.mexico?.status === 'banned'

  // FAQ structured data - use SEO enrichment if available
  const seo = getIngredientSEO(slug)
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: seo?.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })) ?? [
      {
        '@type': 'Question',
        name: `Is ${ingredient.name} banned in Brazil?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${ingredient.name} is ${ingredient.status.brazil.status} in Brazil under ${ingredient.status.brazil.regulation}. ${ingredient.status.brazil.status === 'banned' ? 'It is completely prohibited in cosmetic products.' : ingredient.status.brazil.limit ? `The maximum allowed concentration is ${ingredient.status.brazil.limit}.` : 'It is allowed without concentration restrictions.'}`,
        },
      },
      ...(ingredient.status.mexico
        ? [
            {
              '@type': 'Question',
              name: `Is ${ingredient.name} banned in Mexico?`,
              acceptedAnswer: {
                '@type': 'Answer',
                text: `${ingredient.name} is ${ingredient.status.mexico.status} in Mexico under ${ingredient.status.mexico.regulation}. ${ingredient.status.mexico.status === 'banned' ? 'It is completely prohibited in cosmetic products.' : ingredient.status.mexico.limit ? `The maximum allowed concentration is ${ingredient.status.mexico.limit}.` : 'It is allowed without concentration restrictions.'}`,
              },
            },
          ]
        : []),
      {
        '@type': 'Question',
        name: `What are compliant alternatives to ${ingredient.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Compliant alternatives to ${ingredient.name} include: ${alternatives.map((a) => a.name).join(', ')}. These ingredients can achieve similar results while meeting Brazil ANVISA and Mexico COFEPRIS regulations.`,
        },
      },
      {
        '@type': 'Question',
        name: `Why is ${ingredient.name} ${isBanned ? 'banned' : 'restricted'} in cosmetics?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: ingredient.whyBanned ?? ingredient.description,
        },
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#0F1419] text-[#E8ECF0]">
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />

      {/* Breadcrumb + Back */}
      <section className="pt-28 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/ingredients"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Database
          </Link>
          <nav className="flex items-center gap-2 text-sm text-white/40">
            <Link href="/" className="hover:text-white/70 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/ingredients"
              className="hover:text-white/70 transition-colors"
            >
              Ingredients
            </Link>
            <span>/</span>
            <span className="text-white/70">{ingredient.name}</span>
          </nav>
        </div>
      </section>

      {/* Hero Status Card */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 sm:px-8 py-6 border-b border-[#252530]">
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                    isBanned ? 'bg-red-500/10' : 'bg-amber-500/10'
                  }`}
                >
                  {isBanned ? (
                    <Ban className="w-7 h-7 text-red-400" />
                  ) : (
                    <AlertTriangle className="w-7 h-7 text-amber-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-bold font-heading">
                      {ingredient.name}
                    </h1>
                    <StatusBadge status={ingredient.status.brazil.status} />
                  </div>
                  <p className="text-sm text-white/40 font-mono mt-1">
                    INCI: {ingredient.inci} · CAS: {ingredient.cas}
                  </p>
                  <p className="text-sm text-white/50 mt-2">
                    {ingredient.commonUse}
                  </p>
                </div>
              </div>
            </div>

            {/* Country Status Grid */}
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#252530]">
              {/* Brazil */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🇧🇷</span>
                  <h2 className="font-semibold text-white/90">Brazil (ANVISA)</h2>
                </div>
                <div className="space-y-3">
                  <StatusRow label="Status">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-sm font-medium ${brazilColors.bg} ${brazilColors.text} ${brazilColors.border}`}
                    >
                      {getStatusIcon(ingredient.status.brazil.status)}
                      {brazilColors.label}
                    </span>
                  </StatusRow>
                  <StatusRow label="Regulation">
                    <span className="text-sm text-white/70 font-mono">
                      {ingredient.status.brazil.regulation}
                    </span>
                  </StatusRow>
                  <StatusRow label="Effective Since">
                    <span className="text-sm text-white/70">
                      {ingredient.status.brazil.since}
                    </span>
                  </StatusRow>
                  {ingredient.status.brazil.limit && (
                    <StatusRow label="Max Limit">
                      <span className="text-sm text-amber-400 font-medium">
                        {ingredient.status.brazil.limit}
                      </span>
                    </StatusRow>
                  )}
                  {ingredient.status.brazil.note && (
                    <StatusRow label="Note">
                      <span className="text-sm text-white/50">
                        {ingredient.status.brazil.note}
                      </span>
                    </StatusRow>
                  )}
                </div>
              </div>

              {/* Mexico */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🇲🇽</span>
                  <h2 className="font-semibold text-white/90">Mexico (COFEPRIS)</h2>
                </div>
                {ingredient.status.mexico ? (
                  <div className="space-y-3">
                    <StatusRow label="Status">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-sm font-medium ${mexicoColors!.bg} ${mexicoColors!.text} ${mexicoColors!.border}`}
                      >
                        {getStatusIcon(ingredient.status.mexico.status)}
                        {mexicoColors!.label}
                      </span>
                    </StatusRow>
                    <StatusRow label="Regulation">
                      <span className="text-sm text-white/70 font-mono">
                        {ingredient.status.mexico.regulation}
                      </span>
                    </StatusRow>
                    <StatusRow label="Effective Since">
                      <span className="text-sm text-white/70">
                        {ingredient.status.mexico.since}
                      </span>
                    </StatusRow>
                    {ingredient.status.mexico.limit && (
                      <StatusRow label="Max Limit">
                        <span className="text-sm text-amber-400 font-medium">
                          {ingredient.status.mexico.limit}
                        </span>
                      </StatusRow>
                    )}
                    {ingredient.status.mexico.note && (
                      <StatusRow label="Note">
                        <span className="text-sm text-white/50">
                          {ingredient.status.mexico.note}
                        </span>
                      </StatusRow>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-sm text-white/20">
                      Mexico data coming soon
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action */}
            <div className="px-6 sm:px-8 py-4 border-t border-[#252530] bg-[#0A4D8C]/5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-sm text-white/50">
                  Check if your product contains {ingredient.name} and get a full
                  compliance report.
                </p>
                <Link href="/">
                  <Button className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-semibold shrink-0">
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    Check My Product
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Description */}
          <ContentCard icon={FileText} title={`What is ${ingredient.name}?`}>
            <p className="text-white/70 leading-relaxed">
              {ingredient.description}
            </p>
          </ContentCard>

          {/* Why Banned / Restricted */}
          {ingredient.whyBanned && (
            <ContentCard icon={AlertTriangle} title={`Why is ${ingredient.name} ${isBanned ? 'Banned' : 'Restricted'}?`}>
              <p className="text-white/70 leading-relaxed">
                {ingredient.whyBanned}
              </p>
            </ContentCard>
          )}

          {/* Health Risks */}
          {ingredient.healthRisks.length > 0 && (
            <ContentCard icon={Ban} title="Health Risks & Safety Concerns">
              <ul className="space-y-2">
                {ingredient.healthRisks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                    <span className="text-white/70">{risk}</span>
                  </li>
                ))}
              </ul>
            </ContentCard>
          )}

          {/* Compliant Alternatives */}
          {alternatives.length > 0 && (
            <ContentCard icon={ShieldCheck} title="Compliant Alternatives">
              <p className="text-white/50 mb-4">
                These ingredients can achieve similar results while complying with
                Brazil ANVISA and Mexico COFEPRIS regulations:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {alternatives.map((alt) => (
                  <Link
                    key={alt.slug}
                    href={`/ingredient/${alt.slug}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#0F1419] border border-[#252530] hover:border-[#0A4D8C]/40 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white group-hover:text-[#1E6BB8] transition-colors truncate">
                        {alt.name}
                      </p>
                      <p className="text-xs text-white/40">{alt.commonUse}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#1E6BB8] transition-colors ml-auto shrink-0" />
                  </Link>
                ))}
              </div>
            </ContentCard>
          )}

          {/* Related Regulation Links */}
          <ContentCard icon={ExternalLink} title="Official Regulation Sources">
            <div className="space-y-2">
              <a
                href="https://www.gov.br/anvisa/pt-br"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-[#0F1419] border border-[#252530] hover:border-[#0A4D8C]/40 transition-colors"
              >
                <span className="text-lg">🇧🇷</span>
                <div>
                  <p className="text-sm text-white/80">
                    ANVISA — Brazilian Health Regulatory Agency
                  </p>
                  <p className="text-xs text-white/30">gov.br/anvisa</p>
                </div>
                <ExternalLink className="w-4 h-4 text-white/20 ml-auto" />
              </a>
              <a
                href="https://www.gob.mx/cofepris"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-[#0F1419] border border-[#252530] hover:border-[#0A4D8C]/40 transition-colors"
              >
                <span className="text-lg">🇲🇽</span>
                <div>
                  <p className="text-sm text-white/80">
                    COFEPRIS — Federal Commission for Protection Against Health
                    Risks (Mexico)
                  </p>
                  <p className="text-xs text-white/30">gob.mx/cofepris</p>
                </div>
                <ExternalLink className="w-4 h-4 text-white/20 ml-auto" />
              </a>
            </div>
          </ContentCard>

          {/* FAQ Section (for SEO + users) */}
          <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold font-heading mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {seo?.faq.map((item, i) => (
                <FAQItem key={i} question={item.question} answer={item.answer} />
              )) ?? (
                <>
                  <FAQItem
                    question={`Is ${ingredient.name} banned in Brazil?`}
                    answer={`${ingredient.name} is ${ingredient.status.brazil.status} in Brazil under ${ingredient.status.brazil.regulation}. ${ingredient.status.brazil.status === 'banned' ? 'It is completely prohibited in cosmetic products.' : ingredient.status.brazil.limit ? `The maximum allowed concentration is ${ingredient.status.brazil.limit}.` : 'It is allowed without concentration restrictions.'}`}
                  />
                  {ingredient.status.mexico && (
                    <FAQItem
                      question={`Is ${ingredient.name} banned in Mexico?`}
                      answer={`${ingredient.name} is ${ingredient.status.mexico.status} in Mexico under ${ingredient.status.mexico.regulation}. ${ingredient.status.mexico.status === 'banned' ? 'It is completely prohibited in cosmetic products.' : ingredient.status.mexico.limit ? `The maximum allowed concentration is ${ingredient.status.mexico.limit}.` : 'It is allowed without concentration restrictions.'}`}
                    />
                  )}
                  <FAQItem
                    question={`What are compliant alternatives to ${ingredient.name}?`}
                    answer={`Compliant alternatives to ${ingredient.name} include: ${alternatives.map((a) => a.name).join(', ')}. These ingredients can achieve similar results while meeting Brazil ANVISA and Mexico COFEPRIS regulations.`}
                  />
                  {ingredient.whyBanned && (
                    <FAQItem
                      question={`Why is ${ingredient.name} ${isBanned ? 'banned' : 'restricted'} in cosmetics?`}
                      answer={ingredient.whyBanned}
                    />
                  )}
                  <FAQItem
                    question={`How do I check if my product contains ${ingredient.name}?`}
                    answer={`Use CosmetCheck's free AI compliance scanner. Simply paste your ingredient list, and our system will instantly flag ${ingredient.name} and any other regulated substances, then generate a compliant product listing for Brazil or Mexico.`}
                  />
                </>
              )}
            </div>
          </div>
          {/* Related Ingredients + Category Links */}
          <RelatedIngredientsBlock slug={slug} currentCategory={ingredient.category} />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#0A4D8C]/20 to-[#00A86B]/10 border border-[#0A4D8C]/30 rounded-2xl p-8 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0A4D8C]/20 flex items-center justify-center mx-auto mb-4">
              <FlaskConical className="w-8 h-8 text-[#1E6BB8]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading mb-3">
              Don&apos;t Risk Your Inventory
            </h2>
            <p className="text-white/60 max-w-lg mx-auto mb-6">
              Check your entire product formula against 2,000+ ANVISA and COFEPRIS
              regulations in 30 seconds. Get instant results + AI-generated
              compliant listings.
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-semibold h-12 px-8">
                Check My Product Free →
              </Button>
            </Link>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-white/30">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> SSL Encrypted
              </span>
              <span className="flex items-center gap-1">
                <Ban className="w-3.5 h-3.5" /> No Credit Card
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 10 Free Checks
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#252530] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            © 2025 CosmetCheck. Data sourced from ANVISA and COFEPRIS official
            regulations.
          </p>
          <div className="flex gap-6">
            <Link
              href="/ingredients"
              className="text-sm text-white/30 hover:text-white/60 transition-colors"
            >
              Ingredients
            </Link>
            <Link
              href="/blog"
              className="text-sm text-white/30 hover:text-white/60 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/"
              className="text-sm text-white/30 hover:text-white/60 transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors = getStatusColor(status as 'banned' | 'restricted' | 'allowed' | 'prescription' | 'pending')
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {getStatusIcon(status as 'banned' | 'restricted' | 'allowed' | 'prescription' | 'pending')}
      {colors.label}
    </span>
  )
}

function StatusRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-white/40 shrink-0">{label}</span>
      <div className="text-right">{children}</div>
    </div>
  )
}

function ContentCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-[#0A4D8C]/15 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-[#1E6BB8]" />
        </div>
        <h2 className="text-lg font-semibold font-heading">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-[#252530]/50 pb-6 last:border-0 last:pb-0">
      <h3 className="text-sm font-medium text-white/90 mb-2">{question}</h3>
      <p className="text-sm text-white/50 leading-relaxed">{answer}</p>
    </div>
  )
}

function RelatedIngredientsBlock({ slug, currentCategory }: { slug: string; currentCategory: string }) {
  const relatedSlugs = getRelatedSlugs(slug)
  const relatedIngredients = relatedSlugs.length > 0 
    ? relatedSlugs.map((s) => {
        const data = getIngredientBySlug(s)
        if (!data) return null
        return {
          slug: s,
          name: data.name,
          inci: data.inci,
          brazilStatus: data.status.brazil.status,
        }
      }).filter(Boolean)
    : []

  if (relatedIngredients.length === 0) return null

  const categoryLabel = categoryLabels[currentCategory] ?? currentCategory

  return (
    <div className="space-y-6 mt-8">
      {/* Related Ingredients */}
      <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold font-heading mb-4">Related Ingredients</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {relatedIngredients.slice(0, 6).map((ing) => {
            if (!ing) return null
            const colors = getStatusColor(ing.brazilStatus as 'banned' | 'restricted' | 'allowed' | 'prescription' | 'pending')
            return (
              <Link
                key={ing.slug}
                href={`/ingredient/${ing.slug}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#0F1419] border border-[#252530] hover:border-[#0A4D8C]/40 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0A4D8C]/15 flex items-center justify-center shrink-0">
                  <FlaskConical className="w-4 h-4 text-[#1E6BB8]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white group-hover:text-[#1E6BB8] transition-colors truncate">
                    {ing.name}
                  </p>
                  <p className="text-xs text-white/40 font-mono truncate">{ing.inci}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border}`}>
                  {colors.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Browse by Category */}
      <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold font-heading mb-4">Browse by Category</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/category/${currentCategory}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0F1419] border border-[#0A4D8C]/30 text-[#1E6BB8] hover:bg-[#0A4D8C]/10 transition-colors text-sm font-medium"
          >
            <span>View all {categoryLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/ingredients"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0F1419] border border-[#252530] hover:border-[#0A4D8C]/40 transition-colors text-sm text-white/70"
          >
            <span>Full Database</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href={`/status/brazil/${relatedIngredients[0]?.brazilStatus ?? 'banned'}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0F1419] border border-[#252530] hover:border-[#0A4D8C]/40 transition-colors text-sm text-white/70"
          >
            <span>Brazil {getStatusColor((relatedIngredients[0]?.brazilStatus ?? 'banned') as any).label}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
