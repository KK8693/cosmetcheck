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
// Blog posts (M2 content calendar Week 8-14) — local fallback
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
    publishedAt: '2025-03-15',
    updatedAt: '2025-05-20',
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
    publishedAt: '2025-04-10',
    updatedAt: '2025-05-20',
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
    publishedAt: '2025-03-28',
    updatedAt: '2025-05-20',
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
    publishedAt: '2025-04-22',
    updatedAt: '2025-05-20',
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
    publishedAt: '2025-05-01',
    updatedAt: '2025-05-20',
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
  {
    slug: 'guia-definitivo-compliance-cosmeticos-brasil-2025',
    title: 'Guia Definitivo: Compliance de Cosméticos no Brasil — Tudo que Você Precisa Saber em 2025',
    excerpt:
      'Guia completo sobre compliance de cosméticos no Brasil em 2025. Ingredientes proibidos ANVISA, checklist de documentação, erros comuns, análise de produtos reais e case de sucesso. PDF gratuito!',
    locale: 'pt-BR',
    category: 'Compliance',
    author: 'CosmetCheck Team',
    publishedAt: '2025-05-10',
    updatedAt: '2025-05-28',
    tags: ['ANVISA', 'compliance', 'Brasil', 'guia completo', 'importação', 'regularização'],
    targetKeyword: 'compliance cosméticos brasil',
    readingTime: 20,
    featured: true,
    content: `
<h2>Introdução: O Mercado de Ouro com a Porteira de Aço</h2>
<p>O Brasil é o <strong>4º maior mercado de cosméticos do mundo</strong> — e o 1º quando se fala em beleza por habitante. Em 2024, o setor movimentou <strong>R$ 52,6 bilhões</strong>, com crescimento projetado de 8% ao ano até 2028.</p>
<p>Mas existe um problema sério: <strong>67% dos produtos importados são reprovados na primeira inspeção da ANVISA.</strong> Em 2024, mais de <strong>12.000 produtos de beleza</strong> foram retidos na alfândega brasileira.</p>
<p>Neste guia completo, você vai descobrir: lista atualizada de ingredientes proibidos, checklist de documentação, os 3 erros que reprovam 80% dos produtos, análise real de 3 produtos, e um case de sucesso de 15 produtos regularizados em 30 dias.</p>

<h2>Capítulo 1: A Lista Negra da ANVISA 2025</h2>
<p>Em 2025, três mudanças críticas afetam diretamente produtos importados:</p>

<h3>1. Hidroquinona: Proibição Total</h3>
<p>A hidroquinona está <strong>proibida em todos os cosméticos</strong> — qualquer concentração, zero tolerância. Produtos afetados: cremes clareadores da Coreia do Sul, China, Tailândia; séruns antimanchas de marcas asiáticas.</p>

<h3>2. Formol e Liberadores de Formaldeído: Tolerância Zero</h3>
<p>Nenhuma quantidade de formol ou liberadores de formaldeído é permitida. Cuidado: muitos produtos "sem formol" contêm <strong>glutaraldeído</strong> ou outros aldeídos que a ANVISA também rejeita.</p>

<h3>3. Nanopartículas: Declaração Obrigatória no Rótulo</h3>
<p>Cosméticos com nanopartículas precisam ter declaração explícita no rótulo em português. Produtos afetados: protetores solares com óxido de zinco nanonizado, cremes com nanopartículas de ouro/prata.</p>

<h3>Lista Resumida: Substâncias Proibidas Totalmente</h3>
<table>
<tr><th>Substância</th><th>Produtos Típicos</th><th>Origem Comum</th></tr>
<tr><td>Hidroquinona</td><td>Cremes clareadores</td><td>Ásia</td></tr>
<tr><td>Mercúrio e compostos</td><td>Cremes branqueadores</td><td>Ásia, África</td></tr>
<tr><td>Chumbo e sais</td><td>Tinturas de cabelo</td><td>Diversos</td></tr>
<tr><td>Formol/Formaldeído</td><td>Alisantes, progressivas</td><td>BR, CN, AR</td></tr>
<tr><td>Estrôncio e sais</td><td>Dentifrícios</td><td>Europa</td></tr>
<tr><td>Hexaclorofeno</td><td>Sabonetes antimicrobianos</td><td>Diversos</td></tr>
<tr><td>Tretinoína (uso cosmético)</td><td>Cremes antienvelhecimento</td><td>Diversos</td></tr>
<tr><td>Corticosteroides</td><td>Cremes "milagrosos"</td><td>Diversos</td></tr>
<tr><td>Hormônios</td><td>Cremes firmadores</td><td>Diversos</td></tr>
</table>

<h2>Capítulo 2: Checklist de Documentação Obrigatória</h2>
<p>Muitos vendedores acham que basta ter o rótulo em português. <strong>Errado.</strong> A ANVISA exige 5 documentos:</p>

<h3>1. Relatório de Segurança do Produto (RSP)</h3>
<p>Documento técnico elaborado por Responsável Técnico habilitado. Deve conter: composição completa, especificações físico-químicas, avaliação de segurança, estabilidade.</p>

<h3>2. Comprovante de Notificação ou Registro na ANVISA</h3>
<p><strong>Grau 1 (baixo risco):</strong> Notificação — processo online, gratuito, mais simples. Ex: hidratantes, shampoos básicos.<br/>
<strong>Grau 2 (maior risco):</strong> Registro — processo mais rigoroso, paga taxa, exige mais documentação. Ex: protetor solar, tintura de cabelo, antitranspirante.</p>

<h3>3. Laudo de Análise de Ingredientes</h3>
<p>Confirma que os ingredientes correspondem ao declarado no rótulo. Deve ser de laboratório credenciado ANVISA ou acreditado INMETRO.</p>

<h3>4. Rótulo em Português (RDC 752/2022)</h3>
<p>Deve conter: nome do produto, CNPJ do titular, nome do RT, composição em ordem decrescente, modo de usar, precauções, prazo de validade, lote, registro/notificação ANVISA.</p>

<h3>5. Certificado de Origem</h3>
<p>Comprova a procedência do produto. Necessário para cálculo de impostos e facilitação alfandegária.</p>

<h2>Capítulo 3: Os 3 Erros que Reprovam 80% dos Produtos Importados</h2>

<h3>Erro #1: Confiar Cegamente no Fornecedor</h3>
<p>O certificado pode ser falso, desatualizado, ou referir-se a uma norma chinesa — não à ANVISA. <strong>Solução:</strong> Sempre verifique os ingredientes individualmente contra a lista da ANVISA. Use a <a href="/">CosmetCheck</a> para validar antes de importar.</p>

<h3>Erro #2: Ignorar "Ingredientes Ocultos"</h3>
<p>Fragrâncias compostas, impurezas do processo, conservantes sistêmicos. <strong>Solução:</strong> Peça ao fornecedor a fórmula completa (full ingredient list), não apenas o rótulo de varejo.</p>

<h3>Erro #3: Traduzir o Rótulo ao Invés de Adaptá-lo</h3>
<p>A ANVISA exige nomenclatura oficial brasileira (Dicionário de Substâncias Cosméticas da ANVISA). <strong>Solução:</strong> Use um tradutor especializado em regulamentação de cosméticos.</p>

<h2>Capítulo 4: Análise Real de 3 Produtos</h2>

<h3>Produto 1: "Hidratante Ultra Glow" (China) — ❌ REPROVADO</h3>
<p>Continha <strong>Hydroquinone</strong> na lista de ingredientes. A ANVISA proíbe qualquer traço de hidroquinona em cosméticos desde 2025. <strong>Prejuízo evitado:</strong> R$ 8.000 em estoque.</p>

<h3>Produto 2: "Protetor Solar Mineral SPF 50" (Alemanha) — ✅ APROVADO</h3>
<p>Todos os ingredientes permitidos, mas requer <strong>Registro</strong> na ANVISA (Grau 2) por ser protetor solar. Requer laudo de eficácia SPF e declaração de nanopartículas no rótulo. <strong>Investimento:</strong> R$ 5.000-8.000. <strong>Prazo:</strong> 90-120 dias.</p>

<h3>Produto 3: "Máscara de Cabelo Natural" (Índia) — ⚠️ ALERTA</h3>
<p>Conservante MI/MCI em concentração que precisa de verificação. Claim "natural" sem certificação é publicidade enganosa. Requer certificado de análise confirmando concentração de MI/MCI.</p>

<h2>Capítulo 5: Case de Sucesso — 15 Produtos em 30 Dias</h2>
<p>Uma pequena empresa de São Paulo que importa cosméticos da Coreia do Sul descobriu que <strong>14 dos 15 produtos tinham algum problema de compliance.</strong> Com a CosmetCheck, eles:</p>
<ul>
<li>Identificaram 7 produtos com hidroquinona e solicitaram reformulação</li>
<li>Geraram relatórios de compliance para cada produto</li>
<li>Contrataram um Responsável Técnico</li>
<li>Elaboraram RSPs e iniciaram Notificação/Registro</li>
</ul>
<p><strong>Resultado:</strong> 11 produtos aprovados para Notificação, 2 em processo de Registro, 0 prejuízo com retenção alfandegária. <strong>Economia estimada:</strong> R$ 35.000-45.000.</p>

<h2>Capítulo 6: Como Começar Agora — Seu Próximo Passo em 5 Minutos</h2>

<h3>Passo 1: Analise Seus Produtos Atuais</h3>
<p>Use a <a href="/">CosmetCheck</a> para verificar ingredientes em segundos.</p>

<h3>Passo 2: Faça o Diagnóstico de Documentação</h3>
<p>Use nosso checklist PDF gratuito para verificar se você tem todos os 5 documentos obrigatórios.</p>

<h3>Passo 3: Corrija Antes de Escalar</h3>
<p>Não importe mais estoque até ter certeza de que seus produtos estão em compliance.</p>

<h2>Baixe o Checklist Completo de Compliance ANVISA 2025</h2>
<p>Todo o conhecimento deste guia está compilado em um <strong>PDF prático de 6 páginas</strong> que você pode imprimir, salvar no celular e compartilhar com sua equipe.</p>
<p><strong>O que inclui o PDF:</strong></p>
<ul>
<li>Checklist de documentação (5 documentos obrigatórios + explicação)</li>
<li>Tabela de substâncias proibidas (nomes INCI + comuns)</li>
<li>Tabela de substâncias restritas com limites de concentração</li>
<li>Template de email para solicitar informações ao fornecedor</li>
<li>Checklist de rótulo (tudo que precisa estar no rótulo em português)</li>
<li>Fluxograma: Notificação vs Registro</li>
</ul>
<p><a href="/downloads/cosmetcheck-checklist-compliance-anvisa-2025.pdf" target="_blank"><strong>📥 BAIXAR PDF GRATUITO →</strong></a></p>

<h2>Perguntas Frequentes (FAQ)</h2>

<h3>Posso vender cosméticos no Brasil sem notificar a ANVISA?</h3>
<p><strong>Não.</strong> Todo cosmético vendido no Brasil precisa estar notificado ou registrado na ANVISA. Multas de até R$ 1,5 milhão.</p>

<h3>Quanto custa regularizar um produto?</h3>
<p><strong>Notificação (Grau 1):</strong> Gratuita. Custos: RSP (R$ 500-2.000).<br/>
<strong>Registro (Grau 2):</strong> Taxa ~R$ 2.500-5.000 + testes adicionais.</p>

<h3>Produto aprovado nos EUA/FDA serve para o Brasil?</h3>
<p><strong>Não.</strong> A ANVISA tem regras diferentes da FDA americana, da UE ou da China.</p>

<h3>A CosmetCheck substitui um advogado?</h3>
<p><strong>Não substitui,</strong> mas <strong>acelera</strong> o processo. Para processos complexos, sempre consulte um especialista.</p>

<h2>Conclusão</h2>
<p>O mercado de cosméticos no Brasil movimenta <strong>R$ 52,6 bilhões por ano</strong>. É uma oportunidade enorme para quem sabe navegar a regulamentação. O segredo é simples: verifique antes de importar, documente corretamente, use ferramentas para acelerar.</p>
<p><a href="/downloads/cosmetcheck-checklist-compliance-anvisa-2025.pdf" target="_blank"><strong>📥 Baixe o Checklist Completo agora</strong></a> e comece a proteger seu negócio hoje mesmo.</p>
`,
  },
  {
    slug: 'anvisa-banned-ingredients-list-2025',
    title: 'Complete ANVISA Banned Ingredients List 2025: What Cosmetics Sellers Must Know',
    excerpt:
      'Full list of prohibited and restricted cosmetic ingredients in Brazil. Updated for 2025 with concentrations, common product types, and how to check your formula before import.',
    locale: 'en',
    category: 'Compliance',
    author: 'CosmetCheck Team',
    publishedAt: '2025-05-15',
    updatedAt: '2025-05-30',
    tags: ["ANVISA", "banned ingredients", "Brazil", "cosmetics compliance", "2025"],
    targetKeyword: 'anvisa banned ingredients list 2025',
    readingTime: 10,
    featured: true,
    content: `<h2>Why ANVISA ingredient rules matter for your business</h2>
<p>Brazil's <strong>ANVISA</strong> (Agência Nacional de Vigilância Sanitária) maintains its own cosmetic ingredient regulations under <strong>RDC No. 7/2015</strong> and subsequent amendments. Unlike the EU or FDA, ANVISA uses a <strong>positive list system</strong> — if an ingredient isn't explicitly approved, it's not allowed by default.</p>
<p>This catches foreign brands constantly. A product that passes EU scrutiny can fail ANVISA inspection because of a single unapproved preservative or UV filter. Understanding the banned and restricted list before you import saves you from <strong>seizure, fines, and lost revenue</strong>.</p>

<h2>Completely banned ingredients in Brazilian cosmetics</h2>
<p>These substances are <strong>prohibited in all cosmetic products</strong> regardless of concentration or product type:</p>

<table>
<tr><th>Ingredient</th><th>INCI Name</th><th>Common Products</th><th>Why Banned</th></tr>
<tr><td>Hydroquinone</td><td>Hydroquinone</td><td>Skin lighteners, fade creams</td><td>Carcinogenic risk; melanocyte toxicity</td></tr>
<tr><td>Mercury compounds</td><td>Mercury, Mercurous chloride</td><td>Whitening creams, eye drops</td><td>Neurotoxicity; bioaccumulation</td></tr>
<tr><td>Lead and salts</td><td>Lead acetate</td><td>Hair dyes (especially progressive)</td><td>Neurotoxicity; developmental toxicity</td></tr>
<tr><td>Formaldehyde</td><td>Formaldehyde</td><td>Hair straighteners, nail hardeners</td><td>Carcinogen; respiratory irritant</td></tr>
<tr><td>Strontium compounds</td><td>Strontium chloride</td><td>Toothpaste, deodorants</td><td>Bone-seeking radionuclide mimic</td></tr>
<tr><td>Hexachlorophene</td><td>Hexachlorophene</td><td>Antibacterial soaps</td><td>Neurotoxicity</td></tr>
<tr><td>Corticosteroids</td><td>Hydrocortisone, Betamethasone</td><td>"Miracle" skin creams</td><td>Drug classification; requires prescription</td></tr>
<tr><td>Tretinoin (cosmetic use)</td><td>Tretinoin</td><td>Anti-aging creams</td><td>Retinoic acid — prescription drug in Brazil</td></tr>
<tr><td>Hormones</td><td>Estrogen, Progesterone</td><td>Firming creams, breast enhancers</td><td>Endocrine disruption</td></tr>
<tr><td>Chloroform</td><td>Chloroform</td><td>Historical solvent traces</td><td>Carcinogen; hepatotoxicity</td></tr>
</table>

<h2>Restricted ingredients: allowed only below these limits</h2>
<p>These ingredients are permitted but only within specific concentration ranges. Going over the limit = automatic rejection.</p>

<table>
<tr><th>Ingredient</th><th>Max Concentration</th><th>Product Type</th></tr>
<tr><td>Salicylic acid</td><td>2.0%</td><td>Leave-on products</td></tr>
<tr><td>Salicylic acid</td><td>3.0%</td><td>Rinse-off products</td></tr>
<tr><td>Benzoyl peroxide</td><td>5.0%</td><td>Anti-acne products</td></tr>
<tr><td>Hydrogen peroxide</td><td>12.0%</td><td>Hair bleaching</td></tr>
<tr><td>Ammonia</td><td>6.0%</td><td>Hair coloring</td></tr>
<tr><td>PPD (p-Phenylenediamine)</td><td>2.0%</td><td>Oxidative hair dyes</td></tr>
<tr><td>Resorcinol</td><td>1.25%</td><td>Hair dyes</td></tr>
<tr><td>Alpha-hydroxy acids (AHAs)</td><td>10.0%</td><td>Exfoliating products</td></tr>
<tr><td>Beta-hydroxy acids (BHAs)</td><td>2.0%</td><td>Exfoliating products</td></tr>
<tr><td>Thioglycolic acid</td><td>8.0%</td><td>Hair waving/straightening</td></tr>
</table>

<h2>UV filters: a special ANVISA category</h2>
<p>Brazil has its own <strong>approved sunscreen agent list</strong> that differs from both the FDA and EU. Key differences:</p>
<ul>
<li><strong>Not approved in Brazil (but approved in EU):</strong> Tinosorb S (Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine), Tinosorb M (Methylene Bis-Benzotriazolyl Tetramethylbutylphenol), Uvinul A Plus (Diethylamino Hydroxybenzoyl Hexyl Benzoate)</li>
<li><strong>Approved in Brazil:</strong> Avobenzone, Octocrylene, Oxybenzone, Octinoxate, Titanium Dioxide, Zinc Oxide (nano form requires declaration)</li>
</ul>
<p><strong>Critical:</strong> If your product claims SPF and uses a non-approved UV filter, ANVISA will reject it outright. The sunscreen category (Grau 2) also requires additional efficacy testing.</p>

<h2>Preservatives: the most common rejection reason</h2>
<p>ANVISA's preservative restrictions are stricter than the EU in several areas:</p>
<ul>
<li><strong>Formaldehyde releasers</strong> (DMDM Hydantoin, Quaternium-15, Imidazolidinyl Urea) have tight aggregate limits</li>
<li><strong>Parabens:</strong> Methylparaben and Propylparaben allowed; Butylparaben and Isobutylparaben restricted</li>
<li><strong>Methylisothiazolinone (MI):</strong> Allowed only in rinse-off products at ≤0.0015%</li>
<li><strong>Phenoxyethanol:</strong> Maximum 1.0%</li>
</ul>

<h2>Nanomaterials: declaration required</h2>
<p>Any ingredient in nano form must be explicitly declared on the label in Portuguese. This includes:</p>
<ul>
<li>Nano Titanium Dioxide in sunscreens</li>
<li>Nano Zinc Oxide in sunscreens</li>
<li>Nano Silver in antimicrobial products</li>
</ul>
<p>Products containing undisclosed nanoparticles are rejected at customs.</p>

<h2>How to check your product against ANVISA's lists</h2>
<p>Manual checking against ANVISA's Portuguese-language regulations is error-prone and slow. Here's a practical workflow:</p>

<ol>
<li><strong>Get your full ingredient list</strong> from the manufacturer — not just the retail label, but the complete formula</li>
<li><strong>Cross-check against ANVISA's positive/negative lists</strong> (available in Portuguese on the ANVISA website)</li>
<li><strong>Verify concentrations</strong> for restricted ingredients — don't assume "a little bit is fine"</li>
<li><strong>Check UV filters separately</strong> if your product has SPF claims</li>
<li><strong>Flag nanoparticles</strong> and ensure they'll be declared on the label</li>
</ol>

<p><strong>Pro tip:</strong> Many manufacturers provide EU-compliant formulas that need adjustment for Brazil. Always request a Brazil-specific formula review before placing large orders.</p>

<h2>What happens if you import a non-compliant product?</h2>
<ul>
<li><strong>Customs seizure:</strong> Product held at the border, storage fees accumulate</li>
<li><strong>ANVISA fine:</strong> Up to R$ 1.5 million for repeat violations</li>
<li><strong>Platform delisting:</strong> Mercado Livre and Amazon Brazil increasingly require registration numbers</li>
<li><strong>Reputational damage:</strong> Brazilian consumers are aware of ANVISA and check registration numbers</li>
</ul>

<h2>Next steps</h2>
<p>Don't rely on manufacturer assurances. Verify your ingredient list independently before you invest in inventory. Use our free compliance checker to scan your formula against the latest ANVISA regulations in seconds.</p>
`,
  },
  {
    slug: 'how-to-register-cosmetics-brazil-step-by-step',
    title: 'How to Register Cosmetics in Brazil: The Complete Step-by-Step Guide (2025)',
    excerpt:
      'Everything you need to know about ANVISA cosmetic registration: Grau 1 vs Grau 2, required documents, costs, timeline, and common mistakes that delay approval.',
    locale: 'en',
    category: 'Compliance',
    author: 'CosmetCheck Team',
    publishedAt: '2025-05-18',
    updatedAt: '2025-05-30',
    tags: ["ANVISA", "registration", "Brazil", "cosmetics", "step-by-step"],
    targetKeyword: 'how to register cosmetics in brazil',
    readingTime: 12,
    featured: true,
    content: `<h2>Do you need to register your cosmetics before selling in Brazil?</h2>
<p><strong>Yes.</strong> Every cosmetic product sold in Brazil must be either <strong>notified (Grau 1)</strong> or <strong>registered (Grau 2)</strong> with ANVISA before it can be legally marketed. There are no exceptions for e-commerce, dropshipping, or small quantities.</p>
<p>Importing without registration risks <strong>customs seizure, fines up to R$ 1.5 million, and permanent platform bans</strong> on Mercado Livre and Amazon Brazil.</p>

<h2>Grau 1 (Notificação) vs Grau 2 (Registro): which one applies to you?</h2>

<table>
<tr><th>Factor</th><th>Grau 1 (Notificação)</th><th>Grau 2 (Registro)</th></tr>
<tr><td>Risk level</td><td>Low risk</td><td>High risk</td></tr>
<tr><td>Process</td><td>Online notification, simpler</td><td>Full registration, rigorous review</td></tr>
<tr><td>Government fee</td><td>Free</td><td>~R$ 2,500-5,000</td></tr>
<tr><td>Timeline</td><td>6-12 months</td><td>12-24 months</td></tr>
<tr><td>Product types</td><td>Basic skincare, makeup, perfume, shampoo, conditioner</td><td>Sunscreen, anti-acne, hair dye, anti-aging, baby products, antiperspirant</td></tr>
<tr><td>Testing required</td><td>Basic safety assessment</td><td>Additional efficacy tests (SPF, stability, etc.)</td></tr>
</table>

<p><strong>How to determine your product's grade:</strong></p>
<ul>
<li>Does it claim SPF or sun protection? → <strong>Grau 2</strong></li>
<li>Does it treat acne, wrinkles, or hair loss? → <strong>Grau 2</strong></li>
<li>Is it a hair dye or bleach? → <strong>Grau 2</strong></li>
<li>Is it for babies or children under 3? → <strong>Grau 2</strong></li>
<li>Is it a basic moisturizer, lipstick, or perfume? → <strong>Grau 1</strong></li>
</ul>

<h2>Step 1: Prepare your documentation</h2>
<p>Before starting the ANVISA process, gather these documents:</p>

<h3>Required for both Grau 1 and Grau 2:</h3>
<ul>
<li><strong>Complete ingredient list</strong> (INCI names, concentrations) — must match the final formula</li>
<li><strong>Product Safety Report (PSR)</strong> — prepared by a qualified technical responsible (Responsável Técnico)</li>
<li><strong>GMP certificate</strong> — ISO 22716 accepted, must be current and properly notarized</li>
<li><strong>Portuguese label</strong> — all text must be in Portuguese per RDC 752/2022</li>
<li><strong>Brazilian Responsible Technical Person (PTR)</strong> — a licensed pharmacist or chemist based in Brazil</li>
</ul>

<h3>Additional for Grau 2:</h3>
<ul>
<li><strong>Efficacy test reports</strong> — SPF validation for sunscreens, stability testing</li>
<li><strong>Clinical safety data</strong> — for products with active ingredients</li>
<li><strong>Additional toxicological data</strong> — for products with restricted ingredients at higher concentrations</li>
</ul>

<h2>Step 2: Appoint a Brazilian PTR (Responsável Técnico)</h2>
<p>This is <strong>mandatory</strong> for all foreign brands. Your PTR is the legal representative for your product in Brazil and their name appears on the label. Options:</p>

<table>
<tr><th>Option</th><th>Cost</th><th>Best for</th></tr>
<tr><td>Hire a regulatory consultant as PTR</td><td>$2,000-5,000/year</td><td>Small brands, 1-10 SKUs</td></tr>
<tr><td>Partner with a Brazilian distributor</td><td>Negotiated into margin</td><td>Brands seeking local distribution</td></tr>
<tr><td>Set up a Brazilian subsidiary</td><td>$10,000+</td><td>Large brands with significant Brazil presence</td></tr>
</table>

<h2>Step 3: Submit your application</h2>
<p>For <strong>Grau 1</strong>, submit through ANVISA's online notification system (Sistema de Notificação). For <strong>Grau 2</strong>, submit through the full registration system (Sistema de Peticionamento).</p>

<p><strong>Key fields to complete:</strong></p>
<ul>
<li>Product name (must match the label exactly)</li>
<li>Complete INCI ingredient list with concentrations</li>
<li>Product category and intended use</li>
<li>Manufacturer information</li>
<li>PTR information</li>
<li>GMP certificate details</li>
</ul>

<h2>Step 4: Wait for technical review</h2>
<p>ANVISA's review process includes:</p>
<ul>
<li><strong>Initial queue:</strong> 2-3 months (varies by backlog)</li>
<li><strong>Technical evaluation:</strong> 3-6 months for Grau 1, 6-12 months for Grau 2</li>
<li><strong>Complementation (if needed):</strong> +2-4 months per round</li>
</ul>

<p><strong>Common reasons for complementation:</strong></p>
<ul>
<li>Ingredient list doesn't match the PSR</li>
<li>Label doesn't comply with RDC 752/2022</li>
<li>GMP certificate is expired or not properly notarized</li>
<li>Missing PTR designation</li>
<li>Product claims trigger drug classification</li>
</ul>

<h2>Step 5: Receive your registration number</h2>
<p>Once approved, you'll receive:</p>
<ul>
<li><strong>Grau 1:</strong> Notification number (starts with specific prefix)</li>
<li><strong>Grau 2:</strong> Registration number (starts with specific prefix)</li>
</ul>
<p>This number <strong>must appear on your product label</strong> before sale.</p>

<h2>Total cost breakdown (realistic 2025 estimates)</h2>

<table>
<tr><th>Cost item</th><th>Grau 1</th><th>Grau 2</th></tr>
<tr><td>Government fee</td><td>Free</td><td>~$400-800</td></tr>
<tr><td>PTR retainer (annual)</td><td>$2,000-5,000</td><td>$2,000-5,000</td></tr>
<tr><td>PSR preparation</td><td>$500-2,000</td><td>$1,000-3,000</td></tr>
<tr><td>Label translation/adaptation</td><td>$300-800</td><td>$300-800</td></tr>
<tr><td>GMP documentation</td><td>$500</td><td>$500</td></tr>
<tr><td>Additional testing</td><td>$0</td><td>$3,000-8,000</td></tr>
<tr><td>Consultant fees (full service)</td><td>$3,000-7,000</td><td>$5,000-12,000</td></tr>
<tr><td><strong>Total per SKU</strong></td><td><strong>$5,000-10,000</strong></td><td><strong>$10,000-25,000</strong></td></tr>
</table>

<h2>Money-saving strategies</h2>
<ul>
<li><strong>Start with your hero SKU.</strong> Perfect the process with one product, then batch the rest</li>
<li><strong>Stagger submissions by 2-3 weeks.</strong> Incorporate feedback from the first into subsequent applications</li>
<li><strong>Negotiate volume rates.</strong> If you have 5+ SKUs, most consultants offer discounts</li>
<li><strong>Partner with a distributor.</strong> They often absorb PTR costs in exchange for exclusivity</li>
</ul>

<h2>Timeline: what to expect</h2>

<table>
<tr><th>Phase</th><th>Grau 1</th><th>Grau 2</th></tr>
<tr><td>Preparation</td><td>1-2 months</td><td>2-3 months</td></tr>
<tr><td>Initial review queue</td><td>2-3 months</td><td>2-3 months</td></tr>
<tr><td>Technical evaluation</td><td>3-6 months</td><td>6-12 months</td></tr>
<tr><td>Complementation (if needed)</td><td>+2-4 months</td><td>+2-4 months</td></tr>
<tr><td>Final approval</td><td>1-2 weeks</td><td>1-2 weeks</td></tr>
<tr><td><strong>Total realistic</strong></td><td><strong>6-12 months</strong></td><td><strong>12-24 months</strong></td></tr>
</table>

<h2>Common mistakes that delay approval</h2>
<ol>
<li><strong>Using English labels.</strong> All label text must be Portuguese. Not "mostly Portuguese" — 100%.</li>
<li><strong>Assuming EU/FDA compliance = ANVISA compliance.</strong> ANVISA has unique restrictions.</li>
<li><strong>Incomplete ingredient lists.</strong> "Fragrance" isn't enough — disclose allergens and restricted components.</li>
<li><strong>Drug claims on cosmetic labels.</strong> "Treats acne" pushes you into drug registration (2-3 years).</li>
<li><strong>Hiring a PTR without cosmetics experience.</strong> A general pharmacist won't know ANVISA's specific requirements.</li>
</ol>

<h2>Next steps</h2>
<p>Don't navigate ANVISA registration alone. Use our free compliance checker to verify your ingredient list before you start the registration process — catching issues early saves months of delays.</p>
`,
  },
  {
    slug: 'cofepris-vs-anvisa-key-differences',
    title: 'COFEPRIS vs ANVISA: Key Differences for Cosmetics Compliance in Latin America',
    excerpt:
      'Side-by-side comparison of Mexico COFEPRIS and Brazil ANVISA cosmetics regulations. Ingredient lists, labeling, costs, timeline, and what sellers need to know for both markets.',
    locale: 'en',
    category: 'Compliance',
    author: 'CosmetCheck Team',
    publishedAt: '2025-05-22',
    updatedAt: '2025-05-30',
    tags: ["COFEPRIS", "ANVISA", "Mexico", "Brazil", "comparison"],
    targetKeyword: 'cofepris vs anvisa cosmetics',
    readingTime: 10,
    featured: false,
    content: `<h2>Why you can't use the same strategy for Brazil and Mexico</h2>
<p>Brazil (ANVISA) and Mexico (COFEPRIS) are the two largest cosmetics markets in Latin America. Together they represent over <strong>$15 billion in annual beauty sales</strong>. But their regulatory frameworks are fundamentally different.</p>
<p>Brands that succeed in one market often struggle in the other because they assume compliance transfers. It doesn't. Here's what you actually need to know.</p>

<h2>At-a-glance comparison</h2>

<table>
<tr><th>Aspect</th><th>Brazil (ANVISA)</th><th>Mexico (COFEPRIS)</th></tr>
<tr><td>Pre-market requirement</td><td>Notification (Grau 1) or Registration (Grau 2)</td><td>Registro Sanitario (Sanitary Registration)</td></tr>
<tr><td>Label language</td><td>Portuguese — mandatory, no exceptions</td><td>Spanish — mandatory per NOM-141</td></tr>
<tr><td>Government fee</td><td>Free (Grau 1) / ~$400-800 (Grau 2)</td><td>~$500-1,500</td></tr>
<tr><td>Timeline</td><td>6-12 months (Grau 1) / 12-24 months (Grau 2)</td><td>4-8 months</td></tr>
<tr><td>Local representative</td><td>PTR (Responsável Técnico) — mandatory</td><td>Legal representative in Mexico — mandatory</td></tr>
<tr><td>GMP requirement</td><td>Required, ISO 22716 accepted</td><td>Required, specific Mexican standards</td></tr>
<tr><td>Ingredient philosophy</td><td>Positive list — not approved = not allowed</td><td>Positive list with some FDA alignment</td></tr>
</table>

<h2>Ingredient regulation: where they diverge most</h2>

<h3>Brazil (ANVISA)</h3>
<ul>
<li><strong>Positive list system:</strong> If an ingredient isn't on ANVISA's approved list, it's prohibited by default</li>
<li><strong>Unique restrictions:</strong> Several EU-approved UV filters and preservatives are not approved in Brazil</li>
<li><strong>Strict concentration limits:</strong> Many ingredients have lower maximum concentrations than the EU or US</li>
<li><strong>Nanomaterials:</strong> Must be explicitly declared on the label in Portuguese</li>
</ul>

<h3>Mexico (COFEPRIS)</h3>
<ul>
<li><strong>NOM-141 standard:</strong> Mexican Official Standard for cosmetic labeling and ingredients</li>
<li><strong>Some FDA alignment:</strong> Mexico's restricted list is closer to the FDA than the EU or Brazil</li>
<li><strong>Specific allergen disclosure:</strong> Fragrances with known allergens must be individually declared</li>
<li><strong>Different preservative limits:</strong> Some preservatives allowed at higher concentrations than Brazil</li>
</ul>

<h3>Key differences in banned ingredients</h3>
<table>
<tr><th>Ingredient</th><th>Brazil</th><th>Mexico</th></tr>
<tr><td>Hydroquinone</td><td>Banned (all concentrations)</td><td>Banned in whitening products</td></tr>
<tr><td>Mercury compounds</td><td>Banned</td><td>Banned</td></tr>
<tr><td>Lead in lip/eye products</td><td>Banned</td><td>Strictly limited</td></tr>
<tr><td>Formaldehyde</td><td>Banned (most uses)</td><td>Limited in hair treatments</td></tr>
<tr><td>Parabens (Butyl/Isobutyl)</td><td>Restricted</td><td>Permitted with limits</td></tr>
<tr><td>Certain EU UV filters</td><td>Not approved</td><td>May be approved</td></tr>
</table>

<h2>Labeling requirements: the details that matter</h2>

<h3>Brazil (RDC 752/2022)</h3>
<ul>
<li>All text in Portuguese — no exceptions</li>
<li>Product name, CNPJ of holder, PTR name</li>
<li>Complete ingredient list in descending order (INCI)</li>
<li>Mode of use and precautions</li>
<li>Expiration date and batch number</li>
<li>ANVISA registration/notification number</li>
<li>Net content</li>
<li>Country of origin</li>
</ul>

<h3>Mexico (NOM-141-SSA1/SCF1-2012)</h3>
<ul>
<li>All text in Spanish — no exceptions</li>
<li>Product name and brand</li>
<li>Complete ingredient list</li>
<li>Net content in metric units</li>
<li>Country of origin</li>
<li>Name and address of Mexican legal representative</li>
<li>Health registration number</li>
<li>Batch and expiration date</li>
<li>Specific warnings for certain product categories</li>
</ul>

<h2>Cost comparison per SKU</h2>

<table>
<tr><th>Cost item</th><th>Brazil</th><th>Mexico</th></tr>
<tr><td>Government fee</td><td>$0-800</td><td>$500-1,500</td></tr>
<tr><td>Local representative</td><td>$2,000-5,000/year</td><td>$1,500-4,000/year</td></tr>
<tr><td>Documentation prep</td><td>$500-2,000</td><td>$500-1,500</td></tr>
<tr><td>Label adaptation</td><td>$300-800</td><td>$300-600</td></tr>
<tr><td>Testing (if needed)</td><td>$0-8,000</td><td>$0-3,000</td></tr>
<tr><td>Consultant (full service)</td><td>$3,000-12,000</td><td>$2,000-6,000</td></tr>
<tr><td><strong>Total range</strong></td><td><strong>$5,000-25,000</strong></td><td><strong>$3,000-12,000</strong></td></tr>
</table>

<h2>Timeline comparison</h2>

<table>
<tr><th>Phase</th><th>Brazil</th><th>Mexico</th></tr>
<tr><td>Preparation</td><td>1-3 months</td><td>1-2 months</td></tr>
<tr><td>Submission to approval</td><td>6-24 months</td><td>4-8 months</td></tr>
<tr><td>Post-approval setup</td><td>2-4 weeks</td><td>2-4 weeks</td></tr>
<tr><td><strong>Total</strong></td><td><strong>8-28 months</strong></td><td><strong>5-11 months</strong></td></tr>
</table>

<h2>Strategic recommendation: which market first?</h2>

<h3>Start with Mexico if:</h3>
<ul>
<li>You want faster market entry (4-8 months vs 6-24)</li>
<li>You have limited budget (typically 30-50% cheaper)</li>
<li>Your product is closer to FDA compliance</li>
<li>You want to test LATAM demand before major Brazil investment</li>
</ul>

<h3>Start with Brazil if:</h3>
<ul>
<li>Brazil is your primary target market (4x larger than Mexico)</li>
<li>Your product already has EU compliance documentation</li>
<li>You're willing to invest more upfront for larger long-term returns</li>
<li>You have a distributor partner already established in Brazil</li>
</ul>

<h3>The "documentation reuse" strategy</h3>
<p>Brands that successfully navigate ANVISA often find their documentation is <strong>60-80% reusable</strong> for COFEPRIS. Key reusable elements:</p>
<ul>
<li>Safety assessment methodology</li>
<li>Ingredient analysis reports</li>
<li>GMP certificates (with translation)</li>
<li>Stability testing data</li>
</ul>
<p>Elements that <strong>must be redone:</strong></p>
<ul>
<li>Label translation (Portuguese → Spanish)</li>
<li>Local representative agreements</li>
<li>Registration application forms</li>
<li>Any market-specific testing</li>
</ul>

<h2>Common mistakes when managing both markets</h2>
<ol>
<li><strong>Using one label for both markets.</strong> You need separate Portuguese and Spanish labels.</li>
<li><strong>Hiring the same consultant for both.</strong> Brazil and Mexico require different local expertise.</li>
<li><strong>Assuming ingredient compliance transfers.</strong> Always recheck against each country's specific lists.</li>
<li><strong>Neglecting post-registration obligations.</strong> Both require annual renewals and change notifications.</li>
<li><strong>Not staggering applications.</strong> Start Mexico 3-6 months before Brazil to align launch timelines.</li>
</ol>

<h2>Next steps</h2>
<p>Both markets are profitable but require dedicated preparation. Use our compliance checker to verify your ingredient list against both ANVISA and COFEPRIS regulations simultaneously — it's the fastest way to identify which market is easier for your specific product line.</p>
`,
  },
]

