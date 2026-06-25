# Product Detail Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an unweighted product-to-product supply-flow Sankey, a hero spec-metrics strip, and table-backed source citations to the product detail page, reading from the normalized Supabase tables.

**Architecture:** Pure transformation/geometry logic lives in small, unit-tested modules under `src/lib/` (matching the existing `generations.ts` pattern). Thin Supabase I/O wrappers in `src/lib/db.ts` consume those pure functions. The client component `ProductDetail.tsx` and its child `SankeySection.tsx` render from props produced by the server page. Each task leaves the build green.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind v4, Supabase (`@supabase/supabase-js`), Vitest (node environment).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-06-25-product-detail-redesign-design.md`.
- Relationship data comes from the `product_relationships` table (155 products), NOT the stale `products.rels` jsonb (54). Columns: `from_product_id`, `to_product_id`, `type` (`uses` | `succeeds` | `competes_with` | `fabbed_by` | `packaged_by`), `qty` (nullable int).
- Source data comes from the `sources` table. Columns: `id`, `title`, `publisher`, `url`, `type`, `retrieved`.
- The Sankey is **unweighted**: all ribbons fixed thickness, all nodes equal height. `qty` is a text label only (`×8`), never band width.
- The Sankey shows **products only** (uses → product → usedBy). Suppliers stay in the existing stage-grouped suppliers table.
- No new runtime dependency. The Sankey is hand-rolled inline SVG. The `semiotic` library is removed by the end.
- Tests are pure-function unit tests in node (no Supabase mock, no DOM). Vitest run command: `npx vitest run <file>`.
- Type-check gate: `npx tsc --noEmit`. Build gate: `npm run build`. Lint: `npm run lint`.
- Path alias `@/` maps to `src/`.
- Money formatting uses the existing `fmtUSD` from `@/lib/data`.

---

### Task 1: Relationship grouping (pure module)

**Files:**
- Create: `src/lib/relationships.ts`
- Test: `src/lib/relationships.test.ts`

**Interfaces:**
- Produces:
  - `type RelRow = { from_product_id: string; to_product_id: string; type: string; qty: number | null }`
  - `type RelItem = { id: string; name: string; qty?: number }`
  - `type ProductRelations = { uses: RelItem[]; usedBy: RelItem[]; competesWith: RelItem[] }`
  - `function groupRelationships(rows: RelRow[], productId: string, names: Record<string, string>): ProductRelations`

- [ ] **Step 1: Write the failing test**

Create `src/lib/relationships.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/relationships.test.ts`
Expected: FAIL — cannot find module `./relationships`.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/relationships.ts`:

```ts
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

  for (const r of rows) {
    if (r.type === 'uses' && r.from_product_id === productId) {
      uses.push(item(r.to_product_id, names, r.qty))
    } else if (r.type === 'uses' && r.to_product_id === productId) {
      usedBy.push(item(r.from_product_id, names, r.qty))
    } else if (r.type === 'competes_with' && r.from_product_id === productId) {
      competesWith.push(item(r.to_product_id, names, null))
    }
  }

  return { uses, usedBy, competesWith }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/relationships.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/relationships.ts src/lib/relationships.test.ts
git commit -m "feat: pure relationship grouping for product detail"
```

---

### Task 2: Sankey layout geometry (pure module)

**Files:**
- Create: `src/lib/sankey.ts`
- Test: `src/lib/sankey.test.ts`

**Interfaces:**
- Produces:
  - `type SankeyRect = { x: number; y: number; w: number; h: number }`
  - `type SankeyRibbon = { side: 'left' | 'right'; index: number; path: string }`
  - `type SankeyLayout = { width: number; height: number; left: SankeyRect[]; right: SankeyRect[]; center: SankeyRect; ribbons: SankeyRibbon[] }`
  - `function sankeyLayout(leftCount: number, rightCount: number): SankeyLayout`

- [ ] **Step 1: Write the failing test**

