export const dynamic = 'force-dynamic'

import { getProductSummaries } from '@/lib/db'
import RoadmapView from '../products/RoadmapView'

export const metadata = { title: 'Roadmap — AI Atlas' }

export default async function RoadmapPage() {
  const products = await getProductSummaries()
  return <RoadmapView products={products} />
}
