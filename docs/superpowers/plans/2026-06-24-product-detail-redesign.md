# Product Detail Page Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the product detail page to have a fixed section skeleton, slim header, narrative hero, unified spec table, and flat supply chain table — eliminating visual inconsistency across data-sparse and data-rich products.

**Architecture:** All changes are surgical edits to two files — a one-line type extension in `src/lib/data.ts` and a full-section rewrite of `src/app/products/[id]/ProductDetail.tsx`. No new files, no Supabase schema changes, no data-fetching changes. Each task is an isolated, independently reviewable edit to the component file that can be verified visually with the dev server.

**Tech Stack:** Next.js App Router, React 19 client component (`'use client'`), TypeScript 5, Tailwind v4, inline `style={}` objects (existing pattern), `var(--border)` CSS custom property, Supabase data layer (no changes)

## Global Constraints

- No new files; no new components
- No Supabase schema changes, no changes to `src/lib/db.ts` or `src/app/products/[id]/page.tsx`
- `FACET_DEFS` must NOT be removed from `src/lib/data.ts` (still used by the browse/filter page); only remove it from `ProductDetail.tsx`'s import
- `image_url` field is added to the `Product` interface but no fetch logic is added (not in Supabase yet); the hero renders description-only
- Match existing color palette: `#0f172a` (dark text), `#3d3b37` (body), `#8a8579` (muted), `#a8a294` (section headers), `#1c1a17` (hero body)
- TypeScript check command: `npx tsc --noEmit`
- Dev server: `npm run dev` (port 3000)
- No unit tests for React components; verification is visual via dev server

---

### Task 1: Add `image_url` to Product interface

**Files:**
- Modify: `src/lib/data.ts:315–333`

**Interfaces:**
- Consumes: nothing new
- Produces: `Product.image_url?: string` available to all consumers (no consumers use it yet)

- [ ] **Step 1: Add `image_url?: string` to Product interface**

In `src/lib/data.ts`, find this block (lines 315–333):
```typescript
export interface Product {
  id: string
  name: string
  vendor: string
  domain: string
  sub: string
  subcat: string
  family?: string
  status: string
  node?: string
  avail?: string
  verified?: string
  attrs?: Record<string, string>
  specs: { label: string; value: string; conf?: string }[]
  bom: { uncertainty: number; items: BomItem[]; total: number; totalConf: string } | null
  supply: Partial<Record<StageKey, string[]>>
  rels: { type: string; target: string; qty?: number }[]
  sources: string[]
}
```

Replace with:
```typescript
export interface Product {
  id: string
  name: string
  vendor: string
  domain: string
  sub: string
  subcat: string
  family?: string
  status: string
  node?: string
  avail?: string
  verified?: string
  image_url?: string
  attrs?: Record<string, string>
  specs: { label: string; value: string; conf?: string }[]
  bom: { uncertainty: number; items: BomItem[]; total: number; totalConf: string } | null
  supply: Partial<Record<StageKey, string[]>>
  rels: { type: string; target: string; qty?: number }[]
  sources: string[]
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors (adding an optional field is non-breaking).

- [ ] **Step 3: Commit**

```bash
git add src/lib/data.ts
git commit -m "feat: add image_url to Product interface for future hero image support"
```

---

### Task 2: Slim title block + fix subtitle + update all imports

**Files:**
- Modify: `src/app/products/[id]/ProductDetail.tsx` (lines 5, 43–45, 59–87)

**Interfaces:**
- Consumes: `SUBCAT` from `@/lib/data` (new); all other lookups added here for use by Tasks 4 and 5
- Produces: slim title (no tier badge), human-readable subtitle (`SUBCAT` lookup), clean imports

This task does three things in one commit: (1) updates the import line to remove `FACET_DEFS` and add all lookup tables needed by this and later tasks; (2) removes `tier`/`hasSpecs`/`hasSupply` variables that will no longer be needed; (3) strips the tier badge from the title block and fixes the subtitle. All imports are added in one shot here so Tasks 3–5 don't hit TypeScript errors at intermediate states.

- [ ] **Step 1: Replace the import line (line 5)**

Find:
```tsx
import { PRODUCT_BRIEF, SOURCES, STAGES, STATUS_STYLE, CONF_STYLE, FACET_DEFS, DOMAINS, LIFECYCLE, fmtUSD, type Product, type ProductSummary, type Supplier } from '@/lib/data'
```

Replace with:
```tsx
import { PRODUCT_BRIEF, SOURCES, STAGES, STATUS_STYLE, CONF_STYLE, DOMAINS, LIFECYCLE, SUBCAT, COMPANY, VENDOR_TYPE, PACK, PRODUCT_PACK, NODE_MAT, ARCH, MAT, INTEG, MARKET, fmtUSD, type Product, type ProductSummary, type Supplier } from '@/lib/data'
```

- [ ] **Step 2: Remove tier/hasSpecs/hasSupply variables (lines 43–45)**

Find and delete these three lines:
```tsx
  // Data tier, inferred — no DB field.
  const hasSpecs = product.specs.length > 0
  const hasSupply = Object.values(product.supply).some(a => a && a.length > 0)
  const tier = hasSpecs && product.bom && brief ? 'full' : (hasSpecs || hasSupply ? 'standard' : 'stub')
