export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { getProducts, getProductSummaries } from '@/lib/db'
import ProductsTable from './ProductsTable'
import RoadmapView from './RoadmapView'
import BrowseModeToggle from './BrowseModeToggle'

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const { mode } = await searchParams
  const roadmap = mode === 'roadmap'

  const view = roadmap
    ? <RoadmapView products={await getProductSummaries()} />
    : <ProductsTable products={await getProducts()} />

  return (
    <div style={{ background: 'var(--background)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <BrowseModeToggle roadmap={roadmap} />
      </div>
      <Suspense>{view}</Suspense>
    </div>
  )
}
