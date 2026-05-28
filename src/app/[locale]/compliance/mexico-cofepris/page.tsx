import { Metadata } from 'next'
import Link from 'next/link'

export const runtime = 'edge'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isES = locale === 'es-MX'
  return {
    title: isES
      ? 'Guía COFEPRIS 2025 | Requisitos de Cosméticos en México'
      : 'COFEPRIS Guide 2025 | Cosmetics Requirements in Mexico',
    description: isES
      ? 'Requisitos completos de COFEPRIS para importar y vender cosméticos en México. Verifique la conformidad con CosmetCheck.'
      : 'Complete COFEPRIS requirements for importing and selling cosmetics in Mexico. Check compliance with CosmetCheck.',
    keywords: isES
      ? ['COFEPRIS', 'cosméticos México', 'requisitos importación', 'NOM-141', 'compliance COFEPRIS']
      : ['COFEPRIS', 'Mexico cosmetics', 'import requirements', 'NOM-141', 'COFEPRIS compliance'],
    alternates: {
      canonical: `https://cosmetcheck.com/${locale}/compliance/mexico-cofepris`,
      languages: {
        'es-MX': 'https://cosmetcheck.com/es-MX/compliance/mexico-cofepris',
        'pt-BR': 'https://cosmetcheck.com/pt-BR/compliance/mexico-cofepris',
        'en': 'https://cosmetcheck.com/en/compliance/mexico-cofepris',
      },
    },
  }
}

