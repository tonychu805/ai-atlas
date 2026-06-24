import type { ProductSummary } from './data'

const SUCCEEDS = 'succeeds'

// The product this one directly succeeds (its immediate predecessor), if any.
function predecessorId(p: ProductSummary): string | undefined {
  return p.rels?.find(r => r.type === SUCCEEDS)?.target
}

// One-step predecessor and successor of `product` across the whole catalogue.
export function findAdjacent(
  product: ProductSummary,
  all: ProductSummary[],
): { predecessor?: ProductSummary; successor?: ProductSummary } {
  const byId = new Map(all.map(pr => [pr.id, pr]))
  const predId = predecessorId(product)
  const predecessor = predId ? byId.get(predId) : undefined
  const successor = all.find(pr => predecessorId(pr) === product.id)
  return { predecessor, successor }
}

// Order one vendor+sub group: succession chains (root → leaf) first, then
// products that take part in no chain, alphabetically by name.
export function orderGeneration(group: ProductSummary[]): ProductSummary[] {
  const ids = new Set(group.map(p => p.id))

  // predecessor id -> the product that succeeds it (within this group)
  const byPred = new Map<string, ProductSummary>()
  for (const p of group) {
    const pred = predecessorId(p)
    if (pred && ids.has(pred)) byPred.set(pred, p)
  }

  const participates = (p: ProductSummary): boolean => {
    const pred = predecessorId(p)
    return (!!pred && ids.has(pred)) || byPred.has(p.id)
  }

  // Roots: participants whose predecessor is not inside this group.
  const roots = group
    .filter(participates)
    .filter(p => {
      const pred = predecessorId(p)
      return !(pred && ids.has(pred))
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const ordered: ProductSummary[] = []
  const seen = new Set<string>()
  for (const root of roots) {
    let cur: ProductSummary | undefined = root
    while (cur && !seen.has(cur.id)) {
      ordered.push(cur)
      seen.add(cur.id)
      cur = byPred.get(cur.id)
    }
  }

  // Everything not reached by a chain walk, alphabetically.
  const rest = group
    .filter(p => !seen.has(p.id))
    .sort((a, b) => a.name.localeCompare(b.name))

  return [...ordered, ...rest]
}
