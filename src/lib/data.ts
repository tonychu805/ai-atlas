// ─── Lookup tables ────────────────────────────────────────────────────────────

export const STAGES = [
  { key: 'design_ip_eda', label: 'Design / EDA' },
  { key: 'foundry_fab',   label: 'Foundry' },
  { key: 'materials',     label: 'Materials' },
  { key: 'equipment',     label: 'Equipment' },
  { key: 'packaging_osat',label: 'Packaging' },
  { key: 'test',          label: 'Test' },
  { key: 'distribution',  label: 'Distribution' },
] as const

export type StageKey = (typeof STAGES)[number]['key']

export const STAGE_LABELS: Record<string, string> = Object.fromEntries(STAGES.map(s => [s.key, s.label]))

export const DOMAIN_LIST = ['logic','memory','micro','analog','rf','opto','sensors','discretes'] as const
export type DomainKey = typeof DOMAIN_LIST[number]

export const DOMAINS: Record<DomainKey, {
  label: string; phase: 'now' | 'later'; color: string; summary: string;
  subs: { key: string; label: string }[]
}> = {
  logic:    { label: 'Logic',    phase: 'now',   color: '#9a6b3f', summary: 'Compute silicon — AI accelerators, CPUs, GPUs, SoCs and programmable logic.',
    subs: [ { key:'ai_accelerator',label:'AI Accelerators'},{key:'gpu_graphics',label:'GPUs (graphics)'},{key:'cpu',label:'CPUs'},{key:'soc',label:'Application SoCs'},{key:'fpga',label:'FPGA / PLD'},{key:'networking',label:'Networking logic'},{key:'asic_assp',label:'ASIC / ASSP'},{key:'standard_logic',label:'Standard logic'} ] },
  memory:   { label: 'Memory',   phase: 'now',   color: '#3f7d7a', summary: 'Volatile and non-volatile storage — HBM is the keystone for AI accelerators.',
    subs: [ { key:'dram_hbm',label:'HBM'},{key:'dram_commodity',label:'DRAM (DDR / LPDDR / GDDR)'},{key:'nand',label:'NAND Flash'},{key:'nor',label:'NOR Flash'},{key:'sram',label:'SRAM'},{key:'emerging_nvm',label:'Emerging NVM'} ] },
  micro:    { label: 'Micro',    phase: 'now',   color: '#b0894a', summary: 'Microcontrollers and DSPs. MPUs fold into Logic per the taxonomy.',
    subs: [ {key:'mcu',label:'MCU'},{key:'dsp',label:'DSP'} ] },
  analog:   { label: 'Analog',   phase: 'later', color: '#6b7f86', summary: 'Signal chain, power management and clock/timing. Scaffolded for a later phase.',
    subs: [ {key:'signal_chain',label:'Signal chain'},{key:'pmic',label:'Power management'},{key:'clock_timing',label:'Clock & timing'} ] },
  rf:       { label: 'RF / Wireless', phase: 'later', color: '#8c6a8e', summary: "RF front-end and connectivity — its own III-V materials supply chain.",
    subs: [ {key:'pa_lna',label:'PA / LNA'},{key:'rf_switch',label:'Switches / mixers'},{key:'filters',label:'Filters (SAW / BAW)'},{key:'fem',label:'Front-end modules'},{key:'transceivers',label:'Transceivers'},{key:'connectivity',label:'Connectivity SoC'} ] },
  opto:     { label: 'Optoelectronics', phase: 'later', color: '#4f7a9a', summary: 'Image sensors, lasers and silicon photonics — rising for datacenter interconnect.',
    subs: [ {key:'cis',label:'Image sensors'},{key:'led',label:'LEDs'},{key:'laser',label:'Laser diodes'},{key:'photodetector',label:'Photodetectors'},{key:'silicon_photonics',label:'Silicon photonics'} ] },
  sensors:  { label: 'Sensors',  phase: 'later', color: '#7d8a52', summary: 'MEMS, magnetic, environmental and optical sensing and actuators.',
    subs: [ {key:'mems',label:'MEMS'},{key:'magnetic',label:'Magnetic'},{key:'environmental',label:'Environmental'},{key:'optical_sensor',label:'Optical'} ] },
  discretes:{ label: 'Discretes & Power', phase: 'later', color: '#a06650', summary: 'Diodes, power transistors and wide-bandgap SiC / GaN devices.',
    subs: [ {key:'diodes',label:'Diodes'},{key:'mosfet',label:'MOSFET'},{key:'igbt',label:'IGBT'},{key:'wbg',label:'SiC / GaN'},{key:'power_modules',label:'Power modules'} ] },
}

export const SUBCAT: Record<string, string> = {
  ai_accelerator_gpu: 'AI GPU', ai_accelerator_asic: 'AI ASIC', cpu_server: 'Server CPU',
  cpu_client: 'Client CPU', soc_mobile: 'Mobile SoC', soc: 'Platform / Rack-scale',
  fpga: 'FPGA', mcu_embedded: 'MCU / Embedded',
  networking_dpu: 'Networking / DPU', dram_hbm: 'HBM', dram_commodity: 'DRAM', nand: 'NAND',
  nor: 'NOR Flash', emerging: 'Emerging Memory',
}

export const NODE_MAT: Record<string, string> = { leading_edge: 'Leading edge (≤7nm)', advanced: 'Advanced (7–28nm)', mature: 'Mature (≥28nm)', legacy: 'Legacy' }
export const ARCH: Record<string, string> = { planar: 'Planar', finfet: 'FinFET', gaa_nanosheet: 'GAA nanosheet', cfet: 'CFET' }
export const MAT: Record<string, string> = { si: 'Silicon', soi: 'SOI', sic: 'SiC', gan: 'GaN', gaas: 'GaAs', inp: 'InP' }
export const INTEG: Record<string, string> = { die: 'Die', package: 'Package', module: 'Module', board: 'Board', system: 'System' }
export const MARKET: Record<string, string> = { datacenter: 'Datacenter', mobile: 'Mobile', automotive: 'Automotive', industrial: 'Industrial', consumer: 'Consumer', comms: 'Comms' }
export const PACK: Record<string, string> = { cowos_2_5d: '2.5D / CoWoS', emib_2_5d: '2.5D / EMIB', stacked_3d: '3D stack / TSV', fanout: 'Fan-out / InFO', standard: 'Standard / flip-chip' }
export const LIFECYCLE: Record<string, string> = { production: 'Production', sampling: 'Sampling', announced: 'Announced', eol: 'End of life' }
export const COMPANY: Record<string, string> = { fabless: 'Fabless', idm: 'IDM', foundry: 'Foundry' }

