import Link from 'next/link'
import { getProduct, getProductNames, getSuppliers } from '@/lib/db'
import ProductDetail from './ProductDetail'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, productNames, suppliers] = await Promise.all([
    getProduct(id), getProductNames(), getSuppliers(),
  ])

  if (!product) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p style={{ color: '#8a8579' }}>Product not found.</p>
      <Link href="/products" style={{ color: '#9a6b3f' }}>← Back to products</Link>
    </div>
  )

  return <ProductDetail product={product} productNames={productNames} suppliers={suppliers} />
}
