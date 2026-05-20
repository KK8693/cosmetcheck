import { checkCompliance, initRules, type CheckInput } from './src/lib/engine'

async function test() {
  // 先初始化规则（等待异步加载完成）
  await initRules()
  
  const testCases: { 
    name: string; 
    input: CheckInput; 
  }[] = [
    {
      name: '词根归一 - Retinol 匹配 Retinoids 规则',
      input: {
        country: 'MX',
        ingredients: 'Water, Retinol, Glycerin',
        description: 'Anti-aging skincare',
      },
    }
  ]

  console.log('🧪 测试词根归一匹配功能\n')
  console.log('='.repeat(50))

  let passed = 0
  for (const tc of testCases) {
    console.log(`\n📋 ${tc.name}`)
    const result = checkCompliance(tc.input)
    const matched = result.violations.find(v => 
      v.ruleId.includes('BAN-017') || v.ruleId.includes('ING-007')
    )
    
    console.log(`  成分: ${tc.input.ingredients}`)
    console.log(`  Violations: ${result.violations.length}`)
    for (const v of result.violations) {
      console.log(`    - ${v.ruleId}: ${v.matchedText}`)
    }
    
    if (matched) {
      console.log(`  → 匹配成功: ${matched.ruleId} | matchedText: ${matched.matchedText}`)
      console.log(`  → ${matched.message.substring(0, 60)}...`)
      passed++
    } else {
      console.log(`  ❌ 未匹配到预期规则`)
    }
  }

  console.log(`\n${'='.repeat(50)}`)
  console.log(`结果: ${passed}/${testCases.length} 通过`)
  process.exit(passed === testCases.length ? 0 : 1)
}

test()