export const VENDOR_TYPE: Record<string, string> = {
  "AMD": "fabless",
  "AWS": "fabless",
  "Ampere": "fabless",
  "Broadcom": "fabless",
  "Cerebras": "fabless",
  "Etched": "fabless",
  "Google": "fabless",
  "Groq": "fabless",
  "Huawei": "fabless",
  "Intel": "idm",
  "Marvell": "fabless",
  "Meta": "fabless",
  "Micron": "idm",
  "Microsoft": "fabless",
  "NVIDIA": "fabless",
  "OpenAI": "fabless",
  "Qualcomm": "fabless",
  "SK Hynix": "idm",
  "SambaNova": "fabless",
  "Samsung": "idm",
  "Tenstorrent": "fabless",
  "Tesla": "fabless",
  "UALink Consortium": "fabless",
}

export const PRODUCT_PACK: Record<string, string> = {
  "amd-epyc-bergamo": "standard",
  "amd-epyc-genoa": "standard",
  "amd-epyc-milan": "standard",
  "amd-epyc-turin": "standard",
  "amd-epyc-venice": "standard",
  "amd-epyc-verano": "standard",
  "amd-mi-next": "stacked_3d",
  "amd-mi100": "cowos_2_5d",
  "amd-mi250x": "cowos_2_5d",
  "amd-mi300a": "stacked_3d",
  "amd-mi300x": "stacked_3d",
  "amd-mi325x": "stacked_3d",
  "amd-mi355x": "stacked_3d",
  "amd-mi430x": "stacked_3d",
  "amd-mi440x": "stacked_3d",
  "amd-mi455x": "stacked_3d",
  "amd-mi500": "stacked_3d",
  "amd-pensando-pollara400": "standard",
  "amd-pensando-vulcano800": "standard",
  "ampere-altra": "standard",
  "ampere-ampereone": "standard",
  "aws-graviton2": "standard",
  "aws-graviton3": "standard",
  "aws-graviton4": "standard",
  "aws-graviton5": "standard",
  "aws-inferentia": "standard",
  "aws-inferentia2": "cowos_2_5d",
  "aws-nitro": "standard",
  "aws-trainium": "cowos_2_5d",
  "aws-trainium2": "cowos_2_5d",
  "aws-trainium3": "cowos_2_5d",
  "aws-trainium4": "cowos_2_5d",
  "broadcom-jericho3": "standard",
  "broadcom-jericho4": "standard",
  "broadcom-tomahawk-ultra": "standard",
  "broadcom-tomahawk5": "standard",
  "broadcom-tomahawk6": "standard",
  "etched-sohu": "cowos_2_5d",
  "google-axion": "standard",
  "google-jupiter": "standard",
  "google-tpu-v1": "standard",
  "google-tpu-v2": "cowos_2_5d",
  "google-tpu-v3": "cowos_2_5d",
  "google-tpu-v4": "cowos_2_5d",
  "google-tpu-v5e": "cowos_2_5d",
  "google-tpu-v5p": "cowos_2_5d",
  "google-tpu-v6e": "cowos_2_5d",
  "google-tpu-v7": "cowos_2_5d",
  "google-tpu-v8": "cowos_2_5d",
  "groq-lpu-v1": "standard",
  "groq-lpu-v2": "standard",
  "groq-lpu-v3": "standard",
  "huawei-ascend910": "cowos_2_5d",
  "huawei-ascend910b": "cowos_2_5d",
  "huawei-ascend910c": "cowos_2_5d",
  "huawei-ascend910d": "cowos_2_5d",
  "huawei-ascend950dt": "cowos_2_5d",
  "huawei-ascend950pr": "cowos_2_5d",
  "huawei-ascend960": "cowos_2_5d",
  "huawei-ascend970": "cowos_2_5d",
  "intel-crescent-island": "standard",
  "intel-falcon-shores": "standard",
  "intel-gaudi2": "cowos_2_5d",
  "intel-gaudi3": "cowos_2_5d",
  "intel-jaguar-shores": "cowos_2_5d",
  "intel-pvc": "stacked_3d",
  "intel-xeon-6": "emib_2_5d",
  "intel-xeon-emerald": "emib_2_5d",
  "intel-xeon-ice-lake": "standard",
  "intel-xeon-sapphire": "emib_2_5d",
  "intel-xeon6-clearwater": "stacked_3d",
  "intel-xeon6-sierra": "emib_2_5d",
  "intel-xeon7": "stacked_3d",
  "intel-xeon8": "stacked_3d",
  "marvell-networking": "standard",
  "meta-mtia-300": "standard",
  "meta-mtia-400": "standard",
  "meta-mtia-500": "standard",
  "meta-mtia-v1": "standard",
  "meta-mtia-v2": "standard",
  "micron-ddr5": "standard",
  "micron-gddr6": "standard",
  "micron-gddr7": "standard",
  "micron-hbm2e": "stacked_3d",
  "micron-hbm3": "stacked_3d",
  "micron-hbm3e-12hi": "stacked_3d",
  "micron-hbm3e-8hi": "stacked_3d",
  "micron-hbm4": "stacked_3d",
  "micron-hbm4-16hi": "stacked_3d",
  "micron-hbm4e": "stacked_3d",
  "micron-lpddr5x": "standard",
  "micron-lpddr6": "standard",
  "micron-mrdimm": "standard",
  "micron-mrdimm-gen2": "standard",
  "micron-socamm2": "standard",
  "microsoft-cobalt100": "standard",
  "microsoft-cobalt200": "cowos_2_5d",
  "microsoft-maia100": "cowos_2_5d",
  "microsoft-maia200": "cowos_2_5d",
  "nvidia-a100": "cowos_2_5d",
  "nvidia-b100": "cowos_2_5d",
  "nvidia-b200": "cowos_2_5d",
  "nvidia-b300": "cowos_2_5d",
  "nvidia-bluefield3": "standard",
  "nvidia-bluefield4": "standard",
  "nvidia-bluefield5": "standard",
  "nvidia-connectx7": "standard",
  "nvidia-connectx8": "standard",
  "nvidia-connectx9": "standard",
  "nvidia-cx10-ib": "standard",
  "nvidia-feynman": "stacked_3d",
  "nvidia-feynman-ultra": "stacked_3d",
  "nvidia-gb200": "cowos_2_5d",
  "nvidia-gh200": "cowos_2_5d",
  "nvidia-grace": "standard",
  "nvidia-h100": "cowos_2_5d",
  "nvidia-h200": "cowos_2_5d",
  "nvidia-nvlink6": "standard",
  "nvidia-nvlink7": "standard",
  "nvidia-nvlink8": "standard",
  "nvidia-nvswitch3": "standard",
  "nvidia-nvswitch4": "standard",
  "nvidia-quantum-x800": "standard",
  "nvidia-r100-rubin": "cowos_2_5d",
  "nvidia-rubin-cpx": "cowos_2_5d",
  "nvidia-rubin-ultra": "cowos_2_5d",
  "nvidia-spectrum4": "standard",
  "nvidia-spectrum5": "standard",
  "nvidia-spectrum6": "standard",
  "nvidia-spectrum7": "standard",
  "nvidia-v100": "cowos_2_5d",
  "nvidia-vera-cpu": "standard",
  "qualcomm-ai100": "standard",
  "qualcomm-ai200": "standard",
  "qualcomm-ai250": "standard",
  "qualcomm-dc-next": "standard",
  "sambanova-sn40l": "cowos_2_5d",
  "sambanova-sn50": "cowos_2_5d",
  "samsung-ddr5": "standard",
  "samsung-gddr6": "standard",
  "samsung-gddr7": "standard",
  "samsung-hbm2e": "stacked_3d",
  "samsung-hbm3": "stacked_3d",
  "samsung-hbm3e-12hi": "stacked_3d",
  "samsung-hbm3e-8hi": "stacked_3d",
  "samsung-hbm4": "stacked_3d",
  "samsung-hbm4-16hi": "stacked_3d",
  "samsung-hbm4e": "stacked_3d",
  "samsung-lpddr5x": "standard",
  "samsung-lpddr6": "standard",
  "samsung-mrdimm": "standard",
  "samsung-mrdimm-gen2": "standard",
  "samsung-socamm2": "standard",
  "skhynix-ddr5": "standard",
  "skhynix-gddr6": "standard",
  "skhynix-gddr7": "standard",
  "skhynix-hbm2e": "stacked_3d",
  "skhynix-hbm3": "stacked_3d",
  "skhynix-hbm3e-12hi": "stacked_3d",
  "skhynix-hbm3e-8hi": "stacked_3d",
  "skhynix-hbm4": "stacked_3d",
  "skhynix-hbm4-16hi": "stacked_3d",
  "skhynix-hbm4e": "stacked_3d",
  "skhynix-lpddr5x": "standard",
  "skhynix-lpddr6": "standard",
  "skhynix-mrdimm": "standard",
  "skhynix-mrdimm-gen2": "standard",
  "skhynix-socamm2": "standard",
  "tenstorrent-blackhole": "standard",
  "tenstorrent-wormhole": "standard",
  "tesla-ai4": "standard",
  "tesla-ai5": "standard",
  "tesla-ai6": "standard",
  "tesla-ai7": "standard",
  "tesla-dojo-d1": "stacked_3d",
  "tesla-dojo2": "stacked_3d",
  "ualink-consortium": "standard",
}