Create `src/lib/sankey.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { sankeyLayout } from './sankey'

describe('sankeyLayout', () => {
  it('produces one rect per side node and one ribbon per node', () => {
    const l = sankeyLayout(1, 1)
    expect(l.left).toHaveLength(1)
    expect(l.right).toHaveLength(1)
    expect(l.ribbons).toHaveLength(2)
  })

  it('omits a side with zero nodes (no rects, no ribbons there)', () => {
    const l = sankeyLayout(3, 0)
    expect(l.left).toHaveLength(3)
    expect(l.right).toHaveLength(0)
    expect(l.ribbons.filter(r => r.side === 'right')).toHaveLength(0)
    expect(l.ribbons.filter(r => r.side === 'left')).toHaveLength(3)
  })

  it('height grows with the busier side', () => {
    const small = sankeyLayout(1, 1)
    const big = sankeyLayout(4, 1)
    expect(big.height).toBeGreaterThan(small.height)
  })

  it('every ribbon path is a non-empty SVG path string', () => {
    const l = sankeyLayout(2, 2)
    for (const r of l.ribbons) {
      expect(r.path.startsWith('M')).toBe(true)
      expect(r.path.length).toBeGreaterThan(10)
    }
  })

  it('keeps all rects within the layout bounds', () => {
    const l = sankeyLayout(3, 2)
    for (const rect of [...l.left, ...l.right, l.center]) {
      expect(rect.x).toBeGreaterThanOrEqual(0)
      expect(rect.x + rect.w).toBeLessThanOrEqual(l.width)
      expect(rect.y).toBeGreaterThanOrEqual(0)
      expect(rect.y + rect.h).toBeLessThanOrEqual(l.height)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/sankey.test.ts`
Expected: FAIL — cannot find module `./sankey`.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/sankey.ts`:

```ts
export type SankeyRect = { x: number; y: number; w: number; h: number }
export type SankeyRibbon = { side: 'left' | 'right'; index: number; path: string }
export type SankeyLayout = {
  width: number
  height: number
  left: SankeyRect[]
  right: SankeyRect[]
  center: SankeyRect
  ribbons: SankeyRibbon[]
}

const WIDTH = 560
const NODE_W = 14
const CENTER_W = 18
const NODE_H = 44
const GAP = 16
const PAD_Y = 12
const LEFT_X = 20
const CENTER_X = 271
const RIGHT_X = WIDTH - LEFT_X - NODE_W // 526

function stack(count: number, height: number): SankeyRect[] {
  if (count === 0) return []
  const blockH = count * NODE_H + (count - 1) * GAP
  const top = (height - blockH) / 2
  return Array.from({ length: count }, (_, i) => ({
    x: 0, y: top + i * (NODE_H + GAP), w: NODE_W, h: NODE_H,
  }))
}

// A filled cubic-bezier ribbon from a vertical segment at x0 (y0t..y0b) to a
// vertical segment at x1 (y1t..y1b). Control points sit halfway between.
function ribbon(x0: number, y0t: number, y0b: number, x1: number, y1t: number, y1b: number): string {
  const mx = (x0 + x1) / 2
  return [
    `M${x0} ${y0t}`,
    `C${mx} ${y0t}, ${mx} ${y1t}, ${x1} ${y1t}`,
    `L${x1} ${y1b}`,
    `C${mx} ${y1b}, ${mx} ${y0b}, ${x0} ${y0b}`,
    'Z',
  ].join(' ')
}

