# Product Detail Page Redesign — Design Spec

**Date:** 2026-06-24  
**Status:** Draft  
**Scope:** `src/app/products/[id]/ProductDetail.tsx` and child components  

---

## Problem Statement

The product detail page is visually inconsistent across products because it renders sections conditionally: a rich product like AMD MI350X (6 specs, BOM, supply chain, components) looks totally different from a sparse one like AMD MI455X (1 Notes spec, supply chain only). The same template produces wildly different visual weight, so users can't develop mental expectations. Three specific issues:

1. **Inconsistent rhythm** — sections appear/disappear based on data presence; no fixed skeleton
2. **Attribute chips are noise** — 8 chips (Status, Packaging, Node maturity, Transistor arch, Material, Integration, End market, Company type) sit under the title as unlabeled pills; they belong in a spec table
3. **Supply chain is hard to scan** — stage-grouped chip clusters don't communicate "who supplies what" as clearly as a flat table would

**Reference:** humanoids.fyi Vibe Robotics page — hero description + flat suppliers table + dense spec grid.

---

## Decisions (Settled Before Writing This Spec)

- **Hero image:** Narrative-only for now. No hero image (chips lack one canonical image). The `Product` type should be extended with an optional `image_url` field for future readiness, but the UI renders description-only. `image_url` is not in Supabase yet; no fetch logic needed.
- **Spec table data:** Hybrid — canonical attribute rows (from `attrs` + lookup tables) + `product.specs` rows in one unified table. Notes entry stays as a table row.
- **Process:** Spec first (this document), then implementation plan.

---

## New Layout

### Section Order (fixed; sections omit gracefully when data is absent)

```
1. Breadcrumb
2. Title block (slim)
3. GenerationStrip (existing, unchanged)
4. Narrative hero (description card)
5. "Why it matters" callout (existing, unchanged — only when brief.why exists)
6. Unified Specifications table + BOM (two-column grid; BOM takes right column when present)
7. Supply chain table (flat: Supplier → Role)
8. Composition (existing, unchanged)
9. Related (existing, unchanged)
10. Sources & provenance (existing, unchanged)
```

---

## Section Specs

### 1. Breadcrumb
No change from current implementation.

### 2. Title Block (slim)

**Current:** Status chip + Node chip + "Full/Partial data" tier badge + h1 + subtitle + reading-level toggle (L1/L2/L3)  
**New:** Status chip + Node chip + h1 + subtitle + reading-level toggle (when brief exists)

Removed from title block:
- Tier badge ("Full data / Partial data") — this was misleading (only 3 products qualify for "Full data")
- All attribute chips — moved to Spec table

Subtitle logic (fix raw-subcat bug):
```tsx
// Current (buggy when family is null):
{product.vendor} · {product.family ?? product.subcat}

// New (always human-readable):
import { SUBCAT } from '@/lib/data'
{product.vendor} · {product.family ?? SUBCAT[product.subcat] ?? product.subcat}
```

Reading-level toggle (L1/L2/L3): keep exactly as-is, show only when `brief` exists.

### 3. GenerationStrip
No change.

### 4. Narrative Hero

A full-width card that presents the product description. Three content sources in priority order:

1. **PRODUCT_BRIEF entry:** Render `brief.l1` + optional `brief.analogy` + optional L2/L3 toggle. This is the existing "In plain terms" card — move it here, rename section header from "In plain terms" to nothing (or "About").
2. **Notes spec row:** If no brief but `product.specs` contains a row with `label === 'Notes'`, render that row's value as a prose paragraph (not as a spec row — it's excluded from the spec table and shown here instead).
3. **No content:** Omit section entirely. Do not show an empty card.

Section header: none (description leads directly). Background: white card, same border style as existing.

**Future readiness:** The `Product` interface gets an optional `image_url?: string` field. When present and the hero section renders, show it as a `<img>` left of the description (60/40 split). For now `image_url` is always undefined, so the UI is always description-only. No additional fetch logic needed.

### 5. "Why It Matters" Callout
No change. Only renders when `brief?.why` exists.

### 6. Unified Specifications Table

**Replace:**
- "Attributes" section (chip row)
- "Specs" section (conditional table)

**With:** One unified spec table that always renders (even if all rows are empty).

#### Row composition

Rows are rendered in this fixed order, skipping rows with no value:

