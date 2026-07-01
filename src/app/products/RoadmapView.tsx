'use client'

import { useState, useMemo } from 'react'
import { type ProductSummary } from '@/lib/config'
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
  const [vendorFilter, setVendorFilter] = useState<string | null>(null)
  const [subcatFilter, setSubcatFilter] = useState<string | null>(null)

  const { vendors, allSubcats } = useMemo(() => {
    const vendorSet = new Set<string>()
    const subcatSet = new Set<string>()
    for (const p of products) {
      vendorSet.add(p.vendor)
      if (p.subcat) subcatSet.add(p.subcat)
    }
    return {
      vendors: [...vendorSet].sort((a, b) => a.localeCompare(b)),
      allSubcats: [...subcatSet].sort((a, b) =>
        (SUBCAT_LABEL[a] ?? a).localeCompare(SUBCAT_LABEL[b] ?? b)),
    }
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      (!vendorFilter || p.vendor === vendorFilter) &&
      (!subcatFilter || p.subcat === subcatFilter)
    )
  }, [products, vendorFilter, subcatFilter])

  const byVendor = useMemo(() => {
    const map = new Map<string, ProductSummary[]>()
    for (const p of filteredProducts) {
      const list = map.get(p.vendor) ?? []
      list.push(p)
      map.set(p.vendor, list)
    }
    return map
  }, [filteredProducts])

  const filteredVendors = useMemo(() =>
    vendors.filter(v => !vendorFilter || v === vendorFilter),
    [vendors, vendorFilter])

  return (
    <div style={{ background: 'var(--background)' }} className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#0f172a' }}>Product roadmap</h1>
          <p className="text-sm" style={{ color: '#8a8579' }}>{products.length} products by company and generation</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          <div className="relative w-40">
            <select
              value={vendorFilter ?? ''}
              onChange={e => { setVendorFilter(e.target.value || null); setSubcatFilter(null) }}
              className="w-full text-sm px-3 py-1.5 pr-7 rounded-lg border appearance-none cursor-pointer outline-none"
              style={{
                borderColor: vendorFilter ? '#0f172a' : '#d6d3cb',
                background: vendorFilter ? '#f0ede8' : '#fff',
                color: vendorFilter ? '#0f172a' : '#3d3b37',
              }}
            >
              <option value="">Company: All</option>
              {vendors.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#8a8579' }}>▾</span>
          </div>

          <div className="relative w-40">
            <select
              value={subcatFilter ?? ''}
              onChange={e => setSubcatFilter(e.target.value || null)}
              className="w-full text-sm px-3 py-1.5 pr-7 rounded-lg border appearance-none cursor-pointer outline-none"
              style={{
                borderColor: subcatFilter ? '#0f172a' : '#d6d3cb',
                background: subcatFilter ? '#f0ede8' : '#fff',
                color: subcatFilter ? '#0f172a' : '#3d3b37',
              }}
            >
              <option value="">Type: All</option>
              {allSubcats.map(s => (
                <option key={s} value={s}>{SUBCAT_LABEL[s] ?? s.toUpperCase()}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#8a8579' }}>▾</span>
          </div>
        </div>

        {filteredVendors.map(vendor => {
          const list = byVendor.get(vendor)
          if (!list || list.length === 0) return null

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
            const bucket = bySubcat.get(key) ?? []
            bucket.push(p)
            bySubcat.set(key, bucket)
          }
          const subcats = [...bySubcat.keys()].sort((a, b) =>
            (SUBCAT_LABEL[a] ?? a).localeCompare(SUBCAT_LABEL[b] ?? b))

          return (
            <section key={vendor} className="mb-8 pt-8 border-t first:border-t-0 first:pt-0" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: '#0f172a' }}>{vendor}</h2>
              {subcats.map(subcat => (
                <SubcatRows
                  key={subcat}
                  label={subcats.length > 1 ? (SUBCAT_LABEL[subcat] ?? subcat.toUpperCase()) : ''}
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
