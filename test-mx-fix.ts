import { checkCompliance, initRules } from './src/lib/engine'
import { translateCheckResult } from './src/lib/regulation-messages'

async function main() {
  // Ensure JSON rules are loaded before testing
  await initRules()

  const input = {
    country: 'MX' as const,
    productName: '速效美白祛斑防晒精华',
    description: '7天彻底祛斑、永久美白、医疗级焕肤、根治黑色素、隔离紫外线',
    ingredients: '水，甘油，氢醌 Hydroquinone，熊果苷，激素提取物，香精，防腐剂',
    label: '',
  }

  const result = checkCompliance(input)
  const translated = translateCheckResult(result.violations, 'zh')

  console.log('=== Raw Violations ===')
  for (const v of result.violations) {
    console.log(`[${v.severity}] ${v.ruleId} | matched: "${v.matchedText}"`)
    console.log(`  message: ${v.message}`)
    console.log(`  suggestion: ${v.suggestion}`)
    console.log()
  }

  console.log('\n=== Translated Output ===')
  for (const v of translated) {
    console.log(`[${v.severity}] ${v.ruleId} | matched: "${v.matchedText}"`)
    console.log(`  message: ${v.message}`)
    console.log(`  suggestion: ${v.suggestion}`)
    console.log()
  }

  // Validation checks
  const messages = result.violations.map(v => v.message.toLowerCase())
  const ruleIds = result.violations.map(v => v.ruleId)

  console.log('\n=== Validation ===')

  // Check 1: No false positives
  const hasChromium = messages.some(m => m.includes('chromium') || m.includes('六价铬'))
  const hasAnimalTest = messages.some(m => m.includes('animal') || m.includes('动物测试'))
  const hasOrganic = messages.some(m => m.includes('organic') || m.includes('有机认证'))

  console.log(`❌ False positive - Chromium VI: ${hasChromium ? 'FAIL' : 'PASS'}`)
  console.log(`❌ False positive - Animal testing: ${hasAnimalTest ? 'FAIL' : 'PASS'}`)
  console.log(`❌ False positive - Organic cert: ${hasOrganic ? 'FAIL' : 'PASS'}`)

  // Check 2: Must detect real violations
  const hasHydroquinone = ruleIds.some(id => id.includes('MX-ING-003') || id.includes('MX-BAN-006'))
  const hasHormone = ruleIds.some(id => id.includes('MX-ING-004') || id.includes('MX-BAN-013'))
  const has7Days = ruleIds.includes('MX-CLAIM-014')
  const hasMedical = ruleIds.includes('MX-CLAIM-015')
  const hasCure = ruleIds.includes('MX-CLAIM-010')
  const hasPermanent = ruleIds.includes('MX-CLAIM-013')

  console.log(`✅ Hydroquinone detected: ${hasHydroquinone ? 'PASS' : 'FAIL'}`)
  console.log(`✅ Hormone extract detected: ${hasHormone ? 'PASS' : 'FAIL'}`)
  console.log(`✅ 7-day claim detected: ${has7Days ? 'PASS' : 'FAIL'}`)
  console.log(`✅ Medical grade detected: ${hasMedical ? 'PASS' : 'FAIL'}`)
  console.log(`✅ Cure/根治 detected: ${hasCure ? 'PASS' : 'FAIL'}`)
  console.log(`✅ Permanent/彻底 detected: ${hasPermanent ? 'PASS' : 'FAIL'}`)

  // Check 3: All messages primarily in Chinese (allow English terms in parentheses)
  const hasEnglish = translated.some(v => {
    // Remove text in parentheses and brackets
    const cleaned = v.message.replace(/[（(][^）)]+[）)]/g, '')
    return /[a-zA-Z]{10,}/.test(cleaned)
  })
  console.log(`🌐 All messages Chinese (allow terms in parentheses): ${!hasEnglish ? 'PASS' : 'FAIL'}`)

  // Overall
  const allPass = !hasChromium && !hasAnimalTest && !hasOrganic &&
                  hasHydroquinone && hasHormone && has7Days && hasMedical && hasCure && hasPermanent &&
                  !hasEnglish
  console.log(`\n🎯 OVERALL: ${allPass ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`)
}

main().catch(console.error)
