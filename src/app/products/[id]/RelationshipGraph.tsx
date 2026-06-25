'use client'

import { useMemo } from 'react'
import {
  ReactFlow,
  Handle,
  Position,
  MarkerType,
  Background,
  type Node,
  type Edge,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import Link from 'next/link'
import type { Product } from '@/lib/data'

const REL_STYLE: Record<string, { label: string; color: string; dash?: string; arrow: boolean }> = {
  competes_with: { label: 'competes with', color: '#dc2626', arrow: false },
  fabbed_by:     { label: 'fabbed by',     color: '#9a6b3f', arrow: true },
  packaged_by:   { label: 'packaged by',   color: '#3f7d7a', arrow: true },
  succeeds:      { label: 'succeeds',      color: '#8a8579', dash: '6 3', arrow: true },
  uses:          { label: 'uses',          color: '#4f7a9a', arrow: true },
}

type CenterData = { label: string }
type RelData = { productId: string; label: string; relType: string; qty?: number; color: string }

function CenterNode({ data }: NodeProps<Node<CenterData>>) {
  return (
    <div style={{
      background: '#0f172a',
      color: '#fff',
      borderRadius: 8,
      padding: '10px 18px',
      fontSize: 11,
      fontWeight: 600,
      textAlign: 'center',
      minWidth: 110,
      whiteSpace: 'nowrap',
    }}>
      <Handle type="source" position={Position.Top}    id="t" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} id="b" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left}   id="l" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right}  id="r" style={{ opacity: 0 }} />
      {data.label}
    </div>
  )
}

function RelNode({ data }: NodeProps<Node<RelData>>) {
  return (
    <Link href={`/products/${data.productId}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#f8f7f4',
        border: `2px solid ${data.color}`,
        borderRadius: 8,
        padding: '8px 14px',
        fontSize: 11,
        color: '#0f172a',
        textAlign: 'center',
        cursor: 'pointer',
        minWidth: 96,
        whiteSpace: 'nowrap',
      }}>
        <Handle type="target" position={Position.Top}    id="t" style={{ opacity: 0 }} />
        <Handle type="target" position={Position.Bottom} id="b" style={{ opacity: 0 }} />
        <Handle type="target" position={Position.Left}   id="l" style={{ opacity: 0 }} />
        <Handle type="target" position={Position.Right}  id="r" style={{ opacity: 0 }} />
        <div style={{ fontWeight: 500 }}>{data.label}</div>
        {data.qty && (
          <div style={{ color: '#8a8579', fontSize: 10, marginTop: 2 }}>×{data.qty}</div>
        )}
      </div>
    </Link>
  )
}

const nodeTypes = { center: CenterNode, rel: RelNode }

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

export default function RelationshipGraph({ product, productNames }: {
  product: Product
  productNames: Record<string, string>
}) {
  const rels = product.rels ?? []
  if (rels.length === 0) return null

  const n = rels.length
  // Radius ensures adjacent circles (r≈40 with padding) don't overlap
  const R = Math.max(160, Math.ceil((n * 90) / (2 * Math.PI)))

  const { nodes, edges } = useMemo<{ nodes: Node[]; edges: Edge[] }>(() => {
    const nodes: Node[] = [
      {
        id: 'center',
        type: 'center',
        position: { x: -55, y: -20 },
        data: { label: truncate(product.name, 18) } satisfies CenterData,
      },
      ...rels.map((r, i) => {
        const angle = ((2 * Math.PI) / n) * i - Math.PI / 2
        const s = REL_STYLE[r.type] ?? { color: '#cbc7bd' }
        return {
          id: r.target,
          type: 'rel',
          position: {
            x: Math.cos(angle) * R - 48,
            y: Math.sin(angle) * R - 20,
          },
          data: {
            productId: r.target,
            label: truncate(productNames[r.target] ?? r.target, 18),
            relType: r.type,
            qty: r.qty,
            color: s.color,
          } satisfies RelData,
        }
      }),
    ]

    const edges: Edge[] = rels.map(r => {
      const s = REL_STYLE[r.type] ?? { color: '#cbc7bd', arrow: false }
      return {
        id: `e-${r.target}`,
        source: 'center',
        target: r.target,
        type: 'straight',
        style: {
          stroke: s.color,
          strokeWidth: 1.5,
          strokeDasharray: s.dash,
        },
        markerEnd: s.arrow
          ? { type: MarkerType.ArrowClosed, color: s.color, width: 14, height: 14 }
          : undefined,
      }
    })

    return { nodes, edges }
  }, [product.name, product.id, rels, productNames, n, R])

  const presentTypes = [...new Set(rels.map(r => r.type))].filter(t => REL_STYLE[t])

  return (
    <section className="rounded-xl border mb-8 overflow-hidden" style={{ borderColor: 'var(--border)', background: '#fff' }}>
      <div className="flex items-center justify-between px-5 pt-4 pb-3 flex-wrap gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#a8a294' }}>Relationships</h2>
        <div className="flex items-center gap-4 flex-wrap">
          {presentTypes.map(t => {
            const s = REL_STYLE[t]
            if (!s) return null
            return (
              <div key={t} className="flex items-center gap-1.5">
                <svg width="22" height="8" aria-hidden="true">
                  <line x1="0" y1="4" x2="15" y2="4" stroke={s.color} strokeWidth="1.5" strokeDasharray={s.dash} />
                  {s.arrow && <polygon points="15,1 22,4 15,7" fill={s.color} />}
                </svg>
                <span className="text-xs" style={{ color: '#8a8579' }}>{s.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ height: 340 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          preventScrolling={false}
          style={{ background: '#fbfaf8' }}
        >
          <Background color="#e8e5df" gap={20} size={1} />
        </ReactFlow>
      </div>
    </section>
  )
}
