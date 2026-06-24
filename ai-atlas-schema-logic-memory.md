# AI Atlas — Data Schema & Taxonomy (Logic + Memory)

*Draft v0.1 — the data spine for the first two domains. Designed to extend to Analog, Power, RF, Sensors, and Discretes later without breaking.*

---

## 1. Scope & approach

This covers two product domains — **Logic** and **Memory** — built depth-first. The goal of this phase is not coverage but to prove the data model against the two hardest, most cross-linked cases:

- **Logic** has the most complex BOM (logic die + HBM + advanced packaging + substrate + test).
- **Memory** includes **HBM**, which is simultaneously its own product *and* the single largest BOM line in modern AI logic. Getting this cross-reference right is the core test of the schema.

Populate the data-center compute stack first (AI accelerators, server CPUs, HBM, server DRAM), then widen to client/edge and NAND.

---

## 2. Taxonomy

### Logic
| Subcategory | Examples of products to populate |
|---|---|
| `ai_accelerator_gpu` | NVIDIA Blackwell, AMD Instinct |
| `ai_accelerator_asic` | Google TPU, AWS Trainium, Microsoft Maia, Meta MTIA |
| `cpu_server` | x86 (Intel Xeon, AMD EPYC), Arm (Ampere, Graviton) |
| `cpu_client` | Desktop / laptop CPUs and APUs |
| `soc_mobile` | Apple, Qualcomm, MediaTek application processors |
| `fpga` | AMD (Xilinx), Altera |
| `mcu_embedded` | Microcontrollers, embedded SoCs |
| `networking_dpu` | NICs, DPUs, switch silicon |

### Memory
| Subcategory | Examples of products to populate |
|---|---|
| `dram_hbm` | HBM3, HBM3E, HBM4 |
| `dram_commodity` | DDR5, LPDDR5/5X, GDDR6/7 |
| `nand` | 3D NAND (by layer count), client/enterprise SSDs |
| `nor` | Serial / parallel NOR flash |
| `emerging` | MRAM, ReRAM, FeRAM |

Taxonomy is intentionally a controlled vocabulary (enum), not free text — every product must map to exactly one subcategory, and filtering/faceting depends on it.

---

## 3. Shared value-chain stages

These are the **columns** of the atlas. Every product, regardless of domain, links to suppliers across the same stages. This is what lets a user pivot from a product to its supply graph and back.

`design_ip_eda` → `foundry_fab` → `materials` → `equipment` → `packaging_osat` → `test` → `distribution`

Each stage is a relationship from a product to one or more **Supplier** records (see §7), not a free-text field.

---

## 4. Entities (overview)

The model is a small graph, not a flat table:

- **Product** — a chip or memory device (the nodes users browse).
- **Supplier** — a company occupying one or more value-chain stages.
- **Source** — a citation backing a value (the provenance layer).
- **Edges** — typed relationships between products and suppliers, and product-to-product (`uses`, `competes_with`, `succeeds`).

---

## 5. Core Product record

Common fields shared by every product in every domain. Domain-specific detail lives in `specs` and `bom` (§6).

```json
{
  "id": "nvidia-b200",
  "name": "NVIDIA B200",
  "vendor": "NVIDIA",
  "domain": "logic",
  "subcategory": "ai_accelerator_gpu",
  "family": "Blackwell",
  "status": "production",            // sampling | production | eol | announced
  "announced": "2024-03",
  "available": "2025",
  "foundry": "TSMC",
  "process_node": "TSMC 4NP",
  "specs": { },                       // domain-specific block, see §6
  "bom": { },                         // domain-specific template, see §6
  "supply_chain": {                   // stage -> supplier ids
    "design_ip_eda": ["arm", "synopsys", "cadence"],
    "foundry_fab": ["tsmc"],
    "packaging_osat": ["tsmc-cowos"],
    "test": ["tsmc", "ase"]
  },
  "relationships": [
    { "type": "uses", "target": "skhynix-hbm3e-8hi", "qty": 8 },
    { "type": "succeeds", "target": "nvidia-h200" },
    { "type": "competes_with", "target": "amd-mi300x" }
  ],
  "sources": ["src-001", "src-002"]
}
```

---

## 6. Domain spec & BOM blocks

### 6a. Logic — `specs`
```json
{
  "transistor_count": { "value": 2.08e11, "unit": "count", "confidence": "med", "source": "src-001" },
  "die_config": "dual reticle-limited die",
  "die_area_mm2": { "value": 1600, "unit": "mm^2", "confidence": "low", "source": "est" },
  "compute": {
    "fp16_tflops": { "value": 2250, "confidence": "med", "source": "src-001" },
    "fp8_tflops":  { "value": 4500, "confidence": "med", "source": "src-001" },
    "fp4_tflops":  { "value": 9000, "confidence": "low", "source": "est" }
  },
  "memory_capacity_gb": 192,
  "memory_bandwidth_tbps": 8.0,
  "tdp_w": 1000,
  "interconnect": "NVLink 5",
  "form_factor": "SXM"
}
```