export const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  production: { bg: '#dcfce7', fg: '#166534' },
  sampling:   { bg: '#fef9c3', fg: '#854d0e' },
  announced:  { bg: '#dbeafe', fg: '#1e40af' },
  eol:        { bg: '#f1f0ec', fg: '#6b7280' },
}

export const CONF_STYLE: Record<string, { l: string; c: string }> = {
  high: { l: 'High', c: '#16a34a' },
  med:  { l: 'Med',  c: '#d97706' },
  low:  { l: 'Low',  c: '#dc2626' },
}

export const MODEL_LABEL: Record<string, string> = {
  idm: 'IDM', fabless: 'Fabless', foundry: 'Foundry', osat: 'OSAT', eda: 'EDA', ip: 'IP',
  equipment: 'Equipment', materials: 'Materials', distribution: 'Distribution',
  design_services: 'Design services', gases: 'Gases', infrastructure: 'Infrastructure',
}
export const MODEL_COLOR: Record<string, { bg: string; fg: string }> = {
  idm:              { bg: '#e7f0ef', fg: '#2c6360' }, foundry:      { bg: '#e7f0ef', fg: '#2c6360' },
  osat:             { bg: '#e7f0ef', fg: '#2c6360' }, fabless:      { bg: '#eceef5', fg: '#475569' },
  eda:              { bg: '#eceef5', fg: '#475569' }, ip:           { bg: '#eceef5', fg: '#475569' },
  design_services:  { bg: '#eceef5', fg: '#475569' }, equipment:    { bg: '#f3ecdf', fg: '#8a5a2b' },
  materials:        { bg: '#f1eae3', fg: '#7a5230' }, distribution: { bg: '#f1f0ec', fg: '#6b6557' },
  gases:            { bg: '#eaf0ec', fg: '#3f6b50' }, infrastructure:{ bg: '#eef0f3', fg: '#566273' },
}

