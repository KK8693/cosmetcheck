// 短语优先匹配 测试脚本
// 独立模拟 engine.ts 中 findMatches 的核心逻辑，验证短语优先效果

function generateContextSnippet(text, start, end) {
  const snippetStart = Math.max(0, start - 30)
  const snippetEnd = Math.min(text.length, end + 30)
  let snippet = ''
  if (snippetStart > 0) snippet += '...'
  const middle = text.substring(snippetStart, snippetEnd)
  const relStart = start - snippetStart
  const relEnd = end - snippetStart
  snippet += middle.substring(0, relStart) + '【' + middle.substring(relStart, relEnd) + '】' + middle.substring(relEnd)
  if (snippetEnd < text.length) snippet += '...'
  return snippet
}

function findMatches(text, rules, sourceField = 'description') {
  const violations = []
  const lowerText = text.toLowerCase()
  const seenRuleIds = new Set()

  for (const rule of rules) {
    if (seenRuleIds.has(rule.ruleId)) continue

    const candidates = []
    candidates.push({ text: rule.keyword.toLowerCase(), type: 'keyword' })
    if (rule.aliases) {
      for (const alias of rule.aliases) {
        candidates.push({ text: alias.toLowerCase(), type: 'alias' })
      }
    }
    if (rule.rootFamily) {
      const familyTerms = rule.rootFamily.toLowerCase().split(/[,\uff0c|]/)
      for (const term of familyTerms) {
        const termTrimmed = term.trim()
        if (termTrimmed) {
          candidates.push({ text: termTrimmed, type: 'rootFamily', familyTerm: termTrimmed })
        }
      }
    }
    if (rule.casNumber) {
      candidates.push({ text: rule.casNumber.toLowerCase(), type: 'cas' })
    }

    // 核心：按长度降序，短语优先
    candidates.sort((a, b) => b.text.length - a.text.length)

    for (const candidate of candidates) {
      const index = lowerText.indexOf(candidate.text)
      if (index === -1) continue

      seenRuleIds.add(rule.ruleId)

      if (candidate.type === 'rootFamily') {
        violations.push({
          ...rule,
          matchedText: candidate.familyTerm,
          position: { start: index, end: index + candidate.text.length },
          sourceField,
          contextSnippet: `成分族匹配: 识别到 ${candidate.familyTerm} 属于 ${rule.rootFamily} 成分族`,
        })
      } else {
        violations.push({
          ...rule,
          matchedText: text.substring(index, index + candidate.text.length),
          position: { start: index, end: index + candidate.text.length },
          sourceField,
          contextSnippet: generateContextSnippet(text, index, index + candidate.text.length),
        })
      }
      break
    }
  }

  return violations
}

// ────────── 测试用例 ──────────

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

console.log('\n=== 测试 1：别名短语比主关键词更长，应优先匹配别名 ===')
{
  const rules = [{
    ruleId: 'BR-CLM-002',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'wrinkle',
    severity: 'warning',
    message: 'Wrinkle reduction claims are considered therapeutic and require proof.',
    suggestion: 'Use cosmetic claims only.',
    source: 'ANVISA RDC 529/2021',
    aliases: ['arrug', 'wrinkles', 'anti-wrinkle', 'reduces wrinkles'],
  }]
  const text = 'This product reduces wrinkles instantly'
  const result = findMatches(text, rules, 'description')

  assert(result.length === 1, '应只产生 1 个 violation')
  assert(result[0].matchedText === 'reduces wrinkles', `应匹配更长的短语 "reduces wrinkles"，实际匹配到: "${result[0].matchedText}"`)
  assert(result[0].ruleId === 'BR-CLM-002', 'ruleId 应保持不变')
}

console.log('\n=== 测试 2：主关键词比别名更长，应优先匹配主关键词 ===')
{
  const rules = [{
    ruleId: 'TEST-001',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'salicylic acid',
    severity: 'critical',
    message: 'Test rule.',
    suggestion: 'Remove it.',
    source: 'TEST',
    aliases: ['acid'],  // 别名比主关键词短
  }]
  const text = 'Contains salicylic acid in formula'
  const result = findMatches(text, rules, 'ingredients')

  assert(result.length === 1, '应只产生 1 个 violation')
  assert(result[0].matchedText === 'salicylic acid', `应匹配更长的主关键词 "salicylic acid"，实际匹配到: "${result[0].matchedText}"`)
}