// Pure geometry for the unweighted product Sankey. Side nodes are equal-height
// rects stacked and vertically centered; the center node spans the full height.
export function sankeyLayout(leftCount: number, rightCount: number): SankeyLayout {
  const rows = Math.max(leftCount, rightCount, 1)
  const height = rows * NODE_H + (rows - 1) * GAP + PAD_Y * 2

  const left = stack(leftCount, height).map(r => ({ ...r, x: LEFT_X }))
  const right = stack(rightCount, height).map(r => ({ ...r, x: RIGHT_X }))
  const center: SankeyRect = { x: CENTER_X, y: PAD_Y, w: CENTER_W, h: height - PAD_Y * 2 }

  const ribbons: SankeyRibbon[] = []
  const half = NODE_H / 2
  const cInLeft = center.x
  const cOutRight = center.x + center.w

  left.forEach((n, i) => {
    const cy = center.y + (center.h * (i + 0.5)) / Math.max(leftCount, 1)
    ribbons.push({
      side: 'left', index: i,
      path: ribbon(n.x + n.w, n.y, n.y + n.h, cInLeft, cy - half, cy + half),
    })
  })
  right.forEach((n, i) => {
    const cy = center.y + (center.h * (i + 0.5)) / Math.max(rightCount, 1)
    ribbons.push({
      side: 'right', index: i,
      path: ribbon(cOutRight, cy - half, cy + half, n.x, n.y, n.y + n.h),
    })
  })

  return { width: WIDTH, height, left, right, center, ribbons }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/sankey.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/sankey.ts src/lib/sankey.test.ts
git commit -m "feat: pure Sankey layout geometry"
```

---

### Task 3: Hero metrics + BOM guard (pure module)

**Files:**
- Create: `src/lib/productView.ts`
- Test: `src/lib/productView.test.ts`

**Interfaces:**
- Consumes: `Product` type from `@/lib/data` (`specs: { label: string; value: string; conf?: string }[]`, `bom: { uncertainty: string; items: BomItem[]; total: number; totalConf: string } | null`).
- Produces:
  - `function pickHeroMetrics(specs: Product['specs'], max?: number): Product['specs']`
  - `function hasValidBom(bom: Product['bom']): boolean`

- [ ] **Step 1: Write the failing test**

Create `src/lib/productView.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { pickHeroMetrics, hasValidBom } from './productView'

const specs = [
  { label: 'Transistors', value: '208 B' },
  { label: 'FP8 compute', value: '4,500 TFLOPS' },
  { label: 'Memory', value: '192 GB HBM3E' },
  { label: 'Bandwidth', value: '8.0 TB/s' },
  { label: 'TDP', value: '1,000 W' },
  { label: 'Interconnect', value: 'NVLink 5' },
  { label: 'Form factor', value: 'SXM' },
]

describe('pickHeroMetrics', () => {
  it('returns priority metrics in priority order, capped at max', () => {
    const r = pickHeroMetrics(specs, 5).map(s => s.label)
    expect(r).toEqual(['Memory', 'Bandwidth', 'FP8 compute', 'TDP', 'Interconnect'])
  })

  it('skips priorities that are absent', () => {
    const r = pickHeroMetrics([{ label: 'Memory', value: '24 GB' }]).map(s => s.label)
    expect(r).toEqual(['Memory'])
  })

  it('returns empty when no priority labels match', () => {
    expect(pickHeroMetrics([{ label: 'Transistors', value: '80 B' }])).toEqual([])
  })

  it('matches case-insensitively and does not reuse a spec', () => {
    const r = pickHeroMetrics([{ label: 'memory', value: '24 GB' }])
    expect(r).toHaveLength(1)
  })
})

describe('hasValidBom', () => {
  it('true when items is a non-empty array', () => {
    expect(hasValidBom({ uncertainty: '±10%', items: [{ label: 'die', cost: 850 }], total: 850, totalConf: 'high' })).toBe(true)
  })
  it('false for null', () => {
    expect(hasValidBom(null)).toBe(false)
  })
  it('false for empty / malformed bom', () => {
    expect(hasValidBom({ uncertainty: '', items: [], total: 0, totalConf: '' })).toBe(false)
    // malformed row missing items
    expect(hasValidBom({} as never)).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/productView.test.ts`
Expected: FAIL — cannot find module `./productView`.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/productView.ts`:

```ts
import type { Product } from './data'

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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/productView.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/productView.ts src/lib/productView.test.ts
git commit -m "feat: pure hero-metric picker and BOM guard"
```

---

### Task 4: Data layer — `Source` type, `getProductRelationships`, `getSources`

**Files:**
- Modify: `src/lib/data.ts` (add `Source` interface; change `bom.uncertainty` type to `string`)
- Modify: `src/lib/db.ts` (add two functions)
- Test: none (Supabase I/O; gated on tsc + build + manual query — see Step 4). The shaping logic is already covered by Task 1.

**Interfaces:**
- Consumes: `groupRelationships`, `RelRow`, `ProductRelations` from `@/lib/relationships`; `getProductNames` (existing in `db.ts`).
- Produces:
  - `interface Source { id: string; title: string; publisher?: string | null; url?: string | null; type: string; retrieved?: string | null }`
  - `async function getProductRelationships(id: string): Promise<ProductRelations>`
  - `async function getSources(): Promise<Record<string, Source>>`

- [ ] **Step 1: Add the `Source` type and fix the BOM uncertainty type in `src/lib/data.ts`**

In `src/lib/data.ts`, the `Product` interface currently declares `bom: { uncertainty: number; ... } | null`. The DB now stores `uncertainty` as a string like `"±10%"`. Change that field:

Find (inside `interface Product`):
```ts
  bom: { uncertainty: number; items: BomItem[]; total: number; totalConf: string } | null
```
Replace with:
```ts
  bom: { uncertainty: string; items: BomItem[]; total: number; totalConf: string } | null
```

Then add the `Source` interface immediately after the `Supplier` interface (after its closing `}`):
```ts
export interface Source {
  id: string
  title: string
  publisher?: string | null
  url?: string | null
  type: string
  retrieved?: string | null
}
```

- [ ] **Step 2: Add the two data functions in `src/lib/db.ts`**

At the top of `src/lib/db.ts`, extend the imports. The current type import line is:
```ts
import type { Product, ProductSummary, Supplier } from './data'
```
Replace with:
```ts
import type { Product, ProductSummary, Supplier, Source } from './data'
import { groupRelationships, type ProductRelations, type RelRow } from './relationships'
```

Append these two functions at the end of `src/lib/db.ts`:
```ts
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
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Manual data verification**

Run:
```bash
node --env-file=.env.local -e '
const { createClient } = require("@supabase/supabase-js");
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
(async () => {
  const { data } = await sb.from("product_relationships").select("from_product_id,to_product_id,type,qty").or("from_product_id.eq.nvidia-b200,to_product_id.eq.nvidia-b200");
  console.log("b200 rel rows:", data.length, data.map(r=>`${r.from_product_id}-[${r.type}]->${r.to_product_id}`));
  const { data: s } = await sb.from("sources").select("id,title,url").limit(2);
  console.log("sources:", s);
})();
'
```
Expected: prints B200 rows including `nvidia-b200-[uses]->skhynix-hbm3e-8hi` and `nvidia-gb200-[uses]->nvidia-b200`, plus sources with non-null URLs.

- [ ] **Step 5: Commit**

```bash
git add src/lib/data.ts src/lib/db.ts
git commit -m "feat: getProductRelationships and getSources from normalized tables"
```

---

### Task 5: Wire new data into the server page (additive props)

**Files:**
- Modify: `src/app/products/[id]/page.tsx`
- Modify: `src/app/products/[id]/ProductDetail.tsx` (props signature only)

**Interfaces:**
- Consumes: `getProductRelationships`, `getSources` (Task 4); `ProductRelations` (Task 1); `Source` (Task 4).
- Produces: `ProductDetail` now also accepts `relations: ProductRelations` and `sources: Record<string, Source>`. The existing `downstream` prop stays for now (removed in Task 8) so the build stays green.

This task only threads the data through. The new props are accepted but not yet rendered, which is valid (unused props do not break the build). Rendering lands in Tasks 6–7.

- [ ] **Step 1: Update `page.tsx` to fetch and pass the new data**

Replace the entire body of `src/app/products/[id]/page.tsx` with:
```tsx
import Link from 'next/link'
import {
  getProduct, getProductDownstream, getProductNames, getProductSummaries,
  getSuppliers, getProductRelationships, getSources,
} from '@/lib/db'
import ProductDetail from './ProductDetail'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, productNames, suppliers, summaries, downstream, relations, sources] = await Promise.all([
    getProduct(id), getProductNames(), getSuppliers(), getProductSummaries(),
    getProductDownstream(id), getProductRelationships(id), getSources(),
  ])

  if (!product) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p style={{ color: '#8a8579' }}>Product not found.</p>
      <Link href="/products" style={{ color: '#9a6b3f' }}>← Back to products</Link>
    </div>
  )

  return <ProductDetail product={product} productNames={productNames} suppliers={suppliers} summaries={summaries} downstream={downstream} relations={relations} sources={sources} />
}
```

- [ ] **Step 2: Update the `ProductDetail` props signature**

In `src/app/products/[id]/ProductDetail.tsx`, extend the import of types from `@/lib/data` to include `Source`, and import `ProductRelations`. The current import block is:
```tsx
import {
  PRODUCT_BRIEF, SOURCES, STAGES, STATUS_STYLE, CONF_STYLE,
  FACET_DEFS, DOMAINS, LIFECYCLE, fmtUSD,
  type Product, type ProductSummary, type Supplier,
} from '@/lib/data'
```
Replace with:
```tsx
import {
  PRODUCT_BRIEF, SOURCES, STAGES, STATUS_STYLE, CONF_STYLE,
  FACET_DEFS, DOMAINS, LIFECYCLE, fmtUSD,
  type Product, type ProductSummary, type Supplier, type Source,
} from '@/lib/data'
import type { ProductRelations } from '@/lib/relationships'
```

Then update the component signature. The current signature is:
```tsx
export default function ProductDetail({ product, productNames, suppliers, summaries, downstream }: {
  product: Product
  productNames: Record<string, string>
  suppliers: Record<string, Supplier>
  summaries: ProductSummary[]
  downstream: Downstream[]
}) {
```
Replace with:
```tsx
export default function ProductDetail({ product, productNames, suppliers, summaries, downstream, relations, sources }: {
  product: Product
  productNames: Record<string, string>
  suppliers: Record<string, Supplier>
  summaries: ProductSummary[]
  downstream: Downstream[]
  relations: ProductRelations
  sources: Record<string, Source>
}) {
```

- [ ] **Step 3: Type-check and build**

Run: `npx tsc --noEmit && npm run build`
Expected: no type errors; build succeeds. (`relations`/`sources` unused is allowed; if `noUnusedParameters` complains, prefix is not needed because they are destructured object properties, which TS does not flag.)

- [ ] **Step 4: Commit**

```bash
git add src/app/products/[id]/page.tsx src/app/products/[id]/ProductDetail.tsx
git commit -m "feat: thread relations and sources into ProductDetail props"
```

---

### Task 6: Rebuild `SankeySection` with the unweighted product model

**Files:**
- Rewrite: `src/app/products/[id]/SankeySection.tsx`
- Modify: `src/app/products/[id]/ProductDetail.tsx` (swap the SankeySection call site)

**Interfaces:**
- Consumes: `sankeyLayout` (Task 2); `ProductRelations` (Task 1).
- Produces: `SankeySection` now takes `{ name: string; relations: ProductRelations }` and renders the unweighted product-to-product Sankey, or `null` when there are no `uses`/`usedBy` relationships.

- [ ] **Step 1: Rewrite `SankeySection.tsx`**

Replace the entire contents of `src/app/products/[id]/SankeySection.tsx` with:
```tsx
import Link from 'next/link'
import { sankeyLayout } from '@/lib/sankey'
import type { ProductRelations } from '@/lib/relationships'

export default function SankeySection({ name, relations }: {
  name: string
  relations: ProductRelations
}) {
  const { uses, usedBy } = relations
  if (uses.length === 0 && usedBy.length === 0) return null

  const layout = sankeyLayout(uses.length, usedBy.length)
  const { width, height, left, right, center, ribbons } = layout

  return (
    <section className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#a8a294' }}>
        Supply flow
      </p>
      <div className="rounded-xl border overflow-x-auto" style={{ borderColor: 'var(--border)', background: '#fff' }}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ display: 'block', fontFamily: 'system-ui', minWidth: 420 }}>
          {/* column labels */}
          {uses.length > 0 && (
            <text x={left[0].x} y={14} fontSize="9" letterSpacing="1" fill="#a8a294">USES</text>
          )}
          <text x={center.x} y={14} fontSize="9" letterSpacing="1" fill="#a8a294" textAnchor="start">THIS</text>
          {usedBy.length > 0 && (
            <text x={right[0].x + right[0].w} y={14} fontSize="9" letterSpacing="1" fill="#a8a294" textAnchor="end">USED IN</text>
          )}

          {/* ribbons */}
          {ribbons.map(r => (
            <path key={`${r.side}-${r.index}`} d={r.path}
              fill={r.side === 'left' ? '#2c6360' : '#475569'} opacity={0.26} />
          ))}

          {/* center node */}
          <rect x={center.x} y={center.y} width={center.w} height={center.h} rx={3} fill="#0f172a" />
          <text x={center.x + center.w + 8} y={center.y + center.h / 2} fontSize="12" fontWeight="700" fill="#0f172a" dominantBaseline="middle">{name}</text>

          {/* left (uses) nodes */}
          {left.map((rect, i) => (
            <g key={`l-${uses[i].id}`}>
              <Link href={`/products/${uses[i].id}`}>
                <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx={2} fill="#2c6360" style={{ cursor: 'pointer' }} />
              </Link>
              <Link href={`/products/${uses[i].id}`}>
                <text x={rect.x + rect.w + 6} y={rect.y + rect.h / 2} fontSize="11" fill="#3d3b37" dominantBaseline="middle" style={{ cursor: 'pointer' }}>
                  {uses[i].name}{uses[i].qty ? ` ×${uses[i].qty}` : ''}
                </text>
              </Link>
            </g>
          ))}

          {/* right (usedBy) nodes */}
          {right.map((rect, i) => (
            <g key={`r-${usedBy[i].id}`}>
              <Link href={`/products/${usedBy[i].id}`}>
                <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx={2} fill="#475569" style={{ cursor: 'pointer' }} />
              </Link>
              <Link href={`/products/${usedBy[i].id}`}>
                <text x={rect.x - 6} y={rect.y + rect.h / 2} fontSize="11" fill="#3d3b37" textAnchor="end" dominantBaseline="middle" style={{ cursor: 'pointer' }}>
                  {usedBy[i].name}{usedBy[i].qty ? ` ×${usedBy[i].qty}` : ''}
                </text>
              </Link>
            </g>
          ))}
        </svg>
      </div>
    </section>
  )
}
```

Note: this file no longer imports `semiotic`, no longer uses `useMemo`, and is no longer a `'use client'` component (it has no client-only hooks). `next/link` works in server components.

- [ ] **Step 2: Swap the call site in `ProductDetail.tsx`**

In `src/app/products/[id]/ProductDetail.tsx`, find the existing Sankey render:
```tsx
        {/* Supply flow Sankey */}
        <SankeySection product={product} downstream={downstream} />
```
Replace with:
```tsx
        {/* Supply flow Sankey */}
        <SankeySection name={product.name} relations={relations} />
```

- [ ] **Step 3: Type-check and build**

Run: `npx tsc --noEmit && npm run build`
Expected: no type errors; build succeeds.

- [ ] **Step 4: Manual visual check**

Run `npm run dev`, then open each and confirm:
- `http://localhost:3000/products/nvidia-b200` — Sankey shows `SK Hynix HBM3E ×8` (left) → B200 → `GB200 NVL72` (right).
- `http://localhost:3000/products/amd-mi300x` — left column only (HBM suppliers), no right column, no dangling ribbons.
- `http://localhost:3000/products/skhynix-hbm3e-8hi` — right column only (B200, H200, TPU v6e, TPU v7).
- A product with no `uses` either way (e.g. `http://localhost:3000/products/nvidia-grace`) — no Supply flow section at all.

Stop the dev server when done.

- [ ] **Step 5: Commit**

```bash
git add src/app/products/[id]/SankeySection.tsx src/app/products/[id]/ProductDetail.tsx
git commit -m "feat: unweighted product-to-product supply-flow Sankey"
```

---

### Task 7: ProductDetail — hero metrics, competes-only related, table-backed sources, BOM guard

**Files:**
- Modify: `src/app/products/[id]/ProductDetail.tsx`

**Interfaces:**
- Consumes: `pickHeroMetrics`, `hasValidBom` (Task 3); `relations.competesWith` (Task 1); `sources` prop (Task 5); `Source` type.

This task changes four rendered regions. Apply all four edits, then type-check, build, verify, and commit once.

- [ ] **Step 1: Import the pure helpers**

In `src/app/products/[id]/ProductDetail.tsx`, after the `import type { ProductRelations } from '@/lib/relationships'` line added in Task 5, add:
```tsx
import { pickHeroMetrics, hasValidBom } from '@/lib/productView'
```

- [ ] **Step 2: Compute hero metrics and competitor list inside the component**

In the component body, just after the existing line:
```tsx
  const hasSpecs = product.specs.length > 0
```
add:
```tsx
  const heroMetrics = pickHeroMetrics(product.specs)
  const competitors = relations.competesWith
```

- [ ] **Step 3: Render the hero metrics strip**

Immediately after the closing of the hero/brief block (the `) : brief ? ( ... ) : null}` expression that ends the description section, right before `{/* Related products (competes_with, uses) */}`), insert:
```tsx
        {/* Hero metrics strip */}
        {heroMetrics.length > 0 && (
          <section className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {heroMetrics.map(m => (
                <div key={m.label} className="rounded-xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: '#fff' }}>
                  <p className="text-base font-semibold" style={{ color: '#0f172a' }}>{m.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#8a8579' }}>{m.label}</p>
                </div>
              ))}
            </div>
          </section>
        )}
```

- [ ] **Step 4: Replace the "Related products" section with a competes-only section**

The current block reads `product.rels` via `relsByType`/`REL_ORDER`. Replace the entire block that starts with `{/* Related products (competes_with, uses) */}` and ends at its closing `)}` with:
```tsx
        {/* Competes with */}
        {competitors.length > 0 && (
          <section className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#a8a294' }}>Competes with</p>
            <div className="flex flex-wrap gap-2">
              {competitors.map(c => (
                <Link
                  key={c.id}
                  href={`/products/${c.id}`}
                  className="text-xs px-2.5 py-1 rounded-full border transition-shadow hover:shadow-sm"
                  style={{ borderColor: '#d6d3cb', background: '#fbfaf8', color: '#3d3b37', textDecoration: 'none' }}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </section>
        )}
```

This removes the only consumers of `relsByType`, `hasRels`, `REL_DISPLAY`, and `REL_ORDER`. Delete those now-unused declarations:
- Delete the `relsByType`/`hasRels` computation block in the component body (the loop building `relsByType` and the `const hasRels = ...` line).
- Delete the module-level `const REL_DISPLAY = { ... }` and `const REL_ORDER = [...]` near the top of the file.

- [ ] **Step 5: Guard the BOM section and fix the uncertainty render**

The current BOM block opens with `{product.bom && (` and renders `±{product.bom.uncertainty}%`. The uncertainty value is now a preformatted string (e.g. `"±10%"`).

Change the opening guard from:
```tsx
        {product.bom && (
```
to:
```tsx
        {hasValidBom(product.bom) && product.bom && (
```

And change the uncertainty span from:
```tsx
              <span className="text-xs" style={{ color: '#8a8579' }}>±{product.bom.uncertainty}%</span>
```
to:
```tsx
              <span className="text-xs" style={{ color: '#8a8579' }}>{product.bom.uncertainty}</span>
```

- [ ] **Step 6: Replace the Sources section with table-backed citations**

The current Sources block reads the hardcoded `SOURCES` map. Replace the entire block that starts with `{/* Sources */}` and ends at its closing `)}` with:
```tsx
        {/* Sources & provenance */}
        {product.sources?.some(sid => sources[sid]) && (
          <section className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', background: '#fbfaf8' }}>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#a8a294' }}>Sources & provenance</h2>
            <div className="flex flex-col gap-2">
              {product.sources.map(sid => {
                const src = sources[sid]
                if (!src) return null
                const meta = [src.publisher, src.type, src.retrieved ? `retrieved ${src.retrieved}` : null].filter(Boolean).join(' · ')
                const body = (
                  <div>
                    <p style={{ color: src.url ? '#9a6b3f' : '#3d3b37' }}>{src.title}</p>
                    <p style={{ color: '#a8a294' }}>{meta}</p>
                  </div>
                )
                return (
                  <div key={sid} className="flex items-start gap-3 text-xs">
                    <span className="font-mono px-1.5 py-0.5 rounded shrink-0" style={{ background: '#f1f0ec', color: '#8a8579' }}>{src.type}</span>
                    {src.url
                      ? <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{body}</a>
                      : body}
                  </div>
                )
              })}
            </div>
          </section>
        )}
```

`SOURCES` is now unused in this file. Remove `SOURCES` from the `@/lib/data` import list (the import line edited in Task 5).

- [ ] **Step 7: Type-check, build, lint**

Run: `npx tsc --noEmit && npm run build && npm run lint`
Expected: no type errors, build succeeds, lint passes (no unused-variable errors for `REL_DISPLAY`, `REL_ORDER`, `relsByType`, `hasRels`, `SOURCES` — confirm each was removed).

- [ ] **Step 8: Manual visual check**

Run `npm run dev` and confirm on `http://localhost:3000/products/nvidia-b200`:
- Hero metric cards show Memory / Bandwidth / FP8 compute / TDP / Interconnect.
- "Competes with" shows AMD MI300X / MI355X pills; no "Uses" row (it's in the Sankey).
- BOM shows `±10%` once (not `±±10%%`).
- Sources list titles as clickable links opening the real URLs.
Then open a product with `bom = {}` (e.g. a memory commodity) and confirm no BOM section and no crash.

Stop the dev server when done.

- [ ] **Step 9: Commit**

```bash
git add src/app/products/[id]/ProductDetail.tsx
git commit -m "feat: hero metrics, competes-only related, table-backed sources, BOM guard"
```

---

### Task 8: Cleanup — drop `downstream` plumbing and the `semiotic` dependency

**Files:**
- Modify: `src/app/products/[id]/page.tsx`
- Modify: `src/app/products/[id]/ProductDetail.tsx`
- Modify: `src/lib/db.ts`
- Modify: `package.json` / `package-lock.json` (via `npm uninstall`)

**Interfaces:**
- Removes: the `downstream` prop, the `Downstream` type, `getProductDownstream`, and the `semiotic` dependency. Nothing depends on these after Task 7.

- [ ] **Step 1: Remove the `downstream` prop from `ProductDetail.tsx`**

In `src/app/products/[id]/ProductDetail.tsx`:
- Delete the `type Downstream = { ... }` declaration near the top.
- Remove `downstream` from the destructured props and remove the `downstream: Downstream[]` line from the props type. The signature becomes:
```tsx
export default function ProductDetail({ product, productNames, suppliers, summaries, relations, sources }: {
  product: Product
  productNames: Record<string, string>
  suppliers: Record<string, Supplier>
  summaries: ProductSummary[]
  relations: ProductRelations
  sources: Record<string, Source>
}) {
```

- [ ] **Step 2: Remove `downstream` from `page.tsx`**

Replace the body of `src/app/products/[id]/page.tsx` with:
```tsx
import Link from 'next/link'
import {
  getProduct, getProductNames, getProductSummaries,
  getSuppliers, getProductRelationships, getSources,
} from '@/lib/db'
import ProductDetail from './ProductDetail'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, productNames, suppliers, summaries, relations, sources] = await Promise.all([
    getProduct(id), getProductNames(), getSuppliers(), getProductSummaries(),
    getProductRelationships(id), getSources(),
  ])

  if (!product) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p style={{ color: '#8a8579' }}>Product not found.</p>
      <Link href="/products" style={{ color: '#9a6b3f' }}>← Back to products</Link>
    </div>
  )

  return <ProductDetail product={product} productNames={productNames} suppliers={suppliers} summaries={summaries} relations={relations} sources={sources} />
}
```

- [ ] **Step 3: Remove `getProductDownstream` from `db.ts`**

Delete the entire `getProductDownstream` function from `src/lib/db.ts` (the `export async function getProductDownstream(...) { ... }` block).

- [ ] **Step 4: Uninstall `semiotic`**

Run: `npm uninstall semiotic`
Expected: `semiotic` removed from `package.json` dependencies.

- [ ] **Step 5: Confirm nothing references the removed symbols**

Run:
```bash
grep -rn "semiotic\|getProductDownstream\|Downstream\b" src/ ; echo "exit: $?"
```
Expected: no matches (grep exit 1). If any match remains, remove it before continuing.

- [ ] **Step 6: Full gate**

Run: `npx tsc --noEmit && npm run build && npx vitest run && npm run lint`
Expected: type-check clean, build succeeds, all unit tests pass, lint passes.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: drop downstream plumbing and semiotic dependency"
```

---

## Self-Review

**1. Spec coverage**

- Hero spec-metrics strip → Task 3 (picker) + Task 7 Step 3 (render). ✓
- Supply-flow Sankey, unweighted, product-only, empty/one-sided states, no library → Task 2 (geometry) + Task 6 (render). ✓
- Table-backed source citations with URLs → Task 4 (`getSources`) + Task 7 Step 6. ✓
- BOM render guard + uncertainty-string fix → Task 3 (`hasValidBom`) + Task 7 Step 5. ✓
- `getProductRelationships` / `getSources`, migrate off jsonb → Task 4. ✓
- Remove `uses` duplication; Related products = competes_with only → Task 7 Step 4. ✓
- Replace buggy semiotic SankeySection → Task 6 + Task 8 Step 4. ✓
- Out-of-scope items (perf columns, GenerationStrip migration, removing SOURCES map/RelationshipGraph) → not implemented, as specified. Note: `SOURCES` is only un-imported from ProductDetail (Task 7 Step 6), not deleted from `data.ts`, matching the spec's "leave for other callers". ✓

**2. Placeholder scan:** No TBD/TODO/"handle edge cases"/"similar to Task N". All code steps contain complete code. ✓

**3. Type consistency:** `ProductRelations { uses, usedBy, competesWith }` defined in Task 1, consumed identically in Tasks 5/6/7. `RelItem { id, name, qty? }` used consistently. `Source` fields defined in Task 4, consumed in Task 7 Step 6 (`title`, `publisher`, `url`, `type`, `retrieved`). `sankeyLayout(leftCount, rightCount)` returns `{ width, height, left, right, center, ribbons }`, consumed in Task 6. `hasValidBom`/`pickHeroMetrics` signatures match between Task 3 and Task 7. ✓
