import Link from 'next/link'
import type { Product, ProductSummary } from '@/lib/data'
import { findAdjacent } from '@/lib/generations'

function Chip({ p, dir }: { p: ProductSummary; dir: 'prev' | 'next' }) {
  return (
    <Link
      href={`/products/${p.id}`}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-shadow hover:shadow-sm"
      style={{ borderColor: '#d6d3cb', background: '#fbfaf8', color: '#3d3b37', textDecoration: 'none' }}
    >
      {dir === 'prev' && <span style={{ color: '#a8a294' }}>←</span>}
      {p.name}
      {dir === 'next' && <span style={{ color: '#a8a294' }}>→</span>}
    </Link>
  )
}

export default function GenerationStrip({ product, summaries }: {
  product: Product
  summaries: ProductSummary[]
}) {
  const { predecessor, successor } = findAdjacent(product, summaries)
  if (!predecessor && !successor) return null

  return (
    <div className="flex items-center gap-3 flex-wrap mb-8">
      {predecessor && <Chip p={predecessor} dir="prev" />}
      <span className="text-xs px-2.5 py-1.5 rounded-lg font-medium" style={{ background: '#0f172a', color: '#fff' }}>
        {product.name}
      </span>
      {successor && <Chip p={successor} dir="next" />}
    </div>
  )
}
