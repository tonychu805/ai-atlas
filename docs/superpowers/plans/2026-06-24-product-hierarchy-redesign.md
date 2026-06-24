# Product Hierarchy & Detail Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a vendor/family/generation "Roadmap" browse mode and enrich product detail pages with a generation strip, a composition (components) section, and a consistent data-tier layout — all derived from existing Supabase data with no schema changes.

**Architecture:** A new pure module (`src/lib/generations.ts`) holds the succession-ordering logic and is unit-tested with vitest. A lightweight `getProductSummaries()` query feeds the roadmap and the detail-page generation strip. The browse page (`/products`) becomes a server component that reads a `?mode=roadmap` search param and renders either the existing `ProductsTable` (List) or a new server `RoadmapView` (Roadmap). The detail page gains three presentational components and a tier badge, all data-driven and hidden gracefully when data is absent.

**Tech Stack:** Next.js 16 (App Router, React 19 server/client components), TypeScript 5, Supabase JS client, Tailwind v4, vitest (new, for pure-logic tests only).

## Global Constraints

- No new URL routes. The hierarchy layer lives in browse-page UI only; existing product URLs are unchanged.
- No Supabase schema changes. Tier is inferred client-side; no new DB column.
- `succeeds` rel semantics: a product X with rel `{ type: 'succeeds', target: 'Y' }` means **X is the next generation after Y** — so Y is the predecessor and X is the successor.
- `ProductsTable.tsx` must remain unchanged (List mode is untouched).
- Components hide gracefully when their data is absent (return `null`), except where this plan explicitly specifies a muted placeholder (Specs).
- Match existing styling: inline `style={{ ... }}` with the established palette (`#0f172a` text, `#8a8579` muted, `#fbfaf8`/`#fff` surfaces, `var(--border)`, `var(--background)`), Tailwind utility classes for layout. No new CSS files, no marketing copy.
- Tier inference rule (verbatim): **Full** = has specs AND bom AND a `PRODUCT_BRIEF` entry; **Standard** = has specs OR supply chain; **Stub** = everything else.
- Validation gates: pure logic is gated by `npm test` (vitest); all UI/data tasks are gated by `npx tsc --noEmit` (type check) and a final `npm run build`. There is no component test runner in this project — UI tasks are verified by type-check, build, and the manual browser check noted in each task.

---

### Task 1: `ProductSummary` type + `getProductSummaries()` query

**Files:**
- Modify: `src/lib/data.ts` (add `ProductSummary` interface in the Types section, after the `Product` interface, around line 333)
- Modify: `src/lib/db.ts` (add summary select + function)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `interface ProductSummary { id: string; name: string; vendor: string; sub: string; subcat: string; family?: string; status: string; node?: string; rels: { type: string; target: string; qty?: number }[] }`
  - `getProductSummaries(): Promise<ProductSummary[]>`

- [ ] **Step 1: Add the `ProductSummary` type to `src/lib/data.ts`**

Insert immediately after the closing brace of the `Product` interface (after line 333):

```typescript
// Lightweight shape for the roadmap view and the detail-page generation strip.
// A subset of Product columns — no specs / bom / supply / sources.
export interface ProductSummary {
  id: string
  name: string
  vendor: string
  sub: string
  subcat: string
  family?: string
  status: string
  node?: string
  rels: { type: string; target: string; qty?: number }[]
}
```

- [ ] **Step 2: Add the query to `src/lib/db.ts`**

Change the import on line 2 from:

```typescript
import type { Product, Supplier } from './data'
```

to:

```typescript
import type { Product, ProductSummary, Supplier } from './data'
```

Add the select constant after `SUPPLIER_SELECT` (after line 14):

```typescript
// Subset of PRODUCT_SELECT for the roadmap view + detail-page generation strip.
const PRODUCT_SUMMARY_SELECT = 'id,name,vendor,sub,subcat:subcategory,family,status,node:process_node,rels'
```

Add the function at the end of the file (after `getProductNames`, before or after `getSuppliers`):

```typescript
export async function getProductSummaries(): Promise<ProductSummary[]> {
  const { data, error } = await supabase.from('products').select(PRODUCT_SUMMARY_SELECT)
  if (error) throw new Error(`getProductSummaries: ${error.message}`)
  return (data ?? []) as unknown as ProductSummary[]
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/data.ts src/lib/db.ts
git commit -m "feat: add ProductSummary type and getProductSummaries query"
```

