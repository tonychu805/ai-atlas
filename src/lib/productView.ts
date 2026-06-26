import { HERO_TEMPLATES } from './config'
import type { Product } from './config'

export function pickHeroMetrics(specs: Product['specs'], sub: string): Product['specs'] {
  const labels = HERO_TEMPLATES[sub] ?? []
  const byLabel = Object.fromEntries(specs.map(s => [s.label, s]))
  return labels.map(l => byLabel[l]).filter(Boolean) as Product['specs']
}

// The BOM column now defaults to objects that may lack a usable items array
// (8 malformed rows). Render only when there is at least one item.
export function hasValidBom(bom: Product['bom']): boolean {
  return !!bom && Array.isArray(bom.items) && bom.items.length > 0
}
