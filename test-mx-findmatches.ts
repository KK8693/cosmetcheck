import { loadRegulationRules } from './src/lib/regulation-loader'

function isWordBoundary(text: string, matchStart: number, matchEnd: number): boolean {
  const isWordChar = (c: string) => /[a-zA-Z0-9_]/.test(c)
  const before = matchStart > 0 ? text[matchStart - 1] : ''
  const after = matchEnd < text.length ? text[matchEnd] : ''
  const beforeOk = matchStart === 0 || !isWordChar(before)
  const afterOk = matchEnd >= text.length || !isWordChar(after)
  return beforeOk && afterOk
}

function findWordBoundaryMatch(text: string, candidate: string): { index: number; length: number } | null {
  let searchFrom = 0
  while (true) {
    const index = text.indexOf(candidate, searchFrom)
    if (index === -1) return null
    if (isWordBoundary(text, index, index + candidate.length)) {
      return { index, length: candidate.length }
    }
    searchFrom = index + 1
  }
}

function testFindMatches(text: string, rules: any[]) {
  const violations: any[] = []
  const lowerText = text.toLowerCase()
  const seenRuleIds = new Set<string>()

  for (const rule of rules) {
    if (seenRuleIds.has(rule.ruleId)) continue

    type Candidate = { text: string; type: string }
    const candidates: Candidate[] = []

    if (rule.keyword) {
      candidates.push({ text: rule.keyword.toLowerCase(), type: 'keyword' })
    }

    if (rule.aliases) {
      for (const alias of rule.aliases) {
        candidates.push({ text: alias.toLowerCase(), type: 'alias' })
      }
    }

    candidates.sort((a, b) => b.text.length - a.text.length)

    for (const candidate of candidates) {
      const match = findWordBoundaryMatch(lowerText, candidate.text)
      if (match) {
        seenRuleIds.add(rule.ruleId)
        violations.push({ ruleId: rule.ruleId, matched: candidate.text, original: text.substring(match.index, match.index + match.length) })
        break
      }
    }
  }

  return violations
}

async function main() {
  const rules = await loadRegulationRules('MX')
  const claimRules = rules.filter((r: any) => r.category === 'claim')

  const text = '7\u5929\u5f7b\u5e95\u795b\u6591\u3001\u6c38\u4e45\u7f8e\u767d\u3001\u533b\u7597\u7ea7\u7115\u80a4\u3001\u6839\u6cbb\u9ed1\u8272\u7d20\u3001\u9694\u79bb\u7d2b\u5916\u7ebf'

  console.log(`Testing ${claimRules.length} claim rules...`)
  const result = testFindMatches(text, claimRules)

  console.log(`\nMatched ${result.length} violations:`)
  for (const v of result) {
    console.log(`  ${v.ruleId} | matched: "${v.matched}" | original: "${v.original}"`)
  }
}

main().catch(console.error)
