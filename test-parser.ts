import { parseIngredients, splitIngredients } from './src/lib/ingredient-parser'

const ingredients = '去离子水、丙二醇、氢醌、植物激素提取物、泛醇、透明质酸钠、天然植物精油、苯氧乙醇'

console.log('=== 成分拆分测试 ===')
const split = splitIngredients(ingredients)
console.log('拆分结果:', split)
console.log('拆分数量:', split.length)

console.log('')
console.log('=== 解析结果 ===')
const parsed = parseIngredients(ingredients)
console.log('parsed statistics:', parsed.statistics)
for (const p of parsed.parsed) {
  console.log(`  original:"${p.original}" -> inci:"${p.inci}" | matchedBy:${p.matchedBy} | confidence:${p.confidence}`)
}
