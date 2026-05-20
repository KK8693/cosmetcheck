import { checkCompliance } from './src/lib/engine'

const productName = '速效医疗级美白祛斑防晒精华'
const description = '这款医疗级焕肤精华可在7天内彻底祛除面部色斑、黄褐斑，根治底层黑色素沉淀，实现永久白皙透亮的肌肤状态。配方温和安全，孕妇、敏感肌均可放心使用，使用后100%达到嫩肤美白效果，长期使用无任何副作用、零肌肤刺激，可有效隔离紫外线，长效锁住肌肤白皙状态。'
const ingredients = '去离子水、丙二醇、氢醌、植物激素提取物、泛醇、透明质酸钠、天然植物精油、苯氧乙醇'

console.log('=== 测试产品 ===')
console.log('名称:', productName)
console.log('描述:', description)
console.log('成分:', ingredients)
console.log('')

for (const country of ['BR', 'MX'] as const) {
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`  目标市场: ${country}`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

  const result = checkCompliance({
    productName,
    description,
    ingredients,
    country,
  })

  console.log('合规状态:', result.isCompliant ? '✅ 合规' : '❌ 不合规')
  console.log('')

  const allIssues = [...result.violations, ...result.warnings, ...result.info]
  console.log(`总问题数: ${allIssues.length} (Critical: ${result.summary.criticalCount}, Warning: ${result.summary.warningCount}, Info: ${result.summary.infoCount})`)
  console.log('')

  if (allIssues.length === 0) {
    console.log('⚠️ 未检测到任何违规！')
  } else {
    for (const v of allIssues) {
      const severityIcon = v.severity === 'critical' ? '🔴' : v.severity === 'warning' ? '🟡' : '🔵'
      const confidenceIcon = v.confidence === 'high' ? '●' : v.confidence === 'medium' ? '◐' : v.confidence === 'low' ? '○' : '?'
      console.log(`${severityIcon} [${v.ruleId}] ${v.category.toUpperCase()} | confidence:${confidenceIcon} | severity:${v.severity}`)
      console.log(`   keyword: "${v.keyword}"`)
      console.log(`   matchedText: "${v.matchedText}"`)
      console.log(`   message: ${v.message}`)
      console.log(`   suggestion: ${v.suggestion}`)
      console.log(`   sourceField: ${v.sourceField || 'N/A'}${v.allSourceFields ? ` | allFields:[${v.allSourceFields.join(',')}]` : ''}`)
      console.log('')
    }
  }

  console.log('')
}
