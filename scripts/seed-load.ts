/**
 * One-off seed loader: inserts suppliers + products straight from data.ts via
 * the Supabase JS client, so the payload never has to route through a SQL file.
 *
 *   npx tsx scripts/seed-load.ts
 *
 * Requires a temporary anon INSERT policy (added/dropped around this run) since
 * the steady-state RLS only allows SELECT. Edge tables are derived server-side
 * afterwards. Re-runnable after a truncate.
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import { PRODUCTS, SUPPLIERS } from '../src/lib/data'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)

const db = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const suppliers = Object.values(SUPPLIERS).map(s => ({
  id: s.id, name: s.name, hq: s.hq, models: s.models, stages: s.stages,
}))

// Map the app's field names → DB column names.
const products = PRODUCTS.map(p => ({
  id: p.id, name: p.name, vendor: p.vendor, domain: p.domain, sub: p.sub,
  subcategory: p.subcat, family: p.family ?? null, status: p.status,
  process_node: p.node ?? null, available: p.avail ?? null,
  last_verified: p.verified ?? null, attrs: p.attrs ?? {}, specs: p.specs ?? [],
  bom: p.bom ?? null, supply_chain: p.supply ?? {}, rels: p.rels ?? [],
  source_ids: p.sources ?? [],
}))

async function main() {
  const s = await db.from('suppliers').insert(suppliers)
  if (s.error) throw new Error(`suppliers: ${s.error.message}`)

  const p = await db.from('products').insert(products)
  if (p.error) throw new Error(`products: ${p.error.message}`)

  console.log(`Inserted ${suppliers.length} suppliers, ${products.length} products`)
}

main().catch(e => { console.error(e); process.exit(1) })
