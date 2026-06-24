# AI Atlas — Semiconductor Taxonomy & Manufacturing Reference

*Reference for defining the `domain` / `subcategory` controlled vocabulary and the supplier/value-chain structure. Built on the industry-standard WSTS device segmentation (ICs + O-S-D) so it lines up with how market data is actually reported.*

---

## 0. The one design rule: categories vs. attributes

Before listing anything, separate two different things, or the taxonomy will explode into thousands of meaningless leaves:

- **Category** = *what the product is.* A branch in the tree. Each product maps to exactly one leaf. (e.g., `memory.dram.hbm`)
- **Attribute** = *a property that cuts across categories.* A facet, stored as a field, used for filtering. (e.g., process node, material system, integration level.)

Test: "5nm" is **not** a subcategory — a logic GPU, a memory controller, and a CPU can all be 5nm. It's an attribute. "HBM" **is** a subcategory — it's a distinct kind of thing with its own supply chain. When in doubt, ask: *does this branch have a materially different BOM, supplier set, or spec sheet?* If yes → category. If it just describes a variant → attribute.

The cross-cutting attributes are listed in §4. Use them generously; they're how you get fine-grained filtering without a bloated tree.

---

## PART A — DEVICE TAXONOMY

Top level follows WSTS: **Integrated Circuits** (Logic, Memory, Micro, Analog) + **Optoelectronics**, **Sensors/Actuators**, **Discretes** — the "ICs + O-S-D" backbone. RF is broken out separately below because its supply chain (III-V materials, specialty foundries) is genuinely distinct.

Legend: **[NOW]** = build in Phase 1 (Logic + Memory). **[LATER]** = scaffold the branch, populate later.

### A1. Logic **[NOW]**
- **AI accelerators** *(first-class given the atlas focus; use `type` attribute = gpu | asic)*
  - Data-center training/inference GPUs (NVIDIA, AMD Instinct)
  - Custom AI ASICs (Google TPU, AWS Trainium/Inferentia, Microsoft Maia, Meta MTIA)
  - Edge/embedded AI accelerators (NPUs)
- **GPUs (graphics)** — consumer/pro visualization
- **CPUs** *(see note on Micro overlap)*
  - Server / data-center
  - Client (desktop, laptop)
- **Application SoCs**
  - Mobile application processors
  - Automotive SoCs
  - Consumer / set-top / edge
- **FPGAs & programmable logic** (FPGA, CPLD)
- **Networking & infrastructure logic** — switch/router silicon, DPUs/SmartNICs, retimers
- **ASICs / ASSPs** — full-custom and standard-cell application-specific
- **Standard / glue logic** — gates, buffers, level translators (74xx-class)
- **Display driver ICs (DDIC)** *(sometimes classed mixed-signal)*
- **Security / crypto ICs**

### A2. Memory **[NOW]**
- **DRAM (volatile)**
  - Commodity: **DDR** (DDR4, DDR5), **LPDDR** (mobile/low-power), **GDDR** (graphics)
  - **HBM** (HBM2/2E, HBM3, HBM3E, HBM4) — TSV-stacked *(keystone product — see schema)*
  - Specialty / legacy DRAM
- **SRAM** — standalone (embedded SRAM is an attribute of logic, not a product here)
- **NAND Flash (non-volatile)**
  - 3D NAND (track layer count as attribute; cell type SLC/MLC/TLC/QLC/PLC as attribute)
  - Managed NAND: eMMC, UFS
  - SSDs (controller + NAND — straddles into *systems*; decide if in scope)
- **NOR Flash** — serial (SPI), parallel
- **Other ROM / EEPROM**
- **Emerging NVM** — MRAM (STT/SOT), ReRAM/RRAM, PCM, FeRAM/FRAM

### A3. Micro (microcomponents) **[NOW-ish]**
> ⚠️ **Design tension:** WSTS separates "Micro" (MPU/MCU/DSP) from "Logic," but in modern usage CPUs *are* logic SoCs. **Recommendation:** collapse MPUs/CPUs into Logic and keep only MCU/DSP here, OR keep WSTS split and use a `wsts_class` attribute. Pick one and document it.
- **Microcontrollers (MCU)** — 8/16/32-bit; by core (Arm Cortex-M, RISC-V, proprietary)
- **DSPs** — digital signal processors
- **(MPUs)** — historically here; recommend folding into Logic › CPUs

### A4. Analog **[LATER]**
- **Signal chain**
  - Amplifiers (op-amp, instrumentation, comparator)
  - Data converters (ADC, DAC)
  - Interface / line drivers / transceivers (RS-485, CAN, LVDS)
  - Switches, multiplexers, filters
- **Power management (PMIC)** *(straddles Power — see tension below)*
  - Linear regulators (LDO), switching regulators (buck/boost/DC-DC)
  - PMICs, power sequencers, supervisors
  - Battery management & charging
  - Gate drivers, hot-swap, eFuses
