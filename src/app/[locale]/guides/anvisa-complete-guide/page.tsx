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
      ? 'Guia Completo ANVISA 2025 | Compliance de Cosméticos no Brasil'
      : isES
        ? 'Guía Completa ANVISA 2025 | Cumplimiento de Cosméticos en Brasil'
        : 'ANVISA Cosmetics Compliance Guide 2025 | Complete Brazil Handbook',
    description: isPT
      ? 'Tudo sobre registro ANVISA, ingredientes proibidos, custos e prazos para vender cosméticos no Brasil. Guia completo atualizado 2025.'
      : isES
        ? 'Todo sobre registro ANVISA, ingredientes prohibidos, costos y plazos para vender cosméticos en Brasil. Guía completa 2025.'
        : 'Complete guide to ANVISA cosmetics registration: banned ingredients, labeling requirements, costs, timeline, and common rejection reasons. Updated 2025.',
    keywords: isPT
      ? ['ANVISA', 'compliance cosméticos Brasil', 'registro ANVISA', 'ingredientes proibidos', 'RDC 665']
      : isES
        ? ['ANVISA', 'cumplimiento cosméticos Brasil', 'registro ANVISA', 'ingredientes prohibidos']
        : ['ANVISA cosmetics compliance', 'Brazil cosmetics registration', 'ANVISA banned ingredients', 'sell cosmetics in Brazil', 'RDC 665'],
    alternates: {
      canonical: `https://cosmetcheck.com/${locale}/guides/anvisa-complete-guide`,
      languages: {
        'pt-BR': 'https://cosmetcheck.com/pt-BR/guides/anvisa-complete-guide',
        'es-MX': 'https://cosmetcheck.com/es-MX/guides/anvisa-complete-guide',
        'en': 'https://cosmetcheck.com/en/guides/anvisa-complete-guide',
      },
    },
  }
}

