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

// ─── Products (190 total, sourced from AI_HW_fixed.xlsx) ──────────────────────
export const PRODUCTS: Product[] = [
  { id: "nvidia-v100", name: "NVIDIA V100", vendor: "NVIDIA", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "Volta", status: "eol", node: "TSMC 12nm", avail: "2017", attrs: { node_maturity: "advanced", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "First Tensor Core data-center GPU; commonly cited start of the modern AI-accelerator era" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "kinsus", "unimicron", "ibiden"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-a100", name: "NVIDIA A100", vendor: "NVIDIA", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "Ampere", status: "eol", node: "TSMC 7nm", avail: "2020", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "40/80GB HBM2e; powered the early large-model training boom" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "kinsus", "unimicron", "ibiden"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-h100", name: "NVIDIA H100", vendor: "NVIDIA", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "Hopper", status: "production", node: "TSMC 4N", avail: "2022", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "80GB HBM3, Transformer Engine; still widely deployed Memory: HBM3 supplied almost exclusively by SK Hynix through 2023." }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "kinsus", "unimicron", "ibiden"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-h200", name: "NVIDIA H200", vendor: "NVIDIA", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "Hopper", status: "production", node: "TSMC 4N", avail: "2024", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "141GB HBM3e refresh of H100 Memory: HBM3E led by SK Hynix, with Micron qualified specifically for H200." }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "kinsus", "unimicron", "ibiden"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-gh200", name: "NVIDIA GH200 Grace Hopper Superchip", vendor: "NVIDIA", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "Hopper + Grace", status: "production", node: "TSMC 4N", avail: "2023", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "CPU+GPU superchip linked via NVLink-C2C" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence", "arm"], materials: ["shin-etsu", "kinsus", "unimicron", "ibiden"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-b100", name: "NVIDIA B100", vendor: "NVIDIA", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "Blackwell", status: "production", node: "TSMC 4NP", avail: "2024", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Lower-power Blackwell SKU Memory: HBM3E primarily SK Hynix; Samsung qualified for Blackwell-gen HBM3E in Q4 2025; Micron also supplies." }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "kinsus", "unimicron", "ibiden"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  {
    id: 'nvidia-b200', name: 'NVIDIA B200', vendor: 'NVIDIA', domain: 'logic', sub: 'ai_accelerator', subcat: 'ai_accelerator_gpu',
    family: 'Blackwell', status: 'production', node: 'TSMC 4NP', avail: '2025', verified: '2026-05',
    attrs: { node_maturity: 'leading_edge', transistor_arch: 'finfet', material_system: 'si', integration_level: 'package', end_market: 'datacenter' },
    specs: [
      { label: 'Transistors', value: '208 B', conf: 'med' },
      { label: 'Die config',  value: 'Dual reticle die' },
      { label: 'FP8 compute', value: '4,500 TFLOPS', conf: 'med' },
      { label: 'FP4 compute', value: '9,000 TFLOPS', conf: 'low' },
      { label: 'Memory',      value: '192 GB HBM3E' },
      { label: 'Bandwidth',   value: '8.0 TB/s' },
      { label: 'TDP',         value: '1,000 W' },
      { label: 'Interconnect',value: 'NVLink 5' },
      { label: 'Form factor', value: 'SXM' },
    ],
    bom: { uncertainty: 18, total: 6400, totalConf: 'med', items: [
      { label: 'Logic die',          cost: 380,  conf: 'med', source: 'src-002' },
      { label: 'HBM memory',         cost: 2900, qty: 8, note: '8× HBM3E stacks', ref: 'skhynix-hbm3e-8hi', conf: 'med', source: 'src-002' },
      { label: 'Advanced packaging', cost: 1700, note: 'CoWoS-L interposer + assembly', conf: 'med', source: 'src-003' },
      { label: 'Substrate',          cost: 220,  conf: 'low', source: 'est' },
      { label: 'Assembly & test',    cost: 1200, conf: 'low', source: 'est' },
    ]},
    supply: { design_ip_eda: ['synopsys','cadence'], foundry_fab: ['tsmc'], materials: ['shin-etsu','ibiden','kinsus','air-liquide'], equipment: ['asml','applied-materials','lam-research','tokyo-electron','kla'], packaging_osat: ['tsmc','ase'], test: ['tsmc','ase'] },
    rels: [ { type: 'uses', target: 'skhynix-hbm3e-8hi', qty: 8 }, { type: 'competes_with', target: 'amd-mi300x' } ],
    sources: ['src-001','src-002','src-003'],
  },
  { id: "nvidia-gb200", name: "NVIDIA GB200 Grace Blackwell Superchip", vendor: "NVIDIA", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "Blackwell + Grace", status: "production", node: "TSMC 4NP", avail: "2025", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "2x B200 + 1 Grace CPU; basis of GB200 NVL72" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence", "arm"], materials: ["shin-etsu", "kinsus", "unimicron", "ibiden"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-b300", name: "NVIDIA B300 / GB300 (Blackwell Ultra)", vendor: "NVIDIA", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "Blackwell Ultra", status: "production", node: "TSMC 4NP", avail: "2025", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "288GB HBM3e, higher FP4 throughput" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "kinsus", "unimicron", "ibiden"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-r100-rubin", name: "NVIDIA Rubin GPU (R100 / VR200)", vendor: "NVIDIA", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "Rubin", status: "production", node: "TSMC N3", avail: "2026 (2H)", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "336B transistors, 288GB HBM4, 50 PFLOPS FP4; full production, ships via partners 2H26" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "kinsus", "unimicron", "ibiden"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-rubin-cpx", name: "NVIDIA Rubin CPX", vendor: "NVIDIA", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "Rubin", status: "announced", node: "TSMC N3", avail: "2026 (late)", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Context/prefill-optimized GPU for million-token inference" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "kinsus", "unimicron", "ibiden"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-rubin-ultra", name: "NVIDIA Rubin Ultra", vendor: "NVIDIA", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "Rubin Ultra", status: "announced", node: "TSMC N3", avail: "2027", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "2x Rubin compute dies, ~100 PFLOPS FP4, HBM4E" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "kinsus", "unimicron", "ibiden"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "amd-mi100", name: "AMD Instinct MI100", vendor: "AMD", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "CDNA 1", status: "eol", node: "TSMC 7nm", avail: "2020", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "AMD's first CDNA data-center accelerator" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "unimicron", "ibiden", "shinko"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "amkor"], test: ["ase", "amkor"] }, rels: [], sources: [] },
  { id: "amd-mi250x", name: "AMD Instinct MI250 / MI250X", vendor: "AMD", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "CDNA 2", status: "eol", node: "TSMC 6nm", avail: "2021", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Powered the Frontier exascale supercomputer" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "unimicron", "ibiden", "shinko"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "amkor"], test: ["ase", "amkor"] }, rels: [], sources: [] },
  { id: "amd-mi300a", name: "AMD Instinct MI300A", vendor: "AMD", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "CDNA 3 (APU)", status: "production", node: "TSMC 5/6nm", avail: "2023", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "CPU+GPU APU; powers El Capitan supercomputer" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "unimicron", "ibiden", "shinko"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "amkor"], test: ["ase", "amkor"] }, rels: [], sources: [] },
  {
    id: 'amd-mi300x', name: 'AMD Instinct MI300X', vendor: 'AMD', domain: 'logic', sub: 'ai_accelerator', subcat: 'ai_accelerator_gpu',
    family: 'CDNA 3', status: 'production', node: 'TSMC 5/6nm', avail: '2023', verified: '2026-04',
    attrs: { node_maturity: 'leading_edge', transistor_arch: 'finfet', material_system: 'si', integration_level: 'package', end_market: 'datacenter' },
    specs: [
      { label: 'Transistors', value: '153 B', conf: 'med' },
      { label: 'Die config',  value: '8 XCD + 4 IOD chiplets' },
      { label: 'FP8 compute', value: '2,615 TFLOPS', conf: 'med' },
      { label: 'Memory',      value: '192 GB HBM3' },
      { label: 'Bandwidth',   value: '5.3 TB/s' },
      { label: 'TDP',         value: '750 W' },
    ],
    bom: { uncertainty: 18, total: 5300, totalConf: 'med', items: [
      { label: 'Logic chiplets',     cost: 520,  note: 'XCD + IOD', conf: 'med', source: 'src-002' },
      { label: 'HBM memory',         cost: 2400, qty: 8, note: '8× HBM3 stacks', ref: 'skhynix-hbm3e-8hi', conf: 'med', source: 'src-002' },
      { label: 'Advanced packaging', cost: 1500, note: 'CoWoS-S + SoIC', conf: 'med', source: 'src-002' },
      { label: 'Substrate & test',   cost: 880,  conf: 'low', source: 'est' },
    ]},
    supply: { design_ip_eda: ['synopsys','cadence'], foundry_fab: ['tsmc'], materials: ['shin-etsu','ibiden','unimicron','shinko'], equipment: ['asml','applied-materials','lam-research','tokyo-electron','kla'], packaging_osat: ['ase','amkor'], test: ['ase','amkor'] },
    rels: [ { type: 'uses', target: 'skhynix-hbm3e-8hi', qty: 8 }, { type: 'competes_with', target: 'nvidia-b200' } ],
    sources: ['src-002'],
  },
  { id: "amd-mi325x", name: "AMD Instinct MI325X", vendor: "AMD", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "CDNA 3", status: "production", node: "TSMC 5/6nm", avail: "2024", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "256GB HBM3e Memory: HBM3E supply led by Samsung, mirroring the MI300X relationship." }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "unimicron", "ibiden", "shinko"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "amkor"], test: ["ase", "amkor"] }, rels: [], sources: [] },
  {
    id: 'amd-mi355x', name: 'AMD Instinct MI355X', vendor: 'AMD', domain: 'logic', sub: 'ai_accelerator', subcat: 'ai_accelerator_gpu',
    family: 'CDNA 4', status: 'production', node: 'TSMC 3nm', avail: '2025', verified: '2026-05',
    attrs: { node_maturity: 'leading_edge', transistor_arch: 'finfet', material_system: 'si', integration_level: 'package', end_market: 'datacenter' },
    specs: [
      { label: 'Die config',  value: 'Chiplet, 3nm XCD' },
      { label: 'FP4 compute', value: '~10,000 TFLOPS', conf: 'low' },
      { label: 'Memory',      value: '288 GB HBM3E' },
      { label: 'TDP',         value: '1,400 W' },
    ],
    bom: { uncertainty: 20, total: 6200, totalConf: 'low', items: [
      { label: 'Logic chiplets',        cost: 650,  conf: 'low', source: 'est' },
      { label: 'HBM memory',            cost: 3600, qty: 8, note: '8× HBM3E 12-Hi', ref: 'samsung-hbm3e-12hi', conf: 'low', source: 'est' },
      { label: 'Packaging & assembly',  cost: 1950, conf: 'low', source: 'est' },
    ]},
    supply: { design_ip_eda: ['synopsys','cadence'], foundry_fab: ['tsmc'], materials: ['shin-etsu','ibiden','unimicron','shinko'], equipment: ['asml','applied-materials','lam-research','tokyo-electron','kla'], packaging_osat: ['ase','amkor'], test: ['ase','amkor'] },
    rels: [ { type: 'uses', target: 'samsung-hbm3e-12hi', qty: 8 } ],
    sources: ['est'],
  },
  { id: "amd-mi430x", name: "AMD Instinct MI430X", vendor: "AMD", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "CDNA 5", status: "announced", node: "TSMC N2", avail: "2026 (2H)", attrs: { node_maturity: "leading_edge", transistor_arch: "gaa_nanosheet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Sovereign AI/HPC variant, full FP32/FP64 support" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "unimicron", "ibiden", "shinko"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "amkor"], test: ["ase", "amkor"] }, rels: [], sources: [] },
  { id: "amd-mi440x", name: "AMD Instinct MI440X", vendor: "AMD", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "CDNA 5", status: "announced", node: "TSMC N2", avail: "2026 (2H)", attrs: { node_maturity: "leading_edge", transistor_arch: "gaa_nanosheet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Enterprise AI server: 1 EPYC Venice + 8 GPUs" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "unimicron", "ibiden", "shinko"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "amkor"], test: ["ase", "amkor"] }, rels: [], sources: [] },
  { id: "amd-mi455x", name: "AMD Instinct MI450 / MI455X", vendor: "AMD", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "CDNA 5", status: "announced", node: "TSMC N2", avail: "2026 (2H)", attrs: { node_maturity: "leading_edge", transistor_arch: "gaa_nanosheet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "432GB HBM4; core of the Helios rack; basis of OpenAI 6GW deal" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "unimicron", "ibiden", "shinko"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "amkor"], test: ["ase", "amkor"] }, rels: [], sources: [] },
  { id: "amd-mi500", name: "AMD Instinct MI500 series", vendor: "AMD", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "CDNA 6", status: "announced", node: "TSMC N2P", avail: "2027", attrs: { node_maturity: "leading_edge", transistor_arch: "gaa_nanosheet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "HBM4E; AMD claims up to 1,000x MI300X-class AI performance" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "unimicron", "ibiden", "shinko"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "amkor"], test: ["ase", "amkor"] }, rels: [], sources: [] },
  { id: "intel-gaudi2", name: "Intel Gaudi2", vendor: "Intel", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "Habana", status: "eol", node: "TSMC 7nm", avail: "2022", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "intel-gaudi3", name: "Intel Gaudi3", vendor: "Intel", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "Habana", status: "eol", node: "TSMC 5nm", avail: "2024", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Being phased out as Intel pivots its GPU roadmap to Crescent Island" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "intel-pvc", name: "Intel Data Center GPU Max (Ponte Vecchio)", vendor: "Intel", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "Xe-HPC", status: "eol", node: "Intel 7 + TSMC", avail: "2023", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Limited deployment (Aurora supercomputer)" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["siemens-eda", "synopsys", "cadence"], materials: ["shin-etsu", "air-products", "entegris"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["intel-foundry"], test: ["intel-foundry"] }, rels: [], sources: [] },
  { id: "intel-falcon-shores", name: "Intel Falcon Shores", vendor: "Intel", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "Xe", status: "eol", avail: "-", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Cancelled for commercial sale; redirected to internal use only" }], bom: null, supply: {}, rels: [], sources: [] },
  { id: "intel-crescent-island", name: "Intel Crescent Island", vendor: "Intel", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "Xe3p", status: "sampling", node: "TSMC", avail: "2026 (2H)", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Inference-focused data-center GPU with LPDDR5X memory" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "intel-jaguar-shores", name: "Intel Jaguar Shores", vendor: "Intel", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "Xe4", status: "announced", node: "TSMC", avail: "2027", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Successor to Crescent Island" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-feynman", name: "NVIDIA Feynman GPU", vendor: "NVIDIA", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "Feynman", status: "announced", node: "TSMC (next-gen)", avail: "2028", attrs: { node_maturity: "leading_edge", transistor_arch: "gaa_nanosheet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Successor to Rubin Ultra; 3D stacking, custom next-gen HBM; pairs with Rosa CPU" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "kinsus", "unimicron", "ibiden"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-feynman-ultra", name: "NVIDIA Feynman Ultra (rumored)", vendor: "NVIDIA", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "Feynman", status: "announced", node: "TSMC (next-gen)", avail: "2029-2030", attrs: { node_maturity: "leading_edge", transistor_arch: "gaa_nanosheet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Unconfirmed enhanced variant analogous to the Blackwell Ultra / Rubin Ultra pattern" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "kinsus", "unimicron", "ibiden"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "amd-mi-next", name: "AMD Instinct (post-MI500, unnamed)", vendor: "AMD", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_gpu", family: "CDNA 7 (expected)", status: "announced", node: "TSMC (next-gen)", avail: "2028", attrs: { node_maturity: "leading_edge", transistor_arch: "gaa_nanosheet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "AMD has confirmed it will continue its annual cadence beyond MI500; no name/specs disclosed yet" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "unimicron", "ibiden", "shinko"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "amkor"], test: ["ase", "amkor"] }, rels: [], sources: [] },
  { id: "google-tpu-v1", name: "Google TPU v1", vendor: "Google", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "eol", node: "28nm", avail: "2016", attrs: { node_maturity: "mature", transistor_arch: "planar", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "First-ever TPU; internal inference only" }], bom: null, supply: {}, rels: [], sources: [] },
  { id: "google-tpu-v2", name: "Google TPU v2", vendor: "Google", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "eol", avail: "2017", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: {}, rels: [], sources: [] },
  { id: "google-tpu-v3", name: "Google TPU v3", vendor: "Google", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "eol", avail: "2018", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: {}, rels: [], sources: [] },
  { id: "google-tpu-v4", name: "Google TPU v4", vendor: "Google", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "production", avail: "2021", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: {}, rels: [], sources: [] },
  { id: "google-tpu-v5e", name: "Google TPU v5e", vendor: "Google", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "production", node: "TSMC", avail: "2023", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "google-tpu-v5p", name: "Google TPU v5p", vendor: "Google", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "production", node: "TSMC", avail: "2023", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  {
    id: 'google-tpu-v6e', name: 'Google TPU v6e', vendor: 'Google', domain: 'logic', sub: 'ai_accelerator', subcat: 'ai_accelerator_asic',
    family: 'Trillium', status: 'production', node: 'TSMC N5', avail: '2024', verified: '2026-03',
    attrs: { node_maturity: 'leading_edge', transistor_arch: 'finfet', material_system: 'si', integration_level: 'package', end_market: 'datacenter' },
    specs: [
      { label: 'Design partner', value: 'Broadcom' },
      { label: 'BF16 compute',   value: '~918 TFLOPS', conf: 'med' },
      { label: 'Memory',         value: '32 GB HBM' },
      { label: 'Interconnect',   value: 'ICI optical' },
    ],
    bom: { uncertainty: 20, total: 1400, totalConf: 'low', items: [
      { label: 'Logic die',      cost: 280, conf: 'low', source: 'est' },
      { label: 'HBM memory',     cost: 600, qty: 2, ref: 'skhynix-hbm3e-8hi', conf: 'low', source: 'est' },
      { label: 'Packaging & test',cost: 520, conf: 'low', source: 'est' },
    ]},
    supply: { design_ip_eda: ['broadcom','synopsys','cadence'], foundry_fab: ['tsmc'], materials: ['shin-etsu','air-liquide'], equipment: ['asml','applied-materials','lam-research','tokyo-electron','kla'], packaging_osat: ['tsmc','ase'], test: ['ase','tsmc'] },
    rels: [ { type: 'uses', target: 'skhynix-hbm3e-8hi', qty: 2 }, { type: 'competes_with', target: 'aws-trainium2' } ],
    sources: ['est'],
  },
  { id: "google-tpu-v7", name: "Google TPU v7 (Ironwood / TPU7x)", vendor: "Google", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "production", node: "TSMC N3", avail: "2025-2026", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "192GB HBM3e; first TPU sold to external customers (Anthropic up to 1M chips)" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "google-tpu-v8", name: "Google TPU 8 (8t train / 8i infer)", vendor: "Google", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "announced", node: "TSMC", avail: "2026 (late)", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "First split training/inference TPU pair; Citadel Securities named launch customer" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "aws-inferentia", name: "AWS Inferentia", vendor: "AWS", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "eol", avail: "2019", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: {}, rels: [], sources: [] },
  { id: "aws-inferentia2", name: "AWS Inferentia2", vendor: "AWS", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "production", avail: "2023", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: {}, rels: [], sources: [] },
  { id: "aws-trainium", name: "AWS Trainium", vendor: "AWS", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "eol", avail: "2022", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: {}, rels: [], sources: [] },
  {
    id: 'aws-trainium2', name: 'AWS Trainium2', vendor: 'AWS', domain: 'logic', sub: 'ai_accelerator', subcat: 'ai_accelerator_asic',
    family: 'Trainium', status: 'production', node: 'TSMC N5', avail: '2024', verified: '2026-03',
    attrs: { node_maturity: 'leading_edge', transistor_arch: 'finfet', material_system: 'si', integration_level: 'package', end_market: 'datacenter' },
    specs: [
      { label: 'Design partner', value: 'Alchip / Marvell' },
      { label: 'FP8 compute',    value: '~1,300 TFLOPS', conf: 'low' },
      { label: 'Memory',         value: '96 GB HBM3E' },
      { label: 'TDP',            value: '~500 W' },
    ],
    bom: { uncertainty: 20, total: 2400, totalConf: 'low', items: [
      { label: 'Logic die',      cost: 300, conf: 'low', source: 'est' },
      { label: 'HBM memory',     cost: 1450, qty: 4, ref: 'micron-hbm3e-8hi', conf: 'low', source: 'est' },
      { label: 'Packaging & test',cost: 650, conf: 'low', source: 'est' },
    ]},
    supply: { design_ip_eda: ['alchip','marvell','cadence','synopsys'], foundry_fab: ['tsmc'], materials: ['shin-etsu','air-liquide'], equipment: ['asml','applied-materials','lam-research','tokyo-electron','kla'], packaging_osat: ['tsmc','ase'], test: ['ase','tsmc'] },
    rels: [ { type: 'uses', target: 'micron-hbm3e-8hi', qty: 4 }, { type: 'competes_with', target: 'google-tpu-v6e' } ],
    sources: ['est'],
  },
  { id: "aws-trainium3", name: "AWS Trainium3", vendor: "AWS", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "production", node: "TSMC N3", avail: "2025-2026", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "144GB HBM3e, 2.52 PFLOPS FP8, first 3nm AWS chip" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "aws-trainium4", name: "AWS Trainium4", vendor: "AWS", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "announced", node: "TSMC", avail: "2026 (late) / 2027 (early)", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "3x FP8 / 6x FP4 vs Trainium3, ~288GB memory; adds NVLink Fusion support" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "microsoft-maia100", name: "Microsoft Maia 100", vendor: "Microsoft", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "eol", node: "TSMC 5nm", avail: "2023-2024", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Never scaled to production AI services at meaningful volume" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "microsoft-maia200", name: "Microsoft Maia 200", vendor: "Microsoft", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "production", node: "TSMC 3nm", avail: "2026", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "216GB HBM3e; runs Microsoft 365 Copilot and OpenAI GPT-5.2" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "meta-mtia-v1", name: "Meta MTIA v1 (100 series)", vendor: "Meta", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "production", node: "TSMC 7nm", avail: "2023", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Recommendation-engine inference" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "meta-mtia-v2", name: "Meta MTIA v2 (200 series)", vendor: "Meta", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "production", node: "TSMC 5nm", avail: "2024", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "meta-mtia-300", name: "Meta MTIA 300 series", vendor: "Meta", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "announced", node: "TSMC 3nm", avail: "2026-2027", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "meta-mtia-400", name: "Meta MTIA 400 series", vendor: "Meta", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "announced", node: "TSMC 3nm", avail: "2026-2027", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "meta-mtia-500", name: "Meta MTIA 500 series", vendor: "Meta", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "announced", node: "TSMC 3nm", avail: "2026-2027", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "qualcomm-ai100", name: "Qualcomm Cloud AI 100", vendor: "Qualcomm", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", family: "Hexagon", status: "eol", node: "TSMC 7nm", avail: "2020-2021", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Inference accelerator card" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "qualcomm-ai200", name: "Qualcomm AI200", vendor: "Qualcomm", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", family: "Hexagon", status: "announced", node: "TSMC 3nm", avail: "2026", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "768GB LPDDR per card; rack-scale inference" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "qualcomm-ai250", name: "Qualcomm AI250", vendor: "Qualcomm", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", family: "Hexagon", status: "announced", node: "TSMC 3nm", avail: "2027", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Near-memory compute architecture; >10x effective bandwidth of AI200" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "huawei-ascend910", name: "Huawei Ascend 910", vendor: "Huawei", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", family: "Da Vinci", status: "eol", avail: "2019", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: {}, rels: [], sources: [] },
  { id: "huawei-ascend910b", name: "Huawei Ascend 910B", vendor: "Huawei", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", family: "Da Vinci", status: "production", node: "SMIC 7nm", avail: "2023", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["smic"], design_ip_eda: ["empyrean", "synopsys", "cadence"], materials: ["shin-etsu", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml"], packaging_osat: ["smic", "jcet"], test: ["huatian", "jcet"] }, rels: [], sources: [] },
  { id: "huawei-ascend910c", name: "Huawei Ascend 910C", vendor: "Huawei", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", family: "Da Vinci", status: "production", node: "SMIC N+2 (7nm)", avail: "2024-2025", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Dual-die package; powers CloudMatrix 384 rack" }], bom: null, supply: { foundry_fab: ["smic"], design_ip_eda: ["empyrean", "synopsys", "cadence"], materials: ["shin-etsu", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml"], packaging_osat: ["smic", "jcet"], test: ["huatian", "jcet"] }, rels: [], sources: [] },
  { id: "huawei-ascend910d", name: "Huawei Ascend 910D", vendor: "Huawei", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", family: "Da Vinci", status: "sampling", node: "SMIC (5nm-class)", avail: "2026", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Targets ~H100-class performance" }], bom: null, supply: { foundry_fab: ["smic"], design_ip_eda: ["empyrean", "synopsys", "cadence"], materials: ["shin-etsu", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml"], packaging_osat: ["smic", "jcet"], test: ["huatian", "jcet"] }, rels: [], sources: [] },
  { id: "huawei-ascend950pr", name: "Huawei Ascend 950PR", vendor: "Huawei", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", family: "Da Vinci", status: "announced", node: "SMIC", avail: "2026 (Q1)", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["smic"], design_ip_eda: ["empyrean", "synopsys", "cadence"], materials: ["shin-etsu", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml"], packaging_osat: ["smic", "jcet"], test: ["huatian", "jcet"] }, rels: [], sources: [] },
  { id: "huawei-ascend950dt", name: "Huawei Ascend 950DT", vendor: "Huawei", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", family: "Da Vinci", status: "announced", node: "SMIC", avail: "2026 (Q4)", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "HiZQ 2.0 HBM, 144GB memory, 4TB/s bandwidth" }], bom: null, supply: { foundry_fab: ["smic"], design_ip_eda: ["empyrean", "synopsys", "cadence"], materials: ["shin-etsu", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml"], packaging_osat: ["smic", "jcet"], test: ["huatian", "jcet"] }, rels: [], sources: [] },
  { id: "huawei-ascend960", name: "Huawei Ascend 960", vendor: "Huawei", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", family: "Da Vinci", status: "announced", node: "SMIC", avail: "2027 (Q4)", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Introduces HiF4 4-bit precision format" }], bom: null, supply: { foundry_fab: ["smic"], design_ip_eda: ["empyrean", "synopsys", "cadence"], materials: ["shin-etsu", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml"], packaging_osat: ["smic", "jcet"], test: ["huatian", "jcet"] }, rels: [], sources: [] },
  { id: "huawei-ascend970", name: "Huawei Ascend 970", vendor: "Huawei", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", family: "Da Vinci", status: "announced", node: "SMIC", avail: "2028 (Q4)", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Roadmap target: 2x FP4/FP8 vs Ascend 960" }], bom: null, supply: { foundry_fab: ["smic"], design_ip_eda: ["empyrean", "synopsys", "cadence"], materials: ["shin-etsu", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml"], packaging_osat: ["smic", "jcet"], test: ["huatian", "jcet"] }, rels: [], sources: [] },
  { id: "tesla-dojo-d1", name: "Tesla Dojo D1", vendor: "Tesla", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "eol", node: "TSMC 7nm", avail: "2023", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Dojo team disbanded Aug 2025; Musk shifted focus to AI6" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "tesla-dojo2", name: "Tesla Dojo 2 / Dojo 3", vendor: "Tesla", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "sampling", avail: "2026+", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Shut down Aug 2025 (Musk: \"evolutionary dead end\"); revived Jan 2026 as Dojo 3 with focus on space-based AI compute / orbital data centers" }], bom: null, supply: {}, rels: [], sources: [] },
  { id: "tesla-ai4", name: "Tesla AI4 (Hardware 4 / FSD Computer)", vendor: "Tesla", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "production", node: "Samsung 7nm", avail: "2023", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "automotive" }, specs: [{ label: "Notes", value: "Current vehicle/Cybercab compute" }], bom: null, supply: { foundry_fab: ["samsung"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "soulbrain"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["samsung", "amkor"], test: ["samsung", "amkor"] }, rels: [], sources: [] },
  { id: "tesla-ai5", name: "Tesla AI5", vendor: "Tesla", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "sampling", node: "TSMC / Samsung", avail: "2026 (taped out Apr '26)", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "automotive" }, specs: [{ label: "Notes", value: "~5x AI4 compute; volume production targeted mid-2027" }], bom: null, supply: { foundry_fab: ["tsmc", "samsung"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "tesla-ai6", name: "Tesla AI6", vendor: "Tesla", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "announced", node: "Samsung 2nm", avail: "2027", attrs: { node_maturity: "leading_edge", transistor_arch: "gaa_nanosheet", material_system: "si", integration_level: "package", end_market: "automotive" }, specs: [{ label: "Notes", value: "Tape-out targeted Dec 2026; backed by $16.5B Samsung deal" }], bom: null, supply: { foundry_fab: ["samsung"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "soulbrain"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["samsung", "amkor"], test: ["samsung", "amkor"] }, rels: [], sources: [] },
  { id: "tesla-ai7", name: "Tesla AI7 (in planning)", vendor: "Tesla", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "announced", avail: "2028+", attrs: { material_system: "si", integration_level: "package", end_market: "automotive" }, specs: [{ label: "Notes", value: "Musk has referenced AI7 as already in planning; no specs disclosed" }], bom: null, supply: {}, rels: [], sources: [] },
  { id: "qualcomm-dc-next", name: "Qualcomm Next-gen DC chip (unnamed)", vendor: "Qualcomm", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", family: "Hexagon", status: "announced", node: "TSMC", avail: "2028", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Qualcomm has committed to an annual data-center roadmap cadence beyond AI250; chip unnamed" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "cerebras-wse1", name: "Cerebras WSE-1", vendor: "Cerebras", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", family: "Wafer-Scale Engine", status: "eol", node: "TSMC 16nm", avail: "2019", attrs: { node_maturity: "advanced", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "cerebras-wse2", name: "Cerebras WSE-2", vendor: "Cerebras", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", family: "Wafer-Scale Engine", status: "eol", node: "TSMC 7nm", avail: "2021", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "cerebras-wse3", name: "Cerebras WSE-3", vendor: "Cerebras", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", family: "Wafer-Scale Engine", status: "production", node: "TSMC 5nm", avail: "2024", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "4 trillion transistors; largest chip ever built" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "groq-lpu-v1", name: "Groq LPU v1 (GroqChip)", vendor: "Groq", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", family: "Tensor Streaming Processor", status: "eol", node: "14nm", avail: "2020", attrs: { node_maturity: "advanced", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["globalfoundries"] }, rels: [], sources: [] },
  { id: "groq-lpu-v2", name: "Groq LPU v2", vendor: "Groq", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", family: "Tensor Streaming Processor", status: "production", node: "Samsung 4nm", avail: "2024", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["samsung"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "soulbrain"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["samsung", "amkor"], test: ["samsung", "amkor"] }, rels: [], sources: [] },
  { id: "groq-lpu-v3", name: "Groq Groq 3 LPU / LPX", vendor: "Groq", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", family: "Tensor Streaming Processor", status: "production", avail: "2026", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "NVIDIA acquired Groq (~$20B, Dec 2025); integrated into Vera Rubin LPX inference racks" }], bom: null, supply: {}, rels: [], sources: [] },
  { id: "sambanova-sn40l", name: "SambaNova SN40L", vendor: "SambaNova", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", family: "Reconfigurable Dataflow Unit", status: "production", node: "TSMC", avail: "2024", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "sambanova-sn50", name: "SambaNova SN50", vendor: "SambaNova", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", family: "Reconfigurable Dataflow Unit", status: "production", node: "TSMC", avail: "2025-2026", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "tenstorrent-wormhole", name: "Tenstorrent Wormhole", vendor: "Tenstorrent", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "production", avail: "2023", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: {}, rels: [], sources: [] },
  { id: "tenstorrent-blackhole", name: "Tenstorrent Blackhole", vendor: "Tenstorrent", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", status: "production", avail: "2024-2025", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: {}, rels: [], sources: [] },
  { id: "etched-sohu", name: "Etched Sohu", vendor: "Etched", domain: "logic", sub: "ai_accelerator", subcat: "ai_accelerator_asic", family: "Transformer ASIC", status: "sampling", node: "TSMC", avail: "2025-2026", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Transformer-only inference ASIC; no general matmul support" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-blackwell-platform", name: "NVIDIA Blackwell Platform / GB200 NVL72", vendor: "NVIDIA", domain: "logic", sub: "soc", subcat: "soc", family: "Blackwell", status: "production", node: "TSMC 4NP", avail: "2024-2025", attrs: { integration_level: "system", end_market: "datacenter" }, specs: [{ label: "Notes", value: "72x B200 GPUs + 36x Grace CPUs, NVLink 5, Spectrum-X networking" }], bom: null, supply: {}, rels: [], sources: [] },
  { id: "nvidia-gb300-nvl72", name: "NVIDIA GB300 NVL72 (Blackwell Ultra platform)", vendor: "NVIDIA", domain: "logic", sub: "soc", subcat: "soc", family: "Blackwell Ultra", status: "production", node: "TSMC 4NP", avail: "2025", attrs: { integration_level: "system", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Blackwell Ultra refresh of the NVL72 rack" }], bom: null, supply: {}, rels: [], sources: [] },
  { id: "nvidia-vera-rubin-platform", name: "NVIDIA Vera Rubin Platform (NVL72)", vendor: "NVIDIA", domain: "logic", sub: "soc", subcat: "soc", family: "Rubin", status: "production", node: "TSMC N3", avail: "2026 (2H)", attrs: { integration_level: "system", end_market: "datacenter" }, specs: [{ label: "Notes", value: "7-chip platform: Vera CPU, Rubin GPU, NVLink 6, ConnectX-9, BlueField-4, Spectrum-6, Groq 3 LPU; 72 GPU + 36 CPU rack" }], bom: null, supply: {}, rels: [], sources: [] },
  { id: "nvidia-vera-rubin-nvl144", name: "NVIDIA Vera Rubin NVL144 CPX", vendor: "NVIDIA", domain: "logic", sub: "soc", subcat: "soc", family: "Rubin CPX", status: "announced", node: "TSMC N3", avail: "2026 (late)", attrs: { integration_level: "system", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Context/prefill-optimized rack: 8 exaflops, 100TB fast memory, 1.7PB/s bandwidth" }], bom: null, supply: {}, rels: [], sources: [] },
  { id: "nvidia-rubin-ultra-kyber", name: "NVIDIA Rubin Ultra \"Kyber\" NVL576", vendor: "NVIDIA", domain: "logic", sub: "soc", subcat: "soc", family: "Rubin Ultra", status: "announced", node: "TSMC N3", avail: "2027 (2H)", attrs: { integration_level: "system", end_market: "datacenter" }, specs: [{ label: "Notes", value: "576 GPU compute dies/rack, ~15 EFLOPS FP4 inference, 1TB HBM4e per GPU" }], bom: null, supply: {}, rels: [], sources: [] },
  { id: "nvidia-feynman-platform", name: "NVIDIA Feynman Platform", vendor: "NVIDIA", domain: "logic", sub: "soc", subcat: "soc", family: "Feynman + Rosa", status: "announced", node: "TSMC (next-gen)", avail: "2028", attrs: { integration_level: "system", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Paired Feynman GPU + Rosa CPU platform; next-gen NVLink-8/Spectrum-7/BlueField-5" }], bom: null, supply: {}, rels: [], sources: [] },
  { id: "amd-helios", name: "AMD Helios", vendor: "AMD", domain: "logic", sub: "soc", subcat: "soc", family: "MI450/MI455X + EPYC Venice", status: "announced", node: "TSMC N2", avail: "2026 (2H)", attrs: { integration_level: "system", end_market: "datacenter" }, specs: [{ label: "Notes", value: "72-GPU rack: 2.9 EFLOPS FP4 inference, 31TB HBM4, UALink + Ultra Ethernet" }], bom: null, supply: {}, rels: [], sources: [] },
  { id: "huawei-cloudmatrix-384", name: "Huawei CloudMatrix 384", vendor: "Huawei", domain: "logic", sub: "soc", subcat: "soc", family: "Ascend 910C", status: "production", node: "SMIC 7nm", avail: "2025", attrs: { integration_level: "system", end_market: "datacenter" }, specs: [{ label: "Notes", value: "384-chip all-to-all rack; rivals GB200 NVL72 on raw FLOPs at much higher power draw" }], bom: null, supply: {}, rels: [], sources: [] },
  { id: "google-ironwood-superpod", name: "Google Ironwood (TPU v7) Superpod", vendor: "Google", domain: "logic", sub: "soc", subcat: "soc", family: "TPU v7", status: "production", node: "TSMC N3", avail: "2025-2026", attrs: { integration_level: "system", end_market: "datacenter" }, specs: [{ label: "Notes", value: "9,216-chip pod, 42.5 exaflops, 3D-torus ICI interconnect" }], bom: null, supply: {}, rels: [], sources: [] },
  { id: "aws-trainium3-ultraserver", name: "AWS Trainium3 UltraServer / UltraCluster", vendor: "AWS", domain: "logic", sub: "soc", subcat: "soc", family: "Trainium3", status: "production", node: "TSMC N3", avail: "2025-2026", attrs: { integration_level: "system", end_market: "datacenter" }, specs: [{ label: "Notes", value: "144-chip UltraServer (NeuronLink-v4); scales to ~1M-chip UltraCluster" }], bom: null, supply: {}, rels: [], sources: [] },
  { id: "nvidia-nvswitch3", name: "NVIDIA NVLink 4 / NVSwitch 3", vendor: "NVIDIA", domain: "logic", sub: "networking", subcat: "networking_dpu", family: "Hopper-gen", status: "eol", node: "TSMC", avail: "2022", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "900GB/s GPU-to-GPU scale-up bandwidth" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-nvswitch4", name: "NVIDIA NVLink 5 / NVSwitch 4", vendor: "NVIDIA", domain: "logic", sub: "networking", subcat: "networking_dpu", family: "Blackwell-gen", status: "production", node: "TSMC 4N", avail: "2024", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "1.8TB/s per-GPU scale-up bandwidth" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-connectx7", name: "NVIDIA ConnectX-7 SmartNIC", vendor: "NVIDIA", domain: "logic", sub: "networking", subcat: "networking_dpu", status: "eol", node: "TSMC", avail: "2022", attrs: { material_system: "si", integration_level: "board", end_market: "datacenter" }, specs: [{ label: "Notes", value: "400Gb/s Ethernet/InfiniBand" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-connectx8", name: "NVIDIA ConnectX-8 SuperNIC", vendor: "NVIDIA", domain: "logic", sub: "networking", subcat: "networking_dpu", status: "production", node: "TSMC", avail: "2025", attrs: { material_system: "si", integration_level: "board", end_market: "datacenter" }, specs: [{ label: "Notes", value: "800Gb/s; doubled scale-out bandwidth vs CX-7" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-bluefield3", name: "NVIDIA BlueField-3 DPU", vendor: "NVIDIA", domain: "logic", sub: "networking", subcat: "networking_dpu", status: "production", node: "TSMC", avail: "2023", attrs: { material_system: "si", integration_level: "board", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Foundation of the Spectrum-X networking platform" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence", "arm"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-spectrum4", name: "NVIDIA Spectrum-4 Ethernet Switch (SN5600)", vendor: "NVIDIA", domain: "logic", sub: "networking", subcat: "networking_dpu", status: "production", node: "TSMC", avail: "2024", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "51.2Tb/s; basis of Spectrum-X" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-spectrum5", name: "NVIDIA Spectrum-5 Ethernet Switch", vendor: "NVIDIA", domain: "logic", sub: "networking", subcat: "networking_dpu", status: "production", node: "TSMC", avail: "2025", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Shipping in volume; Spectrum-X platform" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-quantum-x800", name: "NVIDIA Quantum-X800 InfiniBand Switch", vendor: "NVIDIA", domain: "logic", sub: "networking", subcat: "networking_dpu", status: "production", node: "TSMC", avail: "2025", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "800Gb/s InfiniBand for scale-out compute fabric" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-nvlink6", name: "NVIDIA NVLink 6 Switch", vendor: "NVIDIA", domain: "logic", sub: "networking", subcat: "networking_dpu", family: "Rubin-gen", status: "production", node: "TSMC N3", avail: "2026", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "3.6TB/s per-GPU; part of the Vera Rubin platform" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-connectx9", name: "NVIDIA ConnectX-9 SuperNIC", vendor: "NVIDIA", domain: "logic", sub: "networking", subcat: "networking_dpu", status: "production", node: "TSMC N3", avail: "2026", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "board", end_market: "datacenter" }, specs: [{ label: "Notes", value: "1.6Tb/s per GPU; doubled NICs per GPU for Rubin" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-bluefield4", name: "NVIDIA BlueField-4 DPU", vendor: "NVIDIA", domain: "logic", sub: "networking", subcat: "networking_dpu", status: "production", node: "TSMC N3", avail: "2026", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "board", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Dual-die w/ 64-core Grace CPU + ConnectX-9; ASTRA security architecture" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence", "arm"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-spectrum6", name: "NVIDIA Spectrum-6 Ethernet Switch", vendor: "NVIDIA", domain: "logic", sub: "networking", subcat: "networking_dpu", status: "production", node: "TSMC N3", avail: "2026", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Co-packaged optics (Spectrum-X Photonics)" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-nvlink7", name: "NVIDIA NVLink 7 / NVSwitch (Rubin Ultra-gen)", vendor: "NVIDIA", domain: "logic", sub: "networking", subcat: "networking_dpu", family: "Rubin Ultra-gen", status: "announced", node: "TSMC N3", avail: "2027", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "~7.2TB/s per-GPU; powers the Kyber NVL576 rack" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-bluefield5", name: "NVIDIA BlueField-5 DPU", vendor: "NVIDIA", domain: "logic", sub: "networking", subcat: "networking_dpu", family: "Feynman-gen", status: "announced", node: "TSMC (next-gen)", avail: "2028", attrs: { node_maturity: "leading_edge", transistor_arch: "gaa_nanosheet", material_system: "si", integration_level: "board", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Targeted for the Feynman platform; specs undisclosed" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence", "arm"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-spectrum7", name: "NVIDIA Spectrum-7 Ethernet Switch", vendor: "NVIDIA", domain: "logic", sub: "networking", subcat: "networking_dpu", family: "Feynman-gen", status: "announced", node: "TSMC (next-gen)", avail: "2028", attrs: { node_maturity: "leading_edge", transistor_arch: "gaa_nanosheet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Targeted for the Feynman platform; specs undisclosed" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-nvlink8", name: "NVIDIA NVLink-8 / 8th-gen NVSwitch", vendor: "NVIDIA", domain: "logic", sub: "networking", subcat: "networking_dpu", family: "Feynman-gen", status: "announced", node: "TSMC (next-gen)", avail: "2028", attrs: { node_maturity: "leading_edge", transistor_arch: "gaa_nanosheet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Targeted for the Feynman platform; specs undisclosed" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-cx10-ib", name: "NVIDIA CX10 InfiniBand (optical)", vendor: "NVIDIA", domain: "logic", sub: "networking", subcat: "networking_dpu", family: "Feynman-gen", status: "announced", node: "TSMC (next-gen)", avail: "2028", attrs: { node_maturity: "leading_edge", transistor_arch: "gaa_nanosheet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Co-packaged optical InfiniBand interconnect for Feynman" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "amd-pensando-pollara400", name: "AMD Pensando Pollara 400 AI NIC", vendor: "AMD", domain: "logic", sub: "networking", subcat: "networking_dpu", status: "production", node: "TSMC", avail: "2025", attrs: { material_system: "si", integration_level: "board", end_market: "datacenter" }, specs: [{ label: "Notes", value: "First Ultra Ethernet Consortium (UEC)-ready AI NIC; 400Gb/s" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "amd-pensando-vulcano800", name: "AMD Pensando Vulcano 800 AI NIC", vendor: "AMD", domain: "logic", sub: "networking", subcat: "networking_dpu", status: "announced", node: "TSMC", avail: "2026", attrs: { material_system: "si", integration_level: "board", end_market: "datacenter" }, specs: [{ label: "Notes", value: "800Gb/s; supports both UALink and Ultra Ethernet; pairs with MI400/Helios" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "broadcom-tomahawk5", name: "Broadcom Tomahawk 5 Ethernet Switch", vendor: "Broadcom", domain: "logic", sub: "networking", subcat: "networking_dpu", status: "production", node: "TSMC", avail: "2023-2024", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "51.2Tb/s switch ASIC" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "broadcom-tomahawk6", name: "Broadcom Tomahawk 6 Ethernet Switch", vendor: "Broadcom", domain: "logic", sub: "networking", subcat: "networking_dpu", status: "production", node: "TSMC", avail: "2025", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "102.4Tb/s; used in HPE/AMD Helios racks" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "broadcom-tomahawk-ultra", name: "Broadcom Tomahawk Ultra", vendor: "Broadcom", domain: "logic", sub: "networking", subcat: "networking_dpu", status: "production", node: "TSMC", avail: "2025", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Sub-microsecond scale-up Ethernet switch; targets InfiniBand-class latency" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "broadcom-jericho3", name: "Broadcom Jericho3 / Ramon3", vendor: "Broadcom", domain: "logic", sub: "networking", subcat: "networking_dpu", status: "eol", node: "TSMC", avail: "2023", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Deep-buffer, lossless fabric routers" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "broadcom-jericho4", name: "Broadcom Jericho4", vendor: "Broadcom", domain: "logic", sub: "networking", subcat: "networking_dpu", status: "sampling", node: "TSMC 3nm", avail: "2025-2026", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Multi-datacenter AI fabric router; scales beyond 1M XPUs, 100km+ reach" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "ualink-consortium", name: "UALink Consortium (AMD, Intel, Meta, HPE, et al.) UALink (Ultra Accelerator Link)", vendor: "UALink Consortium", domain: "logic", sub: "networking", subcat: "networking_dpu", status: "announced", avail: "2025-2026", attrs: { material_system: "si", integration_level: "system", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Open scale-up interconnect standard positioned as an alternative to NVLink" }], bom: null, supply: {}, rels: [], sources: [] },
  { id: "marvell-networking", name: "Marvell Custom networking / SerDes ASICs", vendor: "Marvell", domain: "logic", sub: "networking", subcat: "networking_dpu", status: "production", node: "TSMC", avail: "2024-2026", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Co-designs interconnect silicon for AWS Trainium and Microsoft Maia" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "aws-nitro", name: "AWS Nitro Cards", vendor: "AWS", domain: "logic", sub: "networking", subcat: "networking_dpu", status: "production", node: "TSMC", avail: "2017+ (latest gens 2024-2025)", attrs: { material_system: "si", integration_level: "board", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Network/storage/security offload silicon underpinning EC2 and UltraServers" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "google-jupiter", name: "Google Jupiter Fabric / OCS", vendor: "Google", domain: "logic", sub: "networking", subcat: "networking_dpu", status: "production", avail: "Ongoing (latest gen 2024-2026)", attrs: { material_system: "si", integration_level: "system", end_market: "datacenter" }, specs: [{ label: "Notes", value: "MEMS-based optical circuit switching for TPU pod/datacenter interconnect" }], bom: null, supply: {}, rels: [], sources: [] },
  { id: "intel-xeon-ice-lake", name: "Intel Xeon Scalable \"Ice Lake\" (3rd Gen)", vendor: "Intel", domain: "logic", sub: "cpu", subcat: "cpu_server", status: "eol", node: "Intel 10nm", avail: "2021", attrs: { node_maturity: "advanced", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { design_ip_eda: ["siemens-eda", "synopsys", "cadence"], materials: ["shin-etsu", "air-products", "entegris"], equipment: ["applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["intel-foundry"], test: ["intel-foundry"] }, rels: [], sources: [] },
  { id: "intel-xeon-sapphire", name: "Intel Xeon Scalable \"Sapphire Rapids\" (4th Gen)", vendor: "Intel", domain: "logic", sub: "cpu", subcat: "cpu_server", status: "eol", node: "Intel 7", avail: "2023", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { design_ip_eda: ["siemens-eda", "synopsys", "cadence"], materials: ["shin-etsu", "air-products", "entegris"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["intel-foundry"], test: ["intel-foundry"] }, rels: [], sources: [] },
  { id: "intel-xeon-emerald", name: "Intel Xeon Scalable \"Emerald Rapids\" (5th Gen)", vendor: "Intel", domain: "logic", sub: "cpu", subcat: "cpu_server", status: "eol", node: "Intel 7", avail: "2023-2024", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { design_ip_eda: ["siemens-eda", "synopsys", "cadence"], materials: ["shin-etsu", "air-products", "entegris"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["intel-foundry"], test: ["intel-foundry"] }, rels: [], sources: [] },
  { id: "intel-xeon6-sierra", name: "Intel Xeon 6 \"Sierra Forest\" (E-core)", vendor: "Intel", domain: "logic", sub: "cpu", subcat: "cpu_server", status: "production", node: "Intel 3", avail: "2024", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { design_ip_eda: ["siemens-eda", "synopsys", "cadence"], materials: ["shin-etsu", "air-products", "entegris"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["intel-foundry"], test: ["intel-foundry"] }, rels: [], sources: [] },
  {
    id: 'intel-xeon-6', name: 'Intel Xeon 6', vendor: 'Intel', domain: 'logic', sub: 'cpu', subcat: 'cpu_server',
    family: 'Granite Rapids', status: 'production', node: 'Intel 3', avail: '2024', verified: '2026-02',
    attrs: { node_maturity: 'leading_edge', transistor_arch: 'finfet', material_system: 'si', integration_level: 'package', end_market: 'datacenter' },
    specs: [
      { label: 'Cores',    value: 'Up to 128 P-cores' },
      { label: 'Memory',   value: 'DDR5 / MRDIMM' },
      { label: 'Socket',   value: 'LGA 7529' },
      { label: 'TDP',      value: 'Up to 500 W' },
      { label: 'Packaging',value: 'EMIB (Embedded Multi-die Interconnect Bridge)' },
    ],
    bom: null,
    supply: { design_ip_eda: ['synopsys','cadence','siemens-eda'], foundry_fab: ['intel-foundry'], materials: ['shin-etsu','entegris'], equipment: ['asml','applied-materials','lam-research','kla','tokyo-electron'], packaging_osat: ['intel-foundry'], test: ['intel-foundry'] },
    rels: [ { type: 'competes_with', target: 'amd-epyc-turin' } ],
    sources: ['est'],
  },
  { id: "intel-xeon6-clearwater", name: "Intel Xeon 6+ \"Clearwater Forest\"", vendor: "Intel", domain: "logic", sub: "cpu", subcat: "cpu_server", family: "Darkmont", status: "production", node: "Intel 18A", avail: "2026", attrs: { node_maturity: "leading_edge", transistor_arch: "gaa_nanosheet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Up to 288 E-cores; first 18A data-center CPU" }], bom: null, supply: { design_ip_eda: ["siemens-eda", "synopsys", "cadence"], materials: ["shin-etsu", "air-products", "entegris"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["intel-foundry"], test: ["intel-foundry"] }, rels: [], sources: [] },
  { id: "intel-xeon7", name: "Intel Xeon 7 \"Diamond Rapids\"", vendor: "Intel", domain: "logic", sub: "cpu", subcat: "cpu_server", family: "Panther Cove-X", status: "announced", node: "Intel 18A-P", avail: "2027", attrs: { node_maturity: "leading_edge", transistor_arch: "gaa_nanosheet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Up to 256 (later 512) P-cores; drops hyperthreading" }], bom: null, supply: { design_ip_eda: ["siemens-eda", "synopsys", "cadence"], materials: ["shin-etsu", "air-products", "entegris"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["intel-foundry"], test: ["intel-foundry"] }, rels: [], sources: [] },
  { id: "intel-xeon8", name: "Intel Xeon 8 \"Coral Rapids\"", vendor: "Intel", domain: "logic", sub: "cpu", subcat: "cpu_server", status: "announced", node: "Intel (advanced node)", avail: "2028", attrs: { node_maturity: "leading_edge", transistor_arch: "gaa_nanosheet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Brings hyperthreading/SMT back" }], bom: null, supply: { design_ip_eda: ["siemens-eda", "synopsys", "cadence"], materials: ["shin-etsu", "air-products", "entegris"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["intel-foundry"], test: ["intel-foundry"] }, rels: [], sources: [] },
  { id: "amd-epyc-milan", name: "AMD EPYC \"Milan\" (3rd Gen)", vendor: "AMD", domain: "logic", sub: "cpu", subcat: "cpu_server", family: "Zen 3", status: "eol", node: "TSMC 7nm", avail: "2021", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tongfu"], test: ["ase", "tongfu"] }, rels: [], sources: [] },
  { id: "amd-epyc-genoa", name: "AMD EPYC \"Genoa\" (4th Gen)", vendor: "AMD", domain: "logic", sub: "cpu", subcat: "cpu_server", family: "Zen 4", status: "eol", node: "TSMC 5nm", avail: "2022", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tongfu"], test: ["ase", "tongfu"] }, rels: [], sources: [] },
  { id: "amd-epyc-bergamo", name: "AMD EPYC \"Bergamo\"", vendor: "AMD", domain: "logic", sub: "cpu", subcat: "cpu_server", family: "Zen 4c", status: "eol", node: "TSMC 5nm", avail: "2023", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tongfu"], test: ["ase", "tongfu"] }, rels: [], sources: [] },
  {
    id: 'amd-epyc-turin', name: 'AMD EPYC Turin', vendor: 'AMD', domain: 'logic', sub: 'cpu', subcat: 'cpu_server',
    family: 'EPYC 9005', status: 'production', node: 'TSMC 4nm / 3nm', avail: '2024', verified: '2026-02',
    attrs: { node_maturity: 'leading_edge', transistor_arch: 'finfet', material_system: 'si', integration_level: 'package', end_market: 'datacenter' },
    specs: [
      { label: 'Cores',   value: 'Up to 192 (Zen 5c)' },
      { label: 'Memory',  value: '12-channel DDR5' },
      { label: 'Socket',  value: 'SP5' },
      { label: 'TDP',     value: 'Up to 500 W' },
    ],
    bom: null,
    supply: { design_ip_eda: ['synopsys','cadence'], foundry_fab: ['tsmc'], materials: ['shin-etsu','ibiden','unimicron','shinko'], equipment: ['asml','applied-materials','lam-research','tokyo-electron','kla'], packaging_osat: ['ase','amkor','tongfu'], test: ['ase','amkor','tongfu'] },
    rels: [ { type: 'competes_with', target: 'intel-xeon-6' } ],
    sources: ['est'],
  },
  { id: "amd-epyc-venice", name: "AMD EPYC \"Venice\"", vendor: "AMD", domain: "logic", sub: "cpu", subcat: "cpu_server", family: "Zen 6 / 6c", status: "announced", node: "TSMC N2", avail: "2026 (2H)", attrs: { node_maturity: "leading_edge", transistor_arch: "gaa_nanosheet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Up to 256 cores, 1.6TB/s memory bandwidth; pairs with Instinct MI450 in Helios" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tongfu"], test: ["ase", "tongfu"] }, rels: [], sources: [] },
  { id: "amd-epyc-verano", name: "AMD EPYC \"Verano\"", vendor: "AMD", domain: "logic", sub: "cpu", subcat: "cpu_server", family: "Zen 7", status: "announced", node: "TSMC (next-gen)", avail: "2027", attrs: { node_maturity: "leading_edge", transistor_arch: "gaa_nanosheet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tongfu"], test: ["ase", "tongfu"] }, rels: [], sources: [] },
  { id: "nvidia-grace", name: "NVIDIA Grace CPU Superchip", vendor: "NVIDIA", domain: "logic", sub: "cpu", subcat: "cpu_server", family: "Arm Neoverse", status: "production", node: "TSMC 4N", avail: "2023", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Pairs with Hopper/Blackwell GPUs (GH200/GB200)" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence", "arm"], materials: ["shin-etsu", "kinsus", "unimicron", "ibiden"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "nvidia-vera-cpu", name: "NVIDIA Vera CPU", vendor: "NVIDIA", domain: "logic", sub: "cpu", subcat: "cpu_server", family: "Arm \"Olympus\" custom cores", status: "production", node: "TSMC N3", avail: "2026", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "88-core/176-thread; pairs with Rubin GPU" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence", "arm"], materials: ["shin-etsu", "kinsus", "unimicron", "ibiden"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "aws-graviton2", name: "AWS Graviton2", vendor: "AWS", domain: "logic", sub: "cpu", subcat: "cpu_server", family: "Arm Neoverse N1", status: "eol", node: "TSMC 7nm", avail: "2020", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence", "arm"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "aws-graviton3", name: "AWS Graviton3", vendor: "AWS", domain: "logic", sub: "cpu", subcat: "cpu_server", family: "Arm Neoverse V1", status: "production", node: "TSMC 5nm", avail: "2022", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence", "arm"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "aws-graviton4", name: "AWS Graviton4", vendor: "AWS", domain: "logic", sub: "cpu", subcat: "cpu_server", family: "Arm Neoverse V2", status: "production", node: "TSMC 4nm", avail: "2024", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence", "arm"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "aws-graviton5", name: "AWS Graviton5", vendor: "AWS", domain: "logic", sub: "cpu", subcat: "cpu_server", family: "Arm Neoverse V3", status: "announced", node: "TSMC 3nm", avail: "2025 (preview) / 2026", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "192 cores; head-node CPU for Trainium3/4 clusters" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence", "arm"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "google-axion", name: "Google Axion", vendor: "Google", domain: "logic", sub: "cpu", subcat: "cpu_server", family: "Arm Neoverse N4A / V2", status: "production", node: "TSMC", avail: "2024-2025", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "N4A and C4A bare-metal variants" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence", "arm"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "microsoft-cobalt100", name: "Microsoft Cobalt 100", vendor: "Microsoft", domain: "logic", sub: "cpu", subcat: "cpu_server", family: "Arm Neoverse N2", status: "production", node: "TSMC", avail: "2023-2024", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence", "arm"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "microsoft-cobalt200", name: "Microsoft Cobalt 200", vendor: "Microsoft", domain: "logic", sub: "cpu", subcat: "cpu_server", family: "Arm Neoverse V3", status: "production", node: "TSMC 3nm", avail: "2025", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "132 cores; live in Azure data centers" }], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence", "arm"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "ampere-altra", name: "Ampere Altra / Altra Max", vendor: "Ampere", domain: "logic", sub: "cpu", subcat: "cpu_server", family: "Arm Neoverse N1", status: "eol", node: "TSMC 7nm", avail: "2020-2021", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence", "arm"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "ampere-ampereone", name: "Ampere AmpereOne", vendor: "Ampere", domain: "logic", sub: "cpu", subcat: "cpu_server", family: "Custom Arm", status: "production", node: "TSMC 5nm", avail: "2023-2024", attrs: { node_maturity: "leading_edge", transistor_arch: "finfet", material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["tsmc"], design_ip_eda: ["synopsys", "cadence", "arm"], materials: ["shin-etsu", "air-liquide", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["ase", "tsmc"], test: ["ase", "tsmc"] }, rels: [], sources: [] },
  { id: "skhynix-hbm2e", name: "SK Hynix HBM2E", vendor: "SK Hynix", domain: "memory", sub: "dram_hbm", subcat: "dram_hbm", family: "High Bandwidth Memory", status: "eol", avail: "2020", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["skhynix"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "skhynix"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["skhynix", "hana-micron", "micron"], test: ["skhynix", "tesna"] }, rels: [], sources: [] },
  { id: "samsung-hbm2e", name: "Samsung HBM2E", vendor: "Samsung", domain: "memory", sub: "dram_hbm", subcat: "dram_hbm", family: "High Bandwidth Memory", status: "eol", avail: "2020", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["samsung"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "soulbrain"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["samsung"], test: ["samsung"] }, rels: [], sources: [] },
  { id: "micron-hbm2e", name: "Micron HBM2E", vendor: "Micron", domain: "memory", sub: "dram_hbm", subcat: "dram_hbm", family: "High Bandwidth Memory", status: "eol", avail: "2020", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["micron"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "entegris", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["pti", "micron"], test: ["pti", "micron"] }, rels: [], sources: [] },
  { id: "skhynix-hbm3", name: "SK Hynix HBM3", vendor: "SK Hynix", domain: "memory", sub: "dram_hbm", subcat: "dram_hbm", family: "High Bandwidth Memory", status: "eol", avail: "2022", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "First to mass-produce HBM3; supplied NVIDIA H100" }], bom: null, supply: { foundry_fab: ["skhynix"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "skhynix"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["skhynix", "hana-micron", "micron"], test: ["skhynix", "tesna"] }, rels: [], sources: [] },
  { id: "samsung-hbm3", name: "Samsung HBM3", vendor: "Samsung", domain: "memory", sub: "dram_hbm", subcat: "dram_hbm", family: "High Bandwidth Memory", status: "eol", avail: "2022", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["samsung"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "soulbrain"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["samsung"], test: ["samsung"] }, rels: [], sources: [] },
  { id: "micron-hbm3", name: "Micron HBM3", vendor: "Micron", domain: "memory", sub: "dram_hbm", subcat: "dram_hbm", family: "High Bandwidth Memory", status: "eol", avail: "2022", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Limited volume; Micron prioritized HBM3E over broad HBM3 production" }], bom: null, supply: { foundry_fab: ["micron"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "entegris", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["pti", "micron"], test: ["pti", "micron"] }, rels: [], sources: [] },
  {
    id: 'skhynix-hbm3e-8hi', name: 'SK Hynix HBM3E 8-Hi', vendor: 'SK Hynix', domain: 'memory', sub: 'dram_hbm', subcat: 'dram_hbm',
    family: 'HBM3E', status: 'production', node: '1b-nm DRAM', avail: '2024', verified: '2026-05',
    attrs: { node_maturity: 'advanced', transistor_arch: 'planar', material_system: 'si', integration_level: 'package', end_market: 'datacenter' },
    specs: [
      { label: 'Stack height', value: '8-Hi' },
      { label: 'Capacity',     value: '24 GB' },
      { label: 'Interface',    value: '1024-bit' },
      { label: 'Bandwidth',    value: '1.2 TB/s per stack' },
      { label: 'Pin speed',    value: '9.6 Gbps' },
      { label: 'TSV',          value: 'Yes' },
    ],
    bom: { uncertainty: 20, total: 400, totalConf: 'low', items: [
      { label: 'Base logic die', cost: 25,  conf: 'low', source: 'est' },
      { label: 'DRAM core dies', cost: 280, qty: 8, conf: 'low', source: 'est' },
      { label: 'TSV stacking',   cost: 60,  conf: 'low', source: 'est' },
      { label: 'Package & test', cost: 35,  conf: 'low', source: 'est' },
    ]},
    supply: { foundry_fab: ['skhynix'], materials: ['shin-etsu','sumco','air-liquide','linde'], equipment: ['asml','applied-materials','lam-research','tokyo-electron','kla'], packaging_osat: ['skhynix','hana-micron'], test: ['skhynix','tesna'] },
    rels: [ { type: 'competes_with', target: 'samsung-hbm3e-12hi' } ],
    sources: ['src-004','est'],
  },
  { id: "samsung-hbm3e-8hi", name: "Samsung HBM3E (8-Hi)", vendor: "Samsung", domain: "memory", sub: "dram_hbm", subcat: "dram_hbm", family: "High Bandwidth Memory", status: "production", avail: "2024", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["samsung"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "soulbrain"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["samsung"], test: ["samsung"] }, rels: [], sources: [] },
  {
    id: 'micron-hbm3e-8hi', name: 'Micron HBM3E 8-Hi', vendor: 'Micron', domain: 'memory', sub: 'dram_hbm', subcat: 'dram_hbm',
    family: 'HBM3E', status: 'production', node: '1b-nm DRAM', avail: '2024', verified: '2026-04',
    attrs: { node_maturity: 'advanced', transistor_arch: 'planar', material_system: 'si', integration_level: 'package', end_market: 'datacenter' },
    specs: [
      { label: 'Stack height', value: '8-Hi' },
      { label: 'Capacity',     value: '24 GB' },
      { label: 'Bandwidth',    value: '1.2 TB/s per stack' },
      { label: 'Power',        value: '~30% below peers', conf: 'low' },
    ],
    bom: { uncertainty: 20, total: 400, totalConf: 'low', items: [
      { label: 'DRAM core dies',    cost: 290, qty: 8, conf: 'low', source: 'est' },
      { label: 'Stacking & package',cost: 110, conf: 'low', source: 'est' },
    ]},
    supply: { foundry_fab: ['micron'], materials: ['shin-etsu','sumco','entegris'], equipment: ['applied-materials','asml','lam-research','kla'], packaging_osat: ['micron','pti'], test: ['micron','pti'] },
    rels: [ { type: 'competes_with', target: 'skhynix-hbm3e-8hi' } ],
    sources: ['est'],
  },
  { id: "skhynix-hbm3e-12hi", name: "SK Hynix HBM3E (12-Hi)", vendor: "SK Hynix", domain: "memory", sub: "dram_hbm", subcat: "dram_hbm", family: "High Bandwidth Memory", status: "production", avail: "2024-2025", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["skhynix"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "skhynix"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["skhynix", "hana-micron", "micron"], test: ["skhynix", "tesna"] }, rels: [], sources: [] },
  {
    id: 'samsung-hbm3e-12hi', name: 'Samsung HBM3E 12-Hi', vendor: 'Samsung', domain: 'memory', sub: 'dram_hbm', subcat: 'dram_hbm',
    family: 'HBM3E', status: 'production', node: '1b-nm DRAM', avail: '2025', verified: '2026-05',
    attrs: { node_maturity: 'advanced', transistor_arch: 'planar', material_system: 'si', integration_level: 'package', end_market: 'datacenter' },
    specs: [
      { label: 'Stack height', value: '12-Hi' },
      { label: 'Capacity',     value: '36 GB' },
      { label: 'Interface',    value: '1024-bit' },
      { label: 'Bandwidth',    value: '1.25 TB/s per stack' },
    ],
    bom: { uncertainty: 22, total: 600, totalConf: 'low', items: [
      { label: 'DRAM core dies',    cost: 430, qty: 12, conf: 'low', source: 'est' },
      { label: 'Stacking & package',cost: 170, conf: 'low', source: 'est' },
    ]},
    supply: { foundry_fab: ['samsung'], materials: ['shin-etsu','sumco','soulbrain'], equipment: ['asml','applied-materials','lam-research','tokyo-electron','kla'], packaging_osat: ['samsung','amkor'], test: ['samsung','amkor'] },
    rels: [ { type: 'competes_with', target: 'skhynix-hbm3e-8hi' } ],
    sources: ['est'],
  },
  { id: "micron-hbm3e-12hi", name: "Micron HBM3E (12-Hi)", vendor: "Micron", domain: "memory", sub: "dram_hbm", subcat: "dram_hbm", family: "High Bandwidth Memory", status: "production", avail: "2024-2025", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["micron"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "entegris", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["pti", "micron"], test: ["pti", "micron"] }, rels: [], sources: [] },
  { id: "skhynix-hbm4", name: "SK Hynix HBM4", vendor: "SK Hynix", domain: "memory", sub: "dram_hbm", subcat: "dram_hbm", family: "High Bandwidth Memory", status: "production", avail: "2026", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Began mass production Feb 2026 (simultaneous with Samsung); base die via TSMC under its 'One Team' alliance" }], bom: null, supply: { foundry_fab: ["skhynix"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "skhynix"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["skhynix", "hana-micron", "micron"], test: ["skhynix", "tesna"] }, rels: [], sources: [] },
  { id: "samsung-hbm4", name: "Samsung HBM4", vendor: "Samsung", domain: "memory", sub: "dram_hbm", subcat: "dram_hbm", family: "High Bandwidth Memory", status: "production", avail: "2026", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Began mass production Feb 2026 (simultaneous with SK Hynix); 2,048-bit I/O, >10Gbps/pin, 4nm logic base die" }], bom: null, supply: { foundry_fab: ["samsung"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "soulbrain"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["samsung"], test: ["samsung"] }, rels: [], sources: [] },
  { id: "micron-hbm4", name: "Micron HBM4", vendor: "Micron", domain: "memory", sub: "dram_hbm", subcat: "dram_hbm", family: "High Bandwidth Memory", status: "sampling", avail: "2026", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Trailing Samsung/SK Hynix to mass production; samples shipped, volume ramping later in 2026" }], bom: null, supply: { foundry_fab: ["micron"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "entegris", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["pti", "micron"], test: ["pti", "micron"] }, rels: [], sources: [] },
  { id: "skhynix-hbm4-16hi", name: "SK Hynix HBM4 (16-Hi)", vendor: "SK Hynix", domain: "memory", sub: "dram_hbm", subcat: "dram_hbm", family: "High Bandwidth Memory", status: "sampling", avail: "2026 (late)", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "48GB capacity, ~2TB/s per stack at 11.7Gbps; demoed at CES 2026" }], bom: null, supply: { foundry_fab: ["skhynix"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "skhynix"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["skhynix", "hana-micron", "micron"], test: ["skhynix", "tesna"] }, rels: [], sources: [] },
  { id: "samsung-hbm4-16hi", name: "Samsung HBM4 (16-Hi)", vendor: "Samsung", domain: "memory", sub: "dram_hbm", subcat: "dram_hbm", family: "High Bandwidth Memory", status: "sampling", avail: "2026 (late)", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["samsung"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "soulbrain"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["samsung"], test: ["samsung"] }, rels: [], sources: [] },
  { id: "micron-hbm4-16hi", name: "Micron HBM4 (16-Hi)", vendor: "Micron", domain: "memory", sub: "dram_hbm", subcat: "dram_hbm", family: "High Bandwidth Memory", status: "sampling", avail: "2026 (late)", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["micron"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "entegris", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["pti", "micron"], test: ["pti", "micron"] }, rels: [], sources: [] },
  { id: "skhynix-hbm4e", name: "SK Hynix HBM4E", vendor: "SK Hynix", domain: "memory", sub: "dram_hbm", subcat: "dram_hbm", family: "High Bandwidth Memory", status: "announced", avail: "2027", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Sampling targeted 2H 2026" }], bom: null, supply: { foundry_fab: ["skhynix"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "skhynix"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["skhynix", "hana-micron", "micron"], test: ["skhynix", "tesna"] }, rels: [], sources: [] },
  { id: "samsung-hbm4e", name: "Samsung HBM4E", vendor: "Samsung", domain: "memory", sub: "dram_hbm", subcat: "dram_hbm", family: "High Bandwidth Memory", status: "announced", avail: "2027", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Sampling targeted 2H 2026; custom HBM samples to customers in 2027" }], bom: null, supply: { foundry_fab: ["samsung"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "soulbrain"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["samsung"], test: ["samsung"] }, rels: [], sources: [] },
  { id: "micron-hbm4e", name: "Micron HBM4E", vendor: "Micron", domain: "memory", sub: "dram_hbm", subcat: "dram_hbm", family: "High Bandwidth Memory", status: "announced", avail: "2027-2028", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["micron"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "entegris", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["pti", "micron"], test: ["pti", "micron"] }, rels: [], sources: [] },
  {
    id: 'micron-ddr5', name: 'Micron DDR5 RDIMM', vendor: 'Micron', domain: 'memory', sub: 'dram_commodity', subcat: 'dram_commodity',
    family: 'DDR5', status: 'production', node: '1b-nm DRAM', avail: '2023', verified: '2026-01',
    attrs: { node_maturity: 'advanced', transistor_arch: 'planar', material_system: 'si', integration_level: 'module', end_market: 'datacenter' },
    specs: [
      { label: 'Data rate', value: 'Up to 6,400 MT/s' },
      { label: 'Capacity',  value: '16–128 GB' },
      { label: 'Form',      value: 'RDIMM' },
    ],
    bom: null,
    supply: { foundry_fab: ['micron'], materials: ['shin-etsu','sumco','entegris'], equipment: ['applied-materials','asml','lam-research','kla'], packaging_osat: ['micron','amkor'], test: ['micron','amkor'] },
    rels: [],
    sources: ['est'],
  },
  { id: "skhynix-ddr5", name: "SK Hynix DDR5 RDIMM", vendor: "SK Hynix", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Server DRAM", status: "production", avail: "2021+", attrs: { material_system: "si", integration_level: "module", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["skhynix"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "skhynix"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["skhynix", "hana-micron", "micron"], test: ["skhynix", "tesna"] }, rels: [], sources: [] },
  { id: "samsung-ddr5", name: "Samsung DDR5 RDIMM", vendor: "Samsung", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Server DRAM", status: "production", avail: "2021+", attrs: { material_system: "si", integration_level: "module", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["samsung"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "soulbrain"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["samsung"], test: ["samsung"] }, rels: [], sources: [] },
  { id: "micron-mrdimm", name: "Micron MRDIMM / MCR-DIMM", vendor: "Micron", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Server DRAM", status: "production", avail: "2024-2025", attrs: { material_system: "si", integration_level: "module", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["micron"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "entegris", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["pti", "micron"], test: ["pti", "micron"] }, rels: [], sources: [] },
  { id: "skhynix-mrdimm", name: "SK Hynix MRDIMM / MCR-DIMM", vendor: "SK Hynix", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Server DRAM", status: "production", avail: "2024-2025", attrs: { material_system: "si", integration_level: "module", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["skhynix"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "skhynix"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["skhynix", "hana-micron", "micron"], test: ["skhynix", "tesna"] }, rels: [], sources: [] },
  { id: "samsung-mrdimm", name: "Samsung MRDIMM / MCR-DIMM", vendor: "Samsung", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Server DRAM", status: "production", avail: "2024-2025", attrs: { material_system: "si", integration_level: "module", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["samsung"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "soulbrain"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["samsung"], test: ["samsung"] }, rels: [], sources: [] },
  { id: "micron-mrdimm-gen2", name: "Micron MRDIMM Gen 2", vendor: "Micron", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Server DRAM", status: "announced", avail: "2026-2027", attrs: { material_system: "si", integration_level: "module", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Up to 1.6TB/s; targeted for Diamond Rapids-class platforms" }], bom: null, supply: { foundry_fab: ["micron"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "entegris", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["pti", "micron"], test: ["pti", "micron"] }, rels: [], sources: [] },
  { id: "skhynix-mrdimm-gen2", name: "SK Hynix MRDIMM Gen 2", vendor: "SK Hynix", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Server DRAM", status: "announced", avail: "2026-2027", attrs: { material_system: "si", integration_level: "module", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["skhynix"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "skhynix"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["skhynix", "hana-micron", "micron"], test: ["skhynix", "tesna"] }, rels: [], sources: [] },
  { id: "samsung-mrdimm-gen2", name: "Samsung MRDIMM Gen 2", vendor: "Samsung", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Server DRAM", status: "announced", avail: "2026-2027", attrs: { material_system: "si", integration_level: "module", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["samsung"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "soulbrain"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["samsung"], test: ["samsung"] }, rels: [], sources: [] },
  { id: "micron-lpddr5x", name: "Micron LPDDR5X / SOCAMM", vendor: "Micron", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Low-Power DRAM module", status: "production", avail: "2025", attrs: { material_system: "si", integration_level: "module", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Used in NVIDIA Grace/Vera and Qualcomm AI200" }], bom: null, supply: { foundry_fab: ["micron"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "entegris", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["pti", "micron"], test: ["pti", "micron"] }, rels: [], sources: [] },
  { id: "samsung-lpddr5x", name: "Samsung LPDDR5X / SOCAMM", vendor: "Samsung", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Low-Power DRAM module", status: "production", avail: "2025", attrs: { material_system: "si", integration_level: "module", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["samsung"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "soulbrain"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["samsung"], test: ["samsung"] }, rels: [], sources: [] },
  { id: "skhynix-lpddr5x", name: "SK Hynix LPDDR5X / SOCAMM", vendor: "SK Hynix", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Low-Power DRAM module", status: "production", avail: "2025", attrs: { material_system: "si", integration_level: "module", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["skhynix"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "skhynix"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["skhynix", "hana-micron", "micron"], test: ["skhynix", "tesna"] }, rels: [], sources: [] },
  { id: "skhynix-socamm2", name: "SK Hynix SOCAMM2", vendor: "SK Hynix", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Low-Power DRAM module", status: "announced", avail: "2026", attrs: { material_system: "si", integration_level: "module", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Showcased at CES 2026" }], bom: null, supply: { foundry_fab: ["skhynix"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "skhynix"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["skhynix", "hana-micron", "micron"], test: ["skhynix", "tesna"] }, rels: [], sources: [] },
  { id: "micron-socamm2", name: "Micron SOCAMM2", vendor: "Micron", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Low-Power DRAM module", status: "announced", avail: "2026", attrs: { material_system: "si", integration_level: "module", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["micron"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "entegris", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["pti", "micron"], test: ["pti", "micron"] }, rels: [], sources: [] },
  { id: "samsung-socamm2", name: "Samsung SOCAMM2", vendor: "Samsung", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Low-Power DRAM module", status: "announced", avail: "2026", attrs: { material_system: "si", integration_level: "module", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["samsung"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "soulbrain"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["samsung"], test: ["samsung"] }, rels: [], sources: [] },
  { id: "skhynix-lpddr6", name: "SK Hynix LPDDR6", vendor: "SK Hynix", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Low-Power DRAM", status: "sampling", avail: "2026-2027", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [{ label: "Notes", value: "Showcased at CES 2026; targeted for Tesla AI6-class edge/inference silicon" }], bom: null, supply: { foundry_fab: ["skhynix"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "skhynix"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["skhynix", "hana-micron", "micron"], test: ["skhynix", "tesna"] }, rels: [], sources: [] },
  { id: "micron-lpddr6", name: "Micron LPDDR6", vendor: "Micron", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Low-Power DRAM", status: "sampling", avail: "2026-2027", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["micron"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "entegris", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["pti", "micron"], test: ["pti", "micron"] }, rels: [], sources: [] },
  { id: "samsung-lpddr6", name: "Samsung LPDDR6", vendor: "Samsung", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Low-Power DRAM", status: "sampling", avail: "2026-2027", attrs: { material_system: "si", integration_level: "package", end_market: "datacenter" }, specs: [], bom: null, supply: { foundry_fab: ["samsung"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "soulbrain"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["samsung"], test: ["samsung"] }, rels: [], sources: [] },
  { id: "samsung-gddr6", name: "Samsung GDDR6", vendor: "Samsung", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Graphics DRAM", status: "eol", avail: "2018+", attrs: { material_system: "si", integration_level: "package", end_market: "consumer" }, specs: [], bom: null, supply: { foundry_fab: ["samsung"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "soulbrain"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["samsung"], test: ["samsung"] }, rels: [], sources: [] },
  { id: "skhynix-gddr6", name: "SK Hynix GDDR6", vendor: "SK Hynix", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Graphics DRAM", status: "eol", avail: "2018+", attrs: { material_system: "si", integration_level: "package", end_market: "consumer" }, specs: [], bom: null, supply: { foundry_fab: ["skhynix"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "skhynix"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["skhynix", "hana-micron", "micron"], test: ["skhynix", "tesna"] }, rels: [], sources: [] },
  { id: "micron-gddr6", name: "Micron GDDR6", vendor: "Micron", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Graphics DRAM", status: "eol", avail: "2018+", attrs: { material_system: "si", integration_level: "package", end_market: "consumer" }, specs: [], bom: null, supply: { foundry_fab: ["micron"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "entegris", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["pti", "micron"], test: ["pti", "micron"] }, rels: [], sources: [] },
  { id: "samsung-gddr7", name: "Samsung GDDR7", vendor: "Samsung", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Graphics DRAM", status: "production", avail: "2024-2025", attrs: { material_system: "si", integration_level: "package", end_market: "consumer" }, specs: [], bom: null, supply: { foundry_fab: ["samsung"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "soulbrain"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["samsung"], test: ["samsung"] }, rels: [], sources: [] },
  { id: "skhynix-gddr7", name: "SK Hynix GDDR7", vendor: "SK Hynix", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Graphics DRAM", status: "production", avail: "2024-2025", attrs: { material_system: "si", integration_level: "package", end_market: "consumer" }, specs: [], bom: null, supply: { foundry_fab: ["skhynix"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "air-liquide", "skhynix"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["skhynix", "hana-micron", "micron"], test: ["skhynix", "tesna"] }, rels: [], sources: [] },
  { id: "micron-gddr7", name: "Micron GDDR7", vendor: "Micron", domain: "memory", sub: "dram_commodity", subcat: "dram_commodity", family: "Graphics DRAM", status: "production", avail: "2024-2025", attrs: { material_system: "si", integration_level: "package", end_market: "consumer" }, specs: [], bom: null, supply: { foundry_fab: ["micron"], design_ip_eda: ["synopsys", "cadence"], materials: ["shin-etsu", "entegris", "sumco"], equipment: ["tokyo-electron", "applied-materials", "lam-research", "asml", "kla"], packaging_osat: ["pti", "micron"], test: ["pti", "micron"] }, rels: [], sources: [] },
]

// ─── Suppliers ────────────────────────────────────────────────────────────────

export const SUPPLIERS: Record<string, Supplier> = {
  tsmc:              { id:'tsmc',             name:'TSMC',              hq:'Taiwan',        models:['foundry'],           stages:['foundry_fab','packaging_osat','test'] },
  samsung:           { id:'samsung',          name:'Samsung',           hq:'South Korea',   models:['idm','foundry'],     stages:['foundry_fab','packaging_osat','test'] },
  'intel-foundry':   { id:'intel-foundry',    name:'Intel Foundry',     hq:'USA',           models:['idm','foundry'],     stages:['foundry_fab','packaging_osat','test'] },
  skhynix:           { id:'skhynix',          name:'SK Hynix',          hq:'South Korea',   models:['idm'],               stages:['foundry_fab','packaging_osat','test'] },
  micron:            { id:'micron',           name:'Micron',            hq:'USA',           models:['idm'],               stages:['foundry_fab','packaging_osat','test'] },
  smic:              { id:'smic',             name:'SMIC',              hq:'China',         models:['foundry'],           stages:['foundry_fab'] },
  globalfoundries:   { id:'globalfoundries',  name:'GlobalFoundries',   hq:'USA',           models:['foundry'],           stages:['foundry_fab'] },
  synopsys:          { id:'synopsys',         name:'Synopsys',          hq:'USA',           models:['eda'],               stages:['design_ip_eda'] },
  cadence:           { id:'cadence',          name:'Cadence',           hq:'USA',           models:['eda'],               stages:['design_ip_eda'] },
  'siemens-eda':     { id:'siemens-eda',      name:'Siemens EDA',       hq:'USA',           models:['eda'],               stages:['design_ip_eda'] },
  empyrean:          { id:'empyrean',         name:'Empyrean Technology',hq:'China',        models:['eda'],               stages:['design_ip_eda'] },
  arm:               { id:'arm',              name:'Arm',               hq:'UK',            models:['ip'],                stages:['design_ip_eda'] },
  broadcom:          { id:'broadcom',         name:'Broadcom',          hq:'USA',           models:['fabless'],           stages:['design_ip_eda','packaging_osat'] },
  alchip:            { id:'alchip',           name:'Alchip',            hq:'Taiwan',        models:['design_services'],   stages:['design_ip_eda'] },
  marvell:           { id:'marvell',          name:'Marvell',           hq:'USA',           models:['fabless'],           stages:['design_ip_eda'] },
  ase:               { id:'ase',              name:'ASE',               hq:'Taiwan',        models:['osat'],              stages:['packaging_osat','test'] },
  amkor:             { id:'amkor',            name:'Amkor',             hq:'USA',           models:['osat'],              stages:['packaging_osat','test'] },
  jcet:              { id:'jcet',             name:'JCET',              hq:'China',         models:['osat'],              stages:['packaging_osat','test'] },
  tongfu:            { id:'tongfu',           name:'Tongfu Microelectronics', hq:'China',   models:['osat'],              stages:['packaging_osat','test'] },
  'hana-micron':     { id:'hana-micron',      name:'Hana Micron',       hq:'South Korea',   models:['osat'],              stages:['packaging_osat','test'] },
  pti:               { id:'pti',              name:'Powertech Technology', hq:'Taiwan',     models:['osat'],              stages:['packaging_osat','test'] },
  tesna:             { id:'tesna',            name:'Tesna',             hq:'South Korea',   models:['osat'],              stages:['test'] },
  huatian:           { id:'huatian',          name:'Huatian Technology', hq:'China',        models:['osat'],              stages:['packaging_osat','test'] },
  asml:              { id:'asml',             name:'ASML',              hq:'Netherlands',   models:['equipment'],         stages:['equipment'] },
  'applied-materials':{ id:'applied-materials',name:'Applied Materials', hq:'USA',          models:['equipment'],         stages:['equipment'] },
  'lam-research':    { id:'lam-research',     name:'Lam Research',      hq:'USA',           models:['equipment'],         stages:['equipment'] },
  'tokyo-electron':  { id:'tokyo-electron',   name:'Tokyo Electron',    hq:'Japan',         models:['equipment'],         stages:['equipment'] },
  kla:               { id:'kla',              name:'KLA',               hq:'USA',           models:['equipment'],         stages:['equipment'] },
  advantest:         { id:'advantest',        name:'Advantest',         hq:'Japan',         models:['equipment'],         stages:['equipment','test'] },
  teradyne:          { id:'teradyne',         name:'Teradyne',          hq:'USA',           models:['equipment'],         stages:['equipment','test'] },
  besi:              { id:'besi',             name:'BESI',              hq:'Netherlands',   models:['equipment'],         stages:['equipment','packaging_osat'] },
  asmpt:             { id:'asmpt',            name:'ASMPT',             hq:'Singapore',     models:['equipment'],         stages:['equipment','packaging_osat'] },
  'shin-etsu':       { id:'shin-etsu',        name:'Shin-Etsu',         hq:'Japan',         models:['materials'],         stages:['materials'] },
  sumco:             { id:'sumco',            name:'SUMCO',             hq:'Japan',         models:['materials'],         stages:['materials'] },
  entegris:          { id:'entegris',         name:'Entegris',          hq:'USA',           models:['materials'],         stages:['materials'] },
  soulbrain:         { id:'soulbrain',        name:'Soulbrain',         hq:'South Korea',   models:['materials'],         stages:['materials'] },
  jsr:               { id:'jsr',              name:'JSR',               hq:'Japan',         models:['materials'],         stages:['materials'] },
  'tokyo-ohka':      { id:'tokyo-ohka',       name:'Tokyo Ohka',        hq:'Japan',         models:['materials'],         stages:['materials'] },
  hoya:              { id:'hoya',             name:'Hoya',              hq:'Japan',         models:['materials'],         stages:['materials'] },
  ibiden:            { id:'ibiden',           name:'Ibiden',            hq:'Japan',         models:['materials'],         stages:['materials','packaging_osat'] },
  unimicron:         { id:'unimicron',        name:'Unimicron',         hq:'Taiwan',        models:['materials'],         stages:['materials','packaging_osat'] },
  shinko:            { id:'shinko',           name:'Shinko',            hq:'Japan',         models:['materials'],         stages:['materials','packaging_osat'] },
  kinsus:            { id:'kinsus',           name:'Kinsus Interconnect', hq:'Taiwan',      models:['materials'],         stages:['materials','packaging_osat'] },
  arrow:             { id:'arrow',            name:'Arrow',             hq:'USA',           models:['distribution'],      stages:['distribution'] },
  avnet:             { id:'avnet',            name:'Avnet',             hq:'USA',           models:['distribution'],      stages:['distribution'] },
  'air-liquide':     { id:'air-liquide',      name:'Air Liquide',       hq:'France',        models:['gases'],             stages:['materials'] },
  linde:             { id:'linde',            name:'Linde',             hq:'Ireland',       models:['gases'],             stages:['materials'] },
  'air-products':    { id:'air-products',     name:'Air Products',      hq:'USA',           models:['gases'],             stages:['materials'] },
  ovivo:             { id:'ovivo',            name:'Ovivo',             hq:'Canada',        models:['infrastructure'],    stages:['materials'] },
  kurita:            { id:'kurita',           name:'Kurita',            hq:'Japan',         models:['infrastructure'],    stages:['materials'] },
}

export function getSupplierName(id: string) { return SUPPLIERS[id]?.name ?? id }

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
export function countSub(domain: string, sub: string) { return PRODUCTS.filter(p => p.domain === domain && p.sub === sub).length }
export function findProduct(id: string) { return PRODUCTS.find(p => p.id === id) }

