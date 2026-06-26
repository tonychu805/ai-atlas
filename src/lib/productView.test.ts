import { describe, it, expect } from 'vitest'
import { pickHeroMetrics, hasValidBom } from './productView'

const accelSpecs = [
  { label: 'FP8 compute', value: '4,500 TFLOPS' },
  { label: 'BF16 compute', value: '2,250 TFLOPS' },
  { label: 'Memory', value: '192 GB HBM3E' },
  { label: 'Bandwidth', value: '8.0 TB/s' },
  { label: 'TDP', value: '1,000 W' },
  { label: 'Transistors', value: '208 B' },
]

describe('pickHeroMetrics', () => {
  it('returns hero labels for ai_accelerator in template order', () => {
    const r = pickHeroMetrics(accelSpecs, 'ai_accelerator').map(s => s.label)
    expect(r).toEqual(['FP8 compute', 'BF16 compute', 'Memory', 'Bandwidth', 'TDP'])
  })

  it('skips labels absent from the spec list', () => {
    const r = pickHeroMetrics([{ label: 'Memory', value: '24 GB' }], 'ai_accelerator').map(s => s.label)
    expect(r).toEqual(['Memory'])
  })

  it('returns empty for unknown subcategory', () => {
    expect(pickHeroMetrics(accelSpecs, 'unknown')).toEqual([])
  })

  it('returns empty when no template labels are present in specs', () => {
    expect(pickHeroMetrics([{ label: 'Transistors', value: '80 B' }], 'ai_accelerator')).toEqual([])
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
