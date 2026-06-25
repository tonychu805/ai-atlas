import { supabase } from './supabase'
import type { Product, ProductSummary, Supplier, Source } from './data'
import { groupRelationships, type ProductRelations, type RelRow } from './relationships'

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

// Subset of PRODUCT_SELECT for the roadmap view + detail-page generation strip.
const PRODUCT_SUMMARY_SELECT = 'id,name,vendor,sub,subcat:subcategory,family,status,node:process_node,rels'

// The specs column is an array for populated products but defaults to an empty
// object ({}) for ~9 stub products. The Product type promises an array, so
// coerce non-arrays to [] to keep every consumer (.length/.slice/.findIndex) safe.
function normalizeProduct(row: unknown): Product {
  const p = row as Product
  if (!Array.isArray(p.specs)) p.specs = []
  return p
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select(PRODUCT_SELECT)
  if (error) throw new Error(`getProducts: ${error.message}`)
  return ((data ?? []) as unknown[]).map(normalizeProduct)
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products').select(PRODUCT_SELECT).eq('id', id).maybeSingle()
  if (error) throw new Error(`getProduct(${id}): ${error.message}`)
  return data ? normalizeProduct(data) : null
}

// Lightweight id → name map for resolving cross-references (e.g. a product's
// related products) without pulling every full record.
export async function getProductNames(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from('products').select('id,name')
  if (error) throw new Error(`getProductNames: ${error.message}`)
  return Object.fromEntries(((data ?? []) as { id: string; name: string }[]).map(p => [p.id, p.name]))
}

export async function getProductSummaries(): Promise<ProductSummary[]> {
  const { data, error } = await supabase.from('products').select(PRODUCT_SUMMARY_SELECT)
  if (error) throw new Error(`getProductSummaries: ${error.message}`)
  return (data ?? []) as unknown as ProductSummary[]
}

export async function getSuppliers(): Promise<Record<string, Supplier>> {
  const { data, error } = await supabase.from('suppliers').select(SUPPLIER_SELECT)
  if (error) throw new Error(`getSuppliers: ${error.message}`)
  return Object.fromEntries(
    ((data ?? []) as unknown as Supplier[]).map(s => [s.id, s])
  )
}

// All relationships touching this product (both directions), grouped for the
// detail page. Reads the normalized product_relationships table (155-product
// coverage) rather than the stale products.rels jsonb.
export async function getProductRelationships(id: string): Promise<ProductRelations> {
  const { data, error } = await supabase
    .from('product_relationships')
    .select('from_product_id,to_product_id,type,qty')
    .or(`from_product_id.eq.${id},to_product_id.eq.${id}`)
  if (error) throw new Error(`getProductRelationships(${id}): ${error.message}`)
  const names = await getProductNames()
  return groupRelationships((data ?? []) as RelRow[], id, names)
}

// id → Source map from the sources table (real titles + URLs + retrieved dates).
export async function getSources(): Promise<Record<string, Source>> {
  const { data, error } = await supabase
    .from('sources')
    .select('id,title,publisher,url,type,retrieved')
  if (error) throw new Error(`getSources: ${error.message}`)
  return Object.fromEntries(((data ?? []) as Source[]).map(s => [s.id, s]))
}
