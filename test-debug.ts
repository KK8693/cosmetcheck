import { checkCompliance } from './src/lib/engine'

// 单独测试 ingredients 匹配
const ingredients = '去离子水、丙二醇、氢醌、植物激素提取物、泛醇、透明质酸钠、天然植物精油、苯氧乙醇'

console.log('=== 单独测试成分匹配 ===')
console.log('成分表:', ingredients)
console.log('')

for (const country of ['BR', 'MX'] as const) {
  const result = checkCompliance({ ingredients, country })
  const all = [...result.violations, ...result.warnings, ...result.info]
  console.log(`${country}: 命中 ${all.length} 条`)
  for (const v of all) {
    console.log(`  ${v.ruleId} | keyword:"${v.keyword}" | matchedText:"${v.matchedText}" | ${v.severity}`)
  }
  console.log('')
}

// 测试各个 claim 关键词单独命中
const claimTests = [
  '医疗级',
  '7天彻底祛斑',
  '永久美白',
  '根治黑色素',
  '100%美白',
  '孕妇可用',
  '无任何副作用',
]

console.log('=== 单词 claim 命中测试 ===')
for (const text of claimTests) {
  console.log(`\n文本: "${text}"`)
  for (const country of ['BR', 'MX'] as const) {
    const result = checkCompliance({ description: text, country })
    const all = [...result.violations, ...result.warnings, ...result.info]
    if (all.length === 0) {
      console.log(`  ${country}: ❌ 未命中`)
    } else {
      for (const v of all) {
        console.log(`  ${country}: ${v.ruleId} | matchedText:"${v.matchedText}" | ${v.severity}`)
      }
    }
  }
}
