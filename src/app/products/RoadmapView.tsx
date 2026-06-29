import Link from 'next/link'
import { STATUS_STYLE, LIFECYCLE, type ProductSummary } from '@/lib/config'
import { orderGenerationChains, type ChainEntry } from '@/lib/generations'

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

function Pill({ p }: { p: ProductSummary }) {
  const s = STATUS_STYLE[p.status] ?? { bg: '#f1f0ec', fg: '#6b7280' }
  const eol = p.status === 'eol'
  return (
    <Link
      href={`/products/${p.id}`}
      className="flex-shrink-0 inline-flex flex-col gap-1 px-4 py-3 rounded-lg border transition-shadow hover:shadow-sm"
      style={{
        borderColor: '#d6d3cb', background: s.bg, textDecoration: 'none',
        opacity: eol ? 0.55 : 1,
      }}
      title={LIFECYCLE[p.status] ?? p.status}
    >
      <span className="text-sm font-medium whitespace-nowrap" style={{ color: s.fg }}>{p.name}</span>
      {p.codename && <span className="text-xs whitespace-nowrap" style={{ color: s.fg, opacity: 0.7 }}>{p.codename}</span>}
      {p.node && <span className="text-xs font-mono" style={{ color: '#8a8579' }}>{p.node}</span>}
    </Link>
  )
}

function ChainRow({ items, prevItems }: { items: ProductSummary[]; prevItems?: ProductSummary[] }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto ax-scroll pb-1">
      {items.map((p, i) => {
        const linkedToPrev = i > 0 && p.rels?.some(r => r.type === 'succeeds' && r.target === items[i - 1].id)
        return (
          <div key={p.id} className="flex items-center gap-2 flex-shrink-0">
            {i > 0 && (linkedToPrev
              ? <span style={{ color: '#cbc7bd' }}>→</span>
              : <span style={{ color: '#e2dfd8' }}>·</span>
            )}
            <Pill p={p} />
          </div>
        )
      })}
    </div>
  )
}

function SubcatRows({ label, entries }: { label: string; entries: ChainEntry[] }) {
  return (
    <div className="mb-6">
      {label && <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#a8a294' }}>{label}</p>}
      {entries.map(({ chain, branchFromId }, i) => (
        <div key={i} className={i > 0 ? 'mt-2' : ''}>
          {branchFromId ? (
            <div className="flex items-center gap-2">
              <span className="flex-shrink-0 text-sm select-none" style={{ color: '#cbc7bd' }}>└→</span>
              <ChainRow items={chain} />
            </div>
          ) : (
            <ChainRow items={chain} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function RoadmapView({ products }: { products: ProductSummary[] }) {
  // Group by vendor.
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
          // Vendors with 1–2 products: a single flat row, no sub grouping.
          if (list.length <= 2) {
            return (
              <section key={vendor} className="mb-8 pt-8 border-t first:border-t-0 first:pt-0" style={{ borderColor: 'var(--border)' }}>
                <h2 className="text-lg font-semibold mb-3" style={{ color: '#0f172a' }}>{vendor}</h2>
                <SubcatRows label="" entries={orderGenerationChains(list)} />
              </section>
            )
          }

          // Otherwise group by subcat for fine-grained rows.
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
              {subcats.flatMap(subcat => {
                const chains = orderGenerationChains(bySubcat.get(subcat)!)
                const label = SUBCAT_LABEL[subcat] ?? subcat.toUpperCase()
                return chains.map((chain, ci) => (
                  <Row key={`${subcat}-${ci}`} label={ci === 0 ? label : ''} items={chain} />
                ))
              })}
            </section>
          )
        })}
      </div>
    </div>
  )
}
