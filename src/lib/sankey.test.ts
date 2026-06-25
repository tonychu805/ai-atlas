import { describe, it, expect } from 'vitest'
import { sankeyLayout } from './sankey'

describe('sankeyLayout', () => {
  it('produces one rect per side node and one ribbon per node', () => {
    const l = sankeyLayout(1, 1)
    expect(l.left).toHaveLength(1)
    expect(l.right).toHaveLength(1)
    expect(l.ribbons).toHaveLength(2)
  })

  it('omits a side with zero nodes (no rects, no ribbons there)', () => {
    const l = sankeyLayout(3, 0)
    expect(l.left).toHaveLength(3)
    expect(l.right).toHaveLength(0)
    expect(l.ribbons.filter(r => r.side === 'right')).toHaveLength(0)
    expect(l.ribbons.filter(r => r.side === 'left')).toHaveLength(3)
  })

  it('height grows with the busier side', () => {
    const small = sankeyLayout(1, 1)
    const big = sankeyLayout(4, 1)
    expect(big.height).toBeGreaterThan(small.height)
  })

  it('every ribbon path is a non-empty SVG path string', () => {
    const l = sankeyLayout(2, 2)
    for (const r of l.ribbons) {
      expect(r.path.startsWith('M')).toBe(true)
      expect(r.path.length).toBeGreaterThan(10)
    }
  })

  it('keeps all rects within the layout bounds', () => {
    const l = sankeyLayout(3, 2)
    for (const rect of [...l.left, ...l.right, l.center]) {
      expect(rect.x).toBeGreaterThanOrEqual(0)
      expect(rect.x + rect.w).toBeLessThanOrEqual(l.width)
      expect(rect.y).toBeGreaterThanOrEqual(0)
      expect(rect.y + rect.h).toBeLessThanOrEqual(l.height)
    }
  })
})