export const FACET_DEFS: { key: string; label: string; map: Record<string,string>; get: (p: Product) => string | undefined }[] = [
  { key: 'status',        label: 'Status',        map: LIFECYCLE, get: p => p.status },
  { key: 'company_type',  label: 'Company type',  map: COMPANY,   get: p => VENDOR_TYPE[p.vendor] },
  { key: 'packaging',     label: 'Packaging',     map: PACK,      get: p => PRODUCT_PACK[p.id] },
  { key: 'node_maturity', label: 'Node maturity', map: NODE_MAT,  get: p => p.attrs?.node_maturity },
  { key: 'transistor_arch',label:'Transistor arch',map: ARCH,     get: p => p.attrs?.transistor_arch },
  { key: 'material_system',label:'Material',       map: MAT,      get: p => p.attrs?.material_system },
  { key: 'integration_level',label:'Integration',  map: INTEG,    get: p => p.attrs?.integration_level },
  { key: 'end_market',    label: 'End market',    map: MARKET,    get: p => p.attrs?.end_market },
]

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BomItem {
  label: string
  cost: number
  qty?: number
  note?: string
  conf?: string
  source?: string
  ref?: string
}

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

export interface Supplier {
  id: string
  name: string
  hq: string
  models: string[]
  stages: StageKey[]
}

export interface Term {
  term: string
  acronym?: string
  aliases?: string[]
  category: 'concept' | 'process' | 'component' | 'material' | 'metric' | 'org_type'
  l1: string
  analogy?: string
  l2?: string
  l3?: string
  why?: string
  relations?: { type: string; target: string }[]
  entities?: string[]
  products?: string[]
  process?: {
    stage: StageKey
    steps: string[]
    equipment?: string[]
    materials?: string[]
  }
  sources?: string[]
}

export interface ValueChainStage {
  key: StageKey
  label: string
  desc: string
  subs: string[]
  groups: { title: string; ids: string[] }[]
}

// ─── Sources ─────────────────────────────────────────────────────────────────

export const SOURCES: Record<string, { title: string; meta: string }> = {
  'src-001': { title: 'Blackwell Architecture Technical Brief',  meta: 'NVIDIA · datasheet · 2024-03' },
  'src-002': { title: 'AI accelerator BOM cost estimates',        meta: 'Silicon Analysts · estimate · 2026-04' },
  'src-003': { title: 'B200 package teardown analysis',           meta: 'TechInsights · teardown · 2025-09' },
  'src-004': { title: 'HBM3E product datasheet',                  meta: 'SK Hynix · datasheet · 2024-05' },
  'est':     { title: 'AI Atlas internal cost model',             meta: 'AI Atlas · estimate · 2026-06' },
}

// ─── Products & Suppliers (moved to Supabase) ────────────────────────────────
// PRODUCTS and SUPPLIERS data now lives in Supabase. Read it via src/lib/db.ts
// (getProducts / getProduct / getProductNames / getSuppliers). The Product and
// Supplier TYPES above remain the shared shape. Editorial + taxonomy (SOURCES,
// PRODUCT_BRIEF, TERMS, VALUE_CHAIN, DOMAINS, STAGES, FACET_DEFS, VENDOR_TYPE,
// PRODUCT_PACK, …) intentionally stay in this file.
// ─── Product briefs ───────────────────────────────────────────────────────────

export const PRODUCT_BRIEF: Record<string, { l1: string; analogy?: string; l2?: string; l3?: string; why?: string; keyTerms?: string[] }> = {
  'nvidia-b200': {
    l1: "NVIDIA's flagship AI accelerator — two large compute dies plus eight HBM3E memory stacks packaged together to act as one enormous chip.",
    analogy: "A racing engine bolted directly to its fuel tanks so nothing starves it.",
    l2: "B200 pairs dual reticle-sized dies with 192 GB of HBM3E on a CoWoS package. The memory sits millimetres from compute so the chip isn't starved for bandwidth during training.",
    l3: "Built on TSMC 4NP (~208B transistors), with ~8 TB/s memory bandwidth, NVLink 5 and a 1,000W TDP in SXM form factor. HBM and advanced packaging dominate its build cost.",
    why: "The B200 is the reference design the entire AI-hardware supply chain is racing to feed — its HBM and CoWoS demand set the market.",
    keyTerms: ['hbm','cowos','chiplet','finfet','bandwidth'],
  },
  'skhynix-hbm3e-8hi': {
    l1: "A single stack of eight DRAM chips wired vertically and built to sit right beside an AI processor, feeding it data at huge speed.",
    analogy: "A parking garage instead of a parking lot — same cars, far less walking.",
    l2: "This 8-high HBM3E stack delivers 24 GB and ~1.2 TB/s over a 1024-bit interface. Through-silicon vias connect the dies; the stack mounts on the accelerator's interposer.",
    l3: "Built on 1b-nm DRAM, 8-Hi over a base logic die at ~9.6 Gbps/pin. SK Hynix leads HBM share, and stacking yield is a tight constraint.",
    why: "HBM is the highest-value component in an AI accelerator after the logic die, and SK Hynix's lead makes it a strategic supplier.",
    keyTerms: ['hbm','tsv','interposer','bandwidth'],
  },
  'amd-mi300x': {
    l1: "AMD's data-center AI accelerator, built from many smaller chiplets plus HBM, all fused together in one package.",
    analogy: "A team of specialists working shoulder to shoulder instead of one overworked generalist.",
    l2: "MI300X combines eight compute chiplets and four I/O dies with 192 GB of HBM3 using CoWoS and 3D stacking — a chiplet-heavy answer to the B200.",
    l3: "TSMC N5/N6 chiplets, ~153B transistors, ~5.3 TB/s bandwidth, 750W. Heavy use of advanced packaging defines its cost structure.",
    why: "MI300X is the main credible challenger to NVIDIA in AI training, so its supply chain matters to market competition.",
    keyTerms: ['chiplet','hbm','cowos','interposer'],
  },
}

// ─── Glossary / Terms ─────────────────────────────────────────────────────────

