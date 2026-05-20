import { checkCompliance, type CheckInput, type Violation } from './src/lib/engine'

const input: CheckInput = {
  country: 'MX',
  ingredients: 'Water, Retinol, Glycerin',
  description: 'Anti-aging skincare',
}

const result = checkCompliance(input)
console.log('成分:', input.ingredients)
console.log('\n所有 Violations:')
for (const v of result.violations) {
  console.log(`  ${v.ruleId}: ${v.matchedText} | ${v.message.substring(0, 50)}...`)
}