---

### Task 2: Generation-ordering logic + tests

This is the only piece with real branching logic (chains, forks, orphans, cycles), so it is extracted into a pure, unit-tested module. Adds vitest as a dev dependency for pure-logic tests.

**Files:**
- Create: `src/lib/generations.ts`
- Create: `src/lib/generations.test.ts`
- Modify: `package.json` (add `test` script)

**Interfaces:**
- Consumes: `ProductSummary` (Task 1).
- Produces:
  - `orderGeneration(group: ProductSummary[]): ProductSummary[]` — orders one vendor+sub group: succession chains first (root → leaf), then non-participating products alphabetically by `name`.
  - `findAdjacent(product: ProductSummary, all: ProductSummary[]): { predecessor?: ProductSummary; successor?: ProductSummary }` — the one-step predecessor and successor of `product`.

- [ ] **Step 1: Add vitest and the `test` script**

Run: `npm install -D vitest`

Then add to the `scripts` block in `package.json` (after the `"lint"` line):

```json
    "test": "vitest run"
```

(Remember the preceding line needs a trailing comma.)

- [ ] **Step 2: Write the failing tests**

Create `src/lib/generations.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { orderGeneration, findAdjacent } from './generations'
import type { ProductSummary } from './data'

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
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — cannot resolve `./generations` (module does not exist yet).

- [ ] **Step 4: Write the implementation**

Create `src/lib/generations.ts`:

```typescript
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
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: PASS — all 7 tests green.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/lib/generations.ts src/lib/generations.test.ts
git commit -m "feat: add generation-ordering logic with vitest tests"
```

---

### Task 3: `RoadmapView` component

A server component (no hooks, no state — Links only) that groups summaries by vendor, then by sub, and renders generation timeline rows.

**Files:**
- Create: `src/app/products/RoadmapView.tsx`

**Interfaces:**
- Consumes: `getProductSummaries()` output → `ProductSummary[]` (Task 1); `orderGeneration` (Task 2); `DOMAINS`, `STATUS_STYLE`, `LIFECYCLE` from `@/lib/data`.
- Produces: `default export function RoadmapView({ products }: { products: ProductSummary[] })`.

- [ ] **Step 1: Write the component**

Create `src/app/products/RoadmapView.tsx`:

```tsx
import Link from 'next/link'
import { DOMAINS, STATUS_STYLE, LIFECYCLE, type ProductSummary } from '@/lib/data'
import { orderGeneration } from '@/lib/generations'

// sub key -> human label, flattened from every domain's sub list.
const SUB_LABEL: Record<string, string> = Object.fromEntries(
  Object.values(DOMAINS).flatMap(d => d.subs.map(s => [s.key, s.label] as const)),
)

function Pill({ p }: { p: ProductSummary }) {
  const s = STATUS_STYLE[p.status] ?? { bg: '#f1f0ec', fg: '#6b7280' }
  const eol = p.status === 'eol'
  return (
    <Link
      href={`/products/${p.id}`}
      className="flex-shrink-0 inline-flex flex-col gap-0.5 px-3 py-1.5 rounded-lg border transition-shadow hover:shadow-sm"
      style={{
        borderColor: '#d6d3cb', background: s.bg, textDecoration: 'none',
        opacity: eol ? 0.55 : 1,
      }}
      title={LIFECYCLE[p.status] ?? p.status}
    >
      <span className="text-sm font-medium leading-tight" style={{ color: s.fg }}>{p.name}</span>
      {p.node && <span className="text-xs font-mono leading-tight" style={{ color: '#8a8579' }}>{p.node}</span>}
    </Link>
  )
}