export const TERMS: Record<string, Term> = {
  hbm: { term: 'High-Bandwidth Memory', acronym: 'HBM', aliases: ['HBM','High-Bandwidth Memory','HBM3E'], category: 'component',
    l1: 'Stacks of memory chips wired straight through with vertical channels and mounted right next to the processor, so data barely has to travel.',
    analogy: 'A parking garage instead of a parking lot — same cars, far less walking.',
    l2: "AI chips are starved for memory bandwidth. HBM solves it by stacking DRAM dies and connecting them with through-silicon vias (TSVs), then placing the stack on an interposer millimetres from the compute die. Short wires mean enormous bandwidth at lower energy per bit.",
    l3: "An HBM3E stack is 8–12 DRAM dies over a base logic die with a 1024-bit interface and ~1.2 TB/s per stack at ~9.6 Gbps/pin. Stacks are bonded with TSVs and integrated via 2.5D packaging (CoWoS). Supply is split across SK Hynix, Samsung and Micron.",
    why: "HBM plus advanced packaging now dominate the cost of an AI accelerator, and stacking yield and CoWoS capacity are the industry's tightest chokepoints.",
    relations: [{ type:'part_of',target:'cowos'},{type:'see_also',target:'tsv'},{type:'see_also',target:'interposer'},{type:'narrower',target:'bandwidth'}],
    entities: ['skhynix','samsung','micron'], products: ['skhynix-hbm3e-8hi','nvidia-b200'], sources: ['src-004','src-002'] },

  tsv: { term: 'Through-Silicon Via', acronym: 'TSV', aliases: ['TSV','TSVs','through-silicon via'], category: 'concept',
    l1: 'A vertical electrical tunnel drilled straight through a silicon chip so stacked chips can talk top-to-bottom instead of around the edge.',
    analogy: 'An elevator inside a building instead of an outdoor staircase.',
    l2: 'TSVs replace long edge wiring with short vertical copper columns etched through the die, enabling dense 3D stacks like HBM with huge bandwidth and low energy per bit.',
    l3: 'High-aspect-ratio vias are etched, lined and copper-filled, then revealed by wafer thinning. TSV pitch and yield set the practical limit on how tall a stack can be.',
    why: 'TSV yield is a key constraint on how tall HBM stacks can go, directly capping memory capacity per accelerator.',
    relations: [{type:'part_of',target:'hbm'},{type:'see_also',target:'interposer'}], entities: ['skhynix'], products: ['skhynix-hbm3e-8hi'], sources: ['src-004'] },

  interposer: { term: 'Silicon Interposer', acronym: '', aliases: ['interposer','silicon interposer'], category: 'component',
    l1: 'A thin slab of silicon that sits under the processor and memory and carries thousands of fine wires between them.',
    analogy: 'A switchboard that lets neighbours talk through dense, short wiring instead of long cables.',
    l2: "In 2.5D packaging the compute die and HBM stacks both sit on an interposer whose ultra-fine wiring provides the thousands of connections HBM's wide interface needs.",
    l3: "Silicon interposers use damascene wiring and microbumps; reticle-size limits drive CoWoS-L and stitched, large-format approaches for multi-die accelerators.",
    why: 'Interposer size and supply (tied to CoWoS) gate how much compute and memory can share one package.',
    relations: [{type:'part_of',target:'cowos'},{type:'see_also',target:'tsv'}], entities: ['tsmc'], products: ['nvidia-b200'], sources: ['src-003'] },

  cowos: { term: 'Chip-on-Wafer-on-Substrate', acronym: 'CoWoS', aliases: ['CoWoS','CoWoS-L','CoWoS-S'], category: 'process',
    l1: "TSMC's way of placing a processor and its memory side by side on one silicon base, then onto a package — so they behave like a single giant chip.",
    analogy: 'Building several rooms on one shared foundation instead of separate houses.',
    l2: "CoWoS is 2.5D advanced packaging: dies are mounted on a silicon interposer (chip-on-wafer), which is then attached to a package substrate (on-substrate). It's how HBM gets close to compute.",
    l3: 'Variants (CoWoS-S / -L / -R) trade interposer type and reticle limits. Capacity is dominated by TSMC and is the tightest bottleneck in AI-accelerator supply.',
    why: 'CoWoS capacity is widely cited as the single biggest limiter on AI-accelerator output industry-wide.',
    relations: [{type:'see_also',target:'interposer'},{type:'see_also',target:'chiplet'}], entities: ['tsmc','ase','amkor'], products: ['nvidia-b200','amd-mi300x'],
    process: { stage: 'packaging_osat', steps: ['Build the silicon interposer with fine wiring','Place the compute die and HBM stacks on the interposer (chip-on-wafer)','Attach the assembly to a package substrate (on-substrate)','Test the integrated module'], equipment: ['besi','asmpt'], materials: ['ibiden','unimicron','shinko'] }, sources: ['src-003'] },

  photolithography: { term: 'Photolithography', acronym: '', aliases: ['photolithography','lithography','litho'], category: 'process',
    l1: "Printing a chip's circuit pattern onto a wafer using light — like a stencil for incredibly tiny shapes.",
    analogy: 'A photographic stencil: shine light through a mask to print the pattern.',
    l2: 'A wafer is coated with light-sensitive resist, exposed through a patterned mask, and developed; the pattern then guides etching and deposition. It repeats for every layer.',
    l3: 'Resolution scales with wavelength and numerical aperture; DUV (193nm immersion) and EUV (13.5nm) define the leading edge, with multi-patterning extending DUV.',
    why: 'Lithography is the throughput and capability gate of the whole fab, and EUV tools come from a single supplier.',
    relations: [{type:'narrower',target:'euv'},{type:'narrower',target:'duv'},{type:'part_of',target:'foundry_fab'}], entities: ['asml'],
    process: { stage: 'foundry_fab', steps: ['Coat the wafer with photoresist','Expose it through a patterned mask','Develop away the resist to reveal the pattern','Transfer the pattern by etching and deposition'], equipment: ['asml','tokyo-electron'], materials: ['jsr','tokyo-ohka','hoya'] }, sources: ['est'] },

  euv: { term: 'Extreme Ultraviolet Lithography', acronym: 'EUV', aliases: ['EUV','EUVL','Extreme Ultraviolet'], category: 'process',
    l1: 'A way of printing chip patterns using extremely short-wavelength light, fine enough to draw the tiniest modern features.',
    analogy: 'Switching from a fat marker to a needle-fine pen to write smaller.',
    l2: "EUV uses 13.5nm light made from tin plasma, reflected through mirrors in a vacuum, to pattern leading-edge layers that older DUV light can't resolve in a single pass.",
    l3: 'Light is generated from laser-pulsed tin droplets, collected by multilayer mirrors and projected at ~0.33 NA; High-NA (0.55) extends resolution further. ASML is the sole tool maker.',
    why: 'EUV is the chokepoint of advanced logic: one supplier (ASML), enormous tool cost, and national export controls built around it.',
    relations: [{type:'broader',target:'photolithography'},{type:'see_also',target:'high-na-euv'},{type:'part_of',target:'foundry_fab'}], entities: ['asml'],
    process: { stage: 'foundry_fab', steps: ['A laser vaporises tin droplets into plasma','The plasma emits 13.5nm EUV light','Mirrors focus the light through a vacuum','The pattern is projected onto the resist-coated wafer'], equipment: ['asml'], materials: ['hoya','jsr','tokyo-ohka'] }, sources: ['est'] },

  'high-na-euv': { term: 'High-NA EUV', acronym: '', aliases: ['High-NA EUV','High-NA'], category: 'process',
    l1: 'A next-generation EUV machine with bigger optics that prints even finer features in a single pass.',
    analogy: 'A sharper lens on the same camera — more detail without changing the light.',
    l2: 'High-NA raises the numerical aperture from 0.33 to 0.55, improving resolution so chipmakers can avoid some costly multi-patterning at the most advanced nodes.',
    l3: 'High-NA uses anamorphic optics and half-field exposure, changing mask and reticle strategy; early tools are extremely expensive and adoption is gradual.',
    why: 'High-NA extends scaling but deepens dependence on a single toolmaker and raises the cost of entry to the leading edge.',
    relations: [{type:'broader',target:'euv'},{type:'part_of',target:'foundry_fab'}], entities: ['asml'], sources: ['est'] },

  duv: { term: 'Deep Ultraviolet Lithography', acronym: 'DUV', aliases: ['DUV','Deep Ultraviolet'], category: 'process',
    l1: 'The older, workhorse light used to print most chip layers — still essential for everything but the very finest features.',
    analogy: 'A reliable ballpoint pen: not the finest, but it does most of the writing.',
    l2: 'DUV uses 193nm light (often immersion) and, with multi-patterning, can still reach advanced nodes — at the cost of more steps than EUV.',
    l3: '193nm immersion scanners plus self-aligned multi-patterning extend pitch below the single-exposure limit; DUV remains the volume backbone of global output.',
    why: 'DUV underpins the vast majority of global chip output, so access to it shapes mature-node supply and policy debates.',
    relations: [{type:'broader',target:'photolithography'},{type:'see_also',target:'euv'}], entities: ['asml'], sources: ['est'] },

  chiplet: { term: 'Chiplet', acronym: '', aliases: ['chiplet','chiplets'], category: 'concept',
    l1: 'Building a big processor out of several smaller chips wired tightly together, instead of one giant chip.',
    analogy: 'Lego bricks instead of carving one solid block.',
    l2: "Splitting a design into chiplets improves yield and lets each piece use the best-fit process node; they're joined by advanced packaging and fast die-to-die links.",
    l3: 'Standards like UCIe and links such as Infinity Fabric or EMIB connect chiplets; partitioning trades packaging complexity for silicon yield and flexibility.',
    why: 'Chiplets are how modern accelerators and server CPUs scale past reticle limits — shifting value toward packaging.',
    relations: [{type:'see_also',target:'cowos'},{type:'see_also',target:'interposer'}], products: ['amd-mi300x','amd-epyc-turin'], sources: ['src-002'] },

  finfet: { term: 'FinFET', acronym: '', aliases: ['FinFET','FinFETs'], category: 'concept',
    l1: 'A transistor design where the channel stands up like a fin, giving the switch better control and less leakage.',
    analogy: 'Gripping a hose from three sides instead of one to shut it cleanly.',
    l2: 'Raising the channel into a fin lets the gate wrap it on multiple sides, controlling current far better than flat (planar) transistors as features shrink.',
    l3: 'FinFETs dominated roughly 16nm–3nm; as scaling continued, gate-control limits drove the move to gate-all-around nanosheets.',
    why: 'The transistor architecture sets how small and efficient a node can go — and when the industry must retool to the next structure.',
    relations: [{type:'see_also',target:'gaa-nanosheet'}], sources: ['est'] },

  'gaa-nanosheet': { term: 'Gate-All-Around (Nanosheet)', acronym: 'GAA', aliases: ['GAA','gate-all-around','nanosheet'], category: 'concept',
    l1: 'The newest transistor shape, where the gate fully surrounds stacked sheets of channel for the tightest control yet.',
    analogy: 'Wrapping your whole hand around the hose instead of three fingers.',
    l2: 'GAA stacks horizontal nanosheets that the gate wraps completely, improving drive and leakage at 2nm-class nodes where FinFETs run out of room.',
    l3: 'Nanosheet width tuning trades drive against area; CFET (vertically stacked complementary devices) is the proposed successor beyond GAA.',
    why: 'GAA marks the current leading-edge transition, reshaping who can compete at 2nm and below.',
    relations: [{type:'see_also',target:'finfet'}], sources: ['est'] },

  bandwidth: { term: 'Memory Bandwidth', acronym: '', aliases: ['memory bandwidth','bandwidth'], category: 'metric',
    l1: 'How much data can move between memory and the processor each second — the lifeblood of AI performance.',
    analogy: 'The number of lanes on a highway: more lanes, more cars per second.',
    l2: 'AI accelerators are often bandwidth-bound — compute sits idle waiting for data. HBM exists specifically to widen this pipe with thousands of parallel connections.',
    l3: 'Bandwidth equals interface width times data rate; HBM3E delivers ~1.2 TB/s per stack via a 1024-bit interface at ~9.6 Gbps/pin.',
    why: 'Bandwidth, not raw FLOPS, is frequently the real limiter on large-model training and inference throughput.',
    relations: [{type:'see_also',target:'hbm'}], products: ['skhynix-hbm3e-8hi'], sources: ['src-004'] },

  wafer: { term: 'Silicon Wafer', acronym: '', aliases: ['silicon wafer','wafers','wafer'], category: 'material',
    l1: 'The thin, polished disc of ultra-pure silicon that every chip is built on.',
    analogy: 'A blank canvas the whole painting is created on.',
    l2: 'Wafers are sliced from a single grown silicon crystal and polished mirror-flat; hundreds of identical chips are fabricated across one wafer at once.',
    l3: 'The common diameter is 300mm; purity, flatness and defect density directly affect yield. Specialty substrates (SOI, SiC, GaN) serve specific device types.',
    why: 'A handful of suppliers dominate high-purity wafers, making them a quiet but critical supply-chain chokepoint.',
    relations: [{type:'part_of',target:'foundry_fab'}], entities: ['shin-etsu','sumco'], sources: ['est'] },

  foundry: { term: 'Foundry', acronym: '', aliases: ['foundry','foundries'], category: 'org_type',
    l1: 'A factory company that manufactures chips designed by others — you bring the blueprint, they build the silicon.',
    analogy: 'A commercial kitchen that cooks recipes other brands create.',
    l2: "Pure-play foundries (like TSMC) let \"fabless\" design firms build cutting-edge chips without owning a multi-billion-dollar fab, concentrating manufacturing in a few hands.",
    l3: 'Foundries provide PDKs, process nodes and packaging; leading-edge capacity is concentrated in TSMC, Samsung and Intel Foundry.',
    why: 'Leading-edge foundry capacity is geographically concentrated, making it central to both AI supply and geopolitics.',
    relations: [{type:'see_also',target:'chiplet'},{type:'part_of',target:'foundry_fab'}], entities: ['tsmc','samsung','intel-foundry','smic','globalfoundries'], sources: ['est'] },

  'specialty-gases': { term: 'Specialty Gases', acronym: '', aliases: ['specialty gases','electronic gases','process gases'], category: 'material',
    l1: 'Ultra-pure gases piped into the fab to grow, etch and clean each chip layer — purity measured in parts per billion.',
    analogy: 'The clean, exact ingredients a kitchen needs — except contamination is counted in single stray atoms.',
    l2: 'Deposition and etch steps rely on precise specialty and bulk gases (nitrogen, argon, plus fluorinated and silicon-bearing species). Tiny impurities ruin yield, so supply and on-site generation are tightly controlled.',
    l3: 'Gas firms often build plants on the fab site; some etch gases and rare gases like neon (for lithography lasers) have become supply-chain flashpoints.',
    why: 'A few industrial-gas firms underpin every fab, and a gas supply shock — neon, for example — can ripple straight into chip output.',
    relations: [{type:'part_of',target:'foundry_fab'},{type:'see_also',target:'photolithography'}], entities: ['air-liquide','linde','air-products'], sources: ['est'] },

  upw: { term: 'Ultra-Pure Water', acronym: 'UPW', aliases: ['ultra-pure water','UPW'], category: 'material',
    l1: 'Water cleaned far beyond drinking standard, used to rinse wafers between steps so nothing is left behind.',
    analogy: 'Distilled water seems clean; UPW is hundreds of times cleaner still — almost nothing but H₂O.',
    l2: 'A single fab can use millions of litres of ultra-pure water a day to rinse wafers, with dedicated treatment plants stripping out ions, particles and microbes to extreme tolerances.',
    l3: 'UPW systems chain multi-stage filtration, reverse osmosis, deionisation and UV; water reuse and discharge management are growing operational and regulatory concerns.',
    why: 'Fabs are among the most water- and energy-intensive facilities on earth, making utilities and their operators essential — and politically sensitive — partners.',
    relations: [{type:'part_of',target:'foundry_fab'}], entities: ['ovivo','kurita'], sources: ['est'] },
}

