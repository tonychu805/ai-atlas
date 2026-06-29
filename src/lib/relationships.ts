export type RelRow = {
  from_product_id: string
  to_product_id: string
  type: string
  qty: number | null
}

export type RelItem = { id: string; name: string; qty?: number }

export type ProductRelations = {
  uses: RelItem[]
  usedBy: RelItem[]
  competesWith: RelItem[]
  succeeds: RelItem[]
}

function item(id: string, names: Record<string, string>, qty: number | null): RelItem {
  const base: RelItem = { id, name: names[id] ?? id }
  return qty ? { ...base, qty } : base
}

// Split a product's relationship rows (both directions) into the three groups
// the detail page renders. `succeeds` is shown by the generation strip and
// `fabbed_by`/`packaged_by` by the suppliers table, so both are ignored here.
export function groupRelationships(
  rows: RelRow[],
  productId: string,
  names: Record<string, string>,
): ProductRelations {
  const uses: RelItem[] = []
  const usedBy: RelItem[] = []
  const competesWith: RelItem[] = []
  const succeeds: RelItem[] = []

  for (const r of rows) {
    if (r.type === 'uses' && r.from_product_id === productId) {
      uses.push(item(r.to_product_id, names, r.qty))
    } else if (r.type === 'uses' && r.to_product_id === productId) {
      usedBy.push(item(r.from_product_id, names, r.qty))
    } else if (r.type === 'competes_with') {
      if (r.from_product_id === productId) competesWith.push(item(r.to_product_id, names, null))
      else if (r.to_product_id === productId) competesWith.push(item(r.from_product_id, names, null))
    } else if (r.type === 'succeeds' && r.from_product_id === productId) {
      succeeds.push(item(r.to_product_id, names, null))
    }
  }

  return { uses, usedBy, competesWith, succeeds }
}
