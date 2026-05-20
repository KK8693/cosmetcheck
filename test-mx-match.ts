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

const text = '7天彻底祛斑、永久美白、医疗级焕肤、根治黑色素、隔离紫外线'.toLowerCase()

const candidates = [
  'resultados inmediatos',
  'instantáneamente',
  '100% efectivo',
  'ultra rápido',
  'garantizado',
  '7 dias',
  '100% 有效',
  '保证 结果',
  '7 days',
  '结果立竿见影',
  '100%有效',
  '即刻见效',
  '保证结果',
  '超快速',
  '7 天',
  '7天',
]

for (const c of candidates) {
  const match = findWordBoundaryMatch(text, c.toLowerCase())
  if (match) {
    console.log(`MATCH: "${c}" at index ${match.index}, length ${match.length}`)
  }
}
