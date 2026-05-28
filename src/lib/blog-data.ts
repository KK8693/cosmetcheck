// src/lib/blog-data.ts
// Static blog content for M2 SEO content matrix
// Supports pt-BR, es-MX, en

export type BlogLocale = 'pt-BR' | 'es-MX' | 'en'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  locale: BlogLocale
  category: string
  author: string
  publishedAt: string
  updatedAt: string
  tags: string[]
  targetKeyword: string
  readingTime: number // minutes
  featured: boolean
}

// ---------------------------------------------------------------------------
// Blog posts (M2 content calendar Week 8-14)
// ---------------------------------------------------------------------------

export const blogPosts: BlogPost[] = [
  {
    slug: 'anvisa-ingredientes-proibidos-2025',
    title: 'Guia Completo: Ingredientes Proibidos pela ANVISA 2025',
    excerpt:
      'Lista atualizada de substâncias banidas e restritas para cosméticos no Brasil. Saiba quais ingredientes podem fazer seu produto ser reprovado.',
    locale: 'pt-BR',
    category: 'Compliance',
    author: 'CosmetCheck Team',
    publishedAt: '2025-08-15',
    updatedAt: '2025-08-15',
    tags: ['ANVISA', 'ingredientes proibidos', 'Brasil', 'regulamentação'],
    targetKeyword: 'anvisa lista de ingredientes proibidos cosméticos',
    readingTime: 8,
    featured: true,
    content: `
<h2>O que é a ANVISA e por que ela importa para vendedores de cosméticos?</h2>
<p>A Agência Nacional de Vigilância Sanitária (ANVISA) é o órgão responsável pela regulamentação de cosméticos no Brasil. Todo produto de beleza vendido no país precisa estar em conformidade com as normas da ANVISA, especialmente a <strong>RDC 665/2022</strong>.</p>

<h2>Lista de ingredientes proibidos pela ANVISA em 2025</h2>
<p>A ANVISA mantém uma lista atualizada de ingredientes que são <strong>estritamente proibidos</strong> em cosméticos. Estes incluem:</p>
<ul>
<li><strong>Hidroquinona</strong> - Proibida em concentrações superiores a 2% em produtos de clareamento</li>
<li><strong>Mercúrio e seus compostos</strong> - Banidos totalmente em cosméticos</li>
<li><strong>Formaldeído</strong> - Liberado apenas em tratamentos de alisamento com concentração limitada</li>
<li><strong>Chumbo e seus compostos</strong> - Proibidos em produtos para lábios e olhos</li>
<li><strong>Triclosan</strong> - Restrito em produtos de higiene pessoal</li>
</ul>

<h2>Ingredientes restritos que exigem atenção especial</h2>
<p>Além dos proibidos, existem ingredientes <strong>restritos</strong> que podem ser usados apenas em concentrações específicas:</p>
<ul>
<li>Ácido salicílico (máximo 2% em produtos deixados na pele)</li>
<li>Peróxido de benzoíla (máximo 5% em produtos antiacne)</li>
<li>Óxidos de zinco e titânio (permitidos em protetores solares)</li>
</ul>

<h2>Como verificar se seu produto está em conformidade</h2>
<p>Use a <a href="/">CosmetCheck</a> para analisar seus ingredientes em segundos. Nosso sistema verifica automaticamente:</p>
<ul>
<li>Ingredientes proibidos pela ANVISA</li>
<li>Concentrações permitidas de ingredientes restritos</li>
<li>Rotulagem obrigatória</li>
<li>Claims permitidas e proibidas</li>
</ul>

<h2>Próximos passos</h2>
<p>Baixe nossa <a href="/">checklist completa de compliance</a> e comece a verificar seus produtos hoje mesmo. Os primeiros 10 checks são gratuitos!</p>
`,
  },
  {
    slug: 'cofepris-requisitos-cosmeticos',
    title: 'Cómo Cumplir con COFEPRIS: Checklist para Vendedores de Belleza',
    excerpt:
      'Guía completa de requisitos de COFEPRIS para importar y vender cosméticos en México. Evita retrasos y rechazos en aduana.',
    locale: 'es-MX',
    category: 'Compliance',
    author: 'CosmetCheck Team',
    publishedAt: '2025-08-22',
    updatedAt: '2025-08-22',
    tags: ['COFEPRIS', 'México', 'requisitos', 'importación'],
    targetKeyword: 'cofepris requisitos cosméticos importados',
    readingTime: 10,
    featured: true,
    content: `
<h2>¿Qué es COFEPRIS y qué regula?</h2>
<p>La <strong>Comisión Federal para la Protección contra Riesgos Sanitarios (COFEPRIS)</strong> es la autoridad mexicana responsable de regular cosméticos, productos de higiene y perfumería en México.</p>

<h2>Requisitos básicos para importar cosméticos a México</h2>
<p>Para importar y vender cosméticos en México, necesitas cumplir con los siguientes requisitos:</p>
<ol>
<li><strong>Registro sanitario</strong> - Todo cosmético importado debe tener un registro sanitario vigente</li>
<li><strong>Etiquetado NOM-141</strong> - La etiqueta debe cumplir con la Norma Oficial Mexicana NOM-141-SSA1/SCF1-2012</li>
<li><strong>Representante legal en México</strong> - Debes tener un representante legal mexicano</li>
<li><strong>Aviso de responsabilidad sanitaria</strong> - Documento que acredita quién es responsable del producto</li>
</ol>

<h2>Ingredientes prohibidos y restringidos en México</h2>
<p>COFEPRIS tiene su propia lista de ingredientes prohibidos, que difiere ligeramente de la FDA y ANVISA:</p>
<ul>
<li><strong>Hidroquinona</strong> - Prohibida en productos de blanqueamiento</li>
<li><strong>Plomo y sus compuestos</strong> - Prohibidos en cosméticos</li>
<li><strong>Parabenos</strong> - Permitidos pero con restricciones de concentración</li>
<li><strong>Fragancias alergénicas</strong> - Deben declararse en la etiqueta</li>
</ul>

<h2>Checklist de cumplimiento COFEPRIS</h2>
<p>Descarga nuestra <a href="/">checklist interactiva</a> y verifica tu producto en minutos con CosmetCheck.</p>
`,
  },
  {
    slug: 'top-10-erros-anvisa-reprovacao',
    title: 'Top 10 Erros que Fazem Seu Produto Ser Reprovado na ANVISA',
    excerpt:
      'Evite os erros mais comuns que levam à reprovação de cosméticos na ANVISA. Dicas práticas para sellers do Mercado Livre e Shopee.',
    locale: 'pt-BR',
    category: 'Dicas',
    author: 'CosmetCheck Team',
    publishedAt: '2025-08-29',
    updatedAt: '2025-08-29',
    tags: ['ANVISA', 'erros comuns', 'Mercado Livre', 'Shopee'],
    targetKeyword: 'anvisa reprovação cosméticos',
    readingTime: 6,
    featured: false,
    content: `
<h2>Por que a ANVISA reprova cosméticos?</h2>
<p>A ANVISA reprova produtos por diversos motivos, mas alguns erros são mais comuns que outros. Veja os 10 principais:</p>

<ol>
<li><strong>Ingredientes proibidos</strong> - Uso de hidroquinona, mercúrio ou chumbo</li>
<li><strong>Rotulagem incompleta</strong> - Falta de lista de ingredientes ou informações do fabricante</li>
<li><strong>Claims proibidas</strong> - Promessas de cura ou tratamento médico</li>
<li><strong>Concentração inadequada</strong> - Ingredientes restritos acima do limite permitido</li>
<li><strong>Falta de registro</strong> - Produto importado sem registro na ANVISA</li>
<li><strong>Informação de lote ausente</strong> - Produto sem identificação de lote</li>
<li><strong>Prazo de validade não informado</strong> - Falta de data de validade na embalagem</li>
<li><strong>Texto em idioma inadequado</strong> - Rótulo apenas em inglês para venda no Brasil</li>
<li><strong>Instruções de uso ausentes</strong> - Falta de modo de uso ou precauções</li>
<li><strong>Informações de importador incompletas</strong> - Dados do importador brasileiro faltando</li>
</ol>

<h2>Como evitar reprovações</h2>
<p>Use <a href="/">CosmetCheck</a> para verificar seu produto antes de colocá-lo à venda. Nosso sistema identifica todos esses erros automaticamente.</p>
`,
  },
  {
    slug: 'anvisa-vs-fda-vs-eu',
    title: 'Comparativo: ANVISA vs FDA vs EU Cosmetics Regulation',
    excerpt:
      'Differences between Brazil ANVISA, US FDA, and EU cosmetics regulations for cross-border sellers.',
    locale: 'en',
    category: 'Compliance',
    author: 'CosmetCheck Team',
    publishedAt: '2025-09-12',
    updatedAt: '2025-09-12',
    tags: ['ANVISA', 'FDA', 'EU', 'cross-border'],
    targetKeyword: 'cross-border compliance cosmetics',
    readingTime: 12,
    featured: false,
    content: `
<h2>Why regulatory differences matter for cross-border sellers</h2>
<p>If you're selling cosmetics across multiple markets, understanding the differences between regulatory frameworks is crucial. A product compliant with FDA rules may not pass ANVISA inspection.</p>

<h2>Key differences: ANVISA vs FDA vs EU</h2>
<table>
<tr><th>Aspect</th><th>ANVISA (Brazil)</th><th>FDA (USA)</th><th>EU Regulation</th></tr>
<tr><td>Pre-market approval</td><td>Required for imports</td><td>Not required</td><td>Notification via CPNP</td></tr>
<tr><td>Ingredient lists</td><td>Português obrigatório</td><td>English required</td><td>Any EU language</td></tr>
<tr><td>Prohibited substances</td><td>RDC 665/2022</td><td>21 CFR 700</td><td>EU Regulation 1223/2009</td></tr>
<tr><td>Testing requirements</td><td>ANVISA-approved labs</td><td>No specific lab requirement</td><td>GLP compliant labs</td></tr>
</table>

<h2>How CosmetCheck helps</h2>
<p><a href="/">CosmetCheck</a> supports ANVISA and COFEPRIS compliance out of the box, with FDA and EU coming soon.</p>
`,
  },
  {
    slug: 'substancias-restritas-anvisa-download',
    title: 'Lista Atualizada: Substâncias Restritas na ANVISA (Baixe Grátis)',
    excerpt:
      'Download gratuito da lista completa de substâncias restritas e proibidas pela ANVISA em 2025.',
    locale: 'pt-BR',
    category: 'Recursos',
    author: 'CosmetCheck Team',
    publishedAt: '2025-09-19',
    updatedAt: '2025-09-19',
    tags: ['ANVISA', 'download', 'substâncias restritas', 'lead magnet'],
    targetKeyword: 'anvisa substâncias restritas',
    readingTime: 4,
    featured: true,
    content: `
<h2>Baixe nossa lista completa de substâncias restritas</h2>
<p>Mantenha seus produtos em conformidade com a ANVISA com nossa lista atualizada de substâncias proibidas e restritas.</p>

<h2>O que está incluído no download</h2>
<ul>
<li>Lista completa de ingredientes proibidos</li>
<li>Tabela de concentrações máximas permitidas</li>
<li>Substâncias restritas por categoria de produto</li>
<li>Atualizações da RDC 665/2022</li>
</ul>

<h2>Como usar a lista</h2>
<p>Use esta lista junto com a <a href="/">CosmetCheck</a> para verificar automaticamente seus produtos contra as normas mais recentes da ANVISA.</p>
`,
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getPostsByLocale(locale: BlogLocale): BlogPost[] {
  return blogPosts.filter((p) => p.locale === locale)
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}

export function getAllSlugs(): string[] {
  return blogPosts.map((p) => p.slug)
}

export function getFeaturedPosts(locale: BlogLocale): BlogPost[] {
  return blogPosts.filter((p) => p.locale === locale && p.featured)
}
