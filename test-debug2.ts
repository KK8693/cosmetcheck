import { loadRegulationRules } from './src/lib/regulation-loader'

async function debug() {
  const rules = await loadRegulationRules('MX')
  const tretinoinRule = rules.find(r => r.ruleId === 'MX-ING-007')
  console.log('MX-ING-007 规则:', JSON.stringify(tretinoinRule, null, 2))
}

debug()