- **Clock & timing** — oscillators, PLLs, clock buffers/generators

> ⚠️ **Design tension:** PMIC and gate drivers sit between Analog and Power. Recommendation: classify *control/conversion ICs* as Analog, *raw switching devices* (MOSFET/IGBT/SiC/GaN) as Discretes/Power. Document the boundary.

### A5. RF / Wireless **[LATER]** *(broken out from Analog)*
- Power amplifiers (PA) — GaAs, GaN
- Low-noise amplifiers (LNA)
- RF switches, mixers, synthesizers, VCOs
- Filters — SAW, BAW/FBAR
- RF front-end modules (FEM) — integrated
- Transceivers (RFIC), mmWave (5G, radar)
- Connectivity SoCs (Wi-Fi / BT / UWB / GNSS) *(overlaps Logic SoC)*

### A6. Optoelectronics **[LATER]**
- CMOS image sensors (CIS)
- LEDs (visible, UV, IR), micro-LED
- Laser diodes — VCSEL, edge-emitting (datacom, lidar, sensing)
- Photodetectors / photodiodes
- Optocouplers / digital isolators
- **Silicon photonics** — optical transceivers, co-packaged optics *(rising fast for AI datacenter interconnect; bridges to Networking logic)*

### A7. Sensors & Actuators **[LATER]**
- **MEMS** — inertial (accelerometer, gyro, IMU), pressure, MEMS microphone, micromirror/DLP, MEMS oscillator, microfluidics
- **Magnetic** — Hall-effect, magnetometer, TMR/GMR
- **Environmental** — temperature, humidity, gas/chemical
- **Optical** — proximity, ambient light, time-of-flight (ToF), fingerprint
- **Ultrasonic**, **actuators** (haptic drivers)

### A8. Discretes & Power devices **[LATER]**
- **Diodes** — rectifier, Schottky, Zener, TVS, varactor
- **Transistors**
  - BJT
  - MOSFET (low / mid / high voltage)
  - IGBT
  - **Wide-bandgap**: SiC MOSFET/diode, GaN HEMT *(distinct substrate supply chain)*
  - RF power: LDMOS, GaAs, GaN-on-SiC
- **Thyristors** — SCR, TRIAC
- **Power modules** — IPM, half/full-bridge modules
- *(Passives — R/L/C — are not semiconductors; exclude as products, but they appear in board-level BOMs.)*

---

## PART B — MANUFACTURING & VALUE CHAIN

This defines your **value-chain stages** (the columns) and the **supplier categories**. Equipment and Materials are large enough that you may eventually treat them as their own atlas domains, not just supplier tags.

