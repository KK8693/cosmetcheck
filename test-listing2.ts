import { config } from 'dotenv'
config({ path: '/home/agentuser/cosmetcheck/.env.local' })

import { generateListing } from './src/lib/ai'

const input = {
  productName: '\u901f\u6548\u533b\u7597\u7ea7\u7f8e\u767d\u6de1\u6591\u9632\u6652\u7cbe\u534e',
  ingredients: '\u53bb\u79bb\u5b50\u6c34\u3001\u4e19\u4e8c\u9187\u3001\u6c22\u919b\u3001\u690d\u7269\u6fc0\u7d20\u63d0\u53d6\u7269\u3001\u6cdb\u9187\u3001\u900f\u660e\u8d28\u9178\u94a0\u3001\u5929\u7136\u690d\u7269\u7cbe\u6cb9\u3001\u82ef\u6c27\u4e59\u9187',
  benefits: '\u7f8e\u767d\u6de1\u6591\uff0c\u9632\u6652',
  category: 'skincare' as const,
  targetCountry: 'BR' as const,
  tone: 'professional' as const,
  checkResult: {
    isCompliant: false,
    violations: [
      {
        message: 'Hidroquinona \u00e9 PROIBIDA em cosm\u00e9ticos pela ANVISA',
        suggestion: 'Remover da f\u00f3rmula',
        category: 'ingredient',
        keyword: 'hydroquinone',
        severity: 'critical',
      },
      {
        message: 'Extrato de horm\u00f4nio vegetal cont\u00e9m subst\u00e2ncias hormonais PROIBIDAS em cosm\u00e9ticos',
        suggestion: 'Remover da f\u00f3rmula',
        category: 'ingredient',
        keyword: 'hormone',
        severity: 'critical',
      },
      {
        message: 'Alega\u00e7\u00e3o m\u00e9dica "\u533b\u7597\u7ea7" (medical grade) proibida em cosm\u00e9ticos',
        suggestion: 'Use "cuidado profissional" ou "f\u00f3rmula avan\u00e7ada"',
        category: 'claim',
        keyword: '\u533b\u7597\u7ea7',
        severity: 'critical',
      },
      {
        message: 'Alega\u00e7\u00e3o de tempo "7 dias" proibida sem comprova\u00e7\u00e3o cl\u00ednica',
        suggestion: 'Remover prazo espec\u00edfico',
        category: 'claim',
        keyword: '7\u5929',
        severity: 'critical',
      },
      {
        message: 'Alega\u00e7\u00e3o absoluta "100%" proibida sem comprova\u00e7\u00e3o',
        suggestion: 'Remover termo absoluto',
        category: 'claim',
        keyword: '100%',
        severity: 'critical',
      },
      {
        message: 'Alega\u00e7\u00e3o de seguran\u00e7a para gr\u00e1vidas sem comprova\u00e7\u00e3o cl\u00ednica',
        suggestion: 'Remover men\u00e7\u00e3o a gestantes',
        category: 'claim',
        keyword: '\u5b55\u5987',
        severity: 'critical',
      },
    ],
    warnings: [
      {
        message: 'Alega\u00e7\u00e3o de prote\u00e7\u00e3o UV sem ativos de prote\u00e7\u00e3o solar na f\u00f3rmula',
        suggestion: 'Adicionar ativos de prote\u00e7\u00e3o solar ou remover alega\u00e7\u00e3o UV',
        category: 'claim',
        keyword: '\u9632\u6652',
        severity: 'warning',
      },
      {
        message: 'Alega\u00e7\u00e3o de clareamento requer registro ESPECIAL na ANVISA',
        suggestion: 'Verificar necessidade de registro especial',
        category: 'claim',
        keyword: '\u7f8e\u767d',
        severity: 'warning',
      },
    ],
  },
}

console.log('='.repeat(70))
console.log('TEST: \u901f\u6548\u533b\u7597\u7ea7\u7f8e\u767d\u6de1\u6591\u9632\u6652\u7cbe\u534e')
console.log('Ingredients:', input.ingredients)
console.log('='.repeat(70))

generateListing(input).then(result => {
  console.log('\n\ud83d\udccc TITLE:')
  console.log(result.title)

  console.log('\n\ud83d\udccc DESCRIPTION:')
  console.log(result.description)

  console.log('\n\ud83d\udccc BULLET POINTS:')
  result.bulletPoints.forEach((p, i) => console.log(`  ${i + 1}. ${p}`))

  console.log('\n\ud83d\udccc INGREDIENT LIST (code-generated, honest):')
  result.ingredientList.forEach((ing, i) => console.log(`  ${i + 1}. ${ing}`))

  console.log('\n\ud83d\udccc COMPLIANCE NOTES:')
  result.complianceNotes.forEach((n, i) => console.log(`  ${i + 1}. ${n}`))

  console.log('\n\ud83d\udccc WARNINGS:')
  result.warnings.forEach((w, i) => console.log(`  ${i + 1}. ${w}`))

  console.log('\n' + '='.repeat(70))
  console.log('VALIDATION CHECKLIST:')
  console.log('='.repeat(70))

  const allText = `${result.title} ${result.description} ${result.bulletPoints.join(' ')}`.toLowerCase()

  const checks = [
    ['Title has NO hydroquinone/hormone names', !/hidroquinona|hydroquinone|horm[oô]nio|plant hormone/.test(allText)],
    ['Title has NO medical claims (medical grade)', !/m[eé]dico|medical grade|\u533b\u7597/.test(allText)],
    ['No false removal claims', !/removido|reformulado|n\u00e3o cont\u00e9m.*foi/.test(allText)],
    ['No absolute claims (100%, permanent, zero)', !/100%|permanente|zero|completamente|totalmente/.test(allText)],
    ['No time-based results (7 dias, instant)', !/7\s*dias?|instant[âa]neo|imediato|24\s*horas/.test(allText)],
    ['No pregnancy safety claims', !/gr[áa]vida|gestante|pregnant/.test(allText)],
    ['No UV claims without sunscreen ingredients', !/fps|spf|prote[c\u00e7][a\u00e3]o\s+solar|bloqueador|anti-uv/.test(allText)],
    ['Ingredient list is honest (8 items)', result.ingredientList.length === 8],
    ['Hydroquinone flagged', result.ingredientList.some(i => i.includes('\ud83d\udd34 PROIBIDO') && i.includes('\u6c22\u919b'))],
    ['Hormone extract flagged', result.ingredientList.some(i => i.includes('\ud83d\udd34 PROIBIDO') && i.includes('\u690d\u7269\u6fc0\u7d20'))],
    ['Compliance note about non-commercializable', result.complianceNotes.some(n => n.includes('N\u00c3O COMERCIALIZ\u00c1VEL'))],
  ]

  for (const [label, pass] of checks) {
    console.log(`  ${pass ? '\u2705' : '\u274c'} ${label}`)
  }

  const allPass = checks.every(([, pass]) => pass)
  console.log('\n' + (allPass ? '\ud83c\udf89 ALL CHECKS PASSED' : '\u26a0\ufe0f SOME CHECKS FAILED'))

}).catch(err => {
  console.error('ERROR:', err)
})
