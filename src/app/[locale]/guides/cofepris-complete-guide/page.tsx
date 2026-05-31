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
      ? 'Guia COFEPRIS 2025 | Compliance de Cosm\u00e9ticos no M\u00e9xico'
      : isES
        ? 'Gu\u00eda COFEPRIS 2025 | Cumplimiento de Cosm\u00e9ticos en M\u00e9xico'
        : 'COFEPRIS Cosmetics Compliance Guide 2025 | Complete Mexico Handbook',
    description: isPT
      ? 'Tudo sobre registro COFEPRIS, NOM-141, ingredientes e custos para vender cosm\u00e9ticos no M\u00e9xico. Guia completo atualizado 2025.'
      : isES
        ? 'Todo sobre registro COFEPRIS, NOM-141, ingredientes y costos para vender cosm\u00e9ticos en M\u00e9xico. Gu\u00eda completa 2025.'
        : 'Complete guide to COFEPRIS cosmetics registration: NOM-141 labeling, banned ingredients, costs, timeline, and Mexico entry strategy. Updated 2025.',
    keywords: isPT
      ? ['COFEPRIS', 'compliance cosm\u00e9ticos M\u00e9xico', 'registro COFEPRIS', 'NOM-141', 'vender cosm\u00e9ticos M\u00e9xico']
      : isES
        ? ['COFEPRIS', 'cumplimiento cosm\u00e9ticos M\u00e9xico', 'registro COFEPRIS', 'NOM-141', 'vender cosm\u00e9ticos M\u00e9xico']
        : ['COFEPRIS cosmetics compliance', 'Mexico cosmetics registration', 'NOM-141 labeling', 'sell cosmetics in Mexico', 'COFEPRIS banned ingredients'],
    alternates: {
      canonical: `https://cosmetcheck.com/${locale}/guides/cofepris-complete-guide`,
      languages: {
        'pt-BR': 'https://cosmetcheck.com/pt-BR/guides/cofepris-complete-guide',
        'es-MX': 'https://cosmetcheck.com/es-MX/guides/cofepris-complete-guide',
        'en': 'https://cosmetcheck.com/en/guides/cofepris-complete-guide',
      },
    },
  }
}