function Row({ label, items }: { label: string; items: ProductSummary[] }) {
  return (
    <div className="mb-4">
      {label && <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#a8a294' }}>{label}</p>}
      <div className="flex items-center gap-2 overflow-x-auto ax-scroll pb-1">
        {items.map((p, i) => (
          <div key={p.id} className="flex items-center gap-2">
            {i > 0 && <span style={{ color: '#cbc7bd' }}>→</span>}
            <Pill p={p} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function RoadmapView({ products }: { products: ProductSummary[] }) {
  // Group by vendor.
  const byVendor = new Map<string, ProductSummary[]>()
  for (const p of products) {
    const list = byVendor.get(p.vendor)
    if (list) list.push(p)
    else byVendor.set(p.vendor, [p])
  }
  const vendors = [...byVendor.keys()].sort((a, b) => a.localeCompare(b))

  return (
    <div style={{ background: 'var(--background)' }} className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#0f172a' }}>Product roadmap</h1>
          <p className="text-sm" style={{ color: '#8a8579' }}>{products.length} products by company and generation</p>
        </div>

        {vendors.map(vendor => {
          const list = byVendor.get(vendor)!
          // Vendors with 1–2 products: a single flat row, no sub grouping.
          if (list.length <= 2) {
            return (
              <section key={vendor} className="mb-8">
                <h2 className="text-lg font-semibold mb-3" style={{ color: '#0f172a' }}>{vendor}</h2>
                <Row label="" items={orderGeneration(list)} />
              </section>
            )
          }

          // Otherwise group by sub.
          const bySub = new Map<string, ProductSummary[]>()
          for (const p of list) {
            const sub = bySub.get(p.sub)
            if (sub) sub.push(p)
            else bySub.set(p.sub, [p])
          }
          const subs = [...bySub.keys()].sort((a, b) =>
            (SUB_LABEL[a] ?? a).localeCompare(SUB_LABEL[b] ?? b))

          return (
            <section key={vendor} className="mb-8">
              <h2 className="text-lg font-semibold mb-3" style={{ color: '#0f172a' }}>{vendor}</h2>
              {subs.map(sub => (
                <Row key={sub} label={SUB_LABEL[sub] ?? sub} items={orderGeneration(bySub.get(sub)!)} />
              ))}
            </section>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/products/RoadmapView.tsx
git commit -m "feat: add RoadmapView vendor/generation timeline component"
```

---

### Task 4: `BrowseModeToggle` + wire the browse page

Make `/products` a server component that reads `?mode=roadmap` and renders either `ProductsTable` (List) or `RoadmapView` (Roadmap), with a toggle above both. `ProductsTable` stays unchanged.

**Files:**
- Create: `src/app/products/BrowseModeToggle.tsx`
- Modify: `src/app/products/page.tsx` (full rewrite of the 14-line file)

**Interfaces:**
- Consumes: `getProducts` (existing), `getProductSummaries` (Task 1), `ProductsTable` (existing), `RoadmapView` (Task 3).
- Produces:
  - `default export function BrowseModeToggle({ roadmap }: { roadmap: boolean })`
  - The updated page reads `searchParams: Promise<{ mode?: string }>`.

- [ ] **Step 1: Write `BrowseModeToggle`**

Create `src/app/products/BrowseModeToggle.tsx`:

```tsx
import Link from 'next/link'

export default function BrowseModeToggle({ roadmap }: { roadmap: boolean }) {
  const base = 'px-3 py-1.5 rounded-md text-sm font-medium transition-colors'
  const active = { color: '#0f172a', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }
  const inactive = { color: '#8a8579', background: 'transparent', boxShadow: 'none' }
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border p-1" style={{ borderColor: '#d6d3cb', background: '#fbfaf8' }}>
      <Link href="/products" className={base} style={{ textDecoration: 'none', ...(roadmap ? inactive : active) }}>List</Link>
      <Link href="/products?mode=roadmap" className={base} style={{ textDecoration: 'none', ...(roadmap ? active : inactive) }}>Roadmap</Link>
    </div>
  )
}
```

- [ ] **Step 2: Rewrite `src/app/products/page.tsx`**

Replace the entire file with:

```tsx
export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { getProducts, getProductSummaries } from '@/lib/db'
import ProductsTable from './ProductsTable'
import RoadmapView from './RoadmapView'
import BrowseModeToggle from './BrowseModeToggle'

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const { mode } = await searchParams
  const roadmap = mode === 'roadmap'

  const view = roadmap
    ? <RoadmapView products={await getProductSummaries()} />
    : <ProductsTable products={await getProducts()} />

  return (
    <div style={{ background: 'var(--background)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <BrowseModeToggle roadmap={roadmap} />
      </div>
      <Suspense>{view}</Suspense>
    </div>
  )
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Manual browser check**

Run `npm run dev`, then:
- Visit `/products` → List mode (existing table), toggle shows "List" active.
- Visit `/products?mode=roadmap` → vendor sections with generation rows; "Roadmap" active.
- Click a pill → navigates to that product's detail page.

- [ ] **Step 5: Commit**

```bash
git add src/app/products/BrowseModeToggle.tsx src/app/products/page.tsx
git commit -m "feat: add List/Roadmap mode toggle to browse page"
```

---

### Task 5: `CompositionSection` component

Renders a product's `uses` rels as a component breakdown. Labeled "Components" for system products (`sub === 'soc'`), "Key components" otherwise. Returns `null` when there are no `uses` rels.

**Files:**
- Create: `src/app/products/[id]/CompositionSection.tsx`

**Interfaces:**
- Consumes: `Product` from `@/lib/data`; `productNames: Record<string, string>`.
- Produces: `default export function CompositionSection({ product, productNames }: { product: Product; productNames: Record<string, string> })`.

- [ ] **Step 1: Write the component**

Create `src/app/products/[id]/CompositionSection.tsx`:

```tsx
import Link from 'next/link'
import type { Product } from '@/lib/data'

export default function CompositionSection({ product, productNames }: {
  product: Product
  productNames: Record<string, string>
}) {
  const parts = (product.rels ?? []).filter(r => r.type === 'uses')
  if (parts.length === 0) return null

  const label = product.sub === 'soc' ? 'Components' : 'Key components'

  return (
    <section className="rounded-xl border p-5 mb-8" style={{ borderColor: 'var(--border)', background: '#fff' }}>
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#a8a294' }}>{label}</h2>
      <div className="flex flex-col gap-2">
        {parts.map(part => (
          <Link
            key={part.target}
            href={`/products/${part.target}`}
            className="flex items-center justify-between gap-3 text-sm rounded-lg px-3 py-2 border transition-colors"
            style={{ borderColor: '#e6e3db', background: '#fbfaf8', textDecoration: 'none' }}
          >
            <span style={{ color: '#0f172a' }}>{productNames[part.target] ?? part.target}</span>
            <span className="flex items-center gap-3">
              {part.qty && <span className="font-mono" style={{ color: '#8a8579' }}>×{part.qty}</span>}
              <span style={{ color: '#cbc7bd' }}>→</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add "src/app/products/[id]/CompositionSection.tsx"
git commit -m "feat: add CompositionSection component for uses rels"
```

---

### Task 6: `GenerationStrip` component

Shows the immediate predecessor and successor of the current product (one step each), derived from `succeeds` rels across the full catalogue. Returns `null` when neither exists.

**Files:**
- Create: `src/app/products/[id]/GenerationStrip.tsx`

**Interfaces:**
- Consumes: `findAdjacent` (Task 2); `Product`, `ProductSummary` from `@/lib/data`. `Product` is structurally assignable to the `ProductSummary` parameter of `findAdjacent` (it has every `ProductSummary` field).
- Produces: `default export function GenerationStrip({ product, summaries }: { product: Product; summaries: ProductSummary[] })`.

- [ ] **Step 1: Write the component**

Create `src/app/products/[id]/GenerationStrip.tsx`:

```tsx
import Link from 'next/link'
import type { Product, ProductSummary } from '@/lib/data'
import { findAdjacent } from '@/lib/generations'

function Chip({ p, dir }: { p: ProductSummary; dir: 'prev' | 'next' }) {
  return (
    <Link
      href={`/products/${p.id}`}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-shadow hover:shadow-sm"
      style={{ borderColor: '#d6d3cb', background: '#fbfaf8', color: '#3d3b37', textDecoration: 'none' }}
    >
      {dir === 'prev' && <span style={{ color: '#a8a294' }}>←</span>}
      {p.name}
      {dir === 'next' && <span style={{ color: '#a8a294' }}>→</span>}
    </Link>
  )
}

export default function GenerationStrip({ product, summaries }: {
  product: Product
  summaries: ProductSummary[]
}) {
  const { predecessor, successor } = findAdjacent(product, summaries)
  if (!predecessor && !successor) return null

  return (
    <div className="flex items-center gap-3 flex-wrap mb-8">
      {predecessor && <Chip p={predecessor} dir="prev" />}
      <span className="text-xs px-2.5 py-1.5 rounded-lg font-medium" style={{ background: '#0f172a', color: '#fff' }}>
        {product.name}
      </span>
      {successor && <Chip p={successor} dir="next" />}
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors. (If TS complains about passing `Product` where `ProductSummary` is expected, that is a real bug — both share the listed fields and structural typing should accept it.)

- [ ] **Step 3: Commit**

```bash
git add "src/app/products/[id]/GenerationStrip.tsx"
git commit -m "feat: add GenerationStrip predecessor/successor component"
```

---

### Task 7: Integrate detail-page additions

Wire the three new components plus the tier badge and Specs placeholder into the detail page, and split the old generic "Connects to" section into Composition + a refined "Related" section. Fetch summaries on the detail route.

**Files:**
- Modify: `src/app/products/[id]/page.tsx` (add `getProductSummaries` to the parallel fetch; pass `summaries` prop)
- Modify: `src/app/products/[id]/ProductDetail.tsx`

**Interfaces:**
- Consumes: `getProductSummaries` (Task 1); `GenerationStrip` (Task 6); `CompositionSection` (Task 5); `ProductSummary` type.
- Produces: `ProductDetail` now takes a `summaries: ProductSummary[]` prop in addition to its existing props.

- [ ] **Step 1: Update `src/app/products/[id]/page.tsx`**

Replace the file contents with:

```tsx
import Link from 'next/link'
import { getProduct, getProductNames, getProductSummaries, getSuppliers } from '@/lib/db'
import ProductDetail from './ProductDetail'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, productNames, suppliers, summaries] = await Promise.all([
    getProduct(id), getProductNames(), getSuppliers(), getProductSummaries(),
  ])

  if (!product) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p style={{ color: '#8a8579' }}>Product not found.</p>
      <Link href="/products" style={{ color: '#9a6b3f' }}>← Back to products</Link>
    </div>
  )

  return <ProductDetail product={product} productNames={productNames} suppliers={suppliers} summaries={summaries} />
}
```

- [ ] **Step 2: Update imports and the component signature in `ProductDetail.tsx`**

Change the import block (lines 3–6) to add the new imports and types. Replace:

```tsx
import { useState } from 'react'
import Link from 'next/link'
import { PRODUCT_BRIEF, SOURCES, STAGES, STATUS_STYLE, CONF_STYLE, FACET_DEFS, DOMAINS, LIFECYCLE, fmtUSD, type Product, type Supplier } from '@/lib/data'
import { Linkify } from '@/lib/linkify'
```

with:

```tsx
import { useState } from 'react'
import Link from 'next/link'
import { PRODUCT_BRIEF, SOURCES, STAGES, STATUS_STYLE, CONF_STYLE, FACET_DEFS, DOMAINS, LIFECYCLE, fmtUSD, type Product, type ProductSummary, type Supplier } from '@/lib/data'
import { Linkify } from '@/lib/linkify'
import GenerationStrip from './GenerationStrip'
import CompositionSection from './CompositionSection'
```

Replace the component signature (lines 22–26):

```tsx
export default function ProductDetail({ product, productNames, suppliers }: {
  product: Product
  productNames: Record<string, string>
  suppliers: Record<string, Supplier>
}) {
```

with:

```tsx
export default function ProductDetail({ product, productNames, suppliers, summaries }: {
  product: Product
  productNames: Record<string, string>
  suppliers: Record<string, Supplier>
  summaries: ProductSummary[]
}) {
```

- [ ] **Step 3: Replace the `connects` derivation with tier + related derivation**

Replace these lines (lines 29–36):

```tsx
  const brief = PRODUCT_BRIEF[product.id]
  const domain = DOMAINS[product.domain as keyof typeof DOMAINS]
  const rels = product.rels ?? []

  // Build connects-to list
  const connects = rels.map(r => ({
    type: r.type, name: productNames[r.target] ?? r.target, id: r.target, qty: r.qty,
  }))
```

with:

```tsx
  const brief = PRODUCT_BRIEF[product.id]
  const domain = DOMAINS[product.domain as keyof typeof DOMAINS]
  const rels = product.rels ?? []

  // "Related" = everything except composition (uses) and succession (shown in
  // the generation strip), so the same fact never appears twice.
  const related = rels
    .filter(r => r.type !== 'uses' && r.type !== 'succeeds')
    .map(r => ({ type: r.type, name: productNames[r.target] ?? r.target, id: r.target, qty: r.qty }))

  // Data tier, inferred — no DB field.
  const hasSpecs = product.specs.length > 0
  const hasSupply = Object.values(product.supply).some(a => a && a.length > 0)
  const tier = hasSpecs && product.bom && brief ? 'full' : (hasSpecs || hasSupply ? 'standard' : 'stub')
```

- [ ] **Step 4: Add the tier badge to the title row**

In the title row, find this block (around lines 53–56):

```tsx
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={product.status} />
              {product.node && <span className="text-xs px-2 py-1 rounded font-mono" style={{ background: '#f3f2ee', color: '#6b6557' }}>{product.node}</span>}
            </div>
```

Replace it with (adds the tier badge after the node chip):

```tsx
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={product.status} />
              {product.node && <span className="text-xs px-2 py-1 rounded font-mono" style={{ background: '#f3f2ee', color: '#6b6557' }}>{product.node}</span>}
              <span className="text-xs px-2 py-1 rounded font-medium"
                style={tier === 'full'
                  ? { background: '#dcfce7', color: '#166534' }
                  : { background: '#f1f0ec', color: '#6b7280' }}>
                {tier === 'full' ? 'Full data' : 'Partial data'}
              </span>
            </div>
```

- [ ] **Step 5: Add the `GenerationStrip` below the title row**

The title row is the `<div className="flex flex-wrap items-start justify-between gap-4 mb-8">…</div>` block that ends at line 72. Immediately after its closing `</div>` (line 72) and before the `{/* In plain terms */}` comment (line 74), insert:

```tsx
        {/* Generation strip */}
        <GenerationStrip product={product} summaries={summaries} />

```

- [ ] **Step 6: Make the Specs section always render (placeholder when empty)**

Replace the Specs block (lines 130–145), which currently begins `{product.specs.length > 0 && (`:

```tsx
          {/* Specs */}
          {product.specs.length > 0 && (
            <section className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', background: '#fff' }}>
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#a8a294' }}>Specs</h2>
              <table className="w-full text-sm">
                <tbody>
                  {product.specs.map(s => (
                    <tr key={s.label} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-2 pr-4 text-left" style={{ color: '#8a8579', width: '45%' }}>{s.label}</td>
                      <td className="py-2 font-medium" style={{ color: '#0f172a' }}>{s.value}</td>
                      <td className="py-2 pl-2 text-right"><ConfBadge conf={s.conf} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
```

with (drops the `&&` guard, adds a muted placeholder):

```tsx
          {/* Specs */}
          <section className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', background: '#fff' }}>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#a8a294' }}>Specs</h2>
            {product.specs.length > 0 ? (
              <table className="w-full text-sm">
                <tbody>
                  {product.specs.map(s => (
                    <tr key={s.label} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-2 pr-4 text-left" style={{ color: '#8a8579', width: '45%' }}>{s.label}</td>
                      <td className="py-2 font-medium" style={{ color: '#0f172a' }}>{s.value}</td>
                      <td className="py-2 pl-2 text-right"><ConfBadge conf={s.conf} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm" style={{ color: '#a8a294' }}>No specifications recorded yet.</p>
            )}
          </section>
```

- [ ] **Step 7: Insert `CompositionSection` after the Supply chain section**

The Supply chain `</section>` ends at line 203. Immediately after it, insert:

```tsx
        {/* Composition */}
        <CompositionSection product={product} productNames={productNames} />

```

- [ ] **Step 8: Replace the "Connects to" section with the refined "Related" section**

Replace the entire "Connects to" block (lines 205–223), which begins `{connects.length > 0 && (`:

```tsx
        {/* Connects to */}
        {connects.length > 0 && (
          <section className="rounded-xl border p-5 mb-8" style={{ borderColor: 'var(--border)', background: '#fff' }}>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#a8a294' }}>Connects to</h2>
            <div className="flex flex-col gap-2">
              {connects.map(c => (
                <div key={c.id} className="flex items-center gap-3 text-sm">
                  <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: '#f3f2ee', color: '#6b6557' }}>
                    {c.type.replace(/_/g, ' ')}
                  </span>
                  <Link href={`/products/${c.id}`} style={{ color: '#0f172a', textDecoration: 'none' }}>
                    {c.name}
                  </Link>
                  {c.qty && <span style={{ color: '#8a8579' }}>×{c.qty}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
```

with:

```tsx
        {/* Related */}
        {related.length > 0 && (
          <section className="rounded-xl border p-5 mb-8" style={{ borderColor: 'var(--border)', background: '#fff' }}>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#a8a294' }}>Related</h2>
            <div className="flex flex-col gap-2">
              {related.map(c => (
                <div key={c.id} className="flex items-center gap-3 text-sm">
                  <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: '#f3f2ee', color: '#6b6557' }}>
                    {c.type.replace(/_/g, ' ')}
                  </span>
                  <Link href={`/products/${c.id}`} style={{ color: '#0f172a', textDecoration: 'none' }}>
                    {c.name}
                  </Link>
                  {c.qty && <span style={{ color: '#8a8579' }}>×{c.qty}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
```

- [ ] **Step 9: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 10: Manual browser check**

Run `npm run dev`, then:
- `/products/nvidia-b200` (Full tier) → "Full data" badge; generation strip shows H200 ← B200 → B300 (per the data); "Key components" lists its HBM `uses` rel; "Related" shows competes_with but not succeeds/uses.
- A system product (`sub === 'soc'`, e.g. a Vera Rubin rack) → "Components" section lists its constituent chips with quantities.
- A stub product (no specs) → Specs section shows "No specifications recorded yet."; badge shows "Partial data".

- [ ] **Step 11: Full build**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 12: Commit**

```bash
git add "src/app/products/[id]/page.tsx" "src/app/products/[id]/ProductDetail.tsx"
git commit -m "feat: enrich product detail with generation strip, composition, tier badge"
```

---

## Self-Review

**Spec coverage:**
- IA / no new routes → Task 4 (search-param mode, same URLs). ✓
- Roadmap mode (vendor → sub rows, generation ordering, status pills, EOL dimmed, 1–2 product flat rows) → Tasks 2, 3. ✓
- List mode unchanged → Task 4 leaves `ProductsTable` untouched. ✓
- Generation strip (predecessor/successor, hidden when none) → Tasks 2, 6, 7. ✓
- Composition section ("Components" for `soc`, "Key components" otherwise, links + qty) → Tasks 5, 7. ✓
- "Connects to" replaced by Composition + refined "Related" (excludes `uses`; also excludes `succeeds` to avoid duplicating the strip) → Task 7. ✓
- Data tiers inferred + badge → Task 7. ✓
- Consistent layout / Specs placeholder → Task 7 step 6. ✓
- New `getProductSummaries()` (id, name, vendor, sub, subcat, family, status, node, rels) → Task 1. ✓
- Generation chain algorithm (map predecessors, find roots, walk forward, orphans alphabetical) → Task 2. ✓
- Out of scope (vendor/family routes, `/map`, backfilling `family`, mobile-specific layout) → not touched. ✓

**Memory-vendor note:** the spec calls for memory vendors to group by product type rather than succession. `ProductSummary` carries `sub` (the memory subtype, e.g. `dram_hbm`) but not `domain`; grouping by `sub` yields HBM / DRAM / NAND rows, and `orderGeneration` degrades to alphabetical when no `succeeds` rels exist (the parallel-line case). This satisfies the requirement without adding a `domain` column to the summary query.

**Placeholder scan:** no "TBD"/"TODO"/"handle edge cases"; every code step shows complete code. ✓

**Type consistency:** `ProductSummary` fields are identical across Task 1 (definition), Task 2 (`orderGeneration`/`findAdjacent`), Task 3, Task 6, Task 7. `findAdjacent(product, summaries)` returns `{ predecessor?, successor? }`, consumed exactly that way in Task 6. `CompositionSection` and `GenerationStrip` prop names match their call sites in Task 7. `getProductSummaries` signature matches its three call sites (Tasks 4, 7). ✓
