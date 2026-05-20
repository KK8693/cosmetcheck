import { checkCompliance, initRules } from './src/lib/engine'

async function test() {
  await initRules()
  
  const testCases = [
    {
      name: 'BR claims test',
      input: {
        country: 'BR' as const,
        description: '7天彻底祛斑、永久美白、医疗级焕肤、根治黑色素',
      }
    },
    {
      name: 'MX claims test', 
      input: {
        country: 'MX' as const,
        description: '7天彻底祛斑、永久美白、医疗级焕肤、根治黑色素',
      }
    }
  ]
  
  for (const tc of testCases) {
    console.log(`\n=== ${tc.name} ===`)
    const result = checkCompliance(tc.input)
    console.log('Total violations:', result.violations.length)
    console.log('Critical:', result.summary.criticalCount)
    console.log('Warnings:', result.summary.warningCount)
    console.log('Info:', result.summary.infoCount)
    
    for (const v of result.violations) {
      console.log(`- [${v.severity}] ${v.ruleId} | ${v.category} | matched: "${v.matchedText}" | keyword: ${v.keyword}`)
    }
    
    if (result.violations.length === 0) {
      console.log('NO VIOLATIONS FOUND - claims zero-hit confirmed!')
    }
  }
}

test().catch(console.error)