export default async function CofeprisCompleteGuidePage({ params }: Props) {
  const { locale } = await params
  const isPT = locale === 'pt-BR'
  const isES = locale === 'es-MX'

  const t = {
    title: isPT
      ? 'Guia COFEPRIS 2025: Compliance de Cosm\u00e9ticos no M\u00e9xico'
      : isES
        ? 'Gu\u00eda COFEPRIS 2025: Cumplimiento de Cosm\u00e9ticos en M\u00e9xico'
        : 'COFEPRIS Cosmetics Compliance Guide 2025: Complete Mexico Handbook',
    subtitle: isPT
      ? 'Tudo sobre registro sanit\u00e1rio, NOM-141, representante legal e custos para entrar no segundo maior mercado de beleza da Am\u00e9rica Latina.'
      : isES
        ? 'Todo sobre registro sanitario, NOM-141, representante legal y costos para entrar al segundo mercado de belleza m\u00e1s grande de Latinoam\u00e9rica.'
        : 'Everything about sanitary registration, NOM-141, legal representative, and costs to enter the second-largest beauty market in Latin America.',
    whatIs: isPT ? 'O que \u00e9 a COFEPRIS?' : isES ? '\u00bfQu\u00e9 es la COFEPRIS?' : 'What is COFEPRIS?',
    nom141: isPT ? 'NOM-141: Requisitos de Rotulagem' : isES ? 'NOM-141: Requisitos de Etiquetado' : 'NOM-141: Labeling Requirements',
    registration: isPT ? 'Processo de Registro Sanit\u00e1rio' : isES ? 'Proceso de Registro Sanitario' : 'Sanitary Registration Process',
    costs: isPT ? 'Custos e Prazos (2025)' : isES ? 'Costos y Plazos (2025)' : 'Costs & Timeline (2025)',
    vsAnvisa: isPT ? 'COFEPRIS vs ANVISA: Qual escolher?' : isES ? 'COFEPRIS vs ANVISA: \u00bfCu\u00e1l elegir?' : 'COFEPRIS vs ANVISA: Which to choose first?',
    mistakes: isPT ? 'Erros Comuns no Registro COFEPRIS' : isES ? 'Errores Comunes en el Registro COFEPRIS' : 'Common COFEPRIS Registration Mistakes',
    faq: isPT ? 'Perguntas Frequentes' : isES ? 'Preguntas Frecuentes' : 'Frequently Asked Questions',
    ctaTitle: isPT ? 'Verifique Seu Produto para COFEPRIS' : isES ? 'Verifique Su Producto para COFEPRIS' : 'Check Your Product for COFEPRIS',
    ctaDesc: isPT
      ? 'A CosmetCheck verifica seus ingredientes contra as listas mais recentes da COFEPRIS e ANVISA simultaneamente.'
      : isES
        ? 'CosmetCheck verifica sus ingredientes contra las listas m\u00e1s recientes de COFEPRIS y ANVISA simult\u00e1neamente.'
        : 'CosmetCheck checks your ingredients against the latest COFEPRIS and ANVISA lists simultaneously.',
    ctaButton: isPT ? 'Verifica\u00e7\u00e3o Gratuita' : isES ? 'Verificaci\u00f3n Gratuita' : 'Free Check',
  }

  const faqs = [
    {
      q: isPT
        ? 'Preciso registrar meu produto na COFEPRIS para vender no M\u00e9xico?'
        : isES
          ? '\u00bfNecesito registrar mi producto en COFEPRIS para vender en M\u00e9xico?'
          : 'Do I need COFEPRIS registration to sell cosmetics in Mexico?',
      a: isPT
        ? 'Sim, para canais de varejo regulares e marketplaces como Mercado Libre e Amazon M\u00e9xico. Produtos para uso pessoal em bagagem t\u00eam isen\u00e7\u00f5es limitadas.'
        : isES
          ? 'S\u00ed, para canales de venta regulares y marketplaces como Mercado Libre y Amazon M\u00e9xico.'
          : 'Yes, for regular retail channels and marketplaces like Mercado Libre and Amazon Mexico. Personal-use luggage exemptions are limited.',
    },
    {
      q: isPT
        ? 'Quanto tempo leva o registro na COFEPRIS?'
        : isES
          ? '\u00bfCu\u00e1nto tiempo toma el registro en COFEPRIS?'
          : 'How long does COFEPRIS registration take?',
      a: isPT
        ? '4-8 meses para cosm\u00e9ticos padr\u00e3o. Produtos com ingredientes ativos ou protetores solar podem levar mais. O processo \u00e9 2-3x mais r\u00e1pido que a ANVISA.'
        : isES
          ? '4-8 meses para cosm\u00e9ticos est\u00e1ndar. Productos con ingredientes activos o protectores solares pueden tardar m\u00e1s.'
          : '4-8 months for standard cosmetics. Products with active ingredients or sunscreens may take longer. The process is 2-3x faster than ANVISA.',
    },
    {
      q: isPT
        ? 'Quanto custa o registro na COFEPRIS?'
        : isES
          ? '\u00bfCu\u00e1nto cuesta el registro en COFEPRIS?'
          : 'How much does COFEPRIS registration cost?',
      a: isPT
        ? '$3.000-12.000 por SKU, incluindo taxas governamentais ($500-1.500), representante legal ($1.500-4.000/ano), documenta\u00e7\u00e3o ($500-1.500) e consultoria ($2.000-6.000). Geralmente 30-50% mais barato que o Brasil.'
        : isES
          ? '$3.000-12.000 USD por SKU, incluyendo tasas gubernamentales, representante legal, documentaci\u00f3n y consultor\u00eda.'
          : '$3,000-12,000 per SKU, including government fees ($500-1,500), legal representative ($1,500-4,000/year), documentation ($500-1,500), and consulting ($2,000-6,000). Typically 30-50% cheaper than Brazil.',
    },
    {
      q: isPT
        ? 'O registro COFEPRIS \u00e9 v\u00e1lido no Brasil?'
        : isES
          ? '\u00bfEl registro de COFEPRIS es v\u00e1lido en Brasil?'
          : 'Is COFEPRIS registration valid in Brazil?',
      a: isPT
        ? 'N\u00e3o. Cada pa\u00eds exige registro pr\u00f3prio. No entanto, 60-80% da documenta\u00e7\u00e3o (avalia\u00e7\u00f5es de seguran\u00e7a, an\u00e1lise de ingredientes, certificados BPF) \u00e9 reutiliz\u00e1vel.'
        : isES
          ? 'No. Cada pa\u00eds requiere su propio registro. Sin embargo, 60-80% de la documentaci\u00f3n es reutilizable.'
          : 'No. Each country requires its own registration. However, 60-80% of documentation (safety assessments, ingredient analysis, GMP certificates) is reusable.',
    },
    {
      q: isPT
        ? 'Posso usar o mesmo r\u00f3tulo do Brasil no M\u00e9xico?'
        : isES
          ? '\u00bfPuedo usar la misma etiqueta de Brasil en M\u00e9xico?'
          : 'Can I use the same Brazil label in Mexico?',
      a: isPT
        ? 'N\u00e3o. O M\u00e9xico exige etiqueta 100% em espanhol (NOM-141). Os n\u00fameros de registro, nomes do representante legal e at\u00e9 a nomenclatura dos ingredientes diferem entre os pa\u00edses.'
        : isES
          ? 'No. M\u00e9xico exige etiqueta 100% en espa\u00f1ol (NOM-141). Los n\u00fameros de registro, nombres del representante legal y nomenclatura de ingredientes difieren.'
          : 'No. Mexico requires 100% Spanish labeling per NOM-141. Registration numbers, legal representative names, and even ingredient nomenclature differ between countries.',
    },
  ]

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
            name: 'Guides',
            item: `https://cosmetcheck.com/${locale}/guides`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: isPT ? 'Guia COFEPRIS' : isES ? 'Gu\u00eda COFEPRIS' : 'COFEPRIS Guide',
            item: `https://cosmetcheck.com/${locale}/guides/cofepris-complete-guide`,
          },
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#0F1419]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="py-16 md:py-24 bg-gradient-to-br from-[#0A4D8C] via-[#1E6BB8] to-[#00A86B]">
        <div className="container-custom text-center max-w-4xl">
          <nav className="text-sm text-white/70 mb-6">
            <Link href={`/${locale}`} className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`/${locale}/guides`} className="hover:text-white">{isPT ? 'Guias' : isES ? 'Gu\u00edas' : 'Guides'}</Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">COFEPRIS</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">{t.title}</h1>
          <p className="text-lg text-white/90 max-w-3xl mx-auto">{t.subtitle}</p>
        </div>
      </section>

      <div className="container-custom max-w-4xl py-12 space-y-16">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.whatIs}</h2>
          <p className="text-gray-300 leading-relaxed">
            {isPT
              ? 'A COFEPRIS (Comisi\u00f3n Federal para la Protecci\u00f3n contra Riesgos Sanitarios) \u00e9 a ag\u00eancia federal mexicana de prote\u00e7\u00e3o de riscos sanit\u00e1rios. Para cosm\u00e9ticos, a COFEPRIS regula: registro sanit\u00e1rio (Registro Sanitario); seguran\u00e7a de ingredientes; requisitos de rotulagem (NOM-141); padr\u00f5es de fabrica\u00e7\u00e3o; supervis\u00e3o de importa\u00e7\u00e3o e distribui\u00e7\u00e3o. O M\u00e9xico \u00e9 o segundo maior mercado de cosm\u00e9ticos da Am\u00e9rica Latina, com crescimento de e-commerce acelerado e proximidade com a cadeia de suprimentos dos EUA.'
              : isES
                ? 'La COFEPRIS (Comisi\u00f3n Federal para la Protecci\u00f3n contra Riesgos Sanitarios) es la agencia federal mexicana de protecci\u00f3n de riesgos sanitarios. Para cosm\u00e9ticos, regula: registro sanitario, seguridad de ingredientes, requisitos de etiquetado (NOM-141), est\u00e1ndares de fabricaci\u00f3n y supervisi\u00f3n de importaci\u00f3n.'
                : 'COFEPRIS (Federal Commission for Protection against Health Risks) is Mexico\'s federal health risk protection agency. For cosmetics, COFEPRIS regulates: sanitary registration (Registro Sanitario); ingredient safety; labeling requirements (NOM-141); manufacturing standards; import and distribution oversight. Mexico is the second-largest cosmetics market in Latin America, with accelerating e-commerce growth and proximity to US supply chains.'}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.nom141}</h2>
          <p className="text-gray-300 mb-4">
            {isPT
              ? 'A NOM-141-SSA1/SCF1-2012 \u00e9 a norma oficial mexicana que governa a rotulagem e ingredientes de cosm\u00e9ticos. Requisitos principais:'
              : isES
                ? 'La NOM-141-SSA1/SCF1-2012 es la norma oficial mexicana que rige el etiquetado e ingredientes de cosm\u00e9ticos. Requisitos principales:'
                : 'NOM-141-SSA1/SCF1-2012 is the Mexican Official Standard governing cosmetic labeling and ingredients. Key requirements:'}
          </p>
          <div className="space-y-3">
            {[
              isPT ? 'Texto 100% em espanhol — sem exce\u00e7\u00f5es' : isES ? 'Texto 100% en espa\u00f1ol — sin excepciones' : '100% Spanish text — no exceptions',
              isPT ? 'Unidades m\u00e9tricas apenas (gramas, mililitros)' : isES ? 'Unidades m\u00e9tricas solo (gramos, mililitros)' : 'Metric units only (grams, milliliters)',
              isPT ? 'Lista completa de ingredientes em ordem decrescente de concentra\u00e7\u00e3o' : isES ? 'Lista completa de ingredientes en orden decreciente de concentraci\u00f3n' : 'Complete ingredient list in descending concentration order',
              isPT ? 'Nome e endere\u00e7o do representante legal mexicano' : isES ? 'Nombre y direcci\u00f3n del representante legal mexicano' : 'Name and address of Mexican legal representative',
              isPT ? 'N\u00famero de registro sanit\u00e1rio (ap\u00f3s aprova\u00e7\u00e3o)' : isES ? 'N\u00famero de registro sanitario (despu\u00e9s de aprobaci\u00f3n)' : 'Health registration number (after approval)',
              isPT ? 'Avisos espec\u00edficos para tinturas de cabelo e produtos com AHA' : isES ? 'Advertencias espec\u00edficas para tintes de cabello y productos con AHA' : 'Specific warnings for hair dyes and AHA products',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#1A1A24] border border-[#252530] rounded-lg p-4">
                <span className="text-[#00A86B] font-bold">{i + 1}.</span>
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.registration}</h2>
          <div className="space-y-4">
            {[
              { step: isPT ? 'Preparar documenta\u00e7\u00e3o' : isES ? 'Preparar documentaci\u00f3n' : 'Prepare documentation', time: '1-2 months' },
              { step: isPT ? 'Submeter aplica\u00e7\u00e3o online' : isES ? 'Enviar solicitud en l\u00ednea' : 'Submit online application', time: '1-2 weeks' },
              { step: isPT ? 'Pagar taxa governamental ($500-1.500)' : isES ? 'Pagar tasa gubernamental ($500-1.500)' : 'Pay government fee ($500-1,500)', time: '1 week' },
              { step: isPT ? 'Revis\u00e3o inicial' : isES ? 'Revisi\u00f3n inicial' : 'Initial review', time: '2-3 months' },
              { step: isPT ? 'Avalia\u00e7\u00e3o t\u00e9cnica' : isES ? 'Evaluaci\u00f3n t\u00e9cnica' : 'Technical evaluation', time: '2-4 months' },
              { step: isPT ? 'Complementa\u00e7\u00e3o (se necess\u00e1rio)' : isES ? 'Complementaci\u00f3n (si es necesario)' : 'Complementation (if needed)', time: '+1-3 months' },
              { step: isPT ? 'Receber Registro Sanit\u00e1rio' : isES ? 'Recibir Registro Sanitario' : 'Receive sanitary registration', time: '1-2 weeks' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-[#1A1A24] border border-[#252530] rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#0A4D8C] text-white flex items-center justify-center text-sm font-bold">{i + 1}</span>
                  <span className="text-gray-300">{item.step}</span>
                </div>
                <span className="text-sm text-gray-500">{item.time}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-4">
            {isPT ? 'Total realista: 4-8 meses' : isES ? 'Total realista: 4-8 meses' : 'Total realistic: 4-8 months'}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.costs}</h2>
          <div className="bg-[#1A1A24] border border-[#252530] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#252530]">
                  <th className="text-left text-white p-4">{isPT ? 'Item' : 'Item'}</th>
                  <th className="text-left text-white p-4">USD</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-[#252530]"><td className="p-4">{isPT ? 'Taxa governamental' : 'Government fee'}</td><td className="p-4">$500 – $1,500</td></tr>
                <tr className="border-b border-[#252530]"><td className="p-4">{isPT ? 'Representante legal' : 'Legal representative'}</td><td className="p-4">$1,500 – $4,000/ano</td></tr>
                <tr className="border-b border-[#252530]"><td className="p-4">{isPT ? 'Prepara\u00e7\u00e3o documental' : 'Documentation prep'}</td><td className="p-4">$500 – $1,500</td></tr>
                <tr className="border-b border-[#252530]"><td className="p-4">{isPT ? 'Adapta\u00e7\u00e3o de r\u00f3tulo' : 'Label adaptation'}</td><td className="p-4">$300 – $600</td></tr>
                <tr className="border-b border-[#252530]"><td className="p-4">{isPT ? 'Testes (se necess\u00e1rio)' : 'Testing (if needed)'}</td><td className="p-4">$0 – $3,000</td></tr>
                <tr className="bg-[#0A4D8C]/10"><td className="p-4 font-semibold text-white">{isPT ? 'Total por SKU' : 'Total per SKU'}</td><td className="p-4 font-semibold text-[#00A86B]">$3,000 – $12,000</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.vsAnvisa}</h2>
          <div className="bg-[#1A1A24] border border-[#252530] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#252530]">
                  <th className="text-left text-white p-4">{isPT ? 'Aspecto' : 'Aspect'}</th>
                  <th className="text-left text-white p-4">COFEPRIS</th>
                  <th className="text-left text-white p-4">ANVISA</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-[#252530]"><td className="p-4">{isPT ? 'Taxa governamental' : 'Gov fee'}</td><td className="p-4">$500 – $1,500</td><td className="p-4">$0 – $800</td></tr>
                <tr className="border-b border-[#252530]"><td className="p-4">{isPT ? 'Prazo' : 'Timeline'}</td><td className="p-4 text-[#00A86B]">4 – 8 meses</td><td className="p-4 text-amber-400">6 – 24 meses</td></tr>
                <tr className="border-b border-[#252530]"><td className="p-4">{isPT ? 'Idioma do r\u00f3tulo' : 'Label language'}</td><td className="p-4">Espanhol</td><td className="p-4">Portugu\u00eas</td></tr>
                <tr className="border-b border-[#252530]"><td className="p-4">{isPT ? 'Filosofia de ingredientes' : 'Ingredient approach'}</td><td className="p-4">{isPT ? 'Pr\u00f3xima \u00e0 FDA' : 'Closer to FDA'}</td><td className="p-4">{isPT ? 'Lista positiva estrita' : 'Strict positive list'}</td></tr>
                <tr className="border-b border-[#252530]"><td className="p-4">{isPT ? 'Custo total por SKU' : 'Total cost per SKU'}</td><td className="p-4 text-[#00A86B]">$3K – $12K</td><td className="p-4 text-amber-400">$5K – $25K+</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-300 mt-4">
            {isPT
              ? 'Recomenda\u00e7\u00e3o: se voc\u00ea est\u00e1 escolhendo seu primeiro mercado na Am\u00e9rica Latina, o M\u00e9xico geralmente faz mais sentido como mercado de teste — \u00e9 30-50% mais barato e 2-3x mais r\u00e1pido que o Brasil.'
              : isES
                ? 'Recomendaci\u00f3n: si est\u00e1 eligiendo su primer mercado en Latinoam\u00e9rica, M\u00e9xico generalmente tiene m\u00e1s sentido como mercado de prueba.'
                : 'Recommendation: if you\'re choosing your first LATAM market, Mexico generally makes more sense as a testing ground — it\'s 30-50% cheaper and 2-3x faster than Brazil.'}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.mistakes}</h2>
          <div className="space-y-4">
            {[
              {
                title: isPT ? 'Assumir que compliance FDA = compliance COFEPRIS' : isES ? 'Asumir que cumplimiento FDA = cumplimiento COFEPRIS' : 'Assuming FDA compliance = COFEPRIS compliance',
                desc: isPT ? 'A COFEPRIS \u00e9 pr\u00f3xima \u00e0 FDA, mas a NOM-141 tem requisitos \u00fanicos. Sempre verifique contra a NOM-141 especificamente.' : isES ? 'COFEPRIS est\u00e1 cerca de la FDA, pero NOM-141 tiene requisitos \u00fanicos.' : 'COFEPRIS is closer to FDA, but NOM-141 has unique requirements. Always cross-check against NOM-141 specifically.',
              },
              {
                title: isPT ? 'Usar r\u00f3tulo em ingl\u00eas' : isES ? 'Usar etiqueta en ingl\u00e9s' : 'Using English labels',
                desc: isPT ? 'A NOM-141 exige 100% espanhol. At\u00e9 "Net Wt." ou "Made in USA" devem ser traduzidos por tradutor profissional.' : isES ? 'NOM-141 requiere 100% espa\u00f1ol. Incluso "Net Wt." debe traducirse.' : 'NOM-141 requires 100% Spanish. Even "Net Wt." or "Made in USA" must be professionally translated.',
              },
              {
                title: isPT ? 'Ignorar requisitos de divulga\u00e7\u00e3o de alerg\u00eanios' : isES ? 'Ignorar requisitos de divulgaci\u00f3n de alergenos' : 'Ignoring allergen disclosure requirements',
                desc: isPT ? 'A COFEPRIS exige divulga\u00e7\u00e3o de alerg\u00eanios espec\u00edficos de fragr\u00e2ncia no r\u00f3tulo, al\u00e9m do exigido pela FDA.' : isES ? 'COFEPRIS requiere divulgaci\u00f3n de alergenos espec\u00edficos de fragancia.' : 'COFEPRIS requires disclosure of specific fragrance allergens on the label, beyond what FDA requires.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-[#1A1A24] border border-red-500/20 rounded-xl p-6">
                <h3 className="font-semibold text-red-400 mb-2">{i + 1}. {item.title}</h3>
                <p className="text-gray-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="p-8 rounded-2xl bg-gradient-to-r from-[#0A4D8C]/20 to-[#00A86B]/20 border border-[#0A4D8C]/30 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">{t.ctaTitle}</h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">{t.ctaDesc}</p>
          <Link href={`/${locale}`} className="inline-block px-8 py-4 rounded-xl bg-[#00A86B] text-white font-bold text-lg hover:bg-[#00A86B]/90 transition-colors">
            {t.ctaButton}
          </Link>
          <p className="text-sm text-gray-400 mt-3">
            {isPT ? '10 verifica\u00e7\u00f5es gratuitas — sem cart\u00e3o de cr\u00e9dito' : isES ? '10 verificaciones gratuitas — sin tarjeta de cr\u00e9dito' : '10 free checks — no credit card required'}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-6">{t.faq}</h2>
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
