export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { getProducts } from '@/lib/db'
import ProductsTable from './ProductsTable'

export default async function ProductsPage() {
  const products = await getProducts()
  return (
    <Suspense>
      <ProductsTable products={products} />
    </Suspense>
  )
}
