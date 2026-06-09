import { describe, it, expect, beforeEach } from 'vitest'
import { loadRegulationRules, getRuleStats } from './regulation-loader'
import mxBannedJson from '../data/regulations/mexico/banned.json'
import mxRestrictedJson from '../data/regulations/mexico/restricted.json'

describe('Regulation Loader - New Ruleset', () => {
  it('should verify Mexico JSON imports directly', () => {
    console.log('[TEST] Direct import banned rules:', mxBannedJson.rules?.length)
    console.log('[TEST] Direct import restricted rules:', mxRestrictedJson.rules?.length)
    expect(mxBannedJson.rules.length).toBeGreaterThan(0)
    expect(mxRestrictedJson.rules.length).toBeGreaterThan(0)
  })

  it('should load Brazil rules with expected counts', async () => {
    const rules = await loadRegulationRules('BR')
    expect(rules.length).toBeGreaterThan(1700)
    const banned = rules.filter(r => r.ruleType === 'prohibited')
    const restricted = rules.filter(r => r.ruleType === 'restricted')
    expect(banned.length).toBeGreaterThan(1300)
    expect(restricted.length).toBeGreaterThan(300)
  })

  it('should load Mexico rules with expected counts', async () => {
    const rules = await loadRegulationRules('MX')
    console.log(`[TEST] MX rules loaded: ${rules.length}`)
    expect(rules.length).toBeGreaterThan(250)
    const banned = rules.filter(r => r.ruleType === 'prohibited')
    const restricted = rules.filter(r => r.ruleType === 'restricted')
    expect(banned.length).toBeGreaterThan(160)
    expect(restricted.length).toBeGreaterThan(90)
  })

  it('should have valid rule structure for all loaded rules', async () => {
    const allRules = [
      ...(await loadRegulationRules('BR')),
      ...(await loadRegulationRules('MX')),
    ]
    for (const rule of allRules) {
      if (!rule.ruleId || !rule.keyword || !rule.severity) {
        console.error('[TEST] Invalid rule:', JSON.stringify(rule, null, 2))
      }
      expect(rule.ruleId).toBeDefined()
      expect(rule.ruleId.length).toBeGreaterThan(0)
      expect(rule.keyword).toBeDefined()
      expect(rule.keyword.length).toBeGreaterThan(0)
      expect(['critical', 'warning', 'info']).toContain(rule.severity)
    }
  })

  it('should include key banned substances for Brazil', async () => {
    const rules = await loadRegulationRules('BR')
    const ruleIds = new Set(rules.map(r => r.ruleId))
    expect(ruleIds.has('BR-BAN-001')).toBe(true)
    expect(ruleIds.has('BR-BAN-010')).toBe(true)
    expect(ruleIds.has('BR-IN220-1')).toBe(true)
  })

  it('should include key banned substances for Mexico', async () => {
    const rules = await loadRegulationRules('MX')
    const ruleIds = new Set(rules.map(r => r.ruleId))
    expect(ruleIds.has('MX-2010-SEGUNDO-1')).toBe(true)
    expect(ruleIds.has('MX-2010-SEGUNDO-10')).toBe(true)
    expect(ruleIds.has('MX-2014-SEXTO-130')).toBe(true)
  })

  it('should expose stats matching loaded rule counts', async () => {
    await loadRegulationRules('BR')
    await loadRegulationRules('MX')
    const stats = getRuleStats()
    expect(stats.BR).toBeGreaterThan(1600)
    expect(stats.MX).toBeGreaterThan(250)
    expect(stats.loadedAt).toBeDefined()
  })
})
