import Link from 'next/link'
import {
  getProduct, getProductDownstream, getProductNames, getProductSummaries,
  getSuppliers, getProductRelationships, getSources,
} from '@/lib/db'
import ProductDetail from './ProductDetail'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, productNames, suppliers, summaries, downstream, relations, sources] = await Promise.all([
    getProduct(id), getProductNames(), getSuppliers(), getProductSummaries(),
    getProductDownstream(id), getProductRelationships(id), getSources(),
  ])

  if (!product) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p style={{ color: '#8a8579' }}>Product not found.</p>
      <Link href="/products" style={{ color: '#9a6b3f' }}>← Back to products</Link>
    </div>
  )

  return <ProductDetail product={product} productNames={productNames} suppliers={suppliers} summaries={summaries} downstream={downstream} relations={relations} sources={sources} />
}