```

- [ ] **Step 3: Replace title block (lines 59–87)**

Find:
```tsx
        {/* Title row */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
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
            <h1 className="text-3xl font-bold mt-2" style={{ color: '#0f172a' }}>{product.name}</h1>
            <p className="text-base mt-1" style={{ color: '#8a8579' }}>{product.vendor} · {product.family ?? product.subcat}</p>
          </div>
          {/* Reading level toggle */}
          {brief && (
            <div className="flex items-center gap-1 rounded-lg border p-1" style={{ borderColor: '#d6d3cb', background: '#fbfaf8' }}>
              {(['L1','L2','L3'] as Level[]).map(l => (
                <button key={l} onClick={() => setLevel(l)}
                  className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
                  style={{ background: level === l ? '#fff' : 'transparent', color: level === l ? '#0f172a' : '#8a8579', boxShadow: level === l ? '0 1px 3px rgba(0,0,0,0.06)' : 'none' }}>
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>
```

Replace with:
```tsx
        {/* Title row */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={product.status} />
              {product.node && <span className="text-xs px-2 py-1 rounded font-mono" style={{ background: '#f3f2ee', color: '#6b6557' }}>{product.node}</span>}
            </div>
            <h1 className="text-3xl font-bold mt-2" style={{ color: '#0f172a' }}>{product.name}</h1>
            <p className="text-base mt-1" style={{ color: '#8a8579' }}>{product.vendor} · {product.family ?? SUBCAT[product.subcat] ?? product.subcat}</p>
          </div>
          {/* Reading level toggle */}
          {brief && (
            <div className="flex items-center gap-1 rounded-lg border p-1" style={{ borderColor: '#d6d3cb', background: '#fbfaf8' }}>
              {(['L1','L2','L3'] as Level[]).map(l => (
                <button key={l} onClick={() => setLevel(l)}
                  className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
                  style={{ background: level === l ? '#fff' : 'transparent', color: level === l ? '#0f172a' : '#8a8579', boxShadow: level === l ? '0 1px 3px rgba(0,0,0,0.06)' : 'none' }}>
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>
```

- [ ] **Step 4: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors. If you see `Cannot find name 'tier'` — check that Step 2 removed all three lines. If you see `Module has no exported member 'FACET_DEFS'` — that export still exists in data.ts (don't remove it); the error is the reverse, meaning ProductDetail.tsx still references it. The Attributes block (lines 128–144) still references `FACET_DEFS` — it will be removed in Task 4.

- [ ] **Step 5: Visual check**

With `npm run dev` running:
- `http://localhost:3000/products/google-tpu-v7` → subtitle reads "Google · AI GPU" (not "Google · ai_accelerator_gpu"); no "Partial data" badge
- `http://localhost:3000/products/nvidia-b200` → subtitle reads "NVIDIA · AI GPU"; no badge

- [ ] **Step 6: Commit**

```bash
git add src/app/products/[id]/ProductDetail.tsx
git commit -m "refactor: slim title block, fix subtitle SUBCAT lookup, update imports for redesign"
```

---

### Task 3: Narrative hero section

**Files:**
- Modify: `src/app/products/[id]/ProductDetail.tsx` (lines 92–115)

**Interfaces:**
- Consumes: `PRODUCT_BRIEF` (already in scope as `brief`), `product.specs`, `level` state, `Linkify` — all already present
- Produces: hero section with three priority tiers: (1) brief → (2) Notes spec → (3) nothing

Replace the "In plain terms" card with a priority-ordered narrative hero. The section header "In plain terms" is removed — the description text leads directly. When no brief exists, the Notes spec row (if any) becomes prose in the hero instead of a table row.

- [ ] **Step 1: Replace "In plain terms" block (lines 92–115)**

Find:
```tsx
        {/* In plain terms */}
        {brief && (
          <section className="rounded-xl p-6 mb-8" style={{ background: '#fff', border: '1px solid var(--border)' }}>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#a8a294' }}>In plain terms</h2>
            <p className="text-base mb-3" style={{ color: '#1c1a17', lineHeight: 1.7 }}>
              <Linkify text={brief.l1} />
            </p>
            {brief.analogy && (
              <p className="text-sm italic" style={{ color: '#8a8579' }}>
                <Linkify text={brief.analogy} />
              </p>
            )}
            {(level === 'L2' || level === 'L3') && brief.l2 && (
              <p className="text-sm mt-4" style={{ color: '#3d3b37', lineHeight: 1.7, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <Linkify text={brief.l2} />
              </p>
            )}
            {level === 'L3' && brief.l3 && (
              <p className="text-sm mt-4" style={{ color: '#3d3b37', lineHeight: 1.7, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <Linkify text={brief.l3} />
              </p>
            )}
          </section>
        )}
```

Replace with:
```tsx
        {/* Narrative hero */}
        {(() => {
          if (brief) {
            return (
              <section className="rounded-xl p-6 mb-8" style={{ background: '#fff', border: '1px solid var(--border)' }}>
                <p className="text-base mb-3" style={{ color: '#1c1a17', lineHeight: 1.7 }}>
                  <Linkify text={brief.l1} />
                </p>
                {brief.analogy && (
                  <p className="text-sm italic" style={{ color: '#8a8579' }}>
                    <Linkify text={brief.analogy} />
                  </p>
                )}
                {(level === 'L2' || level === 'L3') && brief.l2 && (
                  <p className="text-sm mt-4" style={{ color: '#3d3b37', lineHeight: 1.7, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                    <Linkify text={brief.l2} />
                  </p>
                )}
                {level === 'L3' && brief.l3 && (
                  <p className="text-sm mt-4" style={{ color: '#3d3b37', lineHeight: 1.7, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                    <Linkify text={brief.l3} />
                  </p>
                )}
              </section>
            )
          }
          const notesSpec = product.specs.find(s => s.label === 'Notes')
          if (notesSpec) {
            return (
              <section className="rounded-xl p-6 mb-8" style={{ background: '#fff', border: '1px solid var(--border)' }}>
                <p className="text-base" style={{ color: '#1c1a17', lineHeight: 1.7 }}>
                  <Linkify text={notesSpec.value} />
                </p>
              </section>
            )
          }
          return null
        })()}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Visual check**

- `http://localhost:3000/products/nvidia-b200` → hero shows the B200 brief text with no "In plain terms" header; L1/L2/L3 toggle (top-right of title) still expands L2/L3 text
- `http://localhost:3000/products/amd-mi455x` → hero shows the Notes spec value as plain prose (no header); it should say something about the chip's specs
- `http://localhost:3000/products/amd-mi350x` → if MI350X has no brief and no Notes spec, hero section is entirely absent; verify no empty card appears

- [ ] **Step 4: Commit**

```bash
git add src/app/products/[id]/ProductDetail.tsx
git commit -m "feat: replace 'In plain terms' card with priority-ordered narrative hero"
```

---

### Task 4: Unified Specifications table

**Files:**
- Modify: `src/app/products/[id]/ProductDetail.tsx` (lines 128–195)

**Interfaces:**
- Consumes: `LIFECYCLE`, `COMPANY`, `VENDOR_TYPE`, `PACK`, `PRODUCT_PACK`, `NODE_MAT`, `ARCH`, `MAT`, `INTEG`, `MARKET` — all already imported (added in Task 2)
- Produces: single unified spec table (canonical attr rows + product spec rows); BOM unchanged in right column

This task removes the "Attributes" chip section entirely and replaces the "Specs" box with a unified table. The table has two blocks: canonical attribute rows from lookup tables (Status, Company type, Packaging, Node maturity, Transistor arch, Material, Integration, End market) followed by product spec rows from `product.specs` (excluding Notes — that went to the hero in Task 3). A thin divider separates the two blocks when both are non-empty. When BOM is absent, the spec table expands to full width via a conditional grid class.

- [ ] **Step 1: Remove the "Attributes row" section (lines 128–144)**

Find and delete this entire block:
```tsx
        {/* Attributes row */}
        {product.attrs && (
          <section className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#a8a294' }}>Attributes</p>
            <div className="flex flex-wrap gap-2">
              {FACET_DEFS.map(f => {
                const v = f.get(product)
                if (!v) return null
                return (
                  <span key={f.key} className="text-xs px-2.5 py-1 rounded-full border" style={{ borderColor: '#d6d3cb', color: '#3d3b37', background: '#fbfaf8' }}>
                    <span style={{ color: '#8a8579' }}>{f.label}: </span>{f.map[v] ?? v}
                  </span>
                )
              })}
            </div>
          </section>
        )}
```

- [ ] **Step 2: Replace the Specs+BOM grid (lines 146–195)**

Find:
```tsx
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
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

          {/* BOM */}
          {product.bom && (
            <section className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', background: '#fff' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#a8a294' }}>BOM cost estimate</h2>
                <span className="text-xs" style={{ color: '#8a8579' }}>±{product.bom.uncertainty}%</span>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {product.bom.items.map(item => (
                    <tr key={item.label} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-2 pr-2" style={{ color: '#3d3b37' }}>
                        {item.label}
                        {item.note && <span className="text-xs block" style={{ color: '#8a8579' }}>{item.note}</span>}
                      </td>
                      <td className="py-2 text-right font-mono font-medium" style={{ color: '#0f172a' }}>{fmtUSD(item.cost)}</td>
                      <td className="py-2 pl-2"><ConfBadge conf={item.conf} /></td>
                    </tr>
                  ))}
                  <tr>
                    <td className="pt-3 font-semibold" style={{ color: '#0f172a' }}>Total</td>
                    <td className="pt-3 text-right font-mono font-bold" style={{ color: '#0f172a' }}>{fmtUSD(product.bom.total)}</td>
                    <td className="pt-3 pl-2"><ConfBadge conf={product.bom.totalConf} /></td>
                  </tr>
                </tbody>
              </table>
            </section>
          )}
        </div>
```

Replace with:
```tsx
        <div className={`grid gap-6 mb-8${product.bom ? ' sm:grid-cols-2' : ''}`}>
          {/* Unified Specifications */}
          <section className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', background: '#fff' }}>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#a8a294' }}>Specifications</h2>
            {(() => {
              const attrRows: { label: string; value: string }[] = [
                { label: 'Status',          value: LIFECYCLE[product.status] ?? product.status },
                { label: 'Company type',    value: COMPANY[VENDOR_TYPE[product.vendor] ?? ''] ?? '' },
                { label: 'Packaging',       value: PACK[PRODUCT_PACK[product.id] ?? ''] ?? '' },
                { label: 'Node maturity',   value: NODE_MAT[product.attrs?.node_maturity ?? ''] ?? '' },
                { label: 'Transistor arch', value: ARCH[product.attrs?.transistor_arch ?? ''] ?? '' },
                { label: 'Material',        value: MAT[product.attrs?.material_system ?? ''] ?? '' },
                { label: 'Integration',     value: INTEG[product.attrs?.integration_level ?? ''] ?? '' },
                { label: 'End market',      value: MARKET[product.attrs?.end_market ?? ''] ?? '' },
              ].filter(r => r.value !== '')

              // Notes goes to the hero only when used as a fallback (no brief).
              // When a brief exists, Notes wasn't consumed by the hero, so keep it in the table.
              const notesInHero = !brief && product.specs.some(s => s.label === 'Notes')
              const specRows = product.specs.filter(s => !(s.label === 'Notes' && notesInHero))
              const hasAny = attrRows.length > 0 || specRows.length > 0

              if (!hasAny) {
                return <p className="text-sm" style={{ color: '#a8a294' }}>No specifications recorded yet.</p>
              }

              return (
                <table className="w-full text-sm">
                  <tbody>
                    {attrRows.map(r => (
                      <tr key={r.label} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="py-2 pr-4" style={{ color: '#8a8579', width: '45%' }}>{r.label}</td>
                        <td className="py-2 font-medium" style={{ color: '#0f172a' }} colSpan={2}>{r.value}</td>
                      </tr>
                    ))}
                    {attrRows.length > 0 && specRows.length > 0 && (
                      <tr>
                        <td colSpan={3} style={{ padding: '4px 0', borderBottom: '2px solid var(--border)' }} />
                      </tr>
                    )}
                    {specRows.map(s => (
                      <tr key={s.label} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="py-2 pr-4" style={{ color: '#8a8579', width: '45%' }}>{s.label}</td>
                        <td className="py-2 font-medium" style={{ color: '#0f172a' }}>{s.value}</td>
                        <td className="py-2 pl-2 text-right"><ConfBadge conf={s.conf} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            })()}
          </section>

          {/* BOM — unchanged */}
          {product.bom && (
            <section className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', background: '#fff' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#a8a294' }}>BOM cost estimate</h2>
                <span className="text-xs" style={{ color: '#8a8579' }}>±{product.bom.uncertainty}%</span>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {product.bom.items.map(item => (
                    <tr key={item.label} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-2 pr-2" style={{ color: '#3d3b37' }}>
                        {item.label}
                        {item.note && <span className="text-xs block" style={{ color: '#8a8579' }}>{item.note}</span>}
                      </td>
                      <td className="py-2 text-right font-mono font-medium" style={{ color: '#0f172a' }}>{fmtUSD(item.cost)}</td>
                      <td className="py-2 pl-2"><ConfBadge conf={item.conf} /></td>
                    </tr>
                  ))}
                  <tr>
                    <td className="pt-3 font-semibold" style={{ color: '#0f172a' }}>Total</td>
                    <td className="pt-3 text-right font-mono font-bold" style={{ color: '#0f172a' }}>{fmtUSD(product.bom.total)}</td>
                    <td className="pt-3 pl-2"><ConfBadge conf={product.bom.totalConf} /></td>
                  </tr>
                </tbody>
              </table>
            </section>
          )}
        </div>
```

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors. If you see `Cannot find name 'FACET_DEFS'` — Step 1 left a reference. Search the file for `FACET_DEFS` and verify the Attributes block was fully removed.

- [ ] **Step 4: Visual check**

- `http://localhost:3000/products/amd-mi350x` → Specifications table shows: Status (Production), Company type (Fabless), Packaging (3D stack / TSV), Node maturity (Leading edge), then a divider, then the product's non-Notes spec rows (Cooling, TBP, Memory, etc.). BOM appears in the right column.
- `http://localhost:3000/products/amd-mi455x` → Specifications table shows canonical attr rows only (Notes was taken by the hero); spec table is full-width (no BOM column on this page).
- `http://localhost:3000/products/nvidia-b200` → Specifications + BOM in two columns; no attribute chip row above.
- Find a product with no attrs and no specs — Specifications table should show "No specifications recorded yet."

- [ ] **Step 5: Commit**

```bash
git add src/app/products/[id]/ProductDetail.tsx
git commit -m "feat: replace attribute chips and specs section with unified specifications table"
```

---

### Task 5: Flat supply chain table

**Files:**
- Modify: `src/app/products/[id]/ProductDetail.tsx` (lines 197–223)

**Interfaces:**
- Consumes: `STAGES`, `product.supply`, `suppliers` — all already present
- Produces: flat two-column table (Supplier name → Role); section entirely omitted when no suppliers

Replace the current supply chain section (stage groups → chip clouds) with a flat table. Iterate `STAGES` in order; for each stage key, emit one row per supplier ID: `Supplier name | Stage label`. When a supplier appears in multiple stages, it gets multiple rows (one per stage). When zero rows exist, the section returns null — fixing the empty card bug.

- [ ] **Step 1: Replace supply chain section (lines 197–223)**

Find:
```tsx
        {/* Supply chain */}
        <section className="rounded-xl border p-5 mb-8" style={{ borderColor: 'var(--border)', background: '#fff' }}>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#a8a294' }}>Supply chain</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {STAGES.map(st => {
              const sups = product.supply[st.key] ?? []
              if (!sups.length) return null
              return (
                <div key={st.key}>
                  <p className="text-xs font-medium mb-1.5" style={{ color: '#8a8579' }}>{st.label}</p>
                  <div className="flex flex-wrap gap-1">
                    {sups.map(sid => {
                      const sup = suppliers[sid]
                      return (
                        <Link key={sid} href={`/suppliers/${sid}`}
                          className="text-xs px-2 py-0.5 rounded border transition-colors"
                          style={{ borderColor: '#d6d3cb', color: '#3d3b37', background: '#fbfaf8', textDecoration: 'none' }}>
                          {sup?.name ?? sid}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
```

Replace with:
```tsx
        {/* Supply chain */}
        {(() => {
          const rows: { sid: string; stageLabel: string }[] = []
          for (const st of STAGES) {
            for (const sid of product.supply[st.key] ?? []) {
              rows.push({ sid, stageLabel: st.label })
            }
          }
          if (rows.length === 0) return null
          return (
            <section className="rounded-xl border p-5 mb-8" style={{ borderColor: 'var(--border)', background: '#fff' }}>
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#a8a294' }}>Supply chain</h2>
              <table className="w-full text-sm">
                <tbody>
                  {rows.map(({ sid, stageLabel }, i) => {
                    const sup = suppliers[sid]
                    return (
                      <tr key={`${i}-${sid}`} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="py-2 pr-4">
                          <Link href={`/suppliers/${sid}`} style={{ color: '#0f172a', textDecoration: 'none' }}>
                            {sup?.name ?? sid}
                          </Link>
                        </td>
                        <td className="py-2" style={{ color: '#8a8579' }}>{stageLabel}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </section>
          )
        })()}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Visual check**

- `http://localhost:3000/products/amd-mi350x` → Supply chain shows a flat table, e.g. "TSMC | Foundry", "Amkor | Packaging", etc. (rows in STAGES order)
- `http://localhost:3000/products/google-ironwood-superpod` (or any product with no supply chain entries) → Supply chain section is entirely absent; no empty card visible
- `http://localhost:3000/products/nvidia-b200` → Supply chain table has multiple rows; spot-check supplier names are linked to `/suppliers/<id>`

- [ ] **Step 4: Confirm all spec pages look consistent**

Check a sparse product and a rich product side-by-side mentally:
- Both should show: Breadcrumb → Title (Status + Node chips) → [GenerationStrip if applicable] → Hero card → [Why it matters if applicable] → Specifications → [Supply chain if applicable] → [Composition if applicable] → [Related if applicable] → [Sources if applicable]
- Sparse product: fewer rows in Specifications, no BOM column, shorter or absent Supply chain
- Rich product: more rows, BOM column, more Supply chain rows

- [ ] **Step 5: Commit**

```bash
git add src/app/products/[id]/ProductDetail.tsx
git commit -m "feat: replace supply chain chip clusters with flat supplier/role table; omit section when empty"
```
