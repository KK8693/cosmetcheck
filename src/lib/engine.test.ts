import { describe, it, expect } from 'vitest'
import { checkCompliance } from './engine'

describe('checkCompliance', () => {
  describe('claim matching', () => {
    it('detects medical cure claims in BR', () => {
      const result = checkCompliance({
        country: 'BR',
        description: 'Este produto cura acne e psoríase completamente.',
      })
      expect(result.isCompliant).toBe(false)
      expect(result.violations.length).toBeGreaterThan(0)
    })

    it('detects absolute whitening claims in BR', () => {
      const result = checkCompliance({
        country: 'BR',
        description: 'Clareamento permanente, elimina todas as manchas em 7 dias.',
      })
      expect(result.isCompliant).toBe(false)
      expect(result.violations.length).toBeGreaterThanOrEqual(1)
    })

    it('detects claims in product name (P4.1)', () => {
      const result = checkCompliance({
        country: 'BR',
        productName: 'Creme Médico Curativo',
        description: 'Hidratação facial diária.',
      })
      expect(result.isCompliant).toBe(false)
    })
  })

  describe('ingredient matching', () => {
    it('detects banned mercury in ingredients', () => {
      const result = checkCompliance({
        country: 'BR',
        ingredients: 'Water, Mercury, Glycerin',
      })
      expect(result.isCompliant).toBe(false)
      expect(result.violations.length + result.warnings.length).toBeGreaterThan(0)
    })

    it('detects corticosteroid aliases', () => {
      const result = checkCompliance({
        country: 'BR',
        ingredients: 'Aqua, Hydrocortisone, Niacinamide',
      })
      expect(result.isCompliant).toBe(false)
    })
  })

  describe('P0.6: phytohormone false positive', () => {
    it('does NOT flag phytohormones as corticosteroid', () => {
      const result = checkCompliance({
        country: 'BR',
        ingredients: 'Extrato de hormônio vegetal, glicina',
      })
      const hasCortico = result.violations.some(v => 
        v.matchedText.toLowerCase().includes('corticosteroid') ||
        v.matchedText.toLowerCase().includes('corticoide')
      )
      expect(hasCortico).toBe(false)
    })
  })

  describe('P0.8: inflection matching', () => {
    it('matches plural forms of Portuguese keywords', () => {
      const result = checkCompliance({
        country: 'BR',
        description: 'Nosso produto é 100% natural e orgânico.',
      })
      expect(result.isCompliant).toBe(false)
    })
  })

  describe('P4.2: cross-field deduplication', () => {
    it('merges source fields when same rule matches in multiple fields', () => {
      const result = checkCompliance({
        country: 'BR',
        productName: 'Creme Curativo',
        description: 'Creme curativo para acne.',
      })
      const violation = result.violations.find(v => v.ruleId === 'BR-CLAIM-001')
      expect(violation).toBeDefined()
      expect(violation?.allSourceFields).toBeDefined()
      expect(violation?.allSourceFields?.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Mexico (COFEPRIS) rules', () => {
    it('detects MX claim violations', () => {
      const result = checkCompliance({
        country: 'MX',
        description: 'Crema médica que cura el acné permanentemente en 7 días.',
      })
      expect(result.isCompliant).toBe(false)
      expect(result.violations.length).toBeGreaterThan(0)
    })

    it('detects MX banned ingredients', () => {
      const result = checkCompliance({
        country: 'MX',
        ingredients: 'Aqua, Mercury, Fragrance',
      })
      expect(result.isCompliant).toBe(false)
    })
  })

  describe('compliant product', () => {
    it('returns compliant for safe product', () => {
      const result = checkCompliance({
        country: 'BR',
        productName: 'Hidratante Facial',
        description: 'Hidratação suave para pele seca.',
        ingredients: 'Aqua, Glycerin, Sodium Hyaluronate',
      })
      expect(result.summary.criticalCount).toBe(0)
    })
  })
})
