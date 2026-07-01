'use client'

import { STATUS_STYLE, type ProductSummary } from '@/lib/config'
import { orderGenerationChains } from '@/lib/generations'
import { RoadmapGraph } from './RoadmapGraph'

const SUBCAT_LABEL: Record<string, string> = {
  gpu:        'GPU',
  asic:       'AI ASIC',
  fpga:       'FPGA',
  superchip:  'Superchip',
  cpu:        'CPU',
  hbm:        'HBM',
  dram:       'DRAM',
  dpu:        'DPU / SmartNIC',
  switch:     'Switch',
  system:     'System Platform',
  soc:        'SoC',
}

function SubcatRows({ label, products }: { label: string; products: ProductSummary[] }) {
  const entries = orderGenerationChains(products)
  return (
    <div className="mb-4">
      {label && (
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#a8a294' }}>
          {label}
        </p>
      )}
      <RoadmapGraph entries={entries} />
    </div>
  )
}

export default function RoadmapView({ products }: { products: ProductSummary[] }) {
  const byVendor = new Map<string, ProductSummary[]>()
  for (const p of products) {
    const list = byVendor.get(p.vendor)
    if (list) list.push(p)
    else byVendor.set(p.vendor, [p])
  }
  const vendors = [...byVendor.keys()].sort((a, b) => a.localeCompare(b))

  return (
    <div style={{ background: 'var(--background)' }} className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#0f172a' }}>Product roadmap</h1>
          <p className="text-sm" style={{ color: '#8a8579' }}>{products.length} products by company and generation</p>
        </div>

        {vendors.map(vendor => {
          const list = byVendor.get(vendor)!

          if (list.length <= 2) {
            return (
              <section key={vendor} className="mb-8 pt-8 border-t first:border-t-0 first:pt-0" style={{ borderColor: 'var(--border)' }}>
                <h2 className="text-lg font-semibold mb-3" style={{ color: '#0f172a' }}>{vendor}</h2>
                <SubcatRows label="" products={list} />
              </section>
            )
          }

          const bySubcat = new Map<string, ProductSummary[]>()
          for (const p of list) {
            const key = p.subcat || 'other'
            const bucket = bySubcat.get(key)
            if (bucket) bucket.push(p)
            else bySubcat.set(key, [p])
          }
          const subcats = [...bySubcat.keys()].sort((a, b) =>
            (SUBCAT_LABEL[a] ?? a).localeCompare(SUBCAT_LABEL[b] ?? b))

          return (
            <section key={vendor} className="mb-8 pt-8 border-t first:border-t-0 first:pt-0" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: '#0f172a' }}>{vendor}</h2>
              {subcats.map(subcat => (
                <SubcatRows
                  key={subcat}
                  label={SUBCAT_LABEL[subcat] ?? subcat.toUpperCase()}
                  products={bySubcat.get(subcat)!}
                />
              ))}
            </section>
          )
        })}
      </div>
    </div>
  )
}
