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
      ? 'Como Vender Cosm\u00e9ticos na Am\u00e9rica Latina | Guia 2025'
      : isES
        ? 'C\u00f3mo Vender Cosm\u00e9ticos en Latinoam\u00e9rica | Gu\u00eda 2025'
        : 'How to Sell Cosmetics in Latin America | Complete Market Entry Guide 2025',
    description: isPT
      ? 'Guia completo para vender cosm\u00e9ticos no Brasil e M\u00e9xico: Amazon, Mercado Livre, alf\u00e2ndega, impostos e estrat\u00e9gia de pre\u00e7os. Atualizado 2025.'
      : isES
        ? 'Gu\u00eda completa para vender cosm\u00e9ticos en Brasil y M\u00e9xico: Amazon, Mercado Libre, aduanas, impuestos y estrategia de precios. 2025.'
        : 'Complete guide to selling cosmetics in Brazil and Mexico: Amazon, Mercado Libre, customs, duties, and pricing strategy. Updated 2025.',
    keywords: isPT
      ? ['vender cosm\u00e9ticos Brasil', 'vender cosm\u00e9ticos M\u00e9xico', 'Amazon Brasil cosm\u00e9ticos', 'Mercado Livre beleza', 'importar cosm\u00e9ticos Am\u00e9rica Latina']
      : isES
        ? ['vender cosm\u00e9ticos Brasil', 'vender cosm\u00e9ticos M\u00e9xico', 'Amazon M\u00e9xico belleza', 'Mercado Libre belleza', 'importar cosm\u00e9ticos Latinoam\u00e9rica']
        : ['sell cosmetics in Brazil', 'sell cosmetics in Mexico', 'Amazon Brazil cosmetics', 'Mercado Libre beauty', 'import cosmetics Latin America', 'LATAM cosmetics market entry'],
    alternates: {
      canonical: `https://cosmetcheck.com/${locale}/guides/sell-cosmetics-latam`,
      languages: {
        'pt-BR': 'https://cosmetcheck.com/pt-BR/guides/sell-cosmetics-latam',
        'es-MX': 'https://cosmetcheck.com/es-MX/guides/sell-cosmetics-latam',
        'en': 'https://cosmetcheck.com/en/guides/sell-cosmetics-latam',
      },
    },
  }
}

