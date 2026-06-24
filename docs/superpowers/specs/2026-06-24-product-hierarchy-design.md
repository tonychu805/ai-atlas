# Product Hierarchy & Detail Page Redesign

**Date:** 2026-06-24  
**Status:** Approved for implementation

---

## Problem

The site has 220+ products but was designed around 12 richly-documented ones. This creates three compounding issues:

1. **Inconsistent product pages** — most pages show a half-empty shell (supply chain, no specs, no BOM, no brief), which undermines trust as a reference tool.
2. **No family/generation navigation** — there is no way to see "all AMD Instinct chips in order" or "where does the B200 sit in the Blackwell → Rubin → Feynman arc" without clicking through individual products.
3. **Chip vs system distinction is invisible** — a rack system like Vera Rubin NVL72 (72 GPUs + 36 CPUs + 9 NVLink switches) looks identical to a single chip in the product list.

**Target audience:** learners new to the industry + investors using the site as a reference.

---

## Design

### Information Architecture

No new routes. The hierarchy layer lives in the browse page UI, not in URLs. Existing product URLs are unchanged.

```
/products        → browse (List mode OR Roadmap mode, toggle between them)
/products/[id]   → product detail (enriched, same URL)
/suppliers/[id]  → vendor detail (existing, unchanged)
```

### Browse Page — Roadmap Mode

A mode toggle (List / Roadmap) is added to the products page header.

**Roadmap mode** groups products by vendor, then by sub-category family, rendered as horizontal generation timelines:

```
NVIDIA
├── GPU (AI)    [V100] → [A100] → [H100] → [H200] → [B200] → [B300] → [R100 Rubin] → …
├── Platforms   [Blackwell NVL72] → [GB300 NVL72] → [Vera Rubin NVL72] → [NVL144 CPX] → …
├── Networking  [CX7] → [CX8] → [CX9]
└── CPU         [Grace] → [Vera CPU]
```

Each chip is a status-colored pill (name + node). EOL chips are visually dimmed. Clicking navigates to `/products/[id]`.

**Ordering within a family row** is derived by walking `succeeds` rels to build a linked list, then flattening to an array. Products not in any succession chain appear at the end alphabetically. This runs client-side in O(n) — no extra DB query.

**Grouping rules:**
- Primary: `vendor`
- Secondary: `sub` (ai_accelerator / cpu / networking / soc / memory subtype)
- Vendors with 1–2 products render as a flat row with no family grouping
- Memory vendors group by product type (HBM, DDR5, GDDR), not succession, since they ship parallel lines

**List mode** is unchanged — all existing filters and table layout remain.

### Product Detail Page — Three Additions

All three additions are data-driven and hide gracefully when data is absent.

#### 1. Generation Strip
Appears below the title row on every product page. Shows immediate predecessor and successor derived from `succeeds` rels:

```
← [H200]   [B200]   [B300] →
            ↑ here
```

- Shows one step back and one step forward (not the full chain)
- Each chip is a link to its product page
- Hidden if no `succeeds` rels exist for this product

#### 2. Composition Section
Appears on system/platform products (`sub = 'soc'`) and on chip-level products that have `uses` rels pointing to memory components.

For system products — labeled **"Components"**:
```
NVIDIA R100 Rubin GPU     × 72   →
NVIDIA Vera CPU           × 36   →
NVIDIA NVLink 6 Switch    × 9    →
```

For chip-level products with memory rels — labeled **"Key components"**:
```
SK Hynix HBM3E 8-Hi       × 8    →
```

Each row links to the component's product page.

The existing "Connects to" section (which renders all `rels` generically) is replaced by Composition + a refined "Related" section that shows only `competes_with` and non-`uses` rels. This avoids showing the same information twice.

#### 3. Consistent Layout with Data Tiers

Every product page renders the same sections in the same order. Sections do not disappear when data is absent — they show a muted placeholder.

| Section | Full | Standard | Stub |
|---|---|---|---|
| Generation strip | ✓ | ✓ | ✓ (if rels) |
| In plain terms | ✓ | — | — |
| Attributes | ✓ | ✓ | ✓ (if attrs) |
| Specs | ✓ | ✓ | placeholder |
| BOM | ✓ | — | — |
| Supply chain | ✓ | ✓ | ✓ (if supply) |
| Composition | ✓ | ✓ | ✓ (if rels) |
| Connects to | ✓ | ✓ | ✓ (if rels) |
| Sources | ✓ | — | — |

Tier is inferred automatically — no new DB field:
- **Full**: has specs + BOM + PRODUCT_BRIEF entry
- **Standard**: has specs or supply chain
- **Stub**: everything else

A small badge ("Full data" / "Partial data") appears near the product title to set reader expectations.

---

## Data Layer

### New db.ts function

```typescript
// Lightweight query for roadmap view — no specs/BOM/supply
getProductSummaries(): Promise<ProductSummary[]>
// fields: id, name, vendor, sub, subcat, family, status, node, rels
```

Existing `getProducts()`, `getProduct(id)`, `getProductNames()`, `getSuppliers()` are unchanged.

### New/modified components

```
src/app/products/
  page.tsx                  modified — adds mode toggle, fetches summaries for roadmap
  ProductsTable.tsx         unchanged
  RoadmapView.tsx           new — vendor+family grouping with generation timeline rows
  GenerationStrip.tsx       new — predecessor / current / successor strip

src/app/products/[id]/
  ProductDetail.tsx         modified — adds GenerationStrip + CompositionSection
  CompositionSection.tsx    new — renders uses rels as component breakdown table
```

### Generation chain algorithm (client-side)

```
1. Build a map: target_id → product (who succeeds whom)
2. Find roots: products with no incoming "succeeds" edge
3. Walk forward from each root to produce ordered arrays
4. Products not reached by any walk are appended alphabetically
```

---

## Out of scope

- New URL routes for vendor or family pages
- The existing `/map` page (future graph view)
- Populating missing `family` fields for products that currently have none (data task, separate)
- Mobile-specific layout changes beyond what responsive CSS handles naturally
