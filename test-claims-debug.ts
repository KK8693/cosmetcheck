import { checkCompliance } from './src/lib/engine'

// 测试 BR claims 命中 - 逐个关键词
const tests = [
  '医疗级',
  '医疗级焕肤',
  '7天',
  '7天内',
  '彻底',
  '根治',
  '永久',
  '100%',
  '100%美白',
  '孕妇',
  '无任何副作用',
  '零肌肤刺激',
]

for (const text of tests) {
  const result = checkCompliance({ description: text, country: 'BR' })
  const all = [...result.violations, ...result.warnings, ...result.info]
  if (all.length === 0) {
    console.log(`❌ "${text}" -> 未命中`)
  } else {
    for (const v of all) {
      console.log(`✅ "${text}" -> ${v.ruleId} | matchedText:"${v.matchedText}" | ${v.severity}`)
    }
  }
}

// 检查是否有硬编码规则覆盖 JSON 规则
console.log('\n=== 检查 BR-CLAIM-010/015 是否被硬编码规则覆盖 ===')
const result = checkCompliance({ description: '医疗级', country: 'BR' })
const all = [...result.violations, ...result.warnings, ...result.info]
console.log('命中规则:', all.map(v => v.ruleId).join(', ') || '无')

// 测试完整产品名称
console.log('\n=== 产品名称命中 ===')
const nameResult = checkCompliance({ productName: '速效医疗级美白祛斑防晒精华', country: 'BR' })
const nameAll = [...nameResult.violations, ...nameResult.warnings, ...nameResult.info]
for (const v of nameAll) {
  console.log(`${v.ruleId} | matchedText:"${v.matchedText}" | ${v.severity}`)
}
if (nameAll.length === 0) console.log('无命中')
