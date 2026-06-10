import { Metadata } from 'next'
import Link from 'next/link'

export const runtime = 'edge'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isPT = locale === 'pt-BR'
  return {
    title: isPT
      ? 'Guia ANVISA 2025 | Ingredientes Proibidos e Compliance de Cosméticos no Brasil'
      : 'ANVISA Guide 2025 | Banned Ingredients & Cosmetic Compliance in Brazil',
    description: isPT
      ? 'Lista atualizada de ingredientes proibidos pela ANVISA. Verifique a conformidade dos seus cosméticos em segundos com a CosmetCheck.'
      : 'Updated list of ANVISA banned ingredients. Check your cosmetics compliance in seconds with CosmetCheck.',
    keywords: isPT
      ? ['ANVISA', 'ingredientes proibidos', 'cosméticos Brasil', 'compliance ANVISA', 'RDC 665']
      : ['ANVISA', 'banned ingredients', 'Brazil cosmetics', 'ANVISA compliance', 'RDC 665'],
    alternates: {
      canonical: `https://cosmetcheck.com/${locale}/compliance/brazil-anvisa`,
      languages: {
        'pt-BR': 'https://cosmetcheck.com/pt-BR/compliance/brazil-anvisa',
        'es-MX': 'https://cosmetcheck.com/es-MX/compliance/brazil-anvisa',
        'en': 'https://cosmetcheck.com/en/compliance/brazil-anvisa',
        'x-default': 'https://cosmetcheck.com/en',
      },
    },
  }
}

