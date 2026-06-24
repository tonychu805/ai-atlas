import Link from 'next/link'
import { DOMAINS, STATUS_STYLE, LIFECYCLE, type ProductSummary } from '@/lib/data'
import { orderGeneration } from '@/lib/generations'

// sub key -> human label, flattened from every domain's sub list.
const SUB_LABEL: Record<string, string> = Object.fromEntries(
  Object.values(DOMAINS).flatMap(d => d.subs.map(s => [s.key, s.label] as const)),
)

function Pill({ p }: { p: ProductSummary }) {
  const s = STATUS_STYLE[p.status] ?? { bg: '#f1f0ec', fg: '#6b7280' }
  const eol = p.status === 'eol'
  return (
    <Link
      href={`/products/${p.id}`}
      className="flex-shrink-0 inline-flex flex-col gap-0.5 px-3 py-1.5 rounded-lg border transition-shadow hover:shadow-sm"
      style={{
        borderColor: '#d6d3cb', background: s.bg, textDecoration: 'none',
        opacity: eol ? 0.55 : 1,
      }}
      title={LIFECYCLE[p.status] ?? p.status}
    >
      <span className="text-sm font-medium leading-tight" style={{ color: s.fg }}>{p.name}</span>
      {p.node && <span className="text-xs font-mono leading-tight" style={{ color: '#8a8579' }}>{p.node}</span>}
    </Link>
  )
}

function Row({ label, items }: { label: string; items: ProductSummary[] }) {
  return (
    <div className="mb-4">
      {label && <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#a8a294' }}>{label}</p>}
      <div className="flex items-center gap-2 overflow-x-auto ax-scroll pb-1">
        {items.map((p, i) => (
          <div key={p.id} className="flex items-center gap-2">
            {i > 0 && <span style={{ color: '#cbc7bd' }}>→</span>}
            <Pill p={p} />
          </div>
        ))}
      </div>
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
              <section key={vendor} className="mb-8">
                <h2 className="text-lg font-semibold mb-3" style={{ color: '#0f172a' }}>{vendor}</h2>
                <Row label="" items={orderGeneration(list)} />
              </section>
            )
          }

          // Otherwise group by sub.
          const bySub = new Map<string, ProductSummary[]>()
          for (const p of list) {
            const sub = bySub.get(p.sub)
            if (sub) sub.push(p)
            else bySub.set(p.sub, [p])
          }
          const subs = [...bySub.keys()].sort((a, b) =>
            (SUB_LABEL[a] ?? a).localeCompare(SUB_LABEL[b] ?? b))

          return (
            <section key={vendor} className="mb-8">
              <h2 className="text-lg font-semibold mb-3" style={{ color: '#0f172a' }}>{vendor}</h2>
              {subs.map(sub => (
                <Row key={sub} label={SUB_LABEL[sub] ?? sub} items={orderGeneration(bySub.get(sub)!)} />
              ))}
            </section>
          )
        })}
      </div>
    </div>
  )
}