// ─── Value chain ──────────────────────────────────────────────────────────────

export const VALUE_CHAIN: ValueChainStage[] = [
  { key: 'design_ip_eda', label: 'Design & IP', desc: 'EDA tools, IP cores, PDKs and design services',
    subs: ['Synthesis & place-and-route','Verification / simulation / DFT','Physical sign-off','IP cores — CPU/GPU, PCIe/HBM PHYs, SerDes','Foundry PDKs & design services'],
    groups: [ { title: 'Key suppliers', ids: ['synopsys','cadence','arm','broadcom','alchip','marvell','siemens-eda'] } ] },
  { key: 'foundry_fab', label: 'Foundry — front-end fab', desc: 'Wafer fabrication: hundreds of layered steps, FEOL → MOL → BEOL',
    subs: ['Deposition — CVD / ALD / PVD / epitaxy','Photolithography — DUV / EUV / High-NA','Etch — dry / wet','Doping — implant / anneal','CMP / planarization','Clean / metrology / inspection'],
    groups: [ { title: 'Foundries', ids: ['tsmc','samsung','intel-foundry','smic','globalfoundries'] }, { title: 'Equipment', ids: ['asml','applied-materials','lam-research','tokyo-electron','kla'] }, { title: 'Materials', ids: ['shin-etsu','sumco','jsr','tokyo-ohka','hoya','entegris','soulbrain'] }, { title: 'Infrastructure & utilities', ids: ['air-liquide','linde','air-products','ovivo','kurita'] } ] },
  { key: 'materials', label: 'Materials', desc: 'Wafers, photoresist, gases, slurries, masks and substrates feeding the fab',
    subs: ['Silicon wafers (Si / SOI / SiC / GaN)','Photoresist & ancillaries','Specialty / electronic gases','Ultra-pure water & process chemicals','CMP slurries & pads','Photomask blanks & masks','Package substrates (ABF)'],
    groups: [ { title: 'Wafers, resists & substrates', ids: ['shin-etsu','sumco','jsr','tokyo-ohka','hoya','ibiden','unimicron','shinko','kinsus'] }, { title: 'Specialty gases', ids: ['air-liquide','linde','air-products'] }, { title: 'Ultra-pure water & chemicals', ids: ['ovivo','kurita','entegris','soulbrain'] } ] },
  { key: 'equipment', label: 'Equipment (WFE)', desc: 'Wafer-fab and packaging equipment — a highly concentrated layer',
    subs: ['Lithography scanners (EUV / DUV)','Deposition tools','Etch tools','CMP','Ion implant','Metrology / inspection','ATE & handlers','Advanced-packaging / bonding'],
    groups: [ { title: 'Suppliers', ids: ['asml','applied-materials','lam-research','tokyo-electron','kla','advantest','teradyne','besi','asmpt'] } ] },
  { key: 'packaging_osat', label: 'Assembly & packaging', desc: 'Back-end assembly and advanced packaging — dominates AI-accelerator BOMs',
    subs: ['Wafer thinning / dicing','Interconnect — wire bond / flip-chip','Substrate — organic / ABF','2.5D — interposer / CoWoS / EMIB','3D — TSV / SoIC / hybrid bonding','Fan-out — InFO / FOWLP','Chiplets + UCIe / EMIB'],
    groups: [ { title: 'OSAT & foundry', ids: ['tsmc','ase','amkor','jcet','tongfu','hana-micron','pti'] }, { title: 'Substrate materials', ids: ['ibiden','unimicron','shinko','kinsus'] }, { title: 'Bonding tools', ids: ['besi','asmpt'] } ] },
  { key: 'test', label: 'Test', desc: 'Wafer sort, final test, burn-in and system-level test',
    subs: ['Wafer test / probe (sort)','Final test','Burn-in','System-level test (SLT)'],
    groups: [ { title: 'OSAT', ids: ['ase','amkor','jcet','pti','tesna','huatian'] }, { title: 'ATE', ids: ['advantest','teradyne'] } ] },
  { key: 'distribution', label: 'Distribution', desc: 'Distributors and direct channels to OEMs',
    subs: ['Global distributors','Direct / design-win channels'],
    groups: [ { title: 'Distributors', ids: ['arrow','avnet'] } ] },
]