### B1. Business-model layer (how to tag a *company*)
- **IDM** (designs + fabs + tests own chips): Intel, Samsung, Micron, SK Hynix, TI, Infineon
- **Fabless** (designs only): NVIDIA, AMD, Qualcomm, Broadcom, Apple silicon, MediaTek
- **Pure-play foundry** (fabs others' designs): TSMC, GlobalFoundries, UMC, SMIC
- **Fab-lite** (hybrid): some analog/power players
- **OSAT** (outsourced assembly & test): ASE, Amkor, JCET, Powertech, Tongfu
- **Ecosystem enablers**: EDA vendors, IP vendors, design-service houses

A company can hold several roles; store `business_models` as a list.

### B2. The value chain (end to end) — your stage spine

**1. Design & IP**
- EDA tools: synthesis, place-and-route, verification/simulation, DFT, physical sign-off (Synopsys, Cadence, Siemens EDA)
- IP cores: CPU/GPU IP, interface PHYs (PCIe, HBM, USB, DDR), memory controllers, SerDes (Arm, SiFive/RISC-V, Imagination, Ceva, Alphawave)
- Foundry PDKs & design services

**2. Front-end manufacturing (wafer fab / cleanroom)**
- *Starting material:* silicon wafer (also SOI, SiC, GaN-on-Si, GaAs, InP)
- *Unit process modules* (repeated hundreds of times to build layers):
  - **Deposition** — CVD (PECVD/LPCVD), **ALD**, PVD/sputtering, epitaxy
  - **Photolithography** — coat/develop track, exposure (**DUV immersion**, **EUV**, **High-NA EUV** ramping), reticle/photomask
  - **Etch** — dry/plasma (RIE), wet
  - **Doping** — ion implantation, diffusion, anneal (RTP)
  - **Planarization** — CMP
  - **Clean / metrology / inspection** — overlay, CD, defect review
- *Process integration zones:* **FEOL** (transistors) → **MOL** (contacts) → **BEOL** (interconnect metal stack)
- *Transistor architecture* (attribute axis): planar → **FinFET** → **GAA / nanosheet** → **CFET** (future)

**3. Wafer test / probe (sort)** — electrical test at wafer level, binning

**4. Back-end manufacturing (assembly & packaging)**
- Wafer thinning, dicing/singulation
- Interconnect: wire bond **or** flip-chip (bumping / C4 / micro-bump)
- *Traditional packaging:* leadframe, BGA, QFN, etc.
- *Substrate:* organic, **ABF (Ajinomoto Build-up Film)** — a recurring capacity bottleneck
- **Advanced packaging** *(the part that dominates AI-accelerator BOMs):*
  - **2.5D** — silicon interposer / RDL interposer; **CoWoS** (chip-on-wafer-on-substrate)
  - **3D** — die stacking, **TSV** (through-silicon via), **SoIC / hybrid bonding**
  - **Fan-out** — InFO, FOWLP/FOPLP
  - **Chiplets** + die-to-die interconnect (**UCIe** standard); **EMIB** (embedded bridge)
  - SiP (system-in-package), PoP (package-on-package)

**5. Final test** — electrical, burn-in, system-level test (SLT)

**6. Distribution** — distributors (Arrow, Avnet, WPG, Future) and direct channels

### B3. Equipment layer (WFE — wafer fab equipment) *(highly concentrated)*
- **Lithography**: ASML (sole EUV/High-NA source), Canon, Nikon
- **Deposition**: Applied Materials, Lam Research, TEL, ASM International
- **Etch**: Lam, TEL, Applied
- **CMP**: Applied, Ebara
- **Ion implant**: Applied, Axcelis
- **Metrology / inspection**: KLA (leader), Applied, Onto
- **Test (ATE) & handlers**: Advantest, Teradyne; Cohu
- **Advanced-packaging / bonding tools**: BESI, ASMPT, Hanmi

### B4. Materials layer *(distinct supplier set)*
- **Silicon wafers**: Shin-Etsu, SUMCO, Siltronic, GlobalWafers
- **Photoresist & ancillaries**: JSR, Tokyo Ohka, Shin-Etsu, Fujifilm
- **Specialty / electronic gases**: Air Liquide, Linde, Merck
- **CMP slurries & pads**: CMC, DuPont, Merck
- **Precursors / sputtering targets** (ALD/CVD/PVD)
- **Photomask blanks & masks**: Hoya, Toppan, Photronics
- **Package substrates (ABF)**: Ibiden, Unimicron, Shinko
- **Bonding wire, lead frames, mold compound**
- **Wide-bandgap substrates**: SiC (Wolfspeed, Coherent), GaN

---

## PART C — CROSS-CUTTING ATTRIBUTES (facets, not categories)

Store these as fields on every product so users can filter across the whole tree:

- `process_node` — e.g., "TSMC N3E", "Samsung 1b-nm DRAM"
- `node_maturity` — leading_edge (≤7nm) | advanced (7–28nm) | mature (≥28nm) | legacy
- `transistor_arch` — planar | finfet | gaa_nanosheet | cfet
- `material_system` — si | soi | sic | gan | gaas | inp | sige
- `wafer_size` — 200mm | 300mm
- `integration_level` — die | package | module | board | system *(critical: an HBM die, an HBM stack, and a DIMM are different levels of the same lineage)*
- `package_type` — flip_chip_bga | cowos | info | wirebond_qfn | …
- `end_market` — datacenter | mobile | automotive | industrial | consumer | comms

---

## PART D — How this maps to the AI Atlas schema

- **Part A (devices)** → the `domain` + `subcategory` enum tree on Product records. Build Logic + Memory leaves now; scaffold the rest as empty branches.
- **Part B2 (value chain)** → the `supply_chain` stage links; each stage points to Supplier records.
- **Part B1 (business models)** → `business_models` field on Supplier records.
- **Part B3 / B4 (equipment, materials)** → start as Supplier categories; promote to full atlas **domains** later (they have rich products of their own — an EUV scanner or an ABF substrate deserves a record).
- **Part C (attributes)** → faceting fields on Product records.

### Ready-to-use enum: Phase 1 `subcategory` values
```
logic.ai_accelerator.gpu
logic.ai_accelerator.asic
logic.ai_accelerator.edge_npu
logic.gpu_graphics
logic.cpu.server
logic.cpu.client
logic.soc.mobile
logic.soc.automotive
logic.fpga
logic.networking
logic.asic_assp
logic.standard_logic
micro.mcu
micro.dsp
memory.dram.ddr
memory.dram.lpddr
memory.dram.gddr
memory.dram.hbm
memory.sram
memory.nand.raw
memory.nand.managed
memory.nor
memory.emerging_nvm
```

---

## Open decisions this surfaces
1. **Micro vs Logic** — fold MPUs into Logic, or keep WSTS split? (Recommend fold.)
2. **PMIC/gate drivers** — Analog or Power boundary. (Recommend control ICs = Analog, switches = Discretes.)
3. **SSDs / DIMMs / modules** — are board/module-level assemblies in scope, or only bare die/package? (`integration_level` lets you include them cleanly if yes.)
4. **Equipment & Materials** — supplier tags now, full domains later? (Recommend yes, later.)
5. **RF** — own domain (recommended) vs. WSTS-style under Analog.
