import { Metadata } from 'next'
import Link from 'next/link'

export const runtime = 'edge'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isPT = locale === 'pt-BR'
  const isES = locale === 'es-MX'

  return {
    title: isPT
      ? 'Guias de Compliance | CosmetCheck'
      : isES
        ? 'Gu\u00edas de Cumplimiento | CosmetCheck'
        : 'Compliance Guides | CosmetCheck',
    description: isPT
      ? 'Guias completos de compliance para vender cosm\u00e9ticos na Am\u00e9rica Latina: ANVISA, COFEPRIS, e estrat\u00e9gia de mercado.'
      : isES
        ? 'Gu\u00edas completas de cumplimiento para vender cosm\u00e9ticos en Latinoam\u00e9rica: ANVISA, COFEPRIS y estrategia de mercado.'
        : 'Complete compliance guides for selling cosmetics in Latin America: ANVISA, COFEPRIS, and market entry strategy.',
    alternates: {
      canonical: `https://cosmetcheck.com/${locale}/guides`,
      languages: {
        'pt-BR': 'https://cosmetcheck.com/pt-BR/guides',
        'es-MX': 'https://cosmetcheck.com/es-MX/guides',
        'en': 'https://cosmetcheck.com/en/guides',
      },
    },
  }
}

export default async function GuidesIndexPage({ params }: Props) {
  const { locale } = await params
  const isPT = locale === 'pt-BR'
  const isES = locale === 'es-MX'

  const t = {
    title: isPT ? 'Guias de Compliance' : isES ? 'Gu\u00edas de Cumplimiento' : 'Compliance Guides',
    subtitle: isPT
      ? 'Tudo que voc\u00ea precisa saber para vender cosm\u00e9ticos legalmente na Am\u00e9rica Latina'
      : isES
        ? 'Todo lo que necesita saber para vender cosm\u00e9ticos legalmente en Latinoam\u00e9rica'
        : 'Everything you need to legally sell cosmetics in Latin America',
  }

  const guides = [
    {
      slug: 'anvisa-complete-guide',
      title: isPT
        ? 'Guia Completo ANVISA 2025'
        : isES
          ? 'Gu\u00eda Completa ANVISA 2025'
          : 'ANVISA Cosmetics Compliance Guide 2025',
      desc: isPT
        ? 'Classifica\u00e7\u00e3o de produtos, ingredientes proibidos, documenta\u00e7\u00e3o, custos e prazos para registro na ANVISA.'
        : isES
          ? 'Clasificaci\u00f3n de productos, ingredientes prohibidos, documentaci\u00f3n, costos y plazos para registro en ANVISA.'
          : 'Product classification, banned ingredients, documentation, costs, and timelines for ANVISA registration.',
      badge: isPT ? 'Brasil' : 'Brazil',
      badgeColor: 'bg-green-500/20 text-green-400',
    },
    {
      slug: 'cofepris-complete-guide',
      title: isPT
        ? 'Guia COFEPRIS 2025'
        : isES
          ? 'Gu\u00eda COFEPRIS 2025'
          : 'COFEPRIS Cosmetics Compliance Guide 2025',
      desc: isPT
        ? 'NOM-141, registro sanit\u00e1rio, representante legal e custos para vender cosm\u00e9ticos no M\u00e9xico.'
        : isES
          ? 'NOM-141, registro sanitario, representante legal y costos para vender cosm\u00e9ticos en M\u00e9xico.'
          : 'NOM-141 labeling, sanitary registration, legal representative, and costs for selling cosmetics in Mexico.',
      badge: isPT ? 'M\u00e9xico' : 'Mexico',
      badgeColor: 'bg-amber-500/20 text-amber-400',
    },
    {
      slug: 'sell-cosmetics-latam',
      title: isPT
        ? 'Como Vender Cosm\u00e9ticos na LATAM'
        : isES
          ? 'C\u00f3mo Vender Cosm\u00e9ticos en LATAM'
          : 'How to Sell Cosmetics in Latin America',
      desc: isPT
        ? 'Amazon Brasil, Mercado Livre, alf\u00e2ndega, impostos e estrat\u00e9gia de pre\u00e7os para entrar no mercado.'
        : isES
          ? 'Amazon Brasil, Mercado Libre, aduanas, impuestos y estrategia de precios para entrar al mercado.'
          : 'Amazon Brazil, Mercado Libre, customs, taxes, and pricing strategy for market entry.',
      badge: isPT ? 'Estrat\u00e9gia' : 'Strategy',
      badgeColor: 'bg-blue-500/20 text-blue-400',
    },
  ]

  return (
    <div className="min-h-screen bg-[#0F1419]">
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#0A4D8C] via-[#1E6BB8] to-[#00A86B]">
        <div className="container-custom text-center max-w-4xl">
          <nav className="text-sm text-white/70 mb-6">
            <Link href={`/${locale}`} className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">{isPT ? 'Guias' : isES ? 'Gu\u00edas' : 'Guides'}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">{t.title}</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container-custom max-w-4xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/${locale}/guides/${guide.slug}`}
                className="bg-[#1A1A24] border border-[#252530] rounded-xl p-6 hover:border-[#0A4D8C]/50 transition-colors"
              >
                <span className={`text-xs font-medium px-2 py-1 rounded ${guide.badgeColor}`}>
                  {guide.badge}
                </span>
                <h2 className="text-lg font-bold text-white mt-3 mb-2">{guide.title}</h2>
                <p className="text-sm text-gray-400">{guide.desc}</p>
                <span className="text-sm text-[#00A86B] mt-4 inline-block">
                  {isPT ? 'Ler guia' : isES ? 'Leer gu\u00eda' : 'Read guide'} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
