// 验证植物激素负向过滤问题
const text = '去离子水、丙二醇、氢醌、植物激素提取物、泛醇'

// 模拟 isWordBoundary
const isWordChar = (c: string) => /[a-zA-Z0-9_]/.test(c)

function isWordBoundary(text: string, matchStart: number, matchEnd: number): boolean {
  const before = matchStart > 0 ? text[matchStart - 1] : ''
  const after = matchEnd < text.length ? text[matchEnd] : ''
  const beforeOk = matchStart === 0 || !isWordChar(before)
  const afterOk = matchEnd >= text.length || !isWordChar(after)
  return beforeOk && afterOk
}

// 测试“植物激素”匹配
const candidate = '植物激素'
const idx = text.indexOf(candidate)
console.log('text:', text)
console.log('candidate:', candidate)
console.log('indexOf:', idx)
if (idx !== -1) {
  console.log('isWordBoundary:', isWordBoundary(text, idx, idx + candidate.length))
  console.log('before char:', JSON.stringify(text[idx - 1]))
  console.log('after char:', JSON.stringify(text[idx + candidate.length]))
  
  // 模拟负向过滤
  const contextBefore = text.substring(Math.max(0, idx - 15), idx + candidate.length)
  console.log('contextBefore:', contextBefore)
  const negativePrefixes = ['植物', 'vegetal', 'phyto']
  for (const prefix of negativePrefixes) {
    if (contextBefore.includes(prefix)) {
      console.log(`❌ 负向过滤触发: 包含 "${prefix}"`)
    }
  }
}

// 测试“氢醌”匹配
const candidate2 = '氢醌'
const idx2 = text.indexOf(candidate2)
console.log('')
console.log('candidate:', candidate2)
console.log('indexOf:', idx2)
if (idx2 !== -1) {
  console.log('isWordBoundary:', isWordBoundary(text, idx2, idx2 + candidate2.length))
}

// 验证“氢醌”是否在规则中
console.log('')
console.log('=== 检查“氢醌”在哪些规则的 aliases 中 ===')
import { checkCompliance } from './src/lib/engine'
const brResult = checkCompliance({ ingredients: '氢醌', country: 'BR' })
console.log('BR 单独氢醌:', brResult.violations.length + brResult.warnings.length)
const brResult2 = checkCompliance({ ingredients: '对苯二酚', country: 'BR' })
console.log('BR 单独对苯二酚:', brResult2.violations.length + brResult2.warnings.length)