export default async function BrazilAnvisaPage({ params }: Props) {
  const { locale } = await params
  const isPT = locale === 'pt-BR'
  const isES = locale === 'es-MX'

  const t = {
    title: isPT
      ? 'Guia Completo ANVISA: Compliance de Cosméticos no Brasil'
      : isES
        ? 'Guía Completa ANVISA: Cumplimiento de Cosméticos en Brasil'
        : 'Complete ANVISA Guide: Cosmetics Compliance in Brazil',
    subtitle: isPT
      ? 'Tudo o que você precisa saber para vender cosméticos legalmente no Brasil'
      : isES
        ? 'Todo lo que necesitas saber para vender cosméticos legalmente en Brasil'
        : 'Everything you need to know to sell cosmetics legally in Brazil',
    whatIsAnvisa: isPT
      ? 'O que é a ANVISA?'
      : isES
        ? '¿Qué es la ANVISA?'
        : 'What is ANVISA?',
    whatIsAnvisaDesc: isPT
      ? 'A Agência Nacional de Vigilância Sanitária (ANVISA) é o órgão brasileiro responsável pela regulação de produtos de saúde, incluindo cosméticos. Ela define quais ingredientes podem ser usados, em quais concentrações e como os produtos devem ser rotulados.'
      : isES
        ? 'La Agencia Nacional de Vigilancia Sanitaria (ANVISA) es el organismo brasileño responsable de la regulación de productos de salud, incluidos los cosméticos. Define qué ingredientes pueden usarse, en qué concentraciones y cómo deben etiquetarse los productos.'
        : 'The Brazilian Health Regulatory Agency (ANVISA) is the Brazilian body responsible for regulating health products, including cosmetics. It defines which ingredients can be used, in what concentrations, and how products must be labeled.',
    prohibitedTitle: isPT
      ? 'Ingredientes Proibidos pela ANVISA'
      : isES
        ? 'Ingredientes Prohibidos por la ANVISA'
        : 'Ingredients Banned by ANVISA',
    restrictedTitle: isPT
      ? 'Ingredientes Restritos (Concentração Limitada)'
      : isES
        ? 'Ingredientes Restringidos (Concentración Limitada)'
        : 'Restricted Ingredients (Limited Concentration)',
    howToCheck: isPT
      ? 'Como Verificar se Seu Produto Está em Conformidade'
      : isES
        ? 'Cómo Verificar si su Producto Cumple con la Normativa'
        : 'How to Check if Your Product is Compliant',
    howToCheckDesc: isPT
      ? 'Use a CosmetCheck para verificar automaticamente seus ingredientes contra a lista mais recente da ANVISA. Basta colar a lista de ingredientes e receber um relatório completo em segundos.'
      : isES
        ? 'Use CosmetCheck para verificar automáticamente sus ingredientes contra la lista más reciente de la ANVISA. Simplemente pegue la lista de ingredientes y reciba un informe completo en segundos.'
        : 'Use CosmetCheck to automatically check your ingredients against the latest ANVISA list. Just paste the ingredient list and receive a complete report in seconds.',
    ctaButton: isPT
      ? 'Verificar Seu Produto Agora'
      : isES
        ? 'Verificar Su Producto Ahora'
        : 'Check Your Product Now',
    ctaFree: isPT
      ? '10 verificações gratuitas'
      : isES
        ? '10 verificaciones gratuitas'
        : '10 free checks',
    faqTitle: isPT ? 'Perguntas Frequentes' : isES ? 'Preguntas Frecuentes' : 'Frequently Asked Questions',
  }

  const faqs = [
    {
      q: isPT
        ? 'Quais são os ingredientes mais comuns que levam à reprovação na ANVISA?'
        : 'What are the most common ingredients that lead to ANVISA rejection?',
      a: isPT
        ? 'Hidroquinona em concentrações acima de 2%, mercúrio e seus compostos, chumbo em cosméticos para lábios e olhos, e formaldeído em concentrações não autorizadas são os mais frequentes.'
        : 'Hydroquinone above 2%, mercury and its compounds, lead in lip and eye cosmetics, and formaldehyde in unauthorized concentrations are the most frequent.',
    },
    {
      q: isPT
        ? 'Preciso registrar meu produto na ANVISA antes de vender?'
        : 'Do I need to register my product with ANVISA before selling?',
      a: isPT
        ? 'Sim, produtos importados precisam de registro sanitário na ANVISA. Produtos nacionais geralmente precisam apenas de notificação, dependendo da categoria de risco.'
        : 'Yes, imported products need sanitary registration with ANVISA. Domestic products generally only need notification, depending on the risk category.',
    },
    {
      q: isPT
        ? 'A CosmetCheck verifica todos os ingredientes da ANVISA?'
        : 'Does CosmetCheck check all ANVISA ingredients?',
      a: isPT
        ? 'Sim, nosso banco de dados é atualizado regularmente com as últimas listas da ANVISA, incluindo ingredientes proibidos, restritos e os limites de concentração permitidos.'
        : 'Yes, our database is regularly updated with the latest ANVISA lists, including banned, restricted ingredients and permitted concentration limits.',
    },
  ]

  // JSON-LD: HowTo + FAQPage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
      },
      {
        '@type': 'HowTo',
        name: isPT ? 'Como verificar conformidade ANVISA' : 'How to check ANVISA compliance',
        description: isPT
          ? 'Passos para verificar se seu cosmético está em conformidade com a ANVISA'
          : 'Steps to check if your cosmetic is compliant with ANVISA',
        step: [
          {
            '@type': 'HowToStep',
            name: isPT ? 'Copie a lista de ingredientes' : 'Copy the ingredient list',
            text: isPT ? 'Copie a lista de ingredientes do rótulo do seu produto' : 'Copy the ingredient list from your product label',
          },
          {
            '@type': 'HowToStep',
            name: isPT ? 'Cole na CosmetCheck' : 'Paste into CosmetCheck',
            text: isPT ? 'Cole a lista no campo de verificação da CosmetCheck' : 'Paste the list into the CosmetCheck verification field',
          },
          {
            '@type': 'HowToStep',
            name: isPT ? 'Receba o relatório' : 'Receive the report',
            text: isPT ? 'Receba um relatório completo de conformidade em segundos' : 'Receive a complete compliance report in seconds',
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `https://cosmetcheck.com/${locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Compliance',
            item: `https://cosmetcheck.com/${locale}/compliance`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: isPT ? 'Brasil ANVISA' : 'Brazil ANVISA',
            item: `https://cosmetcheck.com/${locale}/compliance/brazil-anvisa`,
          },
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#0F1419]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#0A4D8C] via-[#1E6BB8] to-[#00A86B]">
        <div className="container-custom text-center max-w-3xl">
          <nav className="text-sm text-white/70 mb-6">
            <Link href={`/${locale}`} className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">{isPT ? 'Brasil ANVISA' : 'Brazil ANVISA'}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">{t.title}</h1>
          <p className="text-lg text-white/90">{t.subtitle}</p>
        </div>
      </section>

      <div className="container-custom max-w-4xl py-12 space-y-16">
        {/* What is ANVISA */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.whatIsAnvisa}</h2>
          <p className="text-gray-300 leading-relaxed">{t.whatIsAnvisaDesc}</p>
        </section>

        {/* Prohibited ingredients */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.prohibitedTitle}</h2>
          <div className="bg-[#1A1A24] border border-[#252530] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#252530]">
                  <th className="text-left text-white p-4">{isPT ? 'Ingrediente' : 'Ingredient'}</th>
                  <th className="text-left text-white p-4">{isPT ? 'Status' : 'Status'}</th>
                  <th className="text-left text-white p-4">{isPT ? 'Notas' : 'Notes'}</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {[
                  { name: 'Hidroquinona', status: isPT ? 'Proibido > 2%' : 'Banned > 2%', note: isPT ? 'Clareamento de pele' : 'Skin lightening' },
                  { name: 'Mercúrio / Compostos', status: isPT ? 'Proibido' : 'Banned', note: isPT ? 'Todos os cosméticos' : 'All cosmetics' },
                  { name: 'Chumbo / Compostos', status: isPT ? 'Proibido' : 'Banned', note: isPT ? 'Lábios e olhos' : 'Lips and eyes' },
                  { name: 'Formaldeído', status: isPT ? 'Restrito' : 'Restricted', note: isPT ? 'Alisamento apenas' : 'Straightening only' },
                  { name: 'Triclosan', status: isPT ? 'Restrito' : 'Restricted', note: isPT ? 'Higiene pessoal' : 'Personal hygiene' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[#252530] last:border-b-0">
                    <td className="p-4 font-medium">{row.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${row.status.includes(isPT ? 'Proib' : 'Ban') ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Restricted ingredients */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.restrictedTitle}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'Ácido Salicílico', limit: '≤ 2%', type: isPT ? 'Deixado na pele' : 'Leave-on' },
              { name: 'Peróxido de Benzoíla', limit: '≤ 5%', type: isPT ? 'Antiacne' : 'Anti-acne' },
              { name: 'Ácido Glicólico', limit: '≤ 10%', type: isPT ? 'Esfoliante' : 'Exfoliant' },
              { name: 'Retinol', limit: '≤ 1%', type: isPT ? 'Anti-envelhecimento' : 'Anti-aging' },
            ].map((item, i) => (
              <div key={i} className="bg-[#1A1A24] border border-[#252530] rounded-xl p-4">
                <h3 className="font-semibold text-white">{item.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{isPT ? 'Limite' : 'Limit'}: <span className="text-amber-400 font-medium">{item.limit}</span></p>
                <p className="text-xs text-gray-500 mt-1">{item.type}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="p-8 rounded-2xl bg-gradient-to-r from-[#0A4D8C]/20 to-[#00A86B]/20 border border-[#0A4D8C]/30 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">{t.howToCheck}</h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">{t.howToCheckDesc}</p>
          <Link
            href={`/${locale}`}
            className="inline-block px-8 py-4 rounded-xl bg-[#00A86B] text-white font-bold text-lg hover:bg-[#00A86B]/90 transition-colors"
          >
            {t.ctaButton}
          </Link>
          <p className="text-sm text-gray-400 mt-3">{t.ctaFree}</p>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">{t.faqTitle}</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#1A1A24] border border-[#252530] rounded-xl p-6">
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
