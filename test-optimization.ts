// 测试脚本：验证检测输出优化效果
import { checkCompliance, initRules } from './src/lib/engine'

// 测试案例：用户提供的检测文本
const testInput = {
  ingredients: 'Água, Glicerina, Hidroquinona, Extrato de aloe, Essência floral, Conservante com formaldeído.',
  description: 'Sérum Clareador Ultra Rápido Para Manchas Faciais\nNosso sérum clareador age 7 dias eliminando todas as manchas escuras, melasma e sinais de envelhecimento de forma permanente. Com fórmula médica exclusiva, cura completamente o melanina escura e deixa a pele branca para sempre. Ideal para todos os tipos de pele, incluindo bebês e mulheres grávidas, sem nenhum risco de irritação.\nModo de uso: Aplicar no rosto todas as manhãs e noites, resultados garantidos 100%.',
  label: '',
  country: 'BR' as const
}

async function main() {
  console.log('=== 测试输入 ===')
  console.log('成分:', testInput.ingredients)
  console.log('描述:', testInput.description.substring(0, 100) + '...')
  console.log()

  // 先初始化规则（等待异步加载完成）
  console.log('正在加载 JSON 规则库...')
  await initRules()
  console.log('规则加载完成！')
  console.log()

  // 执行检测
  const result = checkCompliance(testInput)

  console.log('=== 检测结果 ===')
  console.log('是否合规:', result.isCompliant ? '是' : '否')
  console.log(`总计问题: ${result.summary.totalIssues} | 严重: ${result.summary.criticalCount} | 警告: ${result.summary.warningCount} | 提示: ${result.summary.infoCount}`)
  console.log()

  // 按 ruleId 去重统计
  const allViolations = [...result.violations, ...result.warnings, ...result.info]
  const uniqueRuleIds = new Set(allViolations.map(v => v.ruleId))
  const uniqueCount = uniqueRuleIds.size

  console.log('=== 优化验证 ===')
  console.log(`原始总问题数: ${result.summary.totalIssues}`)
  console.log(`去重后唯一 ruleId 数: ${uniqueCount}`)
  console.log(`重复率: ${result.summary.totalIssues > 0 ? ((result.summary.totalIssues - uniqueCount) / result.summary.totalIssues * 100).toFixed(1) : 0}%`)
  console.log()

  // 按分类统计
  const byCategory: Record<string, number> = {}
  for (const v of allViolations) {
    byCategory[v.category] = (byCategory[v.category] || 0) + 1
  }
  console.log('=== 分类统计 ===')
  for (const [cat, count] of Object.entries(byCategory)) {
    console.log(`  ${cat}: ${count}`)
  }
  console.log()

  // 显示所有唯一违规（带高亮上下文）
  console.log('=== 去重后的违规列表 ===')
  const seen = new Set<string>()
  for (const v of allViolations) {
    if (!seen.has(v.ruleId)) {
      seen.add(v.ruleId)
      console.log(`[${v.severity.toUpperCase()}] ${v.ruleId}: ${v.message.substring(0, 80)}`)
      console.log(`  📍 来源: ${v.sourceField || 'unknown'} | 匹配: "${v.matchedText}"`)
      if (v.contextSnippet) {
        console.log(`  📝 原文: ${v.contextSnippet}`)
      }
      console.log()
    }
  }
}

main().catch(console.error)