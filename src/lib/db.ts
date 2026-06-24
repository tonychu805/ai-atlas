import { supabase } from './supabase'
import type { Product, Supplier } from './data'

// DB columns differ from the app's field names in a few places; alias them in
// the select so rows come back already shaped as Product / Supplier and the
// rendering code needs no changes.
const PRODUCT_SELECT = [
  'id', 'name', 'vendor', 'domain', 'sub',
  'subcat:subcategory', 'family', 'status', 'node:process_node', 'avail:available',
  'verified:last_verified', 'attrs', 'specs', 'bom', 'supply:supply_chain',
  'rels', 'sources:source_ids',
].join(',')

const SUPPLIER_SELECT = 'id,name,hq,models,stages'

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select(PRODUCT_SELECT)
  if (error) throw new Error(`getProducts: ${error.message}`)
  return (data ?? []) as unknown as Product[]
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products').select(PRODUCT_SELECT).eq('id', id).maybeSingle()
  if (error) throw new Error(`getProduct(${id}): ${error.message}`)
  return (data as unknown as Product) ?? null
}

// Lightweight id → name map for resolving cross-references (e.g. a product's
// related products) without pulling every full record.
export async function getProductNames(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from('products').select('id,name')
  if (error) throw new Error(`getProductNames: ${error.message}`)
  return Object.fromEntries(((data ?? []) as { id: string; name: string }[]).map(p => [p.id, p.name]))
}

export async function getSuppliers(): Promise<Record<string, Supplier>> {
  const { data, error } = await supabase.from('suppliers').select(SUPPLIER_SELECT)
  if (error) throw new Error(`getSuppliers: ${error.message}`)
  return Object.fromEntries(
    ((data ?? []) as unknown as Supplier[]).map(s => [s.id, s])
  )
}