export default async function MexicoCofeprisPage({ params }: Props) {
  const { locale } = await params
  const isES = locale === 'es-MX'
  const isPT = locale === 'pt-BR'

  const t = {
    title: isES
      ? 'Guía Completa COFEPRIS: Requisitos para Cosméticos en México'
      : isPT
        ? 'Guia Completa COFEPRIS: Requisitos para Cosméticos no México'
        : 'Complete COFEPRIS Guide: Cosmetics Requirements in Mexico',
    subtitle: isES
      ? 'Todo lo que necesita saber para importar y vender cosméticos legalmente en México'
      : isPT
        ? 'Tudo o que você precisa saber para importar e vender cosméticos legalmente no México'
        : 'Everything you need to know to import and sell cosmetics legally in Mexico',
    whatIsCofepris: isES ? '¿Qué es COFEPRIS?' : isPT ? 'O que é a COFEPRIS?' : 'What is COFEPRIS?',
    whatIsCofeprisDesc: isES
      ? 'La Comisión Federal para la Protección contra Riesgos Sanitarios (COFEPRIS) es la autoridad reguladora mexicana responsable de la salud pública, incluyendo la regulación de cosméticos, productos de higiene y perfumería.'
      : isPT
        ? 'A Comissão Federal para a Proteção contra Riscos Sanitários (COFEPRIS) é a autoridade reguladora mexicana responsável pela saúde pública, incluindo a regulação de cosméticos, produtos de higiene e perfumaria.'
        : 'The Federal Commission for the Protection against Sanitary Risk (COFEPRIS) is the Mexican regulatory authority responsible for public health, including the regulation of cosmetics, hygiene products, and perfumery.',
    requirementsTitle: isES
      ? 'Requisitos Básicos para Importar Cosméticos'
      : isPT
        ? 'Requisitos Básicos para Importar Cosméticos'
        : 'Basic Requirements for Importing Cosmetics',
    prohibitedTitle: isES
      ? 'Ingredientes Prohibidos por COFEPRIS'
      : isPT
        ? 'Ingredientes Proibidos pela COFEPRIS'
        : 'Ingredients Banned by COFEPRIS',
    howToCheck: isES
      ? 'Cómo Verificar la Conformidad con COFEPRIS'
      : isPT
        ? 'Como Verificar a Conformidade com a COFEPRIS'
        : 'How to Check COFEPRIS Compliance',
    ctaButton: isES ? 'Verificar Ahora' : isPT ? 'Verificar Agora' : 'Check Now',
    ctaFree: isES ? '10 verificaciones gratuitas' : isPT ? '10 verificações gratuitas' : '10 free checks',
    faqTitle: isES ? 'Preguntas Frecuentes' : isPT ? 'Perguntas Frequentes' : 'Frequently Asked Questions',
  }

  const requirements = [
    {
      title: isES ? 'Registro Sanitario' : isPT ? 'Registro Sanitário' : 'Sanitary Registration',
      desc: isES
        ? 'Todo cosmético importado debe contar con un registro sanitario vigente emitido por COFEPRIS.'
        : isPT
          ? 'Todo cosmético importado deve ter um registro sanitário vigente emitido pela COFEPRIS.'
          : 'All imported cosmetics must have a valid sanitary registration issued by COFEPRIS.',
    },
    {
      title: 'NOM-141-SSA1/SCF1-2012',
      desc: isES
        ? 'La etiqueta debe cumplir con la Norma Oficial Mexicana para etiquetado de productos de belleza e higiene.'
        : isPT
          ? 'O rótulo deve cumprir com a Norma Oficial Mexicana para rotulagem de produtos de beleza e higiene.'
          : 'The label must comply with the Mexican Official Standard for labeling beauty and hygiene products.',
    },
    {
      title: isES ? 'Representante Legal' : isPT ? 'Representante Legal' : 'Legal Representative',
      desc: isES
        ? 'Debe contar con un representante legal en México responsable del producto ante COFEPRIS.'
        : isPT
          ? 'Deve ter um representante legal no México responsável pelo produto perante a COFEPRIS.'
          : 'You must have a legal representative in Mexico responsible for the product before COFEPRIS.',
    },
    {
      title: isES ? 'Aviso de Responsabilidad' : isPT ? 'Aviso de Responsabilidade' : 'Responsibility Notice',
      desc: isES
        ? 'Documento que acredita quién es el responsable sanitario del producto en territorio mexicano.'
        : isPT
          ? 'Documento que atesta quem é o responsável sanitário do produto em território mexicano.'
          : 'Document certifying who is the sanitary responsible for the product in Mexican territory.',
    },
  ]

  const faqs = [
    {
      q: isES
        ? '¿Cuánto tiempo toma obtener el registro sanitario de COFEPRIS?'
        : 'How long does it take to obtain COFEPRIS sanitary registration?',
      a: isES
        ? 'El proceso puede tardar entre 3 y 6 meses, dependiendo de la complejidad del producto y la documentación presentada.'
        : 'The process can take between 3 and 6 months, depending on the complexity of the product and the documentation submitted.',
    },
    {
      q: isES
        ? '¿Puedo vender cosméticos en México sin registro sanitario?'
        : 'Can I sell cosmetics in Mexico without sanitary registration?',
      a: isES
        ? 'No, es ilegal vender cosméticos importados en México sin el registro sanitario correspondiente. Las sanciones incluyen decomiso de productos y multas.'
        : 'No, it is illegal to sell imported cosmetics in Mexico without the corresponding sanitary registration. Penalties include product seizure and fines.',
    },
    {
      q: isES
        ? '¿CosmetCheck verifica el cumplimiento con COFEPRIS?'
        : 'Does CosmetCheck verify COFEPRIS compliance?',
      a: isES
        ? 'Sí, CosmetCheck verifica los ingredientes contra las listas de COFEPRIS, incluyendo sustancias prohibidas y restricciones de concentración.'
        : 'Yes, CosmetCheck verifies ingredients against COFEPRIS lists, including banned substances and concentration restrictions.',
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
            name: 'Compliance',
            item: `https://cosmetcheck.com/${locale}/compliance`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: isES ? 'México COFEPRIS' : 'Mexico COFEPRIS',
            item: `https://cosmetcheck.com/${locale}/compliance/mexico-cofepris`,
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
            <span className="text-white/90">{isES ? 'México COFEPRIS' : 'Mexico COFEPRIS'}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">{t.title}</h1>
          <p className="text-lg text-white/90">{t.subtitle}</p>
        </div>
      </section>

      <div className="container-custom max-w-4xl py-12 space-y-16">
        {/* What is COFEPRIS */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.whatIsCofepris}</h2>
          <p className="text-gray-300 leading-relaxed">{t.whatIsCofeprisDesc}</p>
        </section>

        {/* Requirements */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">{t.requirementsTitle}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {requirements.map((req, i) => (
              <div key={i} className="bg-[#1A1A24] border border-[#252530] rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0A4D8C]/20 text-[#0A4D8C] flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{req.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{req.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Prohibited ingredients table */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t.prohibitedTitle}</h2>
          <div className="bg-[#1A1A24] border border-[#252530] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#252530]">
                  <th className="text-left text-white p-4">{isES ? 'Ingrediente' : 'Ingredient'}</th>
                  <th className="text-left text-white p-4">{isES ? 'Estado' : 'Status'}</th>
                  <th className="text-left text-white p-4">{isES ? 'Notas' : 'Notes'}</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {[
                  { name: 'Hidroquinona', status: isES ? 'Prohibida' : 'Banned', note: isES ? 'Blanqueamiento' : 'Lightening' },
                  { name: 'Plomo / Compuestos', status: isES ? 'Prohibido' : 'Banned', note: isES ? 'Todos los cosméticos' : 'All cosmetics' },
                  { name: 'Parabenos (mezclas)', status: isES ? 'Restringido' : 'Restricted', note: isES ? 'Concentración limitada' : 'Limited concentration' },
                  { name: 'Fragancias alergénicas', status: isES ? 'Restringido' : 'Restricted', note: isES ? 'Debe declararse' : 'Must be declared' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[#252530] last:border-b-0">
                    <td className="p-4 font-medium">{row.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${row.status.includes(isES ? 'Prohib' : 'Ban') ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
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

        {/* CTA */}
        <section className="p-8 rounded-2xl bg-gradient-to-r from-[#0A4D8C]/20 to-[#00A86B]/20 border border-[#0A4D8C]/30 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">{t.howToCheck}</h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            {isES
              ? 'Use CosmetCheck para verificar automáticamente sus ingredientes contra las listas más recientes de COFEPRIS y ANVISA.'
              : 'Use CosmetCheck to automatically check your ingredients against the latest COFEPRIS and ANVISA lists.'}
          </p>
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
