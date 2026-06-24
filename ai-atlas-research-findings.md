# AI Atlas — Research Findings (June 2026)

## Scope

Cross-referenced the current 190-product / 50-supplier DB snapshot against June 2026 web research. Findings are grouped into: missing products, status corrections, BOM corrections, and supplier corrections.

---

## 1. MISSING PRODUCTS

### 1a. AMD MI350X (air-cooled variant — distinct from MI355X)

The DB only has `amd-mi355x`. AMD MI350 is a family with two SKUs:

| | MI350X | MI355X |
|---|---|---|
| Cooling | Air | Liquid |
| TBP | 1,000W | 1,400W |
| Max clock | 2.2 GHz | 2.4 GHz |
| Architecture | CDNA 4 | CDNA 4 |
| Process (XCDs) | TSMC N3P | TSMC N3P |
| Process (IOD) | TSMC N6 | TSMC N6 |
| Packaging | CoWoS-S + SoIC | CoWoS-S + SoIC |
| HBM | 288GB HBM3E 12-Hi | 288GB HBM3E 12-Hi |
| HBM suppliers | Samsung + Micron (dual) | Samsung + Micron (dual) |
| Status | Production (Q3 2025) | Production (Q3 2025) |

**Action:** Add `amd-mi350x` as a new product. Also note: DB MI355X BOM only lists Samsung as HBM supplier — Micron is confirmed co-supplier.

### 1b. OpenAI XPU ("Tigris" / internal name TBD)

- **Designer:** OpenAI (in-house), back-end with Broadcom
- **Foundry:** TSMC 3nm
- **Type:** Inference ASIC (systolic array, HBM3E or HBM4)
- **Status:** Announced / sampling — production targeted H2 2026
- **Notes:** First OpenAI custom silicon. Intent is to reduce NVIDIA GPU dependence for inference workloads. Partnership with Broadcom mirrors Amazon/Google ASIC model.

**Action:** Add `openai-xpu` as `ai_accelerator_asic`, status = `sampling`.

### 1c. Google TPU v8 — Should be Split into Two Chips

The DB has a single `google-tpu-v8` entry. In reality Google announced two separate 8th-gen chips:

| | TPU 8t "Sunfish" | TPU 8i "Zebrafish" |
|---|---|---|
| Purpose | Training | Inference |
| Designer | Broadcom | MediaTek |
| Process | TSMC N2 | TSMC N2 |
| Compute | 12.6 FP4 PFLOPs | 10.1 FP4 PFLOPs |
| HBM | 216 GB HBM3E (12-Hi stacks) | 288 GB HBM3E |
| HBM BW | 6,528 GB/s | 8,601 GB/s |
| SRAM | — | 384 MB |
| Status | Announced (late 2027 target) | Announced (late 2027 target) |

**Action:** Split `google-tpu-v8` into `google-tpu-v8t` and `google-tpu-v8i`. Add MediaTek as a new supplier (design_ip_eda).

### 1d. Ampere AmpereOne M (192-core)

The DB has `ampere-altra` (eol) and `ampere-ampereone`. The AmpereOne M is a distinct shipping product:

- **Name:** AmpereOne M (A192-32M and variants)
- **Cores:** 96–192 custom Armv8.6+ single-threaded
- **Memory:** 12-channel DDR5-5600, up to 3TB
- **Process:** TSMC 5nm (same die, expanded memory controller vs. prior AmpereOne)
- **Status:** Production (shipping since Q4 2024)
- **Notes:** Key differentiator is 12-channel vs. 8-channel memory on original AmpereOne.

**Action:** Add `ampere-ampereone-m` as a new CPU product.

### 1e. Ampere AmpereOne MX (256-core, announced)

- **Cores:** 256 custom Arm cores
- **Memory:** 12-channel DDR5
- **Process:** TSMC N3
- **Status:** Announced (2026/2027 expected)

**Action:** Add `ampere-ampereone-mx`.

### 1f. Tenstorrent Galaxy Blackhole (server platform)

The DB tracks NVIDIA platform-level products (NVL72, etc.). Tenstorrent launched its equivalent:

- **Name:** Tenstorrent Galaxy Blackhole
- **Chips:** 32× Blackhole chips per 6U server
- **Compute:** 23 PFLOPS (Block FP8)
- **Memory:** 1 TB DRAM, 6.2 GB on-chip SRAM
- **Network:** Up to 56× 800G Ethernet (11.2 Tb/s scale-out)
- **Status:** Production — GA April 28, 2026
- **Price:** $110,000 per server; $440,000 for 4-node supercluster
- **Domain/Subcategory:** logic / soc

**Action:** Add `tenstorrent-galaxy-blackhole`.

---

