export const dynamic = 'force-dynamic'

import { DOMAIN_LIST } from '@/lib/data'
import { getProducts } from '@/lib/db'
import MapView from './MapView'

export default async function MapPage() {
  const products = await getProducts()
  const domainCounts = Object.fromEntries(
    DOMAIN_LIST.map(k => [k, products.filter(p => p.domain === k).length])
  )
  return <MapView domainCounts={domainCounts} />
}