export default async function SellCosmeticsLatamPage({ params }: Props) {
  const { locale } = await params
  const isPT = locale === 'pt-BR'
  const isES = locale === 'es-MX'

  const t = {
    title: isPT
      ? 'Como Vender Cosm\u00e9ticos na Am\u00e9rica Latina: Guia Completo 2025'
      : isES
        ? 'C\u00f3mo Vender Cosm\u00e9ticos en Latinoam\u00e9rica: Gu\u00eda Completa 2025'
        : 'How to Sell Cosmetics in Latin America: Complete Market Entry Guide 2025',
    subtitle: isPT
      ? 'Brasil ou M\u00e9xico? Amazon ou Mercado Livre? Alf\u00e2ndega ou fulfillment local? Tudo que voc\u00ea precisa saber para entrar no maior mercado de beleza das Am\u00e9ricas.'
      : isES
        ? '\u00bfBrasil o M\u00e9xico? \u00bfAmazon o Mercado Libre? Todo lo que necesita saber para entrar al mayor mercado de belleza de las Am\u00e9ricas.'
        : 'Brazil or Mexico? Amazon or Mercado Libre? Customs or local fulfillment? Everything you need to know to enter the largest beauty market in the Americas.',
    whyLatam: isPT ? 'Por que a Am\u00e9rica Latina?' : isES ? '\u00bfPor qu\u00e9 Latinoam\u00e9rica?' : 'Why Latin America?',
    brazilVsMexico: isPT ? 'Brasil vs M\u00e9xico: Qual primeiro?' : isES ? 'Brasil vs M\u00e9xico: \u00bfCu\u00e1l primero?' : 'Brazil vs Mexico: Which market first?',
    platforms: isPT ? 'Principais Plataformas de E-commerce' : isES ? 'Principales Plataformas de E-commerce' : 'Major E-commerce Platforms',
    amazonBrazil: isPT ? 'Amazon Brasil: Requisitos para Cosm\u00e9ticos' : isES ? 'Amazon Brasil: Requisitos para Cosm\u00e9ticos' : 'Amazon Brazil: Cosmetics Requirements',
    mercadoLivre: isPT ? 'Mercado Livre: Regras para Categoria Beleza' : isES ? 'Mercado Libre: Reglas para Categor\u00eda Belleza' : 'Mercado Libre: Beauty Category Rules',
    customs: isPT ? 'Alf\u00e2ndega e Impostos de Importa\u00e7\u00e3o' : isES ? 'Aduanas e Impuestos de Importaci\u00f3n' : 'Customs & Import Duties',
    pricing: isPT ? 'Estrat\u00e9gia de Pre\u00e7os para LATAM' : isES ? 'Estrategia de Precios para LATAM' : 'Pricing Strategy for LATAM',
    mistakes: isPT ? 'Erros Comuns de Quem Entra no Mercado' : isES ? 'Errores Comunes al Entrar al Mercado' : 'Common Market Entry Mistakes',
    faq: isPT ? 'Perguntas Frequentes' : isES ? 'Preguntas Frecuentes' : 'Frequently Asked Questions',
    ctaTitle: isPT ? 'Verifique a Conformidade do Seu Produto' : isES ? 'Verifique el Cumplimiento de Su Producto' : 'Check Your Product Compliance',
    ctaDesc: isPT
      ? 'Antes de investir em registro e log\u00edstica, certifique-se de que seus ingredientes s\u00e3o compat\u00edveis com ANVISA e COFEPRIS.'
      : isES
        ? 'Antes de invertir en registro y log\u00edstica, aseg\u00farese de que sus ingredientes sean compatibles con ANVISA y COFEPRIS.'
        : 'Before investing in registration and logistics, make sure your ingredients are compatible with ANVISA and COFEPRIS.',
    ctaButton: isPT ? 'Verifica\u00e7\u00e3o Gratuita' : isES ? 'Verificaci\u00f3n Gratuita' : 'Free Check',
  }

  const faqs = [
    {
      q: isPT
        ? 'Qual \u00e9 o melhor mercado para come\u00e7ar: Brasil ou M\u00e9xico?'
        : isES
          ? '\u00bfCu\u00e1l es el mejor mercado para comenzar: Brasil o M\u00e9xico?'
          : 'Which is the best market to start: Brazil or Mexico?',
      a: isPT
        ? 'M\u00e9xico geralmente \u00e9 recomendado como primeiro mercado: registro mais r\u00e1pido (4-8 meses vs 6-24), custo 30-50% menor, e padr\u00f5es mais pr\u00f3ximos da FDA. Brasil \u00e9 maior em volume (R$ 52,6B vs $8B), mas exige mais investimento inicial.'
        : isES
          ? 'M\u00e9xico generalmente se recomienda como primer mercado: registro m\u00e1s r\u00e1pido y 30-50% m\u00e1s barato. Brasil es mayor en volumen pero requiere m\u00e1s inversi\u00f3n inicial.'
          : 'Mexico is generally recommended as the first market: faster registration (4-8 months vs 6-24), 30-50% lower cost, and standards closer to FDA. Brazil is larger in volume (R$ 52.6B vs $8B) but requires more upfront investment.',
    },
    {
      q: isPT
        ? 'Posso vender na Amazon Brasil sem registro ANVISA?'
        : isES
          ? '\u00bfPuedo vender en Amazon Brasil sin registro de ANVISA?'
          : 'Can I sell on Amazon Brazil without ANVISA registration?',
      a: isPT
        ? 'N\u00e3o. A Amazon Brasil exige n\u00famero de registro sanit\u00e1rio ANVISA para produtos de beleza. Produtos sem registro s\u00e3o removidos da plataforma e o vendedor pode ser banido.'
        : isES
          ? 'No. Amazon Brasil requiere n\u00famero de registro sanitario ANVISA para productos de belleza.'
          : 'No. Amazon Brazil requires an ANVISA sanitary registration number for beauty products. Unregistered products are removed from the platform and sellers may be banned.',
    },
    {
      q: isPT
        ? 'Quais s\u00e3o os impostos para importar cosm\u00e9ticos no Brasil?'
        : isES
          ? '\u00bfCu\u00e1les son los impuestos para importar cosm\u00e9ticos a Brasil?'
          : 'What are the taxes for importing cosmetics to Brazil?',
      a: isPT
        ? 'II (Imposto de Importa\u00e7\u00e3o): 0-20% conforme NCM. IPI: 0-15%. PIS/COFINS: 9,25% a 11,75%. ICMS: 7-18% conforme estado. Total efetivo: 50-80% sobre o valor CIF.'
        : isES
          ? 'II (Impuesto de Importaci\u00f3n): 0-20%. IPI: 0-15%. PIS/COFINS: 9.25-11.75%. ICMS: 7-18% seg\u00fan estado. Total efectivo: 50-80% sobre valor CIF.'
        : 'II (Import Tax): 0-20% depending on NCM. IPI: 0-15%. PIS/COFINS: 9.25-11.75%. ICMS: 7-18% depending on state. Effective total: 50-80% on CIF value.',
    },
    {
      q: isPT
        ? 'Mercado Livre \u00e9 melhor que Amazon no Brasil?'
        : isES
          ? '\u00bfMercado Libre es mejor que Amazon en Brasil?'
          : 'Is Mercado Libre better than Amazon in Brazil?',
      a: isPT
        ? 'Mercado Livre tem maior penetra\u00e7\u00e3o no Brasil (78% dos e-commerces usam ML). Amazon tem clientes de maior poder aquisitivo e melhor log\u00edstica (FBA). A estrat\u00e9gia ideal \u00e9 estar em ambas.'
        : isES
          ? 'Mercado Libre tiene mayor penetraci\u00f3n en Brasil (78% de e-commerces). Amazon tiene clientes de mayor poder adquisitivo. La estrategia ideal es estar en ambas.'
        : 'Mercado Livre has higher penetration in Brazil (78% of e-commerces use ML). Amazon has higher-income customers and better logistics (FBA). The ideal strategy is to be on both platforms.',
    },
    {
      q: isPT
        ? 'Preciso de empresa local para vender no Brasil ou M\u00e9xico?'
        : isES
          ? '\u00bfNecesito empresa local para vender en Brasil o M\u00e9xico?'
          : 'Do I need a local company to sell in Brazil or Mexico?',
      a: isPT
        ? 'N\u00e3o necessariamente. Voc\u00ea pode usar um PTR (Brasil) ou representante legal (M\u00e9xico) sem abrir subsidi\u00e1ria local. Para opera\u00e7\u00f5es maiores, uma subsidi\u00e1ria pode ser vantajosa por quest\u00f5es fiscais.'
        : isES
          ? 'No necesariamente. Puede usar un PTR (Brasil) o representante legal (M\u00e9xico) sin abrir subsidiaria local.'
          : 'Not necessarily. You can use a PTR (Brazil) or legal representative (Mexico) without opening a local subsidiary. For larger operations, a subsidiary may be advantageous for tax purposes.',
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
            name: isPT ? 'Vender na LATAM' : isES ? 'Vender en LATAM' : 'Sell in LATAM',
            item: `https://cosmetcheck.com/${locale}/guides/sell-cosmetics-latam`,
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
            <span className="text-white/90">{isPT ? 'LATAM' : isES ? 'LATAM' : 'LATAM'}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">{t.title}</h1>
          <p className="text-lg text-white/90 max-w-3xl mx-auto">{t.subtitle}</p>
        </div>
      </section>

      <div className="container-custom max-w-4xl py-12 space-y-16">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.whyLatam}</h2>
          <p className="text-gray-300 leading-relaxed">
            {isPT
              ? 'A Am\u00e9rica Latina representa o mercado de beleza de crescimento mais r\u00e1pido do mundo. O Brasil \u00e9 o 4\u00ba maior mercado global de cosm\u00e9ticos (R$ 52,6 bilh\u00f5es em 2024), enquanto o M\u00e9xico cresce 12% ao ano em e-commerce de beleza. Juntos, representam uma oportunidade de $18+ bilh\u00f5es para marcas internacionais. O diferencial \u00e9 que 67% dos produtos importados s\u00e3o rejeitados na primeira inspe\u00e7\u00e3o — quem entra preparado domina o mercado.'
              : isES
                ? 'Latinoam\u00e9rica representa el mercado de belleza de m\u00e1s r\u00e1pido crecimiento del mundo. Brasil es el 4\u00ba mercado global de cosm\u00e9ticos, mientras M\u00e9xico crece 12% anual en e-commerce de belleza.'
                : 'Latin America represents the fastest-growing beauty market globally. Brazil is the 4th largest cosmetics market worldwide (R$ 52.6 billion in 2024), while Mexico\'s beauty e-commerce grows 12% annually. Together, they represent an $18+ billion opportunity for international brands. The key differentiator: 67% of imported products are rejected on first inspection — those who enter prepared dominate the market.'}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.brazilVsMexico}</h2>
          <div className="bg-[#1A1A24] border border-[#252530] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#252530]">
                  <th className="text-left text-white p-4">{isPT ? 'Crit\u00e9rio' : 'Criteria'}</th>
                  <th className="text-left text-white p-4">{isPT ? 'Brasil' : 'Brazil'}</th>
                  <th className="text-left text-white p-4">{isPT ? 'M\u00e9xico' : 'Mexico'}</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-[#252530]"><td className="p-4">{isPT ? 'Tamanho do mercado' : 'Market size'}</td><td className="p-4 font-semibold text-[#00A86B]">R$ 52,6B (~$10B)</td><td className="p-4">~$8B</td></tr>
                <tr className="border-b border-[#252530]"><td className="p-4">{isPT ? 'Prazo registro' : 'Registration time'}</td><td className="p-4 text-amber-400">6 – 24 meses</td><td className="p-4 text-[#00A86B]">4 – 8 meses</td></tr>
                <tr className="border-b border-[#252530]"><td className="p-4">{isPT ? 'Custo registro' : 'Registration cost'}</td><td className="p-4 text-amber-400">$5K – $25K+</td><td className="p-4 text-[#00A86B]">$3K – $12K</td></tr>
                <tr className="border-b border-[#252530]"><td className="p-4">{isPT ? 'Plataforma dominante' : 'Top platform'}</td><td className="p-4">Mercado Livre (78%)</td><td className="p-4">Mercado Libre + Amazon</td></tr>
                <tr className="border-b border-[#252530]"><td className="p-4">{isPT ? 'Carga tribut\u00e1ria importa\u00e7\u00e3o' : 'Import tax burden'}</td><td className="p-4 text-amber-400">50 – 80%</td><td className="p-4 text-[#00A86B]">25 – 45%</td></tr>
                <tr className="bg-[#0A4D8C]/10"><td className="p-4 font-semibold text-white">{isPT ? 'Recomenda\u00e7\u00e3o' : 'Recommendation'}</td><td className="p-4">{isPT ? 'Para quem tem capital e paci\u00eancia' : 'For capital-rich brands'}</td><td className="p-4 text-[#00A86B]">{isPT ? 'Melhor para primeiro mercado' : 'Best first market'}</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.platforms}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#1A1A24] border border-[#252530] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#FFD700] mb-2">Mercado Livre / Mercado Libre</h3>
              <p className="text-gray-300 text-sm mb-3">
                {isPT
                  ? 'Maior marketplace da LATAM. No Brasil, 78% dos vendedores online usam ML. Categoria Beleza \u00e9 top 3 em vendas.'
                  : 'El mayor marketplace de LATAM. En Brasil, el 78% de vendedores online usan ML. Categor\u00eda Belleza es top 3 en ventas.'}
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• {isPT ? 'Comiss\u00e3o: 13-20%' : 'Commission: 13-20%'}</li>
                <li>• {isPT ? 'Fulfillment: Mercado Envios Full' : 'Fulfillment: Mercado Envios Full'}</li>
                <li>• {isPT ? 'Requer registro sanit\u00e1rio' : 'Requires sanitary registration'}</li>
              </ul>
            </div>
            <div className="bg-[#1A1A24] border border-[#252530] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#FF9900] mb-2">Amazon Brasil / Amazon M\u00e9xico</h3>
              <p className="text-gray-300 text-sm mb-3">
                {isPT
                  ? 'Clientes de maior poder aquisitivo. FBA dispon\u00edvel em ambos os pa\u00edses. Menor penetra\u00e7\u00e3o que ML, mas crescendo 25% ao ano.'
                  : 'Clientes de mayor poder adquisitivo. FBA disponible en ambos pa\u00edses. Menor penetraci\u00f3n que ML, pero creciendo 25% anual.'}
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• {isPT ? 'Comiss\u00e3o: 15-20%' : 'Commission: 15-20%'}</li>
                <li>• {isPT ? 'Fulfillment: FBA dispon\u00edvel' : 'Fulfillment: FBA available'}</li>
                <li>• {isPT ? 'Requer registro sanit\u00e1rio' : 'Requires sanitary registration'}</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.amazonBrazil}</h2>
          <div className="space-y-3">
            {[
              isPT ? 'Registro sanit\u00e1rio ANVISA ativo (n\u00famero vis\u00edvel no r\u00f3tulo)' : isES ? 'Registro sanitario ANVISA activo (n\u00famero visible en etiqueta)' : 'Active ANVISA sanitary registration (number visible on label)',
              isPT ? 'R\u00f3tulo 100% em portugu\u00eas conforme RDC 375/2020' : isES ? 'Etiqueta 100% en portugu\u00e9s conforme RDC 375/2020' : '100% Portuguese label per RDC 375/2020',
              isPT ? 'GTIN/EAN v\u00e1lido para cada SKU' : isES ? 'GTIN/EAN v\u00e1lido para cada SKU' : 'Valid GTIN/EAN for each SKU',
              isPT ? 'Nota Fiscal de entrada (importa\u00e7\u00e3o ou fabrica\u00e7\u00e3o nacional)' : isES ? 'Nota Fiscal de entrada (importaci\u00f3n o fabricaci\u00f3n nacional)' : 'Incoming Invoice (import or domestic manufacture)',
              isPT ? 'Laudo de qualidade/an\u00e1lise (para importados)' : isES ? 'Informe de calidad/an\u00e1lisis (para importados)' : 'Quality/analysis report (for imports)',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#1A1A24] border border-[#252530] rounded-lg p-4">
                <span className="text-[#00A86B] font-bold">{i + 1}.</span>
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.mercadoLivre}</h2>
          <div className="space-y-3">
            {[
              isPT ? 'Registro sanit\u00e1rio ANVISA ou COFEPRIS (conforme pa\u00eds)' : isES ? 'Registro sanitario ANVISA o COFEPRIS (seg\u00fan pa\u00eds)' : 'ANVISA or COFEPRIS sanitary registration (per country)',
              isPT ? 'R\u00f3tulo no idioma local com todos os dados obrigat\u00f3rios' : isES ? 'Etiqueta en idioma local con todos los datos obligatorios' : 'Local language label with all mandatory data',
              isPT ? 'Imagens profissionais (m\u00ednimo 1200x1200px, fundo branco)' : isES ? 'Im\u00e1genes profesionales (m\u00ednimo 1200x1200px, fondo blanco)' : 'Professional images (min 1200x1200px, white background)',
              isPT ? 'Pol\u00edtica de devolu\u00e7\u00e3o compat\u00edvel com ML (30 dias no Brasil)' : isES ? 'Pol\u00edtica de devoluci\u00f3n compatible con ML (30 d\u00edas en Brasil)' : 'Return policy compatible with ML (30 days in Brazil)',
              isPT ? 'Frete gr\u00e1tis ou com custo competitivo (Full \u00e9 recomendado)' : isES ? 'Env\u00edo gratis o con costo competitivo (Full es recomendado)' : 'Free shipping or competitive cost (Full is recommended)',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#1A1A24] border border-[#252530] rounded-lg p-4">
                <span className="text-[#00A86B] font-bold">{i + 1}.</span>
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.customs}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#1A1A24] border border-[#252530] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">{isPT ? 'Brasil' : 'Brazil'}</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• <strong>II:</strong> 0–20%</li>
                <li>• <strong>IPI:</strong> 0–15%</li>
                <li>• <strong>PIS/COFINS:</strong> 9,25–11,75%</li>
                <li>• <strong>ICMS:</strong> 7–18% (estadual)</li>
                <li>• <strong>AFRMM:</strong> 25% do frete mar\u00edtimo</li>
                <li className="pt-2 border-t border-[#252530] text-amber-400 font-semibold">
                  {isPT ? 'Total: 50–80%' : 'Total: 50-80%'}
                </li>
              </ul>
            </div>
            <div className="bg-[#1A1A24] border border-[#252530] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">{isPT ? 'M\u00e9xico' : 'Mexico'}</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• <strong>IGI (Arancel):</strong> 0–20%</li>
                <li>• <strong>IVA:</strong> 16%</li>
                <li>• <strong>IEPS:</strong> 0–8% (se aplic\u00e1vel)</li>
                <li>• <strong>DTA:</strong> 0,8%</li>
                <li>• <strong>Prevalidaci\u00f3n:</strong> ~$50/despacho</li>
                <li className="pt-2 border-t border-[#252530] text-[#00A86B] font-semibold">
                  {isPT ? 'Total: 25–45%' : 'Total: 25-45%'}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.pricing}</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            {isPT
              ? 'A carga tribut\u00e1ria brasileira exige margens maiores. A regra pr\u00e1tica para importadores:'
              : isES
                ? 'La carga tributaria brasile\u00f1a exige m\u00e1rgenes mayores. La regla pr\u00e1ctica para importadores:'
                : 'Brazil\'s tax burden requires higher margins. The practical rule for importers:'}
          </p>
          <div className="bg-[#1A1A24] border border-[#252530] rounded-xl p-6">
            <ul className="text-gray-300 space-y-2">
              <li>• <strong>{isPT ? 'Brasil' : 'Brazil'}:</strong> {isPT ? 'Pre\u00e7o final = Custo FOB \u00d7 2,5 \u2013 3,5' : 'Final price = FOB cost \u00d7 2.5 – 3.5'}</li>
              <li>• <strong>{isPT ? 'M\u00e9xico' : 'Mexico'}:</strong> {isPT ? 'Pre\u00e7o final = Custo FOB \u00d7 1,8 \u2013 2,5' : 'Final price = FOB cost \u00d7 1.8 – 2.5'}</li>
              <li>• {isPT ? 'Inclua: impostos, frete, comiss\u00e3o marketplace (~15%), marketing (~10%), log\u00edstica (~8%) e margem l\u00edquida desejada (20-30%)' : 'Include: taxes, freight, marketplace commission (~15%), marketing (~10%), logistics (~8%), and desired net margin (20-30%)'}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.mistakes}</h2>
          <div className="space-y-4">
            {[
              {
                title: isPT ? 'N\u00e3o verificar ingredientes antes de investir em registro' : isES ? 'No verificar ingredientes antes de invertir en registro' : 'Not checking ingredients before investing in registration',
                desc: isPT ? 'Gastar $10K+ em registro ANVISA para descobrir depois que um ingrediente \u00e9 proibido. Sempre verifique primeiro.' : isES ? 'Gastar $10K+ en registro ANVISA para descubrir despu\u00e9s que un ingrediente est\u00e1 prohibido.' : 'Spending $10K+ on ANVISA registration only to discover later that an ingredient is banned. Always pre-check.',
              },
              {
                title: isPT ? 'Subestimar a carga tribut\u00e1ria brasileira' : isES ? 'Subestimar la carga tributaria brasile\u00f1a' : 'Underestimating Brazilian tax burden',
                desc: isPT ? 'Muitas marcas calculam apenas o II (imposto de importa\u00e7\u00e3o) e esquecem IPI, PIS/COFINS e ICMS. O total efetivo \u00e9 50-80%.' : isES ? 'Muchas marcas calculan solo el II y olvidan IPI, PIS/COFINS e ICMS.' : 'Many brands calculate only the import tax and forget IPI, PIS/COFINS, and ICMS. The effective total is 50-80%.',
              },
              {
                title: isPT ? 'Usar o mesmo r\u00f3tulo para Brasil e M\u00e9xico' : isES ? 'Usar la misma etiqueta para Brasil y M\u00e9xico' : 'Using the same label for Brazil and Mexico',
                desc: isPT ? 'Brasil exige portugu\u00eas; M\u00e9xico exige espanhol. N\u00fameros de registro, representantes e nomenclatura diferem. R\u00f3tulos gen\u00e9ricos s\u00e3o rejeitados.' : isES ? 'Brasil requiere portugu\u00e9s; M\u00e9xico requiere espa\u00f1ol. Los n\u00fameros de registro y representantes difieren.' : 'Brazil requires Portuguese; Mexico requires Spanish. Registration numbers, representatives, and nomenclature differ. Generic labels are rejected.',
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
