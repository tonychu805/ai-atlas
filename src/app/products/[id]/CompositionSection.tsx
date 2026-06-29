import Link from 'next/link'
import type { ProductRelations } from '@/lib/relationships'

export default function CompositionSection({ sub, relations }: {
  sub: string
  relations: ProductRelations
}) {
  const { uses } = relations
  if (uses.length === 0) return null

  const label = sub === 'soc' ? 'Components' : 'Key components'

  return (
    <section className="rounded-xl border p-5 mb-8" style={{ borderColor: 'var(--border)', background: '#fff' }}>
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#a8a294' }}>{label}</h2>
      <div className="flex flex-col gap-2">
        {uses.map(part => (
          <Link
            key={part.id}
            href={`/products/${part.id}`}
            className="flex items-center justify-between gap-3 text-sm rounded-lg px-3 py-2 border transition-colors"
            style={{ borderColor: '#e6e3db', background: '#fbfaf8', textDecoration: 'none' }}
          >
            <span style={{ color: '#0f172a' }}>{part.name}</span>
            <span className="flex items-center gap-3">
              {part.qty && <span className="font-mono" style={{ color: '#8a8579' }}>×{part.qty}</span>}
              <span style={{ color: '#cbc7bd' }}>→</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
