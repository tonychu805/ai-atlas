import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types matching the DB schema
export type Domain = 'logic' | 'memory'
export type Status = 'announced' | 'sampling' | 'production' | 'eol'
export type SourceType = 'filing' | 'teardown' | 'datasheet' | 'estimate' | 'questionnaire'
export type RelationshipType = 'uses' | 'succeeds' | 'competes_with' | 'fabbed_by' | 'packaged_by'

export interface Product {
  id: string
  name: string
  vendor: string
  domain: Domain
  subcategory: string
  family: string | null
  status: Status
  announced: string | null
  available: string | null
  foundry: string | null
  process_node: string | null
  specs: Record<string, unknown>
  bom: Record<string, unknown>
  supply_chain: Record<string, string[]>
  last_verified: string | null
  source_ids: string[]
}

export interface Supplier {
  id: string
  name: string
  hq: string | null
  stages: string[]
  domains_supplied: string[]
}

export interface Source {
  id: string
  title: string
  publisher: string | null
  url: string | null
  type: SourceType
  retrieved: string | null
}

export interface ProductRelationship {
  id: string
  from_product_id: string
  to_product_id: string
  type: RelationshipType
  qty: number | null
  notes: string | null
}

export const SUBCATEGORY_LABELS: Record<string, string> = {
  ai_accelerator_gpu: 'AI GPU',
  ai_accelerator_asic: 'AI ASIC',
  cpu_server: 'Server CPU',
  cpu_client: 'Client CPU',
  soc_mobile: 'Mobile SoC',
  fpga: 'FPGA',
  mcu_embedded: 'MCU / Embedded',
  networking_dpu: 'Networking / DPU',
  dram_hbm: 'HBM',
  dram_commodity: 'DRAM',
  nand: 'NAND',
  nor: 'NOR Flash',
  emerging: 'Emerging Memory',
}

export const DOMAIN_SUBCATEGORIES: Record<Domain, string[]> = {
  logic: ['ai_accelerator_gpu', 'ai_accelerator_asic', 'cpu_server', 'cpu_client', 'soc_mobile', 'fpga', 'mcu_embedded', 'networking_dpu'],
  memory: ['dram_hbm', 'dram_commodity', 'nand', 'nor', 'emerging'],
}

export const STATUS_COLORS: Record<Status, string> = {
  production: 'bg-green-100 text-green-800',
  sampling: 'bg-yellow-100 text-yellow-800',
  announced: 'bg-blue-100 text-blue-800',
  eol: 'bg-gray-100 text-gray-500',
}