### 6b. Logic — `bom` (cost decomposition, not a parts list)
```json
{
  "currency": "USD",
  "estimate_basis": "per-unit manufacturing cost, excludes NRE",
  "uncertainty_pct": 18,
  "line_items": [
    { "component": "logic_die",        "cost": 320,  "confidence": "med", "source": "src-002" },
    { "component": "hbm",              "cost": 3400, "qty": 8, "ref_product": "skhynix-hbm3e-8hi", "confidence": "med", "source": "src-002" },
    { "component": "advanced_packaging", "cost": 1400, "note": "CoWoS-L interposer + assembly", "confidence": "med", "source": "src-002" },
    { "component": "substrate",        "cost": 180,  "confidence": "low", "source": "est" },
    { "component": "assembly_test",    "cost": 1100, "confidence": "low", "source": "est" }
  ],
  "total_est": { "value": 6400, "confidence": "med", "source": "src-002" }
}
```
> Note how the `hbm` line carries `ref_product`, pointing at a Memory record. This is the join that makes the atlas connected: change SK Hynix's HBM3E cost once and every logic product referencing it can recompute.

### 6c. Memory — `specs`
```json
{
  "generation": "HBM3E",
  "stack_height": "8-Hi",
  "capacity_gb": 24,
  "core_die_count": 8,
  "core_die_density_gb": 3,
  "interface_width_bits": 1024,
  "bandwidth_gbps_per_pin": 9.6,
  "bandwidth_tbps_per_stack": 1.2,
  "process_node_class": "1b-nm DRAM",
  "tsv": true
}
```

### 6d. Memory — `bom`
```json
{
  "currency": "USD",
  "uncertainty_pct": 20,
  "line_items": [
    { "component": "base_logic_die", "cost": 25, "confidence": "low", "source": "est" },
    { "component": "dram_core_dies", "cost": 280, "qty": 8, "confidence": "low", "source": "est" },
    { "component": "tsv_stacking",   "cost": 60, "confidence": "low", "source": "est" },
    { "component": "package_test",   "cost": 35, "confidence": "low", "source": "est" }
  ],
  "total_est": { "value": 400, "confidence": "low", "source": "est" },
  "market_share_note": "SK Hynix ~50-55%, Samsung ~35-40%, Micron ~5-10%"
}
```

---

## 7. Supplier & Source records

```json
// Supplier
{
  "id": "skhynix",
  "name": "SK Hynix",
  "stages": ["foundry_fab", "packaging_osat"],
  "domains_supplied": ["dram_hbm", "dram_commodity", "nand"],
  "hq": "South Korea"
}

// Source — the provenance layer
{
  "id": "src-002",
  "title": "AI accelerator BOM cost estimates, April 2026",
  "publisher": "Silicon Analysts",
  "url": "https://siliconanalysts.com/data/ai-chip-costs",
  "type": "estimate",                 // filing | teardown | datasheet | estimate | questionnaire
  "retrieved": "2026-06"
}
```

---

## 8. Provenance & confidence convention

Don't wrap *every* field — that's noise. Wrap only the **contested or estimated** values (cost, ASP, transistor counts, unannounced specs) in the `{ value, unit, confidence, source }` object. Hard datasheet specs (capacity, form factor) can stay plain.

- `confidence`: `high` (vendor datasheet / filing), `med` (reputable third-party estimate), `low` (your own modeled estimate).
- Cost figures should always carry `uncertainty_pct`; industry BOM estimates typically run ±15–20%.
- Every estimated number needs a `source` id — even if that id is `"est"` meaning "AI Atlas internal model."

This is the single biggest credibility differentiator versus a scraped spec sheet.

---

## 9. The connective tissue (why it's an atlas)

The relationships are the product. Minimum viable edge set:

- `product --uses--> product` (logic uses HBM; carries `qty`)
- `product --fabbed_by--> supplier`
- `product --packaged_by--> supplier`
- `product --succeeds / competes_with--> product`

The HBM double-role is the canonical example: `skhynix-hbm3e-8hi` is a browsable Memory product *and* the `ref_product` on the `hbm` BOM line of every Blackwell, MI300, and TPU record. Build this join first; it's the hardest and most valuable.

---

## 10. Worked examples included
- `nvidia-b200` (Logic / `ai_accelerator_gpu`) — full record above.
- `skhynix-hbm3e-8hi` (Memory / `dram_hbm`) — specs + BOM above.

> ⚠️ All numeric values in the examples are **illustrative placeholders to verify against primary sources** before publishing. They demonstrate the format, not vetted data.

---

## 11. Open decisions for next pass
1. Store as flat JSON files per product (git-friendly, easy diffs) vs. a graph DB (better for relationship queries at scale). Recommend JSON-in-git to start.
2. How to version products across generations (B100 → B200 → B300): separate records linked by `succeeds`, which keeps history browsable.
3. Whether `compute` specs get normalized per-precision (FP16/FP8/FP4) — yes, because cross-vendor comparison is meaningless otherwise.
4. A `last_verified` date per record to surface staleness in the UI.
