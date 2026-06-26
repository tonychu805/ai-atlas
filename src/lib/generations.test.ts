import { describe, it, expect } from 'vitest'
import { orderGeneration, findAdjacent } from './generations'
import type { ProductSummary } from './config'

function p(id: string, name: string, succeeds?: string): ProductSummary {
  return {
    id, name, vendor: 'NVIDIA', sub: 'ai_accelerator', subcat: 'ai_accelerator_gpu',
    status: 'production',
    rels: succeeds ? [{ type: 'succeeds', target: succeeds }] : [],
  }
}

describe('orderGeneration', () => {
  it('orders a linear succession chain root → leaf', () => {
    const group = [p('c', 'C', 'b'), p('a', 'A'), p('b', 'B', 'a')]
    expect(orderGeneration(group).map(x => x.id)).toEqual(['a', 'b', 'c'])
  })

  it('appends non-participating products alphabetically after chains', () => {
    const group = [p('b', 'B', 'a'), p('a', 'A'), p('z', 'Zeta'), p('m', 'Mike')]
    expect(orderGeneration(group).map(x => x.id)).toEqual(['a', 'b', 'm', 'z'])
  })

  it('treats succeeds targets outside the group as non-participation', () => {
    const group = [p('b', 'B', 'external'), p('a', 'A')]
    expect(orderGeneration(group).map(x => x.id)).toEqual(['a', 'b'])
  })

  it('does not loop forever on a cycle', () => {
    const group = [p('a', 'A', 'b'), p('b', 'B', 'a')]
    expect(orderGeneration(group)).toHaveLength(2)
  })
})

describe('findAdjacent', () => {
  const all = [p('a', 'A'), p('b', 'B', 'a'), p('c', 'C', 'b')]

  it('finds predecessor and successor of a middle product', () => {
    const { predecessor, successor } = findAdjacent(all[1], all)
    expect(predecessor?.id).toBe('a')
    expect(successor?.id).toBe('c')
  })

  it('returns no predecessor for the first generation', () => {
    const { predecessor, successor } = findAdjacent(all[0], all)
    expect(predecessor).toBeUndefined()
    expect(successor?.id).toBe('b')
  })

  it('returns no successor for the latest generation', () => {
    const { predecessor, successor } = findAdjacent(all[2], all)
    expect(predecessor?.id).toBe('b')
    expect(successor).toBeUndefined()
  })
})