// ─── Learn path ───────────────────────────────────────────────────────────────

export const LEARN_STEPS = [
  { n: 1,  title: 'Design the chip',     l1: 'Engineers describe the chip in code and arrange billions of transistors using EDA software and licensed IP blocks.', l2: 'Design houses — often "fabless" — use tools from Synopsys and Cadence and IP from Arm, then hand a finished layout to a foundry.', why: 'A handful of EDA and IP firms sit at the start of every chip.', node: { kind: 'stage', key: 'design_ip_eda' }, linkLabel: 'See the Design & EDA stage' },
  { n: 2,  title: 'Start with a wafer',  l1: 'Manufacturing begins with a polished disc of ultra-pure silicon called a wafer.', l2: 'Wafers are sliced from a grown silicon crystal; hundreds of chips are built across one wafer at once.', why: 'A few suppliers dominate high-purity wafers worldwide.', node: { kind: 'term', id: 'wafer' }, linkLabel: 'Learn: silicon wafer' },
  { n: 3,  title: 'Print the pattern',   l1: 'Light prints the circuit pattern onto the wafer — the finest features use EUV.', l2: 'Photolithography exposes light-sensitive resist through a mask; leading-edge layers need 13.5nm EUV light from ASML.', why: 'EUV is a single-supplier chokepoint at the heart of advanced chips.', node: { kind: 'term', id: 'euv' }, linkLabel: 'Learn: EUV lithography' },
  { n: 4,  title: 'Build the layers',    l1: 'The chip is built up layer by layer through repeated depositing, patterning and etching.', l2: 'Hundreds of steps in the front-end fab stack and shape materials to form transistors and wiring.', why: 'Front-end fabs cost tens of billions and run for years.', node: { kind: 'stage', key: 'foundry_fab' }, linkLabel: 'See the Foundry stage' },
  { n: 5,  title: 'Test the wafer',      l1: 'Each chip on the wafer is electrically tested before anything is cut or packaged.', l2: 'Wafer sort screens out defective dies early so only good ones move forward.', why: 'Catching failures here saves expensive packaging later.', node: { kind: 'stage', key: 'test' }, linkLabel: 'See the Test stage' },
  { n: 6,  title: 'Stack the memory',    l1: 'Memory chips are stacked into HBM so the processor never runs short of data.', l2: 'HBM stacks 8–12 DRAM dies connected by through-silicon vias for enormous bandwidth.', why: 'HBM is now one of the costliest, most supply-constrained parts.', node: { kind: 'term', id: 'hbm' }, linkLabel: 'Learn: HBM' },
  { n: 7,  title: 'Package it together', l1: 'The processor and its HBM are mounted side by side on one silicon base — CoWoS.', l2: 'Advanced 2.5D packaging places dies on an interposer so they behave like one giant chip.', why: 'CoWoS capacity is the tightest bottleneck in AI-chip supply.', node: { kind: 'term', id: 'cowos' }, linkLabel: 'Learn: CoWoS packaging' },
  { n: 8,  title: 'Final test',          l1: 'The finished package is tested again — and sometimes burned-in — before it ships.', l2: 'Final and system-level test verify the assembled module under real operating conditions.', why: "It's the last gate before a costly part reaches a customer.", node: { kind: 'stage', key: 'test' }, linkLabel: 'See the Test stage' },
  { n: 9,  title: 'Into the rack',       l1: 'Verified accelerators like the B200 are assembled into servers and racks for data centers.', l2: 'Many accelerators plus CPUs, networking and memory combine into the systems that train AI models.', why: 'This is where all the upstream supply chains finally converge.', node: { kind: 'product', id: 'nvidia-b200' }, linkLabel: 'See the NVIDIA B200' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function domainColor(d: string) { return (DOMAINS as Record<string,{color:string}>)[d]?.color ?? '#8a8579' }
export function fmtUSD(n: number) { return '$' + Number(n).toLocaleString() }