## 2. STATUS CORRECTIONS

| Product ID | Current Status | Correct Status | Evidence |
|---|---|---|---|
| `meta-mtia-300` | announced | **production** | Live in Meta data centers since March 2026 |
| `huawei-ascend950pr` | announced | **sampling** | 950PR was scheduled Q1 2026 with samples out; in-house HBM featured |
| `amd-mi350x` | (missing) | production | Mass production Q3 2025 |
| `aws-trainium3` | production ✅ | production (correct) | GA December 2025 / March 2026 |
| `microsoft-maia200` | production ✅ | production (correct) | Announced + production January 2026 |
| `intel-xeon6-clearwater` | production ✅ | production (correct) | Launched June 2, 2026 on Intel 18A |
| `nvidia-r100-rubin` | production | **sampling → production** | Volume shipments H2 2026; entered full production June 2026 |
| `skhynix-hbm4` | production ✅ | production (correct) | Qualified by NVIDIA; ramping for Rubin |

---

## 3. BOM CORRECTIONS

### 3a. AMD MI300X — HBM type is wrong
- **Current BOM:** 8× `skhynix-hbm3e-8hi` (HBM3E)
- **Correct:** 8× HBM3 stacks (not HBM3E), 192GB total, SK Hynix
- **Notes:** MI300X uses HBM3. It's the MI325X that upgraded to HBM3E. This is a meaningful error since it affects downstream product relationships.

### 3b. AMD MI355X — missing Micron as co-supplier
- **Current BOM:** 8× `samsung-hbm3e-12hi`
- **Correct:** Dual source — Samsung AND Micron both supply HBM3E 12-Hi. 288GB total.
- **Also fix:** Process node should be "TSMC N3P" (XCDs) + "TSMC N6" (IOD), not just "TSMC 3nm". Packaging: CoWoS-S + SoIC.

### 3c. NVIDIA B200 — BOM incomplete but directionally correct
- **Current BOM:** Has items but low confidence. Per TechInsights teardown:
  - Logic die (TSMC 4NP / CoWoS-L): ~$900
  - 8× HBM3E stacks (SK Hynix primary, ~$2,900 total): ~$2,900
  - CoWoS-L packaging + substrate: ~$1,100
  - Test + other: ~$1,500
  - **Total CoGS ~$6,400**
- **HBM supplier:** SK Hynix is primary (confirmed by TechInsights teardown of HGX B200). Samsung also qualified for B200 production.
- **B300/GB300:** Also uses SK Hynix HBM3E; Micron qualified but secondary allocation.

### 3d. Google TPU v7 (Ironwood) — BOM missing
- **Logic:** TSMC N3P, Broadcom co-designed
- **HBM:** 8× HBM3E stacks per chip, 192 GB, 7.4 TB/s bandwidth
- **Packaging:** CoWoS (details TBD)
- **HBM supplier:** SK Hynix (primary; Google has historically used SK Hynix HBM)
- **BOM items should include:** Logic die (TSMC N3P), 8× HBM3E 8-Hi stacks, CoWoS packaging, substrate, test

### 3e. Microsoft Maia 200 — BOM missing
- **Process:** TSMC 3nm (CoWoS)
- **HBM:** 216 GB HBM3E, ~7 TB/s bandwidth
- **HBM supplier:** SK Hynix (reportedly sole supplier)
- **BOM items:** Logic die (TSMC 3nm), HBM3E stacks (SK Hynix), CoWoS packaging

### 3f. NVIDIA Vera Rubin (VR200) — BOM missing
- **Logic die:** TSMC N3, 336B transistors
- **HBM:** 16× HBM4 stacks, 288 GB, ~20 TB/s (lowered from 22 TB/s target)
- **HBM suppliers:** SK Hynix ~70%, Samsung ~30%. Micron excluded from HBM4 for Rubin (supplies LPDDR5X for Vera CPU instead)
- **Packaging:** CoWoS (exact variant TBD)
- **Note:** This is one of the first HBM4 production deployments.

### 3g. AWS Trainium3 — process node and BOM missing
- **Process node:** Should be "TSMC N3P" (not just "TSMC N3")
- **HBM:** 144 GB HBM3E per chip, 4.9 TB/s bandwidth
- **Packaging:** CoWoS-R
- **Design:** Annapurna Labs (front-end), Alchip (back-end physical + package design), Synopsys PCIe SerDes IP
- **BOM items:** Logic die (TSMC N3P), HBM3E stacks, CoWoS-R, substrate

### 3h. AWS Trainium2 — HBM supplier
- **Current:** 4× `micron-hbm3e-8hi`
- **Status:** Micron confirmed as HBM3E supplier for Trainium2. This appears correct.
- **Note:** Process node "TSMC N5" is correct.

