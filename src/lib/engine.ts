// CosmetCheck Compliance Engine
// Detects ANVISA (Brazil) and COFEPRIS (Mexico) violations

export interface CheckInput {
  ingredients?: string
  description?: string
  label?: string
  country: 'BR' | 'MX'
}

export interface Violation {
  ruleId: string
  category: 'ingredient' | 'label' | 'claim' | 'packaging'
  ruleType: 'prohibited' | 'restricted' | 'required'
  keyword: string
  severity: 'critical' | 'warning' | 'info'
  message: string
  suggestion: string
  source: string
  matchedText: string
  position?: { start: number; end: number }
}

export interface CheckResult {
  isCompliant: boolean
  violations: Violation[]
  warnings: Violation[]
  info: Violation[]
  summary: {
    totalIssues: number
    criticalCount: number
    warningCount: number
    infoCount: number
  }
  regulationVersion: number
}

// ANVISA Rules (Brazil) - Core rules for MVP
const ANVISA_RULES: Omit<Violation, 'matchedText' | 'position'>[] = [
  // Prohibited ingredients
  {
    ruleId: 'BR-ING-001',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'mercury',
    severity: 'critical',
    message: 'Mercury (Mercúrio) is prohibited in cosmetics by ANVISA RDC 529/2021.',
    suggestion: 'Remove mercury compounds from the formula.',
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-ING-002',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'lead',
    severity: 'critical',
    message: 'Lead (Chumbo) compounds are prohibited in cosmetics.',
    suggestion: 'Remove lead and its compounds from the formula.',
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-ING-003',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'hydroquinone',
    severity: 'critical',
    message: 'Hydroquinone is restricted and generally prohibited in cosmetic products.',
    suggestion: 'Remove hydroquinone or reformulate as a pharmaceutical product.',
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-ING-004',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'corticosteroid',
    severity: 'critical',
    message: 'Corticosteroids require medical prescription and cannot be in cosmetics.',
    suggestion: 'Remove corticosteroids - product must be registered as medicine.',
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-ING-005',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'formaldehyde',
    severity: 'critical',
    message: 'Formaldehyde is prohibited in cosmetics except as preservative trace.',
    suggestion: 'Ensure formaldehyde concentration is below 0.2% or remove entirely.',
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-ING-006',
    category: 'ingredient',
    ruleType: 'restricted',
    keyword: 'paraben',
    severity: 'warning',
    message: 'Parabens are restricted - concentration limits apply.',
    suggestion: 'Verify total paraben concentration does not exceed 0.4% for single / 0.8% for mixtures.',
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-ING-007',
    category: 'ingredient',
    ruleType: 'restricted',
    keyword: 'retinol',
    severity: 'warning',
    message: 'Retinol (Vitamin A) concentration is restricted in cosmetics.',
    suggestion: 'Ensure retinol concentration does not exceed regulatory limits.',
    source: 'ANVISA RDC 529/2021',
  },
  // Label/Claim rules
  {
    ruleId: 'BR-LBL-001',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'medicinal',
    severity: 'critical',
    message: 'Cosmetics cannot claim medicinal or therapeutic properties.',
    suggestion: 'Remove terms like "treats", "cures", "medicinal" from product claims.',
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-LBL-002',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'cure',
    severity: 'critical',
    message: 'Cosmetics cannot claim to cure, treat, or prevent diseases.',
    suggestion: 'Use cosmetic claims only (moisturizing, cleansing, beautifying).',
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-LBL-003',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: '100% natural',
    severity: 'warning',
    message: '"100% natural" claims require proof and specific registration.',
    suggestion: 'Remove absolute claims unless certified. Use "contains natural ingredients" instead.',
    source: 'ANVISA IN 26/2022',
  },
  {
    ruleId: 'BR-LBL-004',
    category: 'label',
    ruleType: 'required',
    keyword: 'manufacturer',
    severity: 'warning',
    message: 'Brazil requires manufacturer/distributor name and address on the label.',
    suggestion: 'Add manufacturer name, CNPJ, and complete address to the label.',
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-LBL-005',
    category: 'label',
    ruleType: 'required',
    keyword: 'ingredient list',
    severity: 'warning',
    message: 'Ingredient list in INCI nomenclature is mandatory.',
    suggestion: 'Include full ingredient list in INCI standard format.',
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-LBL-006',
    category: 'label',
    ruleType: 'required',
    keyword: 'ANVISA registration',
    severity: 'info',
    message: 'Products sold in Brazil require ANVISA registration number.',
    suggestion: 'Obtain ANVISA registration before commercialization.',
    source: 'ANVISA RDC 529/2021',
  },
]

// COFEPRIS Rules (Mexico)
const COFEPRIS_RULES: Omit<Violation, 'matchedText' | 'position'>[] = [
  // Prohibited ingredients
  {
    ruleId: 'MX-ING-001',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'mercury',
    severity: 'critical',
    message: 'Mercury (Mercurio) is prohibited in cosmetics by COFEPRIS.',
    suggestion: 'Remove mercury compounds from the formula.',
    source: 'COFEPRIS NOM-259-SSA1-2014',
  },
  {
    ruleId: 'MX-ING-002',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'lead',
    severity: 'critical',
    message: 'Lead (Plomo) is prohibited in cosmetics.',
    suggestion: 'Remove lead and its compounds.',
    source: 'COFEPRIS NOM-259-SSA1-2014',
  },
  {
    ruleId: 'MX-ING-003',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'hydroquinone',
    severity: 'critical',
    message: 'Hydroquinone is prohibited in cosmetics by COFEPRIS.',
    suggestion: 'Remove hydroquinone or register as pharmaceutical product.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
  },
  {
    ruleId: 'MX-ING-004',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'corticosteroid',
    severity: 'critical',
    message: 'Corticosteroids are prohibited in cosmetic products.',
    suggestion: 'Remove corticosteroids - product must be registered as medicine.',
    source: 'COFEPRIS NOM-259-SSA1-2014',
  },
  {
    ruleId: 'MX-ING-005',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'formaldehyde',
    severity: 'critical',
    message: 'Formaldehyde is prohibited in nail products and restricted in others.',
    suggestion: 'Ensure formaldehyde is not used as an ingredient.',
    source: 'COFEPRIS NOM-259-SSA1-2014',
  },
  {
    ruleId: 'MX-ING-006',
    category: 'ingredient',
    ruleType: 'restricted',
    keyword: 'paraben',
    severity: 'warning',
    message: 'Parabens are restricted - concentration limits apply.',
    suggestion: 'Verify paraben concentrations comply with NOM limits.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
  },
  {
    ruleId: 'MX-ING-007',
    category: 'ingredient',
    ruleType: 'restricted',
    keyword: 'retinol',
    severity: 'warning',
    message: 'Retinol concentration is restricted in cosmetics.',
    suggestion: 'Ensure retinol concentration is within allowed limits.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
  },
  // Label/Claim rules
  {
    ruleId: 'MX-LBL-001',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'medicinal',
    severity: 'critical',
    message: 'Cosmetics cannot claim medicinal or therapeutic properties.',
    suggestion: 'Remove therapeutic claims. Use cosmetic claims only.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
  },
  {
    ruleId: 'MX-LBL-002',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'cure',
    severity: 'critical',
    message: 'Cosmetics cannot claim to cure, treat, or prevent diseases.',
    suggestion: 'Remove disease-related claims.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
  },
  {
    ruleId: 'MX-LBL-003',
    category: 'label',
    ruleType: 'required',
    keyword: 'manufacturer',
    severity: 'warning',
    message: 'Mexico requires manufacturer/importer name and address on label.',
    suggestion: 'Add manufacturer name and address in Spanish.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
  },
  {
    ruleId: 'MX-LBL-004',
    category: 'label',
    ruleType: 'required',
    keyword: 'ingredient list',
    severity: 'warning',
    message: 'Ingredient list in INCI nomenclature is mandatory.',
    suggestion: 'Include full ingredient list in INCI standard format.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
  },
  {
    ruleId: 'MX-LBL-005',
    category: 'label',
    ruleType: 'required',
    keyword: 'COFEPRIS registration',
    severity: 'info',
    message: 'Products sold in Mexico require COFEPRIS registration.',
    suggestion: 'Obtain COFEPRIS registration before commercialization.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
  },
]

function findMatches(text: string, rules: Omit<Violation, 'matchedText' | 'position'>[]): Violation[] {
  const violations: Violation[] = []
  const lowerText = text.toLowerCase()

  for (const rule of rules) {
    const keyword = rule.keyword.toLowerCase()
    let index = lowerText.indexOf(keyword)

    while (index !== -1) {
      violations.push({
        ...rule,
        matchedText: text.substring(index, index + rule.keyword.length),
        position: {
          start: index,
          end: index + rule.keyword.length,
        },
      })
      index = lowerText.indexOf(keyword, index + 1)
    }
  }

  return violations
}

export function checkCompliance(input: CheckInput): CheckResult {
  const rules = input.country === 'BR' ? ANVISA_RULES : COFEPRIS_RULES
  const allText = [
    input.ingredients || '',
    input.description || '',
    input.label || '',
  ].join(' ')

  const violations: Violation[] = []

  // Check ingredients
  if (input.ingredients) {
    violations.push(...findMatches(input.ingredients, rules.filter(r => r.category === 'ingredient')))
  }

  // Check description/claims
  if (input.description) {
    violations.push(...findMatches(input.description, rules.filter(r => r.category === 'claim')))
  }

  // Check label
  if (input.label) {
    violations.push(...findMatches(input.label, rules.filter(r => r.category === 'label')))
  }

  // Always add label requirements (info level)
  const labelRules = rules.filter(r => r.ruleType === 'required')
  // Only add if not already matched
  for (const rule of labelRules) {
    const alreadyFound = violations.some(v => v.ruleId === rule.ruleId)
    if (!alreadyFound) {
      violations.push({
        ...rule,
        matchedText: rule.keyword,
      })
    }
  }

  const criticalCount = violations.filter(v => v.severity === 'critical').length
  const warningCount = violations.filter(v => v.severity === 'warning').length
  const infoCount = violations.filter(v => v.severity === 'info').length

  return {
    isCompliant: criticalCount === 0,
    violations: violations.filter(v => v.severity === 'critical'),
    warnings: violations.filter(v => v.severity === 'warning'),
    info: violations.filter(v => v.severity === 'info'),
    summary: {
      totalIssues: violations.length,
      criticalCount,
      warningCount,
      infoCount,
    },
    regulationVersion: 1,
  }
}
