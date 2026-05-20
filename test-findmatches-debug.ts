import { checkCompliance } from './src/lib/engine'

// 直接测试 checkCompliance 并打印所有命中结果
const text = '医疗级'
const result = checkCompliance({ description: text, country: 'BR' })
const all = [...result.violations, ...result.warnings, ...result.info]

console.log('文本:', text)
console.log('BR 命中数:', all.length)
for (const v of all) {
  console.log('  ruleId:', v.ruleId)
  console.log('  keyword:', v.keyword)
  console.log('  matchedText:', v.matchedText)
  console.log('  severity:', v.severity)
}

// 打印所有 claim 规则的 keyword 和 aliases，看是否有医疗级
console.log('\n=== 检查所有 BR claim 规则的 keyword 和 aliases ===')
// 我们需要直接访问规则，但 checkCompliance 没有导出规则列表
// 让我们用一个更直接的方式

// 检查所有规则，用一个很长的描述来触发所有匹配
const longDesc = '医疗级 7天彻底 根治 永久 100% 孕妇 无副作用 零刺激'
const longResult = checkCompliance({ description: longDesc, country: 'BR' })
const longAll = [...longResult.violations, ...longResult.warnings, ...longResult.info]
console.log(`\n长文本命中: ${longAll.length} 条`)
for (const v of longAll) {
  console.log(`  ${v.ruleId} | keyword:"${v.keyword}" | matchedText:"${v.matchedText}"`)
}
