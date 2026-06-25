export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { getProducts } from '@/lib/db'
import ProductsTable from './ProductsTable'

export default async function ProductsPage() {
  return (
    <div style={{ background: 'var(--background)' }}>
      <Suspense>
        <ProductsTable products={await getProducts()} />
      </Suspense>
    </div>
  )
}
