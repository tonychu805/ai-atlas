import type { Product } from './config'

// Substring keys matched against spec labels, in display priority order.
const HERO_PRIORITY = ['memory', 'bandwidth', 'compute', 'tdp', 'interconnect']

// Lift up to `max` headline specs for the hero strip, in priority order.
// Each spec is used at most once. Returns [] when nothing matches.
export function pickHeroMetrics(specs: Product['specs'], max = 5): Product['specs'] {
  const picked: Product['specs'] = []
  const used = new Set<number>()
  for (const key of HERO_PRIORITY) {
    const idx = specs.findIndex((s, i) => !used.has(i) && s.label.toLowerCase().includes(key))
    if (idx >= 0) {
      used.add(idx)
      picked.push(specs[idx])
      if (picked.length >= max) break
    }
  }
  return picked
}

// The BOM column now defaults to objects that may lack a usable items array
// (8 malformed rows). Render only when there is at least one item.
export function hasValidBom(bom: Product['bom']): boolean {
  return !!bom && Array.isArray(bom.items) && bom.items.length > 0
}
