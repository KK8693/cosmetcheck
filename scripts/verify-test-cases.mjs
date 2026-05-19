// 测试验证脚本 - 验证用户提出的测试用例
import { checkCompliance } from '../src/lib/engine.ts'

const TEST_CASES = [
  {
    name: "抗衰老误判修复",
    product: { category: "防晒", claims: ["彻底祛斑", "永久美白"] },
    expected: {
      anti_aging_violation: false,   // 不应触发
      whitening_absolute_violation: true
    }
  },
  {
    name: "抗菌误判修复", 
    product: { category: "精华", claims: ["隔离紫外线"] },
    expected: {
      antibacterial_warning: false   // 不应触发
    }
  },
  {
    name: "激素漏判修复",
    product: { ingredients: ["激素提取物", "甘油"] },
    expected: {
      hormone_detected: true,
      severity: "P0"  // critical
    }
  }
]

// 转换为引擎输入格式
function toEngineInput(testCase) {
  /** @type {'BR' | 'MX'} */
  const country = 'BR'
  const input = { country }
  
  if (testCase.product.category) {
    input.description = `产品类别: ${testCase.product.category}`
  }
  
  if (testCase.product.claims) {
    const desc = input.description || ''
    input.description = desc + ' ' + testCase.product.claims.join(' ')
  }
  
  if (testCase.product.ingredients) {
    input.ingredients = testCase.product.ingredients.join(', ')
  }
  
  return input
}

// 运行测试
console.log('=== 验证测试用例 ===\n')

for (const testCase of TEST_CASES) {
  console.log(`测试: ${testCase.name}`)
  console.log(`输入: ${JSON.stringify(testCase.product)}`)
  
  const input = toEngineInput(testCase)
  const result = checkCompliance(input)
  
  console.log('违规项:')
  for (const v of [...result.violations, ...result.warnings, ...result.info]) {
    console.log(`  - [${v.severity}] ${v.ruleId}: ${v.matchedText} => ${v.message}`)
  }
  
  // 检查测试期望
  const violations = [...result.violations, ...result.warnings]
  const hasAntiAging = violations.some(v => 
    v.keyword?.toLowerCase().includes('anti-age') || 
    v.keyword?.toLowerCase().includes('anti-wrinkle') ||
    v.matchedText?.toLowerCase().includes('anti-age') ||
    v.matchedText?.toLowerCase().includes('anti-wrinkle')
  )
  const hasWhitening = violations.some(v => 
    v.keyword?.toLowerCase().includes('whitening') ||
    v.matchedText?.toLowerCase().includes('whitening')
  )
  const hasPermanent = violations.some(v => 
    v.keyword?.toLowerCase().includes('permanent') ||
    v.matchedText?.toLowerCase().includes('永久') ||
    v.matchedText?.toLowerCase().includes('permanent')
  )
  const hasAntibacterial = violations.some(v => 
    v.keyword?.toLowerCase().includes('antibacteri') ||
    v.matchedText?.toLowerCase().includes('antibacteri')
  )
  const hasHormone = violations.some(v => 
    v.keyword?.toLowerCase().includes('corticosteroid') ||
    v.keyword?.toLowerCase().includes('hormone') ||
    v.matchedText?.toLowerCase().includes('激素')
  )
  
  console.log('\n期望检查:')
  console.log(`  anti_aging_violation: ${hasAntiAging} (期望: ${testCase.expected.anti_aging_violation})`)
  console.log(`  whitening_absolute_violation: ${hasWhitening || hasPermanent} (期望: ${testCase.expected.whitening_absolute_violation})`)
  console.log(`  antibacterial_warning: ${hasAntibacterial} (期望: ${testCase.expected.antibacterial_warning})`)
  console.log(`  hormone_detected: ${hasHormone} (期望: ${testCase.expected.hormone_detected})`)
  console.log('\n' + '='.repeat(60) + '\n')
}