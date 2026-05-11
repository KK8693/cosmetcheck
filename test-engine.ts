// CosmetCheck Engine Test Script
import { checkCompliance, initRules } from './src/lib/engine'

const testInput = {
  ingredients: "Água, Glicerina, Hidroquinona, Extrato de aloe, Essência floral, Conservante com formaldeído",
  description: "Nosso sérum clareador age 7 dias eliminando todas as manchas escuras, melasma e sinais de envelhecimento de forma permanente. Com fórmula médica exclusiva, cura completamente o melanina escura e deixa a pele branca para sempre. Ideal para todos os tipos de pele, incluindo bebês e mulheres grávidas, sem nenhum risco de irritação. Modo de uso: Aplicar no rosto todas as manhãs e noites, resultados garantidos 100%.",
  country: "BR" as const
}

async function runTest() {
  console.log("=" .repeat(60))
  console.log("🧪 COSMETCHECK ENGINE TEST - Product Compliance Scan")
  console.log("=" .repeat(60))
  
  console.log("\n📝 INPUT TEXT:")
  console.log("-".repeat(40))
  console.log("Ingredients:", testInput.ingredients)
  console.log("\nDescription:", testInput.description.substring(0, 150) + "...")
  
  // Initialize rules first
  await initRules()
  
  // Run compliance check
  const result = checkCompliance(testInput)
  
  console.log("\n" + "=" .repeat(60))
  console.log("📊 DETECTION RESULTS")
  console.log("=" .repeat(60))
  
  console.log(`\n✅ Overall Compliant: ${result.isCompliant ? 'YES' : 'NO'}`)
  console.log(`📈 Total Issues: ${result.summary.totalIssues}`)
  console.log(`   🔴 Critical: ${result.summary.criticalCount}`)
  console.log(`   🟡 Warning: ${result.summary.warningCount}`)
  console.log(`   🔵 Info: ${result.summary.infoCount}`)
  
  console.log("\n" + "-".repeat(60))
  console.log("🚨 VIOLATIONS (CRITICAL - Must Fix)")
  console.log("-".repeat(60))
  
  if (result.violations.length === 0) {
    console.log("   ✅ No critical violations detected!")
  } else {
    result.violations.forEach((v, i) => {
      console.log(`\n   ${i + 1}. [${v.ruleId}] ${v.keyword}`)
      console.log(`      Category: ${v.category} | Type: ${v.ruleType}`)
      console.log(`      📍 Source: ${v.sourceField}`)
      console.log(`      💬 ${v.message}`)
      console.log(`      🎯 Matched: "${v.matchedText}"`)
      if (v.contextSnippet) {
        console.log(`      📝 Context: ${v.contextSnippet}`)
      }
    })
  }
  
  console.log("\n" + "-".repeat(60))
  console.log("⚠️ WARNINGS (Should Fix)")
  console.log("-".repeat(60))
  
  if (result.warnings.length === 0) {
    console.log("   ✅ No warnings!")
  } else {
    result.warnings.forEach((v, i) => {
      console.log(`\n   ${i + 1}. [${v.ruleId}] ${v.keyword}`)
      console.log(`      📍 Source: ${v.sourceField}`)
      console.log(`      💬 ${v.message}`)
      console.log(`      🎯 Matched: "${v.matchedText}"`)
    })
  }
  
  console.log("\n" + "-".repeat(60))
  console.log("ℹ️ INFO (Good to Know)")
  console.log("-".repeat(60))
  
  if (result.info.length === 0) {
    console.log("   ✅ No additional info!")
  } else {
    result.info.forEach((v, i) => {
      console.log(`\n   ${i + 1}. [${v.ruleId}] ${v.keyword}`)
      console.log(`      💬 ${v.message}`)
    })
  }
  
  // Group by category for summary
  const byCategory = {
    ingredient: { critical: 0, warning: 0 },
    claim: { critical: 0, warning: 0 },
    label: { critical: 0, warning: 0 }
  }
  
  ;[...result.violations, ...result.warnings].forEach(v => {
    if (byCategory[v.category as keyof typeof byCategory]) {
      byCategory[v.category as keyof typeof byCategory][v.severity === 'critical' ? 'critical' : 'warning']++
    }
  })
  
  console.log("\n" + "=" .repeat(60))
  console.log("📋 SUMMARY BY CATEGORY")
  console.log("=" .repeat(60))
  
  Object.entries(byCategory).forEach(([cat, counts]) => {
    console.log(`   ${cat.toUpperCase()}: ${counts.critical} critical, ${counts.warning} warnings`)
  })
  
  console.log("\n" + "=" .repeat(60))
  console.log("🎯 RECOMMENDATIONS")
  console.log("=" .repeat(60))
  
  if (result.summary.criticalCount > 0) {
    console.log("   ❌ Product CANNOT be sold in Brazil without reforms!")
    console.log("   📋 Priority actions:")
    console.log("      1. Remove prohibited ingredients (Hidroquinona, Formaldeído)")
    console.log("      2. Remove medical/curative claims")
    console.log("      3. Add required label information")
  } else if (result.summary.warningCount > 0) {
    console.log("   ⚠️ Product has compliance issues that should be fixed before sale")
  } else {
    console.log("   ✅ Product appears compliant")
  }
  
  console.log("\n" + "=".repeat(60))
}

runTest().catch(console.error)