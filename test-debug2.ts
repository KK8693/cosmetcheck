import { checkCompliance, initRules } from './src/lib/engine'

async function test() {
  await initRules()
  
  // Test individual issues
  const tests = [
    { desc: "embarazadas", text: "mujeres embarazadas", country: "BR" as const },
    { desc: "para siempre", text: "para siempre", country: "BR" as const },
    { desc: "7 dias match", text: "en solo 7 días", country: "BR" as const },
    { desc: "100% efectivo", text: "100% efectivo", country: "BR" as const },
  ]
  
  for (const t of tests) {
    const result = checkCompliance({
      ingredients: "",
      description: t.text,
      label: "",
      country: t.country
    })
    console.log(`\n=== ${t.desc} ===`)
    console.log("Matches:", [...result.violations, ...result.warnings].map(v => `${v.ruleId}:${v.matchedText}`).join(', ') || "NONE")
  }
}

test().catch(console.error)
