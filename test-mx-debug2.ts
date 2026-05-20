import { loadRegulationRules } from './src/lib/regulation-loader'

async function main() {
  const rules = await loadRegulationRules('MX')
  console.log(`Total loaded rules: ${rules.length}`)

  const claimRules = rules.filter((r: any) => r.category === 'claim')
  console.log(`Claim rules: ${claimRules.length}`)

  for (const r of claimRules) {
    console.log(`  ${r.ruleId} | cat: ${r.category} | kw: ${r.keyword} | aliases: ${(r.aliases || []).slice(0, 3).join(', ')}`)
  }

  // Test matching manually
  const text = '7天彻底祛斑、永久美白、医疗级焕肤、根治黑色素、隔离紫外线'.toLowerCase()
  console.log(`\nTesting against text: "${text}"`)

  for (const r of claimRules.slice(0, 3)) {
    const candidates = [r.keyword || '', ...(r.aliases || [])].filter(Boolean)
    for (const c of candidates) {
      if (text.includes(c.toLowerCase())) {
        console.log(`  MATCH: ${r.ruleId} | candidate: "${c}"`)
        break
      }
    }
  }
}

main().catch(console.error)
