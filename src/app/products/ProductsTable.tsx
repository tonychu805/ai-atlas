'use client'

import { useState, useMemo } from 'react'
import { FACET_DEFS, STATUS_STYLE, LIFECYCLE, type Product } from '@/lib/config'

const FILTER_GROUPS: { label: string; facets: string[] }[] = [
  { label: 'Business',      facets: ['status', 'company_type', 'vendor'] },
  { label: 'Functional',    facets: ['product_category', 'integration_level', 'end_market'] },
  { label: 'Manufacturing', facets: ['node_maturity', 'transistor_arch', 'packaging', 'material_system'] },
]

type FacetDef = { key: string; label: string; map: Record<string, string>; get: (p: Product) => string | undefined }


export default function ProductsTable({ products }: { products: Product[] }) {
  const [search, setSearch]   = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [sortCol, setSortCol] = useState<'name' | 'vendor' | 'generation' | 'subcat' | 'status' | 'avail' | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  // Company and product_category filters are data-driven.
  const allDefs = useMemo<FacetDef[]>(() => {
    const vendors = Array.from(new Set(products.map(p => p.vendor))).sort((a, b) => a.localeCompare(b))
    const vendorDef: FacetDef = {
      key: 'vendor',
      label: 'Company',
      map: Object.fromEntries(vendors.map(v => [v, v])),
      get: p => p.vendor,
    }
    const subcats = Array.from(new Set(products.map(p => p.subcat))).sort()
    const productCategoryDef: FacetDef = {
      key: 'product_category',
      label: 'Product Category',
      map: Object.fromEntries(subcats.map(v => [v, v.toUpperCase()])),
      get: p => p.subcat,
    }
    return [...FACET_DEFS, vendorDef, productCategoryDef]
  }, [products])

  const filtered = useMemo(() => {
    let list = products
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.vendor.toLowerCase().includes(q) ||
        (p.family ?? '').toLowerCase().includes(q)
      )
    }
    for (const [facetKey, val] of Object.entries(filters)) {
      if (!val) continue
      const def = allDefs.find(f => f.key === facetKey)
      if (!def) continue
      list = list.filter(p => def.get(p) === val)
    }
    return list
  }, [products, search, filters, allDefs])

  function shortName(name: string, vendor: string) {
    return name.startsWith(vendor + ' ') ? name.slice(vendor.length + 1) : name
  }

  function setFilter(key: string, val: string) {
    setFilters(prev => ({ ...prev, [key]: prev[key] === val ? '' : val }))
  }

  function toggleSort(col: typeof sortCol) {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  const sorted = useMemo(() => {
    if (!sortCol) return filtered
    return [...filtered].sort((a, b) => {
      const av = ((sortCol === 'generation' ? a.generation : a[sortCol as keyof typeof a]) ?? '').toString().toLowerCase()
      const bv = ((sortCol === 'generation' ? b.generation : b[sortCol as keyof typeof b]) ?? '').toString().toLowerCase()
      const primary = sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      if (primary !== 0 || sortCol === 'name') return primary
      return a.name.localeCompare(b.name)
    })
  }, [filtered, sortCol, sortDir])

  return (
    <div style={{ background: 'var(--background)' }} className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#0f172a' }}>Products</h1>
          <p className="text-sm" style={{ color: '#8a8579' }}>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Search */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Search chips, vendors…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-gray-200 w-64"
            style={{ borderColor: '#d6d3cb', background: '#fff' }}
          />
        </div>

        {/* Grouped filters */}
        <div className="flex flex-col gap-3 mb-6">
          {FILTER_GROUPS.map(group => {
            const defs = group.facets
              .map(key => allDefs.find(f => f.key === key))
              .filter((f): f is FacetDef => Boolean(f))
            return (
              <div key={group.label} className="flex items-start gap-4">
                <span
                  className="text-xs font-semibold uppercase tracking-wider shrink-0 pt-2"
                  style={{ color: '#a8a294', width: '7rem' }}
                >
                  {group.label}
                </span>
                <div className="flex flex-wrap gap-2">
                  {defs.map(def => {
                    const active = filters[def.key]
                    return (
                      <div key={def.key} className="relative">
                        <select
                          value={active ?? ''}
                          onChange={e => setFilter(def.key, e.target.value)}
                          className="text-sm px-3 py-1.5 pr-7 rounded-lg border appearance-none cursor-pointer outline-none"
                          style={{
                            borderColor: active ? '#0f172a' : '#d6d3cb',
                            background: active ? '#f0ede8' : '#fff',
                            color: active ? '#0f172a' : '#3d3b37',
                          }}
                        >
                          <option value="">{def.label}: All</option>
                          {Object.entries(def.map).map(([k, v]) => (
                            <option key={k} value={k}>{v as string}</option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#8a8579' }}>▾</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Hint */}
        <p className="text-xs font-mono mb-4" style={{ color: '#a8a294' }}>
          value-chain columns → click a supplier to follow the chain
        </p>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="text-sm py-12 text-center" style={{ color: '#8a8579' }}>No products match.</div>
        ) : (
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#e5e2db' }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left" style={{ borderColor: '#e5e2db', background: '#f8f7f4' }}>
                  {([
                    { col: 'name',       label: 'Product'    },
                    { col: 'vendor',     label: 'Company'    },
                    { col: 'generation', label: 'Generation' },
                    { col: 'subcat',     label: 'Category'   },
                    { col: 'avail',      label: 'Year'       },
                    { col: 'status',     label: 'Status'     },
                  ] as { col: typeof sortCol; label: string }[]).map(({ col, label }) => (
                    <th
                      key={col}
                      className="px-5 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none"
                      style={{ color: sortCol === col ? '#0f172a' : '#a8a294' }}
                      onClick={() => toggleSort(col)}
                    >
                      <span className="flex items-center gap-1">
                        {label}
                        <span className="text-xs" style={{ color: sortCol === col ? '#0f172a' : '#d6d3cb' }}>
                          {sortCol === col ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                        </span>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((p, i) => {
                  const st = STATUS_STYLE[p.status] ?? { bg: '#f1f0ec', fg: '#6b7280' }
                  const catLabel = p.subcat.replace(/_/g, ' ').toUpperCase()
                  return (
                    <tr
                      key={p.id}
                      className="border-b cursor-pointer transition-colors hover:bg-amber-50/30"
                      style={{ borderColor: '#e5e2db', background: i % 2 === 0 ? '#fff' : 'transparent' }}
                      onClick={() => { window.location.href = `/products/${p.id}` }}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: st.fg }} />
                          <div>
                            <div className="font-medium" style={{ color: '#0f172a' }}>{shortName(p.name, p.vendor)}</div>
                            {p.codename && <div className="text-xs" style={{ color: '#a8a294' }}>{p.codename}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: '#6b6557' }}>{p.vendor}</td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: p.generation ? '#6b6557' : '#c4c0b8' }}>{p.generation ?? '—'}</td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: '#6b6557' }}>{catLabel}</td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: '#6b6557' }}>{p.avail ?? '—'}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: st.bg, color: st.fg }}
                        >
                          {LIFECYCLE[p.status] ?? p.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
