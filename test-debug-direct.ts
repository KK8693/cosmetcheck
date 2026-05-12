import { checkCompliance, initRules } from './src/lib/engine'

async function test() {
  // Initialize rules first
  await initRules()
  
  const testInput = {
    ingredients: "Agua, Ácido Salicílico, Peróxido de Benzoilo, Clindamicina, Alcohol",
    description: "Gel Anti-Acné Definitivo. Elimina completamente el acné en solo 7 días, cura las espinillas y las cicatrices para siempre. Trata la piel grasa y previene nuevos brotes de forma permanente. Fórmula clínica con antibiótico natural, 100% efectivo para todos los tipos de piel. Seguro para adolescentes y mujeres embarazadas, sin efectos secundarios. Modo de uso: Aplicar dos veces al día, resultados inmediatos.",
    label: "",
    country: "BR" as const
  }
  
  const result = checkCompliance(testInput)
  
  console.log("=== RESULT ===")
  console.log("Is Compliant:", result.isCompliant)
  console.log("Critical Count:", result.summary.criticalCount)
  console.log("Warning Count:", result.summary.warningCount)
  console.log("\n=== VIOLATIONS (Critical) ===")
  for (const v of result.violations) {
    console.log(`[${v.ruleId}] ${v.matchedText}`)
    console.log(`  Message: ${v.message}`)
    console.log(`  Category: ${v.category}, Severity: ${v.severity}`)
  }
  console.log("\n=== WARNINGS ===")
  for (const w of result.warnings) {
    console.log(`[${w.ruleId}] ${w.matchedText}`)
    console.log(`  Message: ${w.message}`)
  }
  console.log("\n=== ALL MATCHED TEXT ===")
  const all = [...result.violations, ...result.warnings]
  console.log(all.map(v => v.matchedText).join(', '))
}

test().catch(console.error)