---

## 4. SUPPLIER CORRECTIONS & GAPS

### 4a. Missing supplier: MediaTek
- **Role:** Designed Google TPU 8i "Zebrafish" (inference chip)
- **HQ:** Taiwan
- **Stage:** design_ip_eda
- **Model:** fabless (custom ASIC design)
- **Action:** Add `mediatek` to suppliers table.

### 4b. AMD MI355X product_suppliers — needs Micron added
- MI355X uses both Samsung AND Micron HBM3E 12-Hi
- Current product_relationships only maps to `samsung-hbm3e-12hi`
- Need to add relationship: `amd-mi355x` → uses → `micron-hbm3e-12hi` (qty 4, noting split supply)

### 4c. NVIDIA Rubin — HBM4 supplier split
- `nvidia-r100-rubin` (VR200) → uses → `skhynix-hbm4` (qty ~11 stacks, 70%)
- `nvidia-r100-rubin` (VR200) → uses → `samsung-hbm4` (qty ~5 stacks, 30%)
- Micron NOT used for HBM4 on Rubin; instead supplies LPDDR5X for Vera CPU
- `nvidia-vera-cpu` → uses → Micron LPDDR5X (up to 1.5 TB)

### 4d. Alchip's role in Trainium3
- Alchip (`alchip`) is already in suppliers table as `design_services`
- Should be linked as a product_supplier for `aws-trainium3` at stage `design_ip_eda`

### 4e. Broadcom's role
- Broadcom co-designed Google TPU v7 (Ironwood) and Google TPU 8t (Sunfish)
- Broadcom is also OpenAI's chip design partner for the XPU
- Broadcom already in suppliers table; needs product_supplier links for these products

### 4f. Huawei in-house HBM
- Huawei is developing its own HBM starting with Ascend 950PR (Q1 2026)
  - 950PR: 128 GB in-house HBM, 1.6 TB/s bandwidth
  - 950DT: 144 GB in-house HBM, 4 TB/s bandwidth
- This means for Ascend 950+ chips, SMIC is no longer the sole supplier concern — Huawei has its own memory
- No new supplier entry needed yet (Huawei is vertically integrated here), but the product specs for 950PR/DT should note in-house HBM

### 4g. domains_supplied field — all 50 suppliers show empty array
- The `domains_supplied` column is [] for every supplier. This should be populated based on which product domains (logic/memory) each supplier serves.

---

## 5. POTENTIAL DUPLICATES / OVERLAP

| Issue | Details |
|---|---|
| `amd-mi300x` vs `amd-mi325x` | Both CDNA3, similar die. MI325X is a direct HBM3E refresh of MI300X — this is intentional, not a duplicate. |
| `nvidia-blackwell-platform` vs `nvidia-gb300-nvl72` | Both represent GB300 NVL72 rack systems. Consider consolidating or clarifying the distinction (one is the chip, one is the rack). |
| `google-tpu-v8` | Should be two entries (8t and 8i) — not a duplicate but an incomplete representation. |
| `aws-trainium3-ultraserver` | This is a system product (like nvidia-blackwell-platform). Is the taxonomy intentional for system-level vs. chip-level? Worth making explicit. |

---

## 6. PROCESS NODE CORRECTIONS

| Product ID | Current Node | Correct Node |
|---|---|---|
| `amd-mi355x` | TSMC 3nm | TSMC N3P (XCDs) + TSMC N6 (IOD) |
| `amd-mi350x` (new) | — | TSMC N3P (XCDs) + TSMC N6 (IOD) |
| `aws-trainium3` | TSMC N3 | TSMC N3P |
| `huawei-ascend950pr` | SMIC | SMIC (5nm-class, same as 910D generation) |
| `google-tpu-v7` | TSMC N3P ✅ | TSMC N3P (correct) |

---

## 7. SUMMARY COUNTS

| Category | Count |
|---|---|
| Missing products to add | 6 (MI350X, OpenAI XPU, TPU 8t, TPU 8i, AmpereOne M, AmpereOne MX, Galaxy Blackhole) |
| Status corrections | 2 confirmed (meta-mtia-300 → production; huawei-ascend950pr → sampling) |
| BOM corrections needed | 8 products |
| Supplier gaps | 1 new supplier (MediaTek); multiple missing product_supplier links |
| Process node corrections | 3 products |
| Potential duplicate/consolidation | 2 cases to review |

---

*Research conducted June 24, 2026. Sources: TrendForce, Tom's Hardware, TechInsights, ServeTheHome, DataCenter Dynamics, Tweaktown, AMD/NVIDIA/Google official blogs, Digitimes, TechPowerUp.*
