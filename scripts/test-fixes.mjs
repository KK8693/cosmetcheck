// 验证 3 个修复点的测试脚本（独立模拟）
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 加载 root-clusters.json
const clustersPath = join(__dirname, '../src/data/regulations/root-clusters.json')
const clustersData = JSON.parse(readFileSync(clustersPath, 'utf-8'))

// 1. 模拟同步构建的 termToGroupMap（如 engine.ts 中所做）
const termToGroupMap = new Map()
for (const cluster of clustersData.clusters) {
  for (const term of cluster.terms) {
    termToGroupMap.set(term.toLowerCase(), cluster.groupId)
  }
}

function getTermGroupId(term) {
  return termToGroupMap.get(term.toLowerCase())
}

// 2. 模拟全局 ruleId 去重
function deduplicateByRuleId(violations) {
  const uniqueByRuleId = new Map()
  for (const v of violations) {
    const existing = uniqueByRuleId.get(v.ruleId)
    if (!existing) {
      uniqueByRuleId.set(v.ruleId, v)
    } else if ((v.matchedText?.length || 0) > (existing.matchedText?.length || 0)) {
      uniqueByRuleId.set(v.ruleId, v)
    }
  }
  return Array.from(uniqueByRuleId.values())
}

// 3. 模拟词根簇跨规则去重
function deduplicateByGroupId(violations) {
  const severityOrder = { critical: 3, warning: 2, info: 1 }
  const groupBest = new Map()
  const result = []

  for (const v of violations) {
    let groupId = getTermGroupId(v.keyword)
    if (!groupId && v.matchedText) {
      groupId = getTermGroupId(v.matchedText)
    }

    if (!groupId) {
      result.push(v)
      continue
    }

    const existing = groupBest.get(groupId)
    if (!existing) {
      groupBest.set(groupId, v)
    } else {
      const vScore = severityOrder[v.severity] || 0
      const eScore = severityOrder[existing.severity] || 0
      if (vScore > eScore) {
        groupBest.set(groupId, v)
      } else if (vScore === eScore) {
        const vLen = v.matchedText?.length || 0
        const eLen = existing.matchedText?.length || 0
        if (vLen > eLen) groupBest.set(groupId, v)
      }
    }
  }

  for (const v of groupBest.values()) result.push(v)
  return result
}

// 4. 模拟时效文案动态化
function dynamicTimeMessage(v) {
  if (v.ruleId.includes('CLAIM-014')) {
    const timeMatch = v.matchedText?.match(/(\d+)\s*(dias?|days?|\u5929|semanas?|weeks?|\u5468)/i)
    if (timeMatch) {
      const timeStr = timeMatch[0]
      v.message = v.message
        .replace(/X天\/周/, timeStr)
        .replace(/（如'\d+天'）/, `(如'${timeStr}')`)
    }
  }
  return v
}

let pass = 0
let fail = 0
function assert(cond, msg) {
  if (cond) { console.log(`  ✅ PASS: ${msg}`); pass++ }
  else { console.log(`  ❌ FAIL: ${msg}`); fail++ }
}

console.log('\n=== 测试 1：全局 ruleId 去重 ===')
{
  // 模拟同一规则在 description 和 combinedText 中被匹配两次
  const violations = [
    { ruleId: 'BR-CLAIM-013', keyword: 'permanente', matchedText: 'permanente', severity: 'critical', message: 'M1' },
    { ruleId: 'BR-CLAIM-013', keyword: 'permanente', matchedText: 'permanente', severity: 'critical', message: 'M1' },
    { ruleId: 'BR-CLAIM-014', keyword: '3 dias', matchedText: '3 dias', severity: 'critical', message: 'M2' },
  ]
  const result = deduplicateByRuleId(violations)
  assert(result.length === 2, `应去重为 2 条（BR-CLAIM-013 去重后 1 条 + BR-CLAIM-014 1 条），实际: ${result.length}`)

  const ruleIds = result.map(r => r.ruleId).sort()
  assert(ruleIds[0] === 'BR-CLAIM-013', '应保留 BR-CLAIM-013')
  assert(ruleIds[1] === 'BR-CLAIM-014', '应保留 BR-CLAIM-014')
}

console.log('\n=== 测试 2：词根簇归一效果 ===')
{
  // 模拟三个不同规则匹配了永久相关的词
  const violations = [
    { ruleId: 'BR-CLM-008', keyword: 'permanent', matchedText: 'permanente', severity: 'warning', message: 'M1' },
    { ruleId: 'BR-CLAIM-013', keyword: 'definitiva', matchedText: 'definitiva', severity: 'critical', message: 'M2' },
    { ruleId: 'BR-X-999', keyword: 'eterno', matchedText: 'eterno', severity: 'warning', message: 'M3' },
    { ruleId: 'BR-ING-001', keyword: 'mercury', matchedText: 'mercury', severity: 'critical', message: 'M4' },
  ]
  const result = deduplicateByGroupId(violations)

  // permanent 簇（permanent/definitiva/eterno）应只保留 1 条（severity 最高的 definitiva 为 critical）
  // mercury 不属于任何簇，应保留
  assert(result.length === 2, `应保留 2 条（1 个 permanent 簇 + 1 个无簇属），实际: ${result.length}`)

  const permanentResult = result.find(r => getTermGroupId(r.keyword) === 'permanent')
  assert(permanentResult !== undefined, '应保留一条 permanent 簇的规则')
  assert(permanentResult.severity === 'critical', `应保留 severity 最高的（critical），实际: ${permanentResult.severity}`)
  assert(permanentResult.matchedText === 'definitiva', `应保留 "definitiva"，实际: ${permanentResult.matchedText}`)
}

