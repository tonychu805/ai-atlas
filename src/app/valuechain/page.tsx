export const dynamic = 'force-dynamic'

import { getSuppliers } from '@/lib/db'
import ValueChainView from './ValueChainView'

export default async function ValueChainPage() {
  const suppliers = await getSuppliers()
  return <ValueChainView suppliers={suppliers} />
}