**Canonical attribute rows** (from lookup tables — these replace the attribute chips):
| Label | Value source |
|---|---|
| Status | `LIFECYCLE[product.status]` |
| Company type | `COMPANY[VENDOR_TYPE[product.vendor]]` |
| Packaging | `PACK[PRODUCT_PACK[product.id]]` |
| Node maturity | `NODE_MAT[product.attrs?.node_maturity]` |
| Transistor arch | `ARCH[product.attrs?.transistor_arch]` |
| Material | `MAT[product.attrs?.material_system]` |
| Integration | `INTEG[product.attrs?.integration_level]` |
| End market | `MARKET[product.attrs?.end_market]` |

**Product spec rows** (from `product.specs`, excluding any row with `label === 'Notes'` — that goes to the hero):
- Render exactly as the current spec table (label | value | ConfBadge)

**Row styling:**
- Canonical attr rows: label in muted grey, value in standard text, no ConfBadge column
- Spec rows: same as current (label | value | ConfBadge)
- A light divider between the canonical block and the spec block when both have rows

**Empty state:** "No specifications recorded yet." — same placeholder as current.

**Layout:** In the existing two-column grid (`sm:grid-cols-2`):
- Left: Unified spec table (always present)
- Right: BOM (when `product.bom` is non-null); omit if null

When BOM is absent, the spec table takes full width (single column).

### 7. Supply Chain Table

**Replace:** Current section (stage groups with chip clusters)

**With:** A flat two-column table: Supplier | Role

#### Construction

Iterate `STAGES` in order. For each stage, collect `product.supply[stage.key] ?? []`. For each supplier ID in that list, emit one table row:

```
| [Supplier name (linked)] | [Stage label] |
```

If a supplier appears in multiple stages, it gets multiple rows — one per stage.

**Empty state:** If no suppliers at all, omit the section entirely (fix the empty card bug).

**Supplier name:** `suppliers[sid]?.name ?? sid` — linked to `/suppliers/${sid}`.

**Role:** `STAGES.find(s => s.key === stageKey).label` — the human-readable stage name (e.g. "Foundry", "Packaging", "Test").

**Section header:** "Supply chain" (unchanged label).

**Table styling:**
- Border-separated rows
- Supplier column: normal weight, linked, `text-sm`
- Role column: muted grey, `text-sm`, right-aligned or left-aligned (prefer left)
- No header row needed (context is obvious from the section header)

### 8–10. Composition, Related, Sources
No change from current implementation.

---

## Files to Touch

| File | Change |
|---|---|
| `src/app/products/[id]/ProductDetail.tsx` | Main rewrite: slim title, remove attr chips, add unified spec table, new supply chain table, reorder sections |
| `src/lib/data.ts` | Add `image_url?: string` to `Product` interface |

No new files needed. No changes to `GenerationStrip`, `CompositionSection`, `FACET_DEFS`, or any data-fetching code.

---

## What Does NOT Change

- GenerationStrip component
- CompositionSection component
- BOM rendering (keep exact current implementation)
- Related section
- Sources & provenance section
- L1/L2/L3 reading-level toggle (keep, appears in title block)
- "Why it matters" callout
- FACET_DEFS (still used for filtering on the browse page — we just stop using it in the detail view)
- Supply-chain data fetching (no DB changes)

---

## Edge Cases

| Case | Behavior |
|---|---|
| No brief, no Notes spec | Hero section omitted |
| Notes spec only | Hero renders Notes as prose; spec table has no Notes row |
| Brief + Notes spec | Brief takes hero; Notes spec appears as a row in spec table |
| No suppliers | Supply chain section omitted |
| No specs, no attrs with values | Spec table shows "No specifications recorded yet." |
| No BOM | Spec table takes full width; BOM section omitted |
| `product.subcat` not in SUBCAT map | Falls through to raw `product.subcat` value |

---

## Visual Reference Summary

Target feel (from humanoids.fyi Vibe Robotics page):
- Slim header, then a clear narrative description
- Flat, readable supplier list with roles (not grouped chips)
- One dense spec table (all known facts in one place)
- Identical structural skeleton regardless of data richness — pages differ in row count, not in which sections appear

The key design principle: **every product detail page has the same sections in the same order**. A sparse product has short tables; a rich product has long ones. The skeleton never changes.
