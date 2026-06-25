export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getProducts, getSuppliers } from '@/lib/db'
import { STAGES, type Product } from '@/lib/data'

export const metadata = { title: 'Supply Chain — AI Atlas' }

export default async function SupplyChainPage() {
  const [products, supplierMap] = await Promise.all([getProducts(), getSuppliers()])

  // Per-stage: supplier → products using them at that stage
  const stageData = STAGES.map(stage => {
    const bySupplier: Record<string, Product[]> = {}
    for (const p of products) {
      for (const sid of p.supply[stage.key] ?? []) {
        if (!bySupplier[sid]) bySupplier[sid] = []
        bySupplier[sid].push(p)
      }
    }
    const entries = Object.entries(bySupplier)
      .map(([sid, prods]) => ({
        sid,
        name: supplierMap[sid]?.name ?? sid,
        prods,
        count: prods.length,
      }))
      .sort((a, b) => b.count - a.count)
    const stageProductCount = new Set(entries.flatMap(e => e.prods.map(p => p.id))).size
    return { stage, entries, stageProductCount }
  }).filter(d => d.entries.length > 0)

  // Summary
  const mappedProducts = products.filter(p =>
    Object.values(p.supply).some(a => a && a.length > 0)
  ).length
  const uniqueSupplierCount = new Set(
    products.flatMap(p => Object.values(p.supply).flatMap(a => a ?? []))
  ).size

  // Global top concentration
  const topConc = stageData
    .flatMap(d => d.entries.map(e => ({ ...e, stageLabel: d.stage.label, stageProdCount: d.stageProductCount })))
    .sort((a, b) => b.count - a.count)[0]

  return (
    <div style={{ background: 'var(--background)' }} className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#0f172a' }}>Supply chain</h1>
          <p className="text-sm" style={{ color: '#8a8579' }}>
            {mappedProducts} of {products.length} products mapped · {uniqueSupplierCount} suppliers · {stageData.length} production stages
          </p>
        </div>

        {/* Top concentration callout */}
        {topConc && (
          <div className="rounded-xl p-5 mb-10 flex gap-4" style={{ background: '#fdf8f0', border: '1px solid #e8d5b5' }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>⚑</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#9a6b3f' }}>
                Highest single-supplier concentration
              </p>
              <p className="text-sm" style={{ color: '#3d3b37', lineHeight: 1.65 }}>
                <Link href={`/suppliers/${topConc.sid}`} style={{ color: '#0f172a', fontWeight: 600, textDecoration: 'none' }}>
                  {topConc.name}
                </Link>{' '}
                provides {topConc.stageLabel.toLowerCase()} services to{' '}
                <strong style={{ color: '#0f172a' }}>{topConc.count}</strong> of {topConc.stageProdCount} products
                with {topConc.stageLabel.toLowerCase()} data — touching{' '}
                <strong style={{ color: '#0f172a' }}>{Math.round((topConc.count / topConc.stageProdCount) * 100)}%</strong>{' '}
                of that stage.
              </p>
            </div>
          </div>
        )}

        {/* Per-stage concentration */}
        {stageData.map(({ stage, entries, stageProductCount }) => {
          const maxCount = entries[0].count
          const leader = entries[0]
          const leaderShare = Math.round((leader.count / stageProductCount) * 100)

          return (
            <section key={stage.key} className="mb-12">
              {/* Stage header */}
              <div className="flex items-baseline justify-between mb-5">
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a8a294' }}>
                  {stage.label}
                </h2>
                <span className="text-xs" style={{ color: '#a8a294' }}>
                  {stageProductCount} products · {entries.length} supplier{entries.length !== 1 ? 's' : ''} · leader holds {leaderShare}%
                </span>
              </div>

              {/* Supplier bars */}
              <div className="flex flex-col gap-4">
                {entries.map(({ sid, name, prods, count }, i) => {
                  const pct = (count / stageProductCount) * 100
                  const isLeader = i === 0
                  return (
                    <div key={sid}>
                      <div className="flex items-center gap-3 mb-2">
                        <Link
                          href={`/suppliers/${sid}`}
                          className="text-sm font-medium shrink-0 truncate hover:underline"
                          style={{ color: '#0f172a', textDecoration: 'none', width: 156 }}
                        >
                          {name}
                        </Link>
                        {/* Bar */}
                        <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: '#f1f0ec' }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pct}%`,
                              background: isLeader ? '#0f172a' : '#cbc7bd',
                            }}
                          />
                        </div>
                        <span className="text-sm font-mono shrink-0 tabular-nums text-right" style={{ color: '#6b6557', width: 28 }}>
                          {count}
                        </span>
                      </div>
                      {/* Product chips */}
                      <div className="flex flex-wrap gap-1" style={{ paddingLeft: 168 }}>
                        {prods.slice(0, 8).map(p => (
                          <Link
                            key={p.id}
                            href={`/products/${p.id}`}
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{ color: '#6b6557', background: '#f1f0ec', textDecoration: 'none' }}
                          >
                            {p.name}
                          </Link>
                        ))}
                        {prods.length > 8 && (
                          <span className="text-xs px-1.5 py-0.5" style={{ color: '#a8a294' }}>
                            +{prods.length - 8} more
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 border-b" style={{ borderColor: 'var(--border)' }} />
            </section>
          )
        })}
      </div>
    </div>
  )
}
