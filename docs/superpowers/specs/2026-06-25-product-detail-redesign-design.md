# Product Detail Page Redesign — Design Spec

**Date:** 2026-06-25
**Scope:** The product detail page (`/products/[id]`) only. Roadmap, products list, and other routes are out of scope.

## Problem

Two user-reported problems with the product detail page:

1. **Trust / sparseness (primary).** Some detail pages feel rich, others feel empty and untrustworthy. The headline numbers are buried in a long specs table, and source citations are effectively absent (the page renders a hardcoded 5-entry `SOURCES` map, so almost nothing shows provenance).
2. **Can't picture the supply chain.** There's no way to see, on one product, what components flow *into* it and what products it flows *into* (upstream → product → downstream).

The Supabase schema was recently restructured, which both enables the fix and quietly breaks parts of the current page.

## Data realities (verified 2026-06-25)

| Data | Source | Coverage | Notes |
|---|---|---|---|
| `specs` (jsonb `[{label,value,conf}]`) | `products.specs` | 153 / 205 | The real spec source; already loaded |
| Relationships | `product_relationships` table | **155** products, 229 rows | `uses` 36, `competes_with` 43, `succeeds` 150 |
| Relationships (legacy) | `products.rels` jsonb | 54 products | **Stale** — do not use for the detail page |
| Sources | `sources` table | 21 rows, all with URLs + `retrieved` dates | Real, linkable citations |
| `source_ids` on product | `products.source_ids` | 205 / 205 | Every product references sources |
| BOM | `products.bom` | 197 have `items`, 8 malformed, 0 empty | Render needs a guard |

**The supply-chain chain is at most one hop each way from a given product**, but that hop can be populated on both sides — e.g. `SK Hynix HBM3E ×8 → B200 → GB200 NVL72`. Most products populate one side or neither:
- Accelerators (B200, MI300X): upstream populated (HBM they use), downstream usually empty.
- Memory parts (HBM3E): downstream populated (chips that use them), upstream empty.

## What breaks right now

- **BOM render crash.** `products.bom` defaults are now objects; `product.bom` is truthy but `product.bom.items` can be absent for the 8 malformed rows. `{product.bom && product.bom.items.map(...)}` throws on those. Needs a guard.
- **Existing `SankeySection` is wrong and buggy.** It is BOM-cost-weighted (not the agreed unweighted product-to-product model), depends on the `semiotic` library, and calls `useMemo` *after* an early `return null` — a React hooks-order violation. It will be replaced.
- **Sources show almost nothing** because they read the hardcoded `SOURCES` map (5 entries) instead of the `sources` table.

## Design

Four changes to `ProductDetail.tsx`, plus the data-layer reads that feed them. The page keeps its existing sections (breadcrumb, title, generation strip, hero/brief, related products, suppliers-by-stage, attributes, specs); this spec changes the data those sections read and adds/replaces three sections.

### 1. Hero spec-metrics strip (trust fix)

A compact row of 3–5 headline metrics directly under the title/hero, lifted from `product.specs`. Pull a fixed priority list of labels when present and render them as large number + small label cards; skip silently when a metric is absent.

- **Priority labels** (first matches win, max 5): `Memory`, `Bandwidth`, `FP8 compute` (or first `*compute` spec), `TDP`, `Interconnect`. Matching is case-insensitive substring against `spec.label`.
- Renders only if at least one priority metric is found. Otherwise the strip is omitted (the full specs table still renders below as today).
- Pure presentational; reads only `product.specs` already in memory. No new data fetch.

### 2. Supply-flow Sankey (chain fix) — replaces existing `SankeySection`

A custom inline-SVG Sankey showing **product-to-product flow**, unweighted:

- **Left column** — products this one *uses* (`product_relationships` where `from_product_id = id AND type = 'uses'`). Quantity shown as a label (`×8`) when `qty` is present.
- **Center** — this product.
- **Right column** — products that *use* this one (`product_relationships` where `to_product_id = id AND type = 'uses'`).
- All side nodes are `Link`s to `/products/<id>`. The center node is static.
- **Unweighted:** every ribbon is the same fixed thickness; node heights are equal. `qty` is a text label only, never band width.
- **Empty / one-sided states:** if a side has no nodes, that column is omitted and no ribbons are drawn to it (no dangling stubs). The whole section renders only when there is ≥1 `uses` relationship in either direction; otherwise it is omitted entirely.
- **No third-party library.** Hand-rolled SVG with a `viewBox` for responsiveness and cubic-bezier ribbons (as in the approved mockup). Node label text sits outside the node rects. Remove the `semiotic` dependency.
- Suppliers stay in their **existing stage-grouped suppliers table** — the Sankey is products only, not companies. The two sections are independent.

