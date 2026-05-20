import { checkCompliance } from './src/lib/engine'

// 直接调用并打印所有规则
const text = '医疗级 7天彻底 根治 永久 100% 孕妇 无副作用 零刺激'

// 我们需要直接访问引擎内部的规则列表
// 让我们用一个更低层的方法

// 检查 JSON 缓存
console.log('=== 检查 JSON 规则加载状态 ===')

// 模拟引擎加载逻辑
import { loadRegulationRules } from './src/lib/regulation-loader'

async function debug() {
  const brRules = await loadRegulationRules('BR')
  console.log('BR JSON rules count:', brRules.length)
  
  // 查找所有 claim 规则
  const claimRules = brRules.filter(r => r.category === 'claim')
  console.log('BR JSON claim rules count:', claimRules.length)
  
  // 检查包含医疗级的规则
  const medicalRules = brRules.filter(r => 
    r.keyword?.includes('医疗') || 
    r.aliases?.some(a => a.includes('医疗'))
  )
  console.log('\n包含医疗的规则数量:', medicalRules.length)
  for (const r of medicalRules.slice(0, 5)) {
    console.log(`  ${r.ruleId} | keyword:"${r.keyword}" | aliases:[${r.aliases?.slice(0, 3).join(',')}...]`)
  }
  
  // 检查包含 7天的规则
  const dayRules = brRules.filter(r => 
    r.keyword?.includes('7') || 
    r.aliases?.some(a => a.includes('7'))
  )
  console.log('\n包含 7/天 的规则数量:', dayRules.length)
  for (const r of dayRules.slice(0, 5)) {
    console.log(`  ${r.ruleId} | keyword:"${r.keyword}" | aliases:[${r.aliases?.slice(0, 3).join(',')}...]`)
  }
}

debug()
