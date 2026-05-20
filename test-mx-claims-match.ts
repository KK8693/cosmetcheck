import { loadRegulationRules } from './src/lib/regulation-loader'

async function main() {
  const rules = await loadRegulationRules('MX')
  const claimRules = rules.filter((r: any) => r.category === 'claim')
  
  const text = '7天彻底祛斑、永久美白、医疗级焕肤、根治黑色素、隔离紫外线'.toLowerCase()
  
  console.log(`Testing ${claimRules.length} claim rules against: "${text}"`)
  console.log()
  
  let matchCount = 0
  for (const rule of claimRules) {
    const candidates = [rule.keyword || '', ...(rule.aliases || [])].filter(Boolean)
    for (const c of candidates) {
      if (text.includes(c.toLowerCase())) {
        console.log(`MATCH: ${rule.ruleId} | keyword: "${rule.keyword}" | matched: "${c}"`)
        matchCount++
        break
      }
    }
  }
  
  console.log(`\nTotal matches: ${matchCount}`)
}

main().catch(console.error)
