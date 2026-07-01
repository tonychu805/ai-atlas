export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { getProducts, getProcessNodes, getFoundries, getPackagingTechnologies } from '@/lib/db'
import ProductsTable from './ProductsTable'

export default async function ProductsPage() {
  const [products, processNodes, foundries, packagingTechs] = await Promise.all([getProducts(), getProcessNodes(), getFoundries(), getPackagingTechnologies()])
  return (
    <div style={{ background: 'var(--background)' }}>
      <Suspense>
        <ProductsTable products={products} processNodes={processNodes} foundries={foundries} packagingTechs={packagingTechs} />
      </Suspense>
    </div>
  )
}
