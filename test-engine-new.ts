// CosmetCheck Engine Test - New Product
import { checkCompliance, initRules } from './src/lib/engine'

const testInput = {
  ingredients: "Água Mineral, Parabenos, Talco, Ácido Arsênico, Extrato de ervas, Conservante de liberação de formaldeído",
  description: "Creme Anti-Idade Rejuvenescedor Facial. Nosso creme rejuvenescedor remove todas as rugas e linhas de expressão de forma definitiva. Recupera a juventude da pele em apenas 3 dias, com efeito eterno e permanente. Possui fórmula clínica exclusiva que cura o envelhecimento cutâneo de uma vez por todas. Compatível com lactantes, bebês recém-nascidos e pessoas com pele muito sensível, sem nenhum tipo de alergia. Resultados 100% comprovados e garantidos para todos os usuários. Modo de uso: Aplicar diariamente pela manhã e noite, com resultado imediato e instantâneo.",
  country: "BR" as const
}

async function runTest() {
  console.log("=".repeat(70))
  console.log("🧪 COSMETCHECK ENGINE TEST - NEW PRODUCT COMPLIANCE SCAN")
  console.log("=".repeat(70))
  
  console.log("\n📝 INPUT TEXT:")
  console.log("-".repeat(50))
  console.log("Product: Creme Anti-Idade Rejuvenescedor Facial")
  console.log("\nIngredients:", testInput.ingredients)
  console.log("\nDescription:", testInput.description.substring(0, 200) + "...")
  
  // Initialize rules first
  await initRules()
  
  // Run compliance check
  const result = checkCompliance(testInput)
  
  console.log("\n" + "=".repeat(70))
  console.log("📊 DETECTION RESULTS")
  console.log("=".repeat(70))
  
  console.log(`\n✅ Overall Compliant: ${result.isCompliant ? 'YES ✓' : 'NO ❌'}`)
  console.log(`📈 Total Issues: ${result.summary.totalIssues}`)
  console.log(`   🔴 Critical: ${result.summary.criticalCount}`)
  console.log(`   🟡 Warning: ${result.summary.warningCount}`)
  console.log(`   🔵 Info: ${result.summary.infoCount}`)
  
  console.log("\n" + "-".repeat(70))
  console.log("🚨 VIOLATIONS (CRITICAL - Must Fix)")
  console.log("-".repeat(70))
  
  if (result.violations.length === 0) {
    console.log("   ✅ No critical violations detected!")
  } else {
    const seen = new Set<string>()
    result.violations.forEach((v, i) => {
      const key = `${v.ruleId}-${v.matchedText}`
      if (seen.has(key)) return
      seen.add(key)
      
      console.log(`\n   ${i + 1}. [${v.ruleId}] ${v.keyword}`)
      console.log(`      📍 Source: ${v.sourceField}`)
      console.log(`      💬 ${v.message}`)
      console.log(`      🎯 Matched: "${v.matchedText}"`)
    })
  }
  
  console.log("\n" + "-".repeat(70))
  console.log("⚠️ WARNINGS (Should Fix)")
  console.log("-".repeat(70))
  
  if (result.warnings.length === 0) {
    console.log("   ✅ No warnings!")
  } else {
    const seen = new Set<string>()
    result.warnings.forEach((v, i) => {
      const key = `${v.ruleId}-${v.matchedText}`
      if (seen.has(key)) return
      seen.add(key)
      
      console.log(`\n   ${i + 1}. [${v.ruleId}] ${v.keyword}`)
      console.log(`      📍 Source: ${v.sourceField}`)
      console.log(`      💬 ${v.message}`)
      console.log(`      🎯 Matched: "${v.matchedText}"`)
    })
  }
  
  // Group by category for summary
  const byCategory: Record<string, { critical: number; warning: number }> = {
    ingredient: { critical: 0, warning: 0 },
    claim: { critical: 0, warning: 0 },
    label: { critical: 0, warning: 0 }
  }
  
  ;[...result.violations, ...result.warnings].forEach(v => {
    if (byCategory[v.category]) {
      byCategory[v.category][v.severity === 'critical' ? 'critical' : 'warning']++
    }
  })
  
  console.log("\n" + "=".repeat(70))
  console.log("📋 SUMMARY BY CATEGORY")
  console.log("=".repeat(70))
  
  Object.entries(byCategory).forEach(([cat, counts]) => {
    const emoji = cat === 'ingredient' ? '🧪' : cat === 'claim' ? '📢' : '🏷️'
    console.log(`   ${emoji} ${cat.toUpperCase()}: ${counts.critical} critical, ${counts.warning} warnings`)
  })
  
  console.log("\n" + "=".repeat(70))
  console.log("🎯 LEGAL RISK ASSESSMENT (BRAZIL - ANVISA)")
  console.log("=".repeat(70))
  
  if (result.summary.criticalCount > 5) {
    console.log("   🔴 EXTREME RISK - Product CANNOT be sold in Brazil")
    console.log("   ")
    console.log("   ⚖️ Potential Legal Consequences:")
    console.log("      • Fine: R$ 5,000 ~ R$ 500,000 (RDC 907/2024)")
    console.log("      • Product seizure and destruction at customs")
    console.log("      • Company blacklisted by ANVISA")
    console.log("      • Criminal liability for health crimes")
  } else if (result.summary.criticalCount > 0) {
    console.log("   🟡 HIGH RISK - Significant reforms required")
  } else if (result.summary.warningCount > 0) {
    console.log("   🟢 MEDIUM RISK - Fix warnings before sale")
  } else {
    console.log("   ✅ LOW RISK - Product appears compliant")
  }
  
  console.log("\n" + "=".repeat(70))
  console.log("📋 CORRECTION PRIORITY")
  console.log("=".repeat(70))
  console.log("   🔴 IMMEDIATE: Remove prohibited/restricted ingredients")
  console.log("   🔴 IMMEDIATE: Remove medical/curative claims")
  console.log("   🟡 BEFORE LAUNCH: Complete label requirements")
  console.log("   🟡 BEFORE LAUNCH: Add compliant disclaimers")
  
  console.log("\n" + "=".repeat(70))
}

runTest().catch(console.error)