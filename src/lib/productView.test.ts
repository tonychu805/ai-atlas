import { describe, it, expect } from 'vitest'
import { pickHeroMetrics, hasValidBom } from './productView'

const specs = [
  { label: 'Transistors', value: '208 B' },
  { label: 'FP8 compute', value: '4,500 TFLOPS' },
  { label: 'Memory', value: '192 GB HBM3E' },
  { label: 'Bandwidth', value: '8.0 TB/s' },
  { label: 'TDP', value: '1,000 W' },
  { label: 'Interconnect', value: 'NVLink 5' },
  { label: 'Form factor', value: 'SXM' },
]

describe('pickHeroMetrics', () => {
  it('returns priority metrics in priority order, capped at max', () => {
    const r = pickHeroMetrics(specs, 5).map(s => s.label)
    expect(r).toEqual(['Memory', 'Bandwidth', 'FP8 compute', 'TDP', 'Interconnect'])
  })

  it('skips priorities that are absent', () => {
    const r = pickHeroMetrics([{ label: 'Memory', value: '24 GB' }]).map(s => s.label)
    expect(r).toEqual(['Memory'])
  })

  it('returns empty when no priority labels match', () => {
    expect(pickHeroMetrics([{ label: 'Transistors', value: '80 B' }])).toEqual([])
  })

  it('matches case-insensitively and does not reuse a spec', () => {
    const r = pickHeroMetrics([{ label: 'memory', value: '24 GB' }])
    expect(r).toHaveLength(1)
  })
})

describe('hasValidBom', () => {
  it('true when items is a non-empty array', () => {
    expect(hasValidBom({ uncertainty: '±10%', items: [{ label: 'die', cost: 850 }], total: 850, totalConf: 'high' })).toBe(true)
  })
  it('false for null', () => {
    expect(hasValidBom(null)).toBe(false)
  })
  it('false for empty / malformed bom', () => {
    expect(hasValidBom({ uncertainty: '', items: [], total: 0, totalConf: '' })).toBe(false)
    // malformed row missing items
    expect(hasValidBom({} as never)).toBe(false)
  })
})
