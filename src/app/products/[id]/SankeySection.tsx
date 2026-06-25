'use client'

import { useMemo } from 'react'
import { SankeyDiagram } from 'semiotic/network'
import type { Product } from '@/lib/data'

type Downstream = { id: string; name: string; rels: { type: string; target: string; qty?: number }[] }

export default function SankeySection({ product, downstream }: {
  product: Product
  downstream: Downstream[]
}) {
  const hasBom = Boolean(product.bom && product.bom.items.length > 0)
  const hasDownstream = downstream.length > 0
  if (!hasBom && !hasDownstream) return null

  const { nodes, edges } = useMemo(() => {
    const nodes: { id: string; label: string; category: string }[] = []
    const edges: { source: string; target: string; value: number }[] = []

    // Upstream: BOM items → product
    if (hasBom) {
      for (const item of product.bom!.items) {
        const nodeId = `bom::${item.label}`
        nodes.push({ id: nodeId, label: item.label, category: 'upstream' })
        edges.push({ source: nodeId, target: product.id, value: item.cost })
      }
    }

    // Center: the product itself
    nodes.push({ id: product.id, label: product.name, category: 'product' })

    // Downstream: product → products that use this one
    if (hasDownstream) {
      // Split the product's total value evenly across downstream consumers
      const baseValue = product.bom?.total ?? 1
      const perDownstream = baseValue / downstream.length
      for (const d of downstream) {
        nodes.push({ id: d.id, label: d.name, category: 'downstream' })
        const rel = d.rels.find(r => r.type === 'uses' && r.target === product.id)
        // If qty is available, use proportional share; otherwise equal split
        const value = rel?.qty
          ? (rel.qty / downstream.reduce((sum, dx) => {
              const rx = dx.rels.find(r => r.type === 'uses' && r.target === product.id)
              return sum + (rx?.qty ?? 1)
            }, 0)) * baseValue
          : perDownstream
        edges.push({ source: product.id, target: d.id, value })
      }
    }

    return { nodes, edges }
  }, [product, downstream, hasBom, hasDownstream])

  return (
    <section className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#a8a294' }}>
        Supply flow
      </p>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)', background: '#fff' }}>
        <SankeyDiagram
          nodes={nodes}
          edges={edges}
          nodeIdAccessor="id"
          valueAccessor="value"
          colorBy="category"
          colorScheme={['#e2d9cc', '#0f172a', '#94a3b8']}
          showLabels
          width={700}
          height={Math.max(200, nodes.length * 40)}
          margin={{ top: 16, bottom: 16, left: 160, right: 160 }}
        />
      </div>
    </section>
  )
}