export default async function AnvisaCompleteGuidePage({ params }: Props) {
  const { locale } = await params
  const isPT = locale === 'pt-BR'
  const isES = locale === 'es-MX'

  const t = {
    title: isPT
      ? 'Guia Completo ANVISA 2025: Compliance de Cosméticos no Brasil'
      : isES
        ? 'Guía Completa ANVISA 2025: Cumplimiento de Cosméticos en Brasil'
        : 'ANVISA Cosmetics Compliance Guide 2025: Complete Brazil Handbook',
    subtitle: isPT
      ? 'Tudo que você precisa saber para vender cosméticos legalmente no Brasil — classificação, ingredientes, documentação, custos e prazos.'
      : isES
        ? 'Todo lo que necesitas saber para vender cosméticos legalmente en Brasil — clasificación, ingredientes, documentación, costos y plazos.'
        : 'Everything you need to legally sell cosmetics in Brazil — product classification, ingredient checks, documentation, costs, and timelines.',
    whatIsAnvisa: isPT ? 'O que é a ANVISA?' : isES ? '¿Qué es la ANVISA?' : 'What is ANVISA?',
    classification: isPT ? 'Classificação do Produto (Grau 1 vs Grau 2)' : isES ? 'Clasificación del Producto (Grado 1 vs Grado 2)' : 'Product Classification (Grade 1 vs Grade 2)',
    ingredients: isPT ? 'Ingredientes Proibidos e Restritos' : isES ? 'Ingredientes Prohibidos y Restringidos' : 'Banned & Restricted Ingredients',
    documentation: isPT ? 'Documentação Necessária' : isES ? 'Documentación Requerida' : 'Required Documentation',
    ptr: isPT ? 'Responsável Técnico no Brasil (PTR)' : isES ? 'Responsable Técnico en Brasil (PTR)' : 'Brazilian Technical Responsible (PTR)',
    timeline: isPT ? 'Prazos e Custos Reais (2025)' : isES ? 'Plazos y Costos Reales (2025)' : 'Timeline & Real Costs (2025)',
    mistakes: isPT ? 'Erros Comuns que Levam à Reprovação' : isES ? 'Errores Comunes que Causan Rechazo' : 'Common Mistakes That Lead to Rejection',
    faq: isPT ? 'Perguntas Frequentes' : isES ? 'Preguntas Frecuentes' : 'Frequently Asked Questions',
    ctaTitle: isPT ? 'Verifique Seu Produto Agora' : isES ? 'Verifique Su Producto Ahora' : 'Check Your Product Now',
    ctaDesc: isPT
      ? 'Use a CosmetCheck para verificar seus ingredientes contra a lista mais recente da ANVISA em segundos.'
      : isES
        ? 'Use CosmetCheck para verificar sus ingredientes contra la lista más reciente de la ANVISA en segundos.'
        : 'Use CosmetCheck to check your ingredients against the latest ANVISA list in seconds.',
    ctaButton: isPT ? 'Verificação Gratuita' : isES ? 'Verificación Gratuita' : 'Free Check',
  }

  const faqs = [
    {
      q: isPT
        ? 'Quais são os ingredientes mais comuns que levam à reprovação na ANVISA?'
        : isES
          ? '¿Cuáles son los ingredientes más comunes que causan rechazo de la ANVISA?'
          : 'What are the most common ingredients that lead to ANVISA rejection?',
      a: isPT
        ? 'Hidroquinona acima de 2%, mercúrio e compostos, chumbo em cosméticos para lábios e olhos, e formaldeído em concentrações não autorizadas são os mais frequentes. A CosmetCheck verifica automaticamente sua lista de ingredientes contra todas essas restrições.'
        : isES
          ? 'Hidroquinona por encima de 2%, mercurio y compuestos, plomo en cosméticos para labios y ojos, y formaldehído en concentraciones no autorizadas son los más frecuentes.'
          : 'Hydroquinone above 2%, mercury and its compounds, lead in lip and eye cosmetics, and formaldehyde in unauthorized concentrations are the most frequent. CosmetCheck automatically checks your ingredient list against all these restrictions.',
    },
    {
      q: isPT
        ? 'Preciso registrar meu produto na ANVISA antes de vender no Brasil?'
        : isES
          ? '¿Necesito registrar mi producto en la ANVISA antes de vender en Brasil?'
          : 'Do I need to register my product with ANVISA before selling in Brazil?',
      a: isPT
        ? 'Sim. Produtos importados precisam de Registro Sanitário na ANVISA. Produtos nacionais geralmente precisam apenas de Notificação, dependendo da categoria de risco (Grau 1 ou Grau 2).'
        : isES
          ? 'Sí. Los productos importados necesitan Registro Sanitario en la ANVISA. Los productos nacionales generalmente solo necesitan Notificación, dependiendo de la categoría de riesgo.'
          : 'Yes. Imported products need sanitary registration with ANVISA. Domestic products generally only need notification, depending on the risk category (Grade 1 or Grade 2).',
    },
    {
      q: isPT
        ? 'Quanto tempo leva o registro na ANVISA?'
        : isES
          ? '¿Cuánto tiempo toma el registro en la ANVISA?'
          : 'How long does ANVISA registration take?',
      a: isPT
        ? 'Produtos Grau 1 (notificação): 30-90 dias. Produtos Grau 2 (registro): 6-24 meses. O prazo varia conforme a complejidade da formulação e a qualidade da documentação apresentada.'
        : isES
          ? 'Productos Grado 1 (notificación): 30-90 días. Productos Grado 2 (registro): 6-24 meses. El plazo varía según la complejidad de la formulación y la calidad de la documentación.'
          : 'Grade 1 products (notification): 30-90 days. Grade 2 products (registration): 6-24 months. Timeline varies based on formulation complexity and documentation quality.',
    },
    {
      q: isPT
        ? 'Quanto custa o registro na ANVISA?'
        : isES
          ? '¿Cuánto cuesta el registro en la ANVISA?'
          : 'How much does ANVISA registration cost?',
      a: isPT
        ? 'Grau 1: R$ 1.500-5.000. Grau 2: R$ 10.000-25.000+ por SKU, incluindo taxas governamentais, PTR, documentação e consultoria. O uso da CosmetCheck para pré-verificação de ingredientes pode reduzir custos de retrabalho em 40-60%.'
        : isES
          ? 'Grado 1: $1.500-5.000 USD. Grado 2: $10.000-25.000+ USD por SKU, incluyendo tasas gubernamentales, PTR, documentación y consultoría.'
          : 'Grade 1: $1,500-5,000 USD. Grade 2: $10,000-25,000+ USD per SKU, including government fees, PTR, documentation, and consulting. Using CosmetCheck for pre-checking ingredients can reduce rework costs by 40-60%.',
    },
    {
      q: isPT
        ? 'Posso vender cosméticos no Brasil sem registro ANVISA?'
        : isES
          ? '¿Puedo vender cosméticos en Brasil sin registro de la ANVISA?'
          : 'Can I sell cosmetics in Brazil without ANVISA registration?',
      a: isPT
        ? 'Não. Vender cosméticos importados sem registro é ilegal e pode resultar em apreensão de produtos, multas e proibição de importação. Marketplaces como Mercado Livre e Amazon Brasil exigem número de registro para listagem.'
        : isES
          ? 'No. Vender cosméticos importados sin registro es ilegal y puede resultar en decomiso de productos, multas y prohibición de importación.'
          : 'No. Selling imported cosmetics without registration is illegal and can result in product seizure, fines, and import bans. Marketplaces like Mercado Livre and Amazon Brazil require registration numbers for listing.',
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
            name: isPT ? 'Guia ANVISA' : isES ? 'Guía ANVISA' : 'ANVISA Guide',
            item: `https://cosmetcheck.com/${locale}/guides/anvisa-complete-guide`,
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
        <div className="container-custom text-center max-w-4xl">
          <nav className="text-sm text-white/70 mb-6">
            <Link href={`/${locale}`} className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`/${locale}/guides`} className="hover:text-white">{isPT ? 'Guias' : isES ? 'Guías' : 'Guides'}</Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">ANVISA</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">{t.title}</h1>
          <p className="text-lg text-white/90 max-w-3xl mx-auto">{t.subtitle}</p>
        </div>
      </section>

      <div className="container-custom max-w-4xl py-12 space-y-16">
        {/* What is ANVISA */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.whatIsAnvisa}</h2>
          <p className="text-gray-300 leading-relaxed">
            {isPT
              ? 'A Agência Nacional de Vigilância Sanitária (ANVISA) é o órgão federal brasileiro responsável pela regulação de produtos de saúde, incluindo cosméticos. Para cosméticos, a ANVISA controla: quais ingredientes podem ser usados e em quais concentrações; como os produtos devem ser rotulados; quais alegações são permitidas vs proibidas; padrões de fabricação (BPF); requisitos de importação e registro. O Brasil é o 4º maior mercado de cosméticos do mundo e o 1º em gasto per capita com beleza. Em 2024, o setor gerou R$ 52,6 bilhões, com crescimento projetado de 8% ao ano até 2028.'
              : isES
                ? 'La Agencia Nacional de Vigilancia Sanitaria (ANVISA) es el organismo federal brasileño responsable de la regulación de productos de salud, incluidos los cosméticos. Para cosméticos, la ANVISA controla: qué ingredientes pueden usarse y en qué concentraciones; cómo deben etiquetarse los productos; qué afirmaciones están permitidas vs prohibidas; estándares de fabricación (GMP); requisitos de importación y registro.'
                : 'The Brazilian Health Regulatory Agency (ANVISA) is Brazil\'s federal health regulatory agency. For cosmetics, ANVISA controls: which ingredients can be used and at what concentrations; how products must be labeled; which claims are permitted vs prohibited; manufacturing standards (GMP); import and registration requirements. Brazil is the 4th largest cosmetics market in the world and 1st in per-capita beauty spending. In 2024, the sector generated R$ 52.6 billion (approx. $10B USD), with projected 8% annual growth through 2028.'}
          </p>
        </section>

        {/* Product Classification */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.classification}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#1A1A24] border border-[#252530] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#00A86B] mb-2">
                {isPT ? 'Grau 1 — Notificação' : isES ? 'Grado 1 — Notificación' : 'Grade 1 — Notification'}
              </h3>
              <p className="text-gray-300 text-sm mb-3">
                {isPT
                  ? 'Produtos de baixo risco: xampus, condicionadores, hidratantes sem ativos, maquiagem simples.'
                  : isES
                    ? 'Productos de bajo riesgo: champús, acondicionadores, hidratantes sin activos, maquillaje simple.'
                    : 'Low-risk products: shampoos, conditioners, basic moisturizers, simple makeup.'}
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• {isPT ? 'Prazo: 30-90 dias' : isES ? 'Plazo: 30-90 días' : 'Timeline: 30-90 days'}</li>
                <li>• {isPT ? 'Custo: R$ 1.500-5.000' : isES ? 'Costo: $1.500-5.000 USD' : 'Cost: $1,500-5,000 USD'}</li>
                <li>• {isPT ? 'Processo: Notificação simplificada' : isES ? 'Proceso: Notificación simplificada' : 'Process: Simplified notification'}</li>
              </ul>
            </div>
            <div className="bg-[#1A1A24] border border-[#252530] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-amber-400 mb-2">
                {isPT ? 'Grau 2 — Registro Sanitário' : isES ? 'Grado 2 — Registro Sanitario' : 'Grade 2 — Sanitary Registration'}
              </h3>
              <p className="text-gray-300 text-sm mb-3">
                {isPT
                  ? 'Produtos de maior risco: protetores solar, produtos para clareamento, anti-acne, produtos infantis, desodorantes antitranspirantes.'
                  : isES
                    ? 'Productos de mayor riesgo: protectores solares, productos para blanquear, anti-acné, productos infantiles, desodorantes antitranspirantes.'
                    : 'Higher-risk products: sunscreens, skin-lightening, anti-acne, children\'s products, antiperspirant deodorants.'}
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• {isPT ? 'Prazo: 6-24 meses' : isES ? 'Plazo: 6-24 meses' : 'Timeline: 6-24 months'}</li>
                <li>• {isPT ? 'Custo: R$ 10.000-25.000+' : isES ? 'Costo: $10.000-25.000+ USD' : 'Cost: $10,000-25,000+ USD'}</li>
                <li>• {isPT ? 'Processo: Registro completo com análise técnica' : isES ? 'Proceso: Registro completo con análisis técnico' : 'Process: Full registration with technical analysis'}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Banned & Restricted Ingredients */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.ingredients}</h2>
          <p className="text-gray-300 mb-4">
            {isPT
              ? 'A ANVISA mantém listas atualizadas de ingredientes proibidos (RDC 665/2022) e restritos (RDC 752/2022). Em 2024, a ANVISA rejeitou 67% dos produtos importados na primeira inspeção devido a problemas de ingredientes.'
              : isES
                ? 'La ANVISA mantiene listas actualizadas de ingredientes prohibidos (RDC 665/2022) y restringidos (RDC 752/2022). En 2024, la ANVISA rechazó el 67% de los productos importados en la primera inspección debido a problemas de ingredientes.'
                : 'ANVISA maintains updated lists of banned ingredients (RDC 665/2022) and restricted ingredients (RDC 752/2022). In 2024, ANVISA rejected 67% of imported products on first inspection due to ingredient issues.'}
          </p>
          <div className="bg-[#1A1A24] border border-[#252530] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#252530]">
                  <th className="text-left text-white p-4">{isPT ? 'Ingrediente' : 'Ingredient'}</th>
                  <th className="text-left text-white p-4">{isPT ? 'Status' : 'Status'}</th>
                  <th className="text-left text-white p-4">{isPT ? 'Detalhes' : 'Details'}</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {[
                  { name: 'Hydroquinone', status: isPT ? 'Proibido' : 'Banned', note: isPT ? 'Todos os usos cosméticos' : 'All cosmetic uses' },
                  { name: 'Mercury / Compounds', status: isPT ? 'Proibido' : 'Banned', note: isPT ? 'Todos os cosméticos' : 'All cosmetics' },
                  { name: 'Lead / Compounds', status: isPT ? 'Proibido' : 'Banned', note: isPT ? 'Lábios e olhos' : 'Lips and eyes' },
                  { name: 'Formaldehyde', status: isPT ? 'Restrito' : 'Restricted', note: isPT ? 'Alisamento: ≤ 0,2%' : 'Hair straightening: ≤ 0.2%' },
                  { name: 'Salicylic Acid', status: isPT ? 'Restrito' : 'Restricted', note: isPT ? 'Leave-on: ≤ 2%' : 'Leave-on: ≤ 2%' },
                  { name: 'Benzoyl Peroxide', status: isPT ? 'Restrito' : 'Restricted', note: isPT ? 'Anti-acne: ≤ 5%' : 'Anti-acne: ≤ 5%' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[#252530] last:border-b-0">
                    <td className="p-4 font-medium">{row.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${row.status === (isPT ? 'Proibido' : 'Banned') ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
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

        {/* Required Documentation */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.documentation}</h2>
          <div className="space-y-3">
            {[
              isPT ? 'Fórmula completa com nomes INCI e concentrações' : isES ? 'Fórmula completa con nombres INCI y concentraciones' : 'Complete formula with INCI names and concentrations',
              isPT ? 'Relatório de segurança (toxicologia)' : isES ? 'Informe de seguridad (toxicología)' : 'Safety evaluation report (toxicology)',
              isPT ? 'Certificado de BPF (Boas Práticas de Fabricação)' : isES ? 'Certificado de GMP (Buenas Prácticas de Manufactura)' : 'GMP certificate (Good Manufacturing Practices)',
              isPT ? 'Rótulo em português conforme RDC 375/2020' : isES ? 'Etiqueta en portugués conforme RDC 375/2020' : 'Portuguese label per RDC 375/2020',
              isPT ? 'Certificado de origem do país de fabricação' : isES ? 'Certificado de origen del país de fabricación' : 'Certificate of origin from manufacturing country',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#1A1A24] border border-[#252530] rounded-lg p-4">
                <span className="text-[#00A86B] font-bold">{i + 1}.</span>
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* PTR */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.ptr}</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            {isPT
              ? 'O Responsável Técnico (PTR) é obrigatório para todos os produtos importados. Deve ser um farmacêutico ou profissional habilitado no Brasil. O PTR pode ser: consultor regulatório independente (R$ 5.000-15.000/ano); distribuidor brasileiro (custo negociado na margem); ou filial brasileira (R$ 30.000+ para empresas grandes).'
              : isES
                ? 'El Responsable Técnico (PTR) es obligatorio para todos los productos importados. Debe ser un farmacéutico o profesional habilitado en Brasil.'
                : 'The Brazilian Technical Responsible (PTR) is mandatory for all imported products. Must be a pharmacist or qualified professional registered in Brazil. Options: independent regulatory consultant ($1,000-3,000/year); Brazilian distributor (cost built into margin); or Brazilian subsidiary ($6,000+ for large brands).'}
          </p>
        </section>

        {/* Timeline & Costs */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.timeline}</h2>
          <div className="bg-[#1A1A24] border border-[#252530] rounded-xl overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#252530]">
                  <th className="text-left text-white p-4">{isPT ? 'Etapa' : 'Phase'}</th>
                  <th className="text-left text-white p-4">{isPT ? 'Grau 1' : 'Grade 1'}</th>
                  <th className="text-left text-white p-4">{isPT ? 'Grau 2' : 'Grade 2'}</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-[#252530]">
                  <td className="p-4">{isPT ? 'Preparação documental' : 'Documentation prep'}</td>
                  <td className="p-4">1-2 {isPT ? 'meses' : 'months'}</td>
                  <td className="p-4">2-3 {isPT ? 'meses' : 'months'}</td>
                </tr>
                <tr className="border-b border-[#252530]">
                  <td className="p-4">{isPT ? 'Análise ANVISA' : 'ANVISA review'}</td>
                  <td className="p-4">30-90 {isPT ? 'dias' : 'days'}</td>
                  <td className="p-4">6-18 {isPT ? 'meses' : 'months'}</td>
                </tr>
                <tr className="border-b border-[#252530]">
                  <td className="p-4">{isPT ? 'Complementação (se necessário)' : 'Complementation (if needed)'}</td>
                  <td className="p-4">+1 {isPT ? 'mês' : 'month'}</td>
                  <td className="p-4">+3-6 {isPT ? 'meses' : 'months'}</td>
                </tr>
                <tr className="border-b border-[#252530] bg-[#0A4D8C]/10">
                  <td className="p-4 font-semibold text-white">{isPT ? 'Total estimado' : 'Total estimate'}</td>
                  <td className="p-4 font-semibold text-[#00A86B]">2-4 {isPT ? 'meses' : 'months'}</td>
                  <td className="p-4 font-semibold text-amber-400">9-24 {isPT ? 'meses' : 'months'}</td>
                </tr>
                <tr className="bg-[#0A4D8C]/10">
                  <td className="p-4 font-semibold text-white">{isPT ? 'Custo estimado' : 'Cost estimate'}</td>
                  <td className="p-4 font-semibold text-[#00A86B]">$1,500-5,000</td>
                  <td className="p-4 font-semibold text-amber-400">$10,000-25,000+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Common Mistakes */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.mistakes}</h2>
          <div className="space-y-4">
            {[
              {
                title: isPT ? 'Usar rótulo em inglês ou espanhol' : isES ? 'Usar etiqueta en inglés o español' : 'Using English or Spanish labels',
                desc: isPT ? 'A ANVISA exige rótulo 100% em português. Mesmo "Made in USA" deve ser traduzido.' : isES ? 'La ANVISA exige etiqueta 100% en portugués.' : 'ANVISA requires 100% Portuguese labeling. Even "Made in USA" must be translated.',
              },
              {
                title: isPT ? 'Não verificar ingredientes antes do registro' : isES ? 'No verificar ingredientes antes del registro' : 'Not checking ingredients before registration',
                desc: isPT ? '67% dos produtos são rejeitados na primeira inspeção. Verifique sua lista de ingredientes antes de iniciar o processo.' : isES ? 'El 67% de los productos son rechazados en la primera inspección.' : '67% of products are rejected on first inspection. Check your ingredient list before starting the process.',
              },
              {
                title: isPT ? 'Alegações terapêuticas no rótulo' : isES ? 'Alegaciones terapéuticas en la etiqueta' : 'Therapeutic claims on the label',
                desc: isPT ? 'Palavras como "trata", "cura", "elimina" transformam o produto em medicamento, sujeito a regulamentação muito mais rigorosa.' : isES ? 'Palabras como "trata", "cura" transforman el producto en medicamento.' : 'Words like "treats", "cures", "eliminates" reclassify the product as a drug, subject to much stricter regulation.',
              },
              {
                title: isPT ? 'Esquecer o PTR (Responsável Técnico)' : isES ? 'Olvidar el PTR (Responsable Técnico)' : 'Forgetting the PTR (Technical Responsible)',
                desc: isPT ? 'O PTR é obrigatório para produtos importados. Sem ele, o registro nem sequer é aceito para análise.' : isES ? 'El PTR es obligatorio para productos importados.' : 'The PTR is mandatory for imported products. Without it, registration is not even accepted for review.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-[#1A1A24] border border-red-500/20 rounded-xl p-6">
                <h3 className="font-semibold text-red-400 mb-2">{i + 1}. {item.title}</h3>
                <p className="text-gray-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="p-8 rounded-2xl bg-gradient-to-r from-[#0A4D8C]/20 to-[#00A86B]/20 border border-[#0A4D8C]/30 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">{t.ctaTitle}</h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">{t.ctaDesc}</p>
          <Link
            href={`/${locale}`}
            className="inline-block px-8 py-4 rounded-xl bg-[#00A86B] text-white font-bold text-lg hover:bg-[#00A86B]/90 transition-colors"
          >
            {t.ctaButton}
          </Link>
          <p className="text-sm text-gray-400 mt-3">
            {isPT ? '10 verificações gratuitas — sem cartão de crédito' : isES ? '10 verificaciones gratuitas — sin tarjeta de crédito' : '10 free checks — no credit card required'}
          </p>
        </section>

        {/* FAQ */}
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
