'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ReactFlow,
  Handle,
  Position,
  MarkerType,
  type NodeProps,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { STATUS_STYLE, LIFECYCLE, type ProductSummary } from '@/lib/config'
import { type ChainEntry } from '@/lib/generations'

const NODE_W = 172
const NODE_H = 80   // approximate rendered height (name + codename + node)
const H_GAP = 52    // horizontal space between nodes (arrow lives here)
const V_GAP = 52    // gap between main chain bottom and first branch row
const ROW_PAD = 12  // gap between branch rows

type ProductData = { p: ProductSummary }

const HS = { background: 'transparent', border: 'none', width: 6, height: 6, opacity: 0 }
const ARROW = { type: MarkerType.ArrowClosed, color: '#cbc7bd', width: 12, height: 12 }
const EDGE_STYLE = { stroke: '#cbc7bd', strokeWidth: 1 }

function ProductNode({ data }: NodeProps) {
  const { p } = data as ProductData
  const s = STATUS_STYLE[p.status] ?? { bg: '#f1f0ec', fg: '#6b7280' }
  return (
    <div style={{ width: NODE_W }}>
      <Handle type="target"  position={Position.Left}   id="left"   style={HS} />
      <Handle type="source"  position={Position.Right}  id="right"  style={HS} />
      {/* bottom handle offset right so the curve exits cleanly, not from center */}
      <Handle type="source"  position={Position.Bottom} id="bottom" style={{ ...HS, left: '80%' }} />
      <Link
        href={`/products/${p.id}`}
        className="nodrag nopan block rounded-lg border transition-shadow hover:shadow-sm focus-visible:outline-none"
        style={{
          borderColor: '#d6d3cb',
          background: s.bg,
          opacity: p.status === 'eol' ? 0.55 : 1,
          textDecoration: 'none',
          padding: '10px 14px',
          overflow: 'hidden',
        }}
        title={LIFECYCLE[p.status] ?? p.status}
      >
        <span className="block text-sm font-medium leading-tight truncate" style={{ color: s.fg }}>
          {p.name}
        </span>
        {p.codename && (
          <span className="block text-xs whitespace-nowrap mt-0.5" style={{ color: s.fg, opacity: 0.65 }}>
            {p.codename}
          </span>
        )}
        {p.node && (
          <span className="block text-xs font-mono mt-0.5" style={{ color: '#8a8579' }}>
            {p.node}
          </span>
        )}
      </Link>
    </div>
  )
}

const nodeTypes = { product: ProductNode }

function buildGraph(entries: ChainEntry[]): { nodes: Node[]; edges: Edge[]; height: number; width: number } {
  const nodes: Node[] = []
  const edges: Edge[] = []

  const independentEntries = entries.filter(e => !e.branchFromId)
  const branchEntries = entries.filter(e => e.branchFromId)

  // Map each product id → the independent chain that contains it, so we can
  // associate branches with the correct parent chain.
  const chainByProductId = new Map<string, ChainEntry>()
  for (const entry of independentEntries) {
    for (const p of entry.chain) chainByProductId.set(p.id, entry)
  }

  // Group branches by their parent independent chain.
  const branchesByChain = new Map<ChainEntry, ChainEntry[]>()
  for (const branch of branchEntries) {
    const parent = chainByProductId.get(branch.branchFromId!)
    if (!parent) continue
    const list = branchesByChain.get(parent) ?? []
    list.push(branch)
    branchesByChain.set(parent, list)
  }

  let currentY = 0

  for (const indEntry of independentEntries) {
    const chain = indEntry.chain
    const idxById = new Map(chain.map((p, i) => [p.id, i]))
    const chainBranches = branchesByChain.get(indEntry) ?? []

    // Place the independent chain horizontally at currentY.
    chain.forEach((p, i) => {
      nodes.push({ id: p.id, type: 'product', position: { x: i * (NODE_W + H_GAP), y: currentY }, data: { p } })
      if (i > 0) {
        const prev = chain[i - 1]
        const linked = p.rels?.some(r => r.type === 'succeeds' && r.target === prev.id)
        if (linked) edges.push({
          id: `e-${prev.id}-${p.id}`,
          source: prev.id, target: p.id,
          sourceHandle: 'right', targetHandle: 'left',
          type: 'default', style: EDGE_STYLE, markerEnd: ARROW,
        })
      }
    })

    // Greedy row assignment for this chain's branches.
    const rowRights: number[] = []
    const rowIdxArr: number[] = []
    for (const branch of chainBranches) {
      const pIdx = idxById.get(branch.branchFromId!) ?? 0
      const succIdx = Math.min(pIdx + 1, chain.length - 1)
      const x = succIdx * (NODE_W + H_GAP)
      let r = rowRights.findIndex(right => x >= right + 12)
      if (r === -1) { r = rowRights.length; rowRights.push(0) }
      rowRights[r] = x + branch.chain.length * (NODE_W + H_GAP)
      rowIdxArr.push(r)
    }

    // Place branches below this chain.
    chainBranches.forEach((branch, i) => {
      const pIdx = idxById.get(branch.branchFromId!) ?? 0
      const succIdx = Math.min(pIdx + 1, chain.length - 1)
      const baseX = succIdx * (NODE_W + H_GAP)
      const branchY = currentY + NODE_H + V_GAP + rowIdxArr[i] * (NODE_H + ROW_PAD)

      branch.chain.forEach((p, j) => {
        nodes.push({ id: p.id, type: 'product', position: { x: baseX + j * (NODE_W + H_GAP), y: branchY }, data: { p } })
        if (j === 0) {
          edges.push({
            id: `b-${branch.branchFromId}-${p.id}`,
            source: branch.branchFromId!, target: p.id,
            sourceHandle: 'bottom', targetHandle: 'left',
            type: 'default', style: EDGE_STYLE, markerEnd: ARROW,
          })
        } else {
          edges.push({
            id: `e-${branch.chain[j - 1].id}-${p.id}`,
            source: branch.chain[j - 1].id, target: p.id,
            sourceHandle: 'right', targetHandle: 'left',
            type: 'default', style: EDGE_STYLE, markerEnd: ARROW,
          })
        }
      })
    })

    const numRows = rowRights.length
    const blockH = numRows > 0
      ? NODE_H + V_GAP + numRows * (NODE_H + ROW_PAD) + V_GAP
      : NODE_H + V_GAP
    currentY += blockH
  }

  const totalW = Math.max(...nodes.map(n => n.position.x + NODE_W), 0)
  return { nodes, edges, height: currentY, width: totalW }
}

const PAD = 16

export function RoadmapGraph({ entries }: { entries: ChainEntry[] }) {
  const router = useRouter()
  const { nodes, edges, height, width } = useMemo(() => buildGraph(entries), [entries])
  return (
    <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
      <div style={{ width: width + PAD * 2, height: height + PAD * 2 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          panOnDrag={false}
          panOnScroll={false}
          preventScrolling={false}
          defaultViewport={{ x: PAD, y: PAD, zoom: 1 }}
          proOptions={{ hideAttribution: true }}
          style={{ background: 'transparent' }}
          onNodeClick={(_, node) => {
            router.push(`/products/${(node.data as ProductData).p.id}`)
          }}
        />
      </div>
    </div>
  )
}
