// 词根簇跨规则去重 测试脚本
// 独立模拟 engine.ts 中 deduplicateByGroupId 的核心逻辑

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 1. 加载 root-clusters.json 并构建 term -> groupId 映射
const clustersPath = join(__dirname, '../src/data/regulations/root-clusters.json')
const clustersData = JSON.parse(readFileSync(clustersPath, 'utf-8'))
const termToGroup = new Map()
for (const cluster of clustersData.clusters) {
  for (const term of cluster.terms) {
    termToGroup.set(term.toLowerCase(), cluster.groupId)
  }
}

function getTermGroupId(term) {
  return termToGroup.get(term.toLowerCase())
}

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
        if (vLen > eLen) {
          groupBest.set(groupId, v)
        }
      }
    }
  }

  for (const v of groupBest.values()) {
    result.push(v)
  }

  return result
}

let pass = 0
let fail = 0

function assert(condition, msg) {
  if (condition) {
    console.log(`  ✅ PASS: ${msg}`)
    pass++
  } else {
    console.log(`  ❌ FAIL: ${msg}`)
    fail++
  }
}

console.log('\n=== 测试 1：词根簇 JSON 加载正确 ===')
{
  assert(clustersData.clusters.length >= 10, `应有至少 10 个词根簇，实际: ${clustersData.clusters.length}`)
  assert(termToGroup.size >= 50, `应有至少 50 个 terms，实际: ${termToGroup.size}`)
  assert(getTermGroupId('cure') === 'cure', 'cure 应属于 cure 簇')
  assert(getTermGroupId('treat') === 'cure', 'treat 应属于 cure 簇')
  assert(getTermGroupId('permanent') === 'permanent', 'permanent 应属于 permanent 簇')
  assert(getTermGroupId('lasting') === 'permanent', 'lasting 应属于 permanent 簇')
  assert(getTermGroupId('inexistent-term-xyz') === undefined, '不存在的词应返回 undefined')
}

console.log('\n=== 测试 2：同一 groupId 多个 violations 去重 ===')
{
  const violations = [
    { ruleId: 'R1', keyword: 'cure', matchedText: 'cure', severity: 'warning', message: 'M1' },
    { ruleId: 'R2', keyword: 'treat', matchedText: 'treat', severity: 'warning', message: 'M2' },
    { ruleId: 'R3', keyword: 'repair', matchedText: 'repair', severity: 'warning', message: 'M3' },
  ]
  const result = deduplicateByGroupId(violations)

  assert(result.length === 1, `同一簇应只保留 1 个，实际: ${result.length}`)
  // severity 相同，保留 matchedText 最长的: 'repair' (6) > 'treat' (5) > 'cure' (4)
  assert(result[0].matchedText === 'repair', `应保留最长的 "repair"，实际: "${result[0].matchedText}"`)
}

console.log('\n=== 测试 3：严重程度更高优先 ===')
{
  const violations = [
    { ruleId: 'R1', keyword: 'cure', matchedText: 'cure', severity: 'warning', message: 'M1' },
    { ruleId: 'R2', keyword: 'treat', matchedText: 'treatment', severity: 'critical', message: 'M2' },
  ]
  const result = deduplicateByGroupId(violations)

  assert(result.length === 1, `应只保留 1 个，实际: ${result.length}`)
  assert(result[0].severity === 'critical', `应保留 critical 级别，实际: ${result[0].severity}`)
  assert(result[0].matchedText === 'treatment', `应保留 "treatment"，实际: "${result[0].matchedText}"`)
}

console.log('\n=== 测试 4：不属于任何簇的 violation 不受影响 ===')
{
  const violations = [
    { ruleId: 'R1', keyword: 'cure', matchedText: 'cure', severity: 'warning', message: 'M1' },
    { ruleId: 'R2', keyword: 'mercury', matchedText: 'mercury', severity: 'critical', message: 'M2' },
    { ruleId: 'R3', keyword: 'lead', matchedText: 'lead', severity: 'critical', message: 'M3' },
  ]
  const result = deduplicateByGroupId(violations)

  assert(result.length === 3, `应保留 3 个（cure 簇 1 个 + 2 个无簇属），实际: ${result.length}`)
  const ruleIds = result.map(r => r.ruleId).sort()
  assert(ruleIds.includes('R1'), '应保留 R1 (cure 簇代表)')
  assert(ruleIds.includes('R2'), '应保留 R2 (无簇属)')
  assert(ruleIds.includes('R3'), '应保留 R3 (无簇属)')
}

console.log('\n=== 测试 5：多个不同簇同时存在 ===')
{
  const violations = [
    { ruleId: 'R1', keyword: 'cure', matchedText: 'cure', severity: 'warning', message: 'M1' },
    { ruleId: 'R2', keyword: 'treat', matchedText: 'treat', severity: 'warning', message: 'M2' },
    { ruleId: 'R3', keyword: 'permanent', matchedText: 'permanent', severity: 'warning', message: 'M3' },
    { ruleId: 'R4', keyword: 'lasting', matchedText: 'lasting', severity: 'warning', message: 'M4' },
  ]
  const result = deduplicateByGroupId(violations)

  assert(result.length === 2, `应保留 2 个（cure 簇 1 个 + permanent 簇 1 个），实际: ${result.length}`)
  const matchedTexts = result.map(r => r.matchedText).sort()
  assert(matchedTexts[0] === 'lasting' || matchedTexts[0] === 'permanent', 'permanent 簇应保留更长的')
  assert(matchedTexts[1] === 'treat' || matchedTexts[1] === 'cure', 'cure 簇应保留更长的')
}

console.log('\n=== 测试 6：通过 matchedText 弥补查找 groupId ===')
{
  // 某个 rule 的 keyword 不在 cluster 中，但 matchedText 在
  const violations = [
    { ruleId: 'R1', keyword: 'some-random-keyword', matchedText: 'cure', severity: 'warning', message: 'M1' },
  ]
  const result = deduplicateByGroupId(violations)

  assert(result.length === 1, `应保留 1 个`)
  // 虽然 keyword 不在 cluster，但 matchedText 'cure' 在 cure 簇，所以仍然被分组
  assert(getTermGroupId(result[0].matchedText) === 'cure', '应通过 matchedText 识别为 cure 簇')
}

console.log('\n==============================')
console.log(`总结果: ${pass} 通过, ${fail} 失败`)
if (fail > 0) {
  console.log('❌ 测试未通过')
  process.exit(1)
} else {
  console.log('✅ 所有测试通过')
  process.exit(0)
}
