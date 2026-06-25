import Link from 'next/link'
import { sankeyLayout } from '@/lib/sankey'
import type { ProductRelations } from '@/lib/relationships'

export default function SankeySection({ name, relations }: {
  name: string
  relations: ProductRelations
}) {
  const { uses, usedBy } = relations
  if (uses.length === 0 && usedBy.length === 0) return null

  const layout = sankeyLayout(uses.length, usedBy.length)
  const { width, height, left, right, center, ribbons } = layout

  return (
    <section className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#a8a294' }}>
        Supply flow
      </p>
      <div className="rounded-xl border overflow-x-auto" style={{ borderColor: 'var(--border)', background: '#fff' }}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ display: 'block', fontFamily: 'system-ui', minWidth: 420 }}>
          {/* column labels */}
          {uses.length > 0 && (
            <text x={left[0].x} y={14} fontSize="9" letterSpacing="1" fill="#a8a294">USES</text>
          )}
          <text x={center.x} y={14} fontSize="9" letterSpacing="1" fill="#a8a294" textAnchor="start">THIS</text>
          {usedBy.length > 0 && (
            <text x={right[0].x + right[0].w} y={14} fontSize="9" letterSpacing="1" fill="#a8a294" textAnchor="end">USED IN</text>
          )}

          {/* ribbons */}
          {ribbons.map(r => (
            <path key={`${r.side}-${r.index}`} d={r.path}
              fill={r.side === 'left' ? '#2c6360' : '#475569'} opacity={0.26} />
          ))}

          {/* center node */}
          <rect x={center.x} y={center.y} width={center.w} height={center.h} rx={3} fill="#0f172a" />
          <text x={center.x + center.w + 8} y={center.y + center.h / 2} fontSize="12" fontWeight="700" fill="#0f172a" dominantBaseline="middle">{name}</text>

          {/* left (uses) nodes */}
          {left.map((rect, i) => (
            <g key={`l-${uses[i].id}`}>
              <Link href={`/products/${uses[i].id}`}>
                <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx={2} fill="#2c6360" style={{ cursor: 'pointer' }} />
              </Link>
              <Link href={`/products/${uses[i].id}`}>
                <text x={rect.x + rect.w + 6} y={rect.y + rect.h / 2} fontSize="11" fill="#3d3b37" dominantBaseline="middle" style={{ cursor: 'pointer' }}>
                  {uses[i].name}{uses[i].qty ? ` ×${uses[i].qty}` : ''}
                </text>
              </Link>
            </g>
          ))}

          {/* right (usedBy) nodes */}
          {right.map((rect, i) => (
            <g key={`r-${usedBy[i].id}`}>
              <Link href={`/products/${usedBy[i].id}`}>
                <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx={2} fill="#475569" style={{ cursor: 'pointer' }} />
              </Link>
              <Link href={`/products/${usedBy[i].id}`}>
                <text x={rect.x - 6} y={rect.y + rect.h / 2} fontSize="11" fill="#3d3b37" textAnchor="end" dominantBaseline="middle" style={{ cursor: 'pointer' }}>
                  {usedBy[i].name}{usedBy[i].qty ? ` ×${usedBy[i].qty}` : ''}
                </text>
              </Link>
            </g>
          ))}
        </svg>
      </div>
    </section>
  )
}