Rendering approach (fixed-thickness ribbons):
- Three x-bands: left nodes, center node, right nodes.
- Each side node is a small rect; stack them vertically with even spacing centered on the section height.
- One bezier ribbon per relationship, fixed thickness (~the node height), connecting the side node's inner edge to the center node's edge.
- Height scales with `max(leftCount, rightCount)`.

### 3. Sources & provenance (trust fix) — read the `sources` table

Replace the hardcoded `SOURCES` lookup with the `sources` table. For each id in `product.source_ids`, render title, publisher, type, retrieved date, and — when `url` is present — make the entry a link that opens the source.

- New read: `getSources()` (id → source row) or a per-product fetch by `source_ids`.
- Each citation: `[type badge] Title — Publisher · retrieved YYYY-MM-DD`, linked to `url` when present (`target="_blank" rel="noopener"`).
- Renders only when the product has at least one resolvable source.

### 4. BOM render guard (bugfix)

Guard the BOM section so it renders only when `product.bom` has a non-empty `items` array; treat the 8 malformed rows as "no BOM". Fixes the current crash.

## Data layer changes (`src/lib/db.ts`)

- **`getProductRelationships(id)`** — new. Query `product_relationships` for both directions, resolve product names, return grouped by direction/type:
  ```
  { uses: {id,name,qty}[],        // upstream  (from=id, type=uses)
    usedBy: {id,name,qty}[],      // downstream(to=id,   type=uses)
    competesWith: {id,name}[],    // from=id, type=competes_with
  }
  ```
  This supersedes the stale `products.rels` jsonb for the detail page and gives 155-product coverage plus downstream. Name resolution can reuse `getProductNames()` or a join.
- **`getSources()`** — new. Return `Record<id, SourceRow>` from the `sources` table (`id,title,publisher,url,type,retrieved`).
- **Remove / retire `getProductDownstream`** (jsonb-based, 54-coverage) — folded into `getProductRelationships`.
- `getProduct`, `getProductSummaries`, `getSuppliers` unchanged.

`page.tsx` fetches `getProductRelationships(id)` and `getSources()` in the existing `Promise.all` and passes them to `ProductDetail`. The detail page's "Related products" and the Sankey both derive from `getProductRelationships`, so the stale `product.rels` jsonb is no longer read on this page.

### Avoiding duplication with "Related products"

Today the "Related products" section lists both `competes_with` and `uses`. After this change, `uses`/`usedBy` move into the Sankey and `succeeds` is already in the generation strip. So **"Related products" shows only `competes_with`** (from the new `competesWith` group). It renders only when there is ≥1 competitor; otherwise it is omitted. This removes the `uses` duplication between the list and the Sankey.

## Types (`src/lib/data.ts`)

- Add `Source` type: `{ id; title; publisher?; url?; type; retrieved? }`.
- Add a `ProductRelations` type for the grouped result above.
- `PRODUCT_BRIEF` and `SOURCES` (hardcoded) remain in the file but `SOURCES` is no longer used by the detail page; leave it for any other caller (verify none rely on it before deleting — out of scope to remove here).

## Section order on the page (after change)

Breadcrumb → Title → Generation strip → Hero/brief → **Hero metrics strip (new)** → Related products → **Supply-flow Sankey (replaced)** → Suppliers by stage → Attributes → Specs → BOM (guarded) → **Sources (table-backed)**.

## Out of scope (explicit)

- Comparison view, faceted filtering by performance/precision, benchmarks UI.
- The structured perf columns (`peak_tflops_bf16`, `tdp_watts`, …) — too sparse (~20) to rely on; the hero strip reads `specs` instead.
- `GenerationStrip` still reads the 54-coverage `rels` jsonb via `getProductSummaries`. The `succeeds` data is far richer in `product_relationships` (150 rows), so the chain is under-covered — **noted as a follow-on**, not done here.
- Removing the `SOURCES` map and `RelationshipGraph.tsx` from the repo (dead code cleanup) — out of scope.

## Testing

- **Data layer:** unit-test `getProductRelationships` for a both-sides product (`nvidia-b200` → uses HBM3E, usedBy GB200), an upstream-only product (`amd-mi300x`), and a downstream-only product (`skhynix-hbm3e-8hi`). Test `getSources` returns rows with URLs.
- **Component:** render `ProductDetail` and assert — hero metrics strip shows when specs have priority labels and is absent otherwise; Sankey omits the empty column and omits entirely when no `uses` either way; BOM section absent for a malformed-bom product (no crash); sources render as links when `url` present.
- **Manual:** `/products/nvidia-b200` (both sides + rich metrics + linked sources), `/products/amd-mi300x` (upstream-only Sankey), `/products/skhynix-hbm3e-8hi` (downstream-only), a sparse product with no relationships (no Sankey section).
