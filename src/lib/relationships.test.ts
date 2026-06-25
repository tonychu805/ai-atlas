import { describe, it, expect } from 'vitest'
import { groupRelationships, type RelRow } from './relationships'

const names: Record<string, string> = {
  'b200': 'NVIDIA B200',
  'hbm3e': 'SK Hynix HBM3E',
  'gb200': 'GB200 NVL72',
  'mi300x': 'AMD MI300X',
}

const rows: RelRow[] = [
  { from_product_id: 'b200', to_product_id: 'hbm3e', type: 'uses', qty: 8 },
  { from_product_id: 'gb200', to_product_id: 'b200', type: 'uses', qty: null },
  { from_product_id: 'b200', to_product_id: 'mi300x', type: 'competes_with', qty: null },
  { from_product_id: 'b200', to_product_id: 'h200', type: 'succeeds', qty: null },
]

describe('groupRelationships', () => {
  it('puts outgoing uses into `uses` with qty and resolved name', () => {
    const r = groupRelationships(rows, 'b200', names)
    expect(r.uses).toEqual([{ id: 'hbm3e', name: 'SK Hynix HBM3E', qty: 8 }])
  })

  it('puts incoming uses into `usedBy` (no qty when null)', () => {
    const r = groupRelationships(rows, 'b200', names)
    expect(r.usedBy).toEqual([{ id: 'gb200', name: 'GB200 NVL72' }])
  })

  it('puts outgoing competes_with into `competesWith`', () => {
    const r = groupRelationships(rows, 'b200', names)
    expect(r.competesWith).toEqual([{ id: 'mi300x', name: 'AMD MI300X' }])
  })

  it('ignores succeeds and unrelated rows', () => {
    const r = groupRelationships(rows, 'b200', names)
    expect(r.uses).toHaveLength(1)
    expect(r.usedBy).toHaveLength(1)
    expect(r.competesWith).toHaveLength(1)
  })

  it('falls back to id when name is unknown', () => {
    const r = groupRelationships(rows, 'b200', {})
    expect(r.uses[0].name).toBe('hbm3e')
  })

  it('downstream-only product yields uses=[] and usedBy filled', () => {
    const r = groupRelationships(rows, 'hbm3e', names)
    expect(r.uses).toEqual([])
    expect(r.usedBy).toEqual([{ id: 'b200', name: 'NVIDIA B200', qty: 8 }])
  })
})