console.log('\n=== 测试 3：文本只包含短词，不含长短语，应回退匹配短词 ===')
{
  const rules = [{
    ruleId: 'TEST-002',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'wrinkle',
    severity: 'warning',
    message: 'Test.',
    suggestion: 'Fix.',
    source: 'TEST',
    aliases: ['reduces wrinkles'],
  }]
  const text = 'This product helps with wrinkle care'
  const result = findMatches(text, rules, 'description')

  assert(result.length === 1, '应只产生 1 个 violation')
  assert(result[0].matchedText === 'wrinkle', `应回退匹配短词 "wrinkle"，实际匹配到: "${result[0].matchedText}"`)
}

console.log('\n=== 测试 4：词根族与关键词的长度比较 ===')
{
  const rules = [{
    ruleId: 'TEST-003',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'retinol',
    severity: 'critical',
    message: 'Test.',
    suggestion: 'Fix.',
    source: 'TEST',
    rootFamily: 'tretinoin, isotretinoin, adapalene',
  }]
  const text = 'Formula contains isotretinoin and retinol'
  const result = findMatches(text, rules, 'ingredients')

  assert(result.length === 1, '应只产生 1 个 violation')
  // isotretinoin 长度 13 > retinol 长度 7，应优先匹配词根族
  assert(result[0].matchedText === 'isotretinoin', `应优先匹配更长的词根族 "isotretinoin"，实际匹配到: "${result[0].matchedText}"`)
}

console.log('\n=== 测试 5：多个规则独立匹配 ===')
{
  const rules = [
    {
      ruleId: 'TEST-004a',
      category: 'claim',
      ruleType: 'prohibited',
      keyword: 'whitening',
      severity: 'warning',
      message: 'M1',
      suggestion: 'S1',
      source: 'TEST',
      aliases: ['skin whitening'],
    },
    {
      ruleId: 'TEST-004b',
      category: 'claim',
      ruleType: 'prohibited',
      keyword: 'wrinkle',
      severity: 'warning',
      message: 'M2',
      suggestion: 'S2',
      source: 'TEST',
      aliases: ['reduces wrinkles'],
    },
  ]
  const text = 'Our skin whitening cream reduces wrinkles fast'
  const result = findMatches(text, rules, 'description')

  assert(result.length === 2, '应产生 2 个 violations')
  const matchedTexts = result.map(r => r.matchedText).sort()
  assert(matchedTexts[0] === 'reduces wrinkles', `应匹配 "reduces wrinkles"，实际: ${JSON.stringify(matchedTexts)}`)
  assert(matchedTexts[1] === 'skin whitening', `应匹配 "skin whitening"，实际: ${JSON.stringify(matchedTexts)}`)
}

console.log('\n=== 测试 6：CAS 号也参与长度比较 ===')
{
  const rules = [{
    ruleId: 'TEST-005',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'acid',
    severity: 'critical',
    message: 'Test.',
    suggestion: 'Fix.',
    source: 'TEST',
    casNumber: '123-45-6',
  }]
  const text = 'Contains 123-45-6 acid compound'
  const result = findMatches(text, rules, 'ingredients')

  assert(result.length === 1, '应只产生 1 个 violation')
  // '123-45-6' 长度 7 == 'acid' 长度 4，所以 CAS 号更长，应优先匹配
  assert(result[0].matchedText === '123-45-6', `应优先匹配更长的 CAS 号 "123-45-6"，实际匹配到: "${result[0].matchedText}"`)
}

console.log('\n=== 测试 7：大小写不敏感且保留原文大小写 ===')
{
  const rules = [{
    ruleId: 'TEST-006',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'Wrinkle',
    severity: 'warning',
    message: 'Test.',
    suggestion: 'Fix.',
    source: 'TEST',
    aliases: ['Reduces Wrinkles'],
  }]
  const text = 'Product REDUCES WRINKLES fast'
  const result = findMatches(text, rules, 'description')

  assert(result.length === 1, '应只产生 1 个 violation')
  assert(result[0].matchedText === 'REDUCES WRINKLES', `应保留原文大小写 "REDUCES WRINKLES"，实际匹配到: "${result[0].matchedText}"`)
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
