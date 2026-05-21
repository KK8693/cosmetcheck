import { config } from 'dotenv'
config({ path: '/home/agentuser/cosmetcheck/.env.local' })

import { generateListing } from './src/lib/ai'

const input = {
  productName: '\u533b\u7528\u79d1\u7814\u9006\u9f84\u6de1\u6591\u7f8e\u767d\u7cbe\u534e',
  ingredients: '\u53bb\u79bb\u5b50\u6c34\u3001\u4e19\u4e8c\u9187\u3001\u7ef4A\u9178\u3001\u7532\u785d\u5511\u3001\u6cdb\u9187\u3001\u900f\u660e\u8d28\u9178\u94a0\u3001\u718a\u679c\u82f7\u3001\u5c3c\u6cca\u91d1\u916f',
  benefits: '\u6de1\u6591\u7f8e\u767d\uff0c\u9006\u9f84\u6297\u8870',
  category: 'skincare' as const,
  targetCountry: 'BR' as const,
  tone: 'professional' as const,
  checkResult: {
    isCompliant: false,
    violations: [
      {
        message: '\u00c1cido Retinoico \u00e9 PROIBIDO em cosm\u00e9ticos pela ANVISA',
        suggestion: 'Remover da f\u00f3rmula',
        category: 'ingredient',
        keyword: 'retinoic',
        severity: 'critical',
      },
      {
        message: 'Metronidazol \u00e9 um antibi\u00f3tico PROIBIDO em cosm\u00e9ticos pela ANVISA',
        suggestion: 'Remover da f\u00f3rmula',
        category: 'ingredient',
        keyword: 'metronidazol',
        severity: 'critical',
      },
    ],
    warnings: [
      {
        message: 'Parabenos s\u00e3o RESTRITOS - verificar concentra\u00e7\u00e3o',
        suggestion: 'Verificar concentra\u00e7\u00e3o m\u00e1xima permitida',
        category: 'ingredient',
        keyword: 'paraben',
        severity: 'warning',
      },
    ],
  },
}

console.log('='.repeat(60))
console.log('TEST: \u533b\u7528\u79d1\u7814\u9006\u9f84\u6de1\u6591\u7f8e\u767d\u7cbe\u534e')
console.log('Ingredients:', input.ingredients)
console.log('='.repeat(60))

generateListing(input).then(result => {
  console.log('\nTITLE:')
  console.log(result.title)

  console.log('\nDESCRIPTION:')
  console.log(result.description)

  console.log('\nBULLET POINTS:')
  result.bulletPoints.forEach((p, i) => console.log(`  ${i + 1}. ${p}`))

  console.log('\nINGREDIENT LIST (code-generated, honest):')
  result.ingredientList.forEach((ing, i) => console.log(`  ${i + 1}. ${ing}`))

  console.log('\nCOMPLIANCE NOTES:')
  result.complianceNotes.forEach((n, i) => console.log(`  ${i + 1}. ${n}`))

  console.log('\nWARNINGS:')
  result.warnings.forEach((w, i) => console.log(`  ${i + 1}. ${w}`))

  console.log('\n' + '='.repeat(60))
  console.log('VALIDATION CHECKLIST:')
  console.log('='.repeat(60))

  const allText = `${result.title} ${result.description} ${result.bulletPoints.join(' ')}`.toLowerCase()

  const checks = [
    ['Title has NO ingredient names', !/retinoic|tretinoin|metronidazol|kojic|\u00e1cido k\u00f3jico/.test(allText)],
    ['No false removal claims', !/removido|reformulado|n\u00e3o cont\u00e9m.*foi|\u4e0d\u542b.*\u5df2\u79fb\u9664/.test(allText)],
    ['Ingredient list is honest (8 items)', result.ingredientList.length === 8],
    ['Retinoic acid flagged', result.ingredientList.some(i => i.includes('\ud83d\udd34 PROIBIDO') && i.includes('\u7ef4A\u9178'))],
    ['Metronidazol flagged', result.ingredientList.some(i => i.includes('\ud83d\udd34 PROIBIDO') && i.includes('\u7532\u785d\u5511'))],
    ['Paraben flagged', result.ingredientList.some(i => i.includes('\u26a0\ufe0f RESTRITO') && i.includes('\u5c3c\u6cca\u91d1\u916f'))],
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
