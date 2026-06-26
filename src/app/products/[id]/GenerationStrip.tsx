import Link from 'next/link'
import type { Product, ProductSummary } from '@/lib/config'
import { getFullChain } from '@/lib/generations'
import { STATUS_STYLE } from '@/lib/config'

export default function GenerationStrip({ product, summaries }: {
  product: Product
  summaries: ProductSummary[]
}) {
  const chain = getFullChain(product.id, summaries)
  if (chain.length < 2) return null

  return (
    <div className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#a8a294' }}>
        Product family
      </p>
      <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
        {chain.map((p, i) => {
          const isCurrent = p.id === product.id
          const isEol = p.status === 'eol'
          const s = STATUS_STYLE[p.status] ?? { bg: '#f1f0ec', fg: '#6b7280' }

          return (
            <div key={p.id} className="flex items-center gap-2 shrink-0">
              {i > 0 && (
                <span className="text-sm" style={{ color: '#cbc7bd' }}>→</span>
              )}
              {isCurrent ? (
                <span
                  className="inline-flex flex-col gap-0.5 px-3 py-1.5 rounded-lg text-sm font-semibold"
                  style={{ background: '#0f172a', color: '#fff' }}
                >
                  {p.name}
                  {p.node && (
                    <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>{p.node}</span>
                  )}
                </span>
              ) : (
                <Link
                  href={`/products/${p.id}`}
                  className="inline-flex flex-col gap-0.5 px-3 py-1.5 rounded-lg border text-sm transition-shadow hover:shadow-sm"
                  style={{
                    borderColor: '#d6d3cb',
                    background: s.bg,
                    color: s.fg,
                    textDecoration: 'none',
                    opacity: isEol ? 0.55 : 1,
                  }}
                  title={isEol ? 'End of life' : undefined}
                >
                  {p.name}
                  {p.node && (
                    <span className="text-xs font-mono" style={{ color: '#8a8579' }}>{p.node}</span>
                  )}
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
