import { checkCompliance, type CheckInput } from './src/lib/engine'

const testCases: { name: string; input: CheckInput; expectedWarnings: number }[] = [
  {
    name: '多个标签缺失 - 应聚合为1条',
    input: {
      country: 'BR',
      ingredients: 'Water, Glycerin, Niacinamide',
      description: 'Anti-aging serum',
      label: 'Produto: Serum Hidratante'
    },
    expectedWarnings: 1
  },
  {
    name: '无标签缺失 - 应无聚合 warning',
    input: {
      country: 'BR',
      ingredients: 'Water, Glycerin',
      description: ' moisturizer',
      label: 'Produto: Hidratante |Fabricante: ABC |CNPJ: 12.345.678/0001-90 |Lote: 001 |Val: 2025-12-01 |Origem: Brasil'
    },
    expectedWarnings: 0
  }
]

console.log('🧪 测试标签聚合功能\n')
console.log('='.repeat(50))

let passed = 0
for (const tc of testCases) {
  console.log(`\n📋 ${tc.name}`)
  const result = checkCompliance(tc.input)
  console.log(`  Warnings: ${result.warnings.length} (expected: ${tc.expectedWarnings})`)
  if (result.warnings.length > 0) {
    console.log(`  → ${result.warnings[0].message.substring(0, 100)}...`)
  }
  console.log(`  → Violations: ${result.violations.length}`)
  
  if (result.warnings.length === tc.expectedWarnings) {
    console.log('  ✅ PASS')
    passed++
  } else {
    console.log('  ❌ FAIL')
  }
}

console.log(`\n${'='.repeat(50)}`)
console.log(`结果: ${passed}/${testCases.length} 通过`)
process.exit(passed === testCases.length ? 0 : 1)