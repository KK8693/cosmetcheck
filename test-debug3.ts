import { loadRegulationRules } from './src/lib/regulation-loader'

async function debug() {
  const rules = await loadRegulationRules('MX')
  const retinoidRules = rules.filter(r => 
    r.keyword.toLowerCase().includes('retinoid') || 
    r.keyword.toLowerCase().includes('retinol') ||
    r.aliases?.some(a => a.toLowerCase().includes('retin'))
  )
  console.log('Retinoid 相关规则:')
  for (const r of retinoidRules) {
    console.log(`  ${r.ruleId}: ${r.keyword}`)
    console.log(`    aliases: ${r.aliases?.join(', ')}`)
    console.log(`    rootFamily: ${(r as any).rootFamily}`)
  }
}

debug()