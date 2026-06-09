import { describe, it, expect, vi } from 'vitest'

async function getFreshEngine() {
  vi.resetModules()
  const { checkCompliance, initRules } = await import('./engine')
  await initRules()
  return { checkCompliance, initRules }
}

describe('Compliance Engine - End to End', () => {
  describe('Brazil (BR) Detection', () => {
    it('should detect banned ingredient: mercury', async () => {
      const { checkCompliance } = await getFreshEngine()
      const result = checkCompliance({
        country: 'BR',
        ingredients: 'Water, Mercury, Glycerin',
        productName: 'Test Cream',
      })
      const mercuryViolation = result.violations.find(v => v.keyword.toLowerCase().includes('mercury'))
      expect(mercuryViolation).toBeDefined()
      expect(mercuryViolation?.severity).toBe('critical')
      expect(mercuryViolation?.ruleType).toBe('prohibited')
    })

    it('should detect banned ingredient: hydroquinone', async () => {
      const { checkCompliance } = await getFreshEngine()
      const result = checkCompliance({
        country: 'BR',
        ingredients: 'Aqua, Hydroquinone, Alcohol',
        productName: 'Whitening Serum',
      })
      const hqViolation = result.violations.find(v => v.keyword.toLowerCase().includes('hydroquinone'))
      expect(hqViolation).toBeDefined()
      expect(hqViolation?.severity).toBe('critical')
    })

    it('should detect restricted ingredient: paraben', async () => {
      const { checkCompliance } = await getFreshEngine()
      const result = checkCompliance({
        country: 'BR',
        ingredients: 'Water, Methylparaben, Propylparaben, Oil',
        productName: 'Body Lotion',
      })
      console.log('[TEST] All violations:', result.violations.map(v => ({ keyword: v.keyword, matchedText: v.matchedText, ruleType: v.ruleType, ruleId: v.ruleId })))
      const paraViolation = result.violations.find(v => v.keyword.toLowerCase().includes('paraben') || (v.matchedText && v.matchedText.toLowerCase().includes('paraben')))
      expect(paraViolation).toBeDefined()
      expect(paraViolation?.ruleType).toBe('restricted')
    })

    it('should not flag safe ingredients', async () => {
      const { checkCompliance } = await getFreshEngine()
      const result = checkCompliance({
        country: 'BR',
        ingredients: 'Water, Glycerin, Niacinamide, Hyaluronic Acid',
        productName: 'Safe Serum',
      })
      const criticalViolations = result.violations.filter(v => v.severity === 'critical')
      expect(criticalViolations.length).toBe(0)
    })

    it('should detect claim violation: anti-aging', async () => {
      const { checkCompliance } = await getFreshEngine()
      const result = checkCompliance({
        country: 'BR',
        productName: 'Anti-Aging Miracle Cream',
        description: 'This cream removes wrinkles and cures aging',
        ingredients: 'Water, Glycerin',
      })
      const claimViolation = result.violations.find(v => v.category === 'claim')
      expect(claimViolation).toBeDefined()
    })
  })

  describe('Mexico (MX) Detection', () => {
    it('should detect banned ingredient from MX-2010 Segundo', async () => {
      const { checkCompliance } = await getFreshEngine()
      const result = checkCompliance({
        country: 'MX',
        ingredients: 'Water, Aceite de antraceno, Glycerin',
        productName: 'Test Product MX',
      })
      const violation = result.violations.find(v => v.matchedText.toLowerCase().includes('antraceno'))
      expect(violation).toBeDefined()
      expect(violation?.severity).toBe('critical')
    })

    it('should detect restricted ingredient from MX-2010 Tercero', async () => {
      const { checkCompliance } = await getFreshEngine()
      const result = checkCompliance({
        country: 'MX',
        ingredients: 'Water, Acetona, Alcohol',
        productName: 'Nail Polish Remover',
      })
      const violation = result.violations.find(v => v.matchedText.toLowerCase().includes('acetona'))
      expect(violation).toBeDefined()
      expect(violation?.ruleType).toBe('restricted')
    })

    it('should not flag safe ingredients in Mexico', async () => {
      const { checkCompliance } = await getFreshEngine()
      const result = checkCompliance({
        country: 'MX',
        ingredients: 'Agua, Glicerina, Niacinamida, Ácido Hialurónico',
        productName: 'Suero Seguro',
      })
      const criticalViolations = result.violations.filter(v => v.severity === 'critical')
      expect(criticalViolations.length).toBe(0)
    })
  })

  describe('Result Structure', () => {
    it('should return correct result structure', async () => {
      const { checkCompliance } = await getFreshEngine()
      const result = checkCompliance({
        country: 'BR',
        ingredients: 'Water, Mercury',
        productName: 'Bad Product',
      })

      expect(result).toHaveProperty('isCompliant')
      expect(result).toHaveProperty('violations')
      expect(result).toHaveProperty('warnings')
      expect(result).toHaveProperty('info')
      expect(result).toHaveProperty('summary')
      expect(result).toHaveProperty('regulationVersion')

      expect(typeof result.isCompliant).toBe('boolean')
      expect(Array.isArray(result.violations)).toBe(true)
      expect(Array.isArray(result.warnings)).toBe(true)
      expect(Array.isArray(result.info)).toBe(true)
      expect(typeof result.summary.totalIssues).toBe('number')
    })

    it('should mark non-compliant when violations exist', async () => {
      const { checkCompliance } = await getFreshEngine()
      const result = checkCompliance({
        country: 'BR',
        ingredients: 'Water, Mercury',
      })
      expect(result.isCompliant).toBe(false)
      expect(result.summary.criticalCount).toBeGreaterThan(0)
    })

    it('should mark compliant for safe products', async () => {
      const { checkCompliance } = await getFreshEngine()
      const result = checkCompliance({
        country: 'BR',
        ingredients: 'Water, Glycerin, Niacinamide',
      })
      expect(result.isCompliant).toBe(true)
      expect(result.summary.criticalCount).toBe(0)
    })
  })
})
