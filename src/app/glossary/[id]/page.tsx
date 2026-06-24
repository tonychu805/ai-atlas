import { getProductNames, getSuppliers } from '@/lib/db'
import TermDetail from './TermDetail'

export default async function TermPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [productNames, suppliers] = await Promise.all([getProductNames(), getSuppliers()])
  return <TermDetail id={id} productNames={productNames} suppliers={suppliers} />
}