// ---------------------------------------------------------------------------
// Notion CMS integration — build-time data loading
// ---------------------------------------------------------------------------

let cachedPosts: BlogPost[] | null = null

/**
 * Load all blog posts. Prefers Notion CMS if configured,
 * otherwise falls back to local static data.
 * Results are cached for the duration of the build process.
 */
export async function loadAllPosts(): Promise<BlogPost[]> {
  if (cachedPosts) return cachedPosts

  // Dynamic import to avoid bundling Notion client when not used
  const { fetchBlogPostsFromNotion, isNotionConfigured } = await import('./notion')

  if (isNotionConfigured()) {
    try {
      const notionPosts = await fetchBlogPostsFromNotion()
      if (notionPosts.length > 0) {
        cachedPosts = notionPosts
        console.log(`[Blog] Loaded ${notionPosts.length} posts from Notion CMS`)
        return cachedPosts
      }
      console.warn('[Blog] Notion configured but no published posts found, using fallback')
    } catch (err) {
      console.error('[Blog] Failed to fetch from Notion, using fallback:', err)
    }
  }

  cachedPosts = blogPosts
  return cachedPosts
}

// ---------------------------------------------------------------------------
// Helpers (notion-aware)
// ---------------------------------------------------------------------------

export async function getPostsByLocale(locale: BlogLocale): Promise<BlogPost[]> {
  const posts = await loadAllPosts()
  return posts.filter((p) => p.locale === locale)
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await loadAllPosts()
  return posts.find((p) => p.slug === slug)
}

export async function getAllSlugs(): Promise<string[]> {
  const posts = await loadAllPosts()
  return posts.map((p) => p.slug)
}

export async function getFeaturedPosts(locale: BlogLocale): Promise<BlogPost[]> {
  const posts = await loadAllPosts()
  return posts.filter((p) => p.locale === locale && p.featured)
}
