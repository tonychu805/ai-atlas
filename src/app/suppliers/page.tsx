export const dynamic = 'force-dynamic'

import { getSuppliers } from '@/lib/db'
import SuppliersList from './SuppliersList'

export default async function SuppliersPage() {
  const suppliers = await getSuppliers()
  return <SuppliersList suppliers={Object.values(suppliers)} />
}