console.log('\n=== 测试 3：时效文案动态化 ===')
{
  const v1 = {
    ruleId: 'BR-CLAIM-014',
    keyword: '3 dias',
    matchedText: '3 dias',
    severity: 'critical',
    message: "禁止承诺固定天数见效（如'3天'/'7天'/X天/周等）和绝对效果保证"
  }
  dynamicTimeMessage(v1)
  console.log(`  动态化后 message: ${v1.message}`)
  assert(!v1.message.includes('X天/周'), `应替换掉 X天/周 占位符`)
  assert(v1.message.includes('3 dias'), `应包含实际匹配到的 '3 dias'`)

  const v2 = {
    ruleId: 'BR-CLAIM-014',
    keyword: '7 dias',
    matchedText: '7 dias',
    severity: 'critical',
    message: "禁止承诺固定天数见效（如'3天'/'7天'/X天/周等）和绝对效果保证"
  }
  dynamicTimeMessage(v2)
  console.log(`  动态化后 message: ${v2.message}`)
  assert(v2.message.includes('7 dias'), `应包含实际匹配到的 '7 dias'`)
}

console.log('\n=== 测试 4：综合场景 ===')
{
  // 模拟用户案例中的典型重复情况
  const violations = [
    // 永久宣称重复（同一 ruleId 在多字段匹配）
    { ruleId: 'BR-CLAIM-013', keyword: 'definitiva', matchedText: 'definitiva', severity: 'critical', message: 'M1' },
    { ruleId: 'BR-CLAIM-013', keyword: 'definitiva', matchedText: 'definitiva', severity: 'critical', message: 'M1' },
    // 时效承诺
    { ruleId: 'BR-CLAIM-014', keyword: '3 dias', matchedText: '3 dias', severity: 'critical', message: 'M2' },
    { ruleId: 'BR-CLAIM-014', keyword: '3 dias', matchedText: '3 dias', severity: 'critical', message: 'M2' },
    // 临床医疗
    { ruleId: 'BR-CLAIM-015', keyword: 'clínica', matchedText: 'clínica', severity: 'critical', message: 'M3' },
    { ruleId: 'BR-CLAIM-015', keyword: 'clínica', matchedText: 'clínica', severity: 'critical', message: 'M3' },
    // 特殊人群
    { ruleId: 'BR-CLAIM-016', keyword: 'lactantes', matchedText: 'lactantes', severity: 'critical', message: 'M4' },
    { ruleId: 'BR-CLAIM-016', keyword: 'lactantes', matchedText: 'lactantes', severity: 'critical', message: 'M4' },
    // 抗皱绝对化
    { ruleId: 'BR-CLAIM-022', keyword: 'rejuvenescedor', matchedText: 'rejuvenescedor', severity: 'critical', message: 'M5' },
    { ruleId: 'BR-CLAIM-022', keyword: 'rejuvenescedor', matchedText: 'rejuvenescedor', severity: 'critical', message: 'M5' },
    // 成分（不在词根簇中）
    { ruleId: 'BR-ING-009', keyword: 'arsenic', matchedText: 'Ácido Arsênico', severity: 'critical', message: 'M6' },
    { ruleId: 'BR-ING-005', keyword: 'formaldehyde', matchedText: 'formaldeído', severity: 'critical', message: 'M7' },
  ]

  const step1 = deduplicateByRuleId(violations)
  console.log(`  步骤1 (ruleId 去重): ${step1.length} 条`)

  const step2 = deduplicateByGroupId(step1)
  console.log(`  步骤2 (词根簇归一): ${step2.length} 条`)

  assert(step2.length <= 8, `综合去重后应在 8 条以内，实际: ${step2.length}`)

  // 验证每个 ruleId 只出现一次
  const ruleIds = step2.map(r => r.ruleId)
  const uniqueRuleIds = [...new Set(ruleIds)]
  assert(ruleIds.length === uniqueRuleIds.length, `不应有重复 ruleId`)
}

console.log('\n==============================')
console.log(`总结果: ${pass} 通过, ${fail} 失败`)
if (fail > 0) {
  console.log('❌ 测试未通过')
  process.exit(1)
} else {
  console.log('✅ 所有测试通过')
}
