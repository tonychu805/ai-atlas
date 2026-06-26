'use client'

import { useState } from 'react'
import Link from 'next/link'
import { STAGES, MODEL_LABEL, MODEL_COLOR, type Supplier } from '@/lib/config'

function ModelBadge({ model }: { model: string }) {
  const c = MODEL_COLOR[model] ?? { bg: '#f1f0ec', fg: '#6b7280' }
  return (
    <span className="text-xs px-2 py-0.5 rounded font-medium"
      style={{ background: c.bg, color: c.fg }}>
      {MODEL_LABEL[model] ?? model}
    </span>
  )
}

export default function SuppliersList({ suppliers }: { suppliers: Supplier[] }) {
  const [stage, setStage] = useState<string>('')
  const filtered = stage ? suppliers.filter(s => s.stages.includes(stage as never)) : suppliers

  return (
    <div style={{ background: 'var(--background)' }} className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#0f172a' }}>Suppliers</h1>
          <p className="text-sm" style={{ color: '#8a8579' }}>{filtered.length} companies across the semiconductor supply chain</p>
        </div>

        {/* Stage filter */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto ax-scroll pb-1">
          <button onClick={() => setStage('')}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-sm border transition-colors"
            style={{ borderColor: stage ? '#d6d3cb' : '#0f172a', background: stage ? 'transparent' : '#0f172a', color: stage ? '#6b6557' : '#fff' }}>
            All stages
          </button>
          {STAGES.map(st => (
            <button key={st.key} onClick={() => setStage(stage === st.key ? '' : st.key)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-sm border transition-colors"
              style={{ borderColor: stage === st.key ? '#0f172a' : '#d6d3cb', background: stage === st.key ? '#0f172a' : 'transparent', color: stage === st.key ? '#fff' : '#6b6557' }}>
              {st.label}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(sup => (
            <Link key={sup.id} href={`/suppliers/${sup.id}`}
              className="block p-4 rounded-xl border transition-shadow hover:shadow-md"
              style={{ borderColor: 'var(--border)', background: '#fff', textDecoration: 'none' }}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>{sup.name}</span>
                <span className="text-xs flex-shrink-0" style={{ color: '#8a8579' }}>{sup.hq}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {sup.models.map(m => <ModelBadge key={m} model={m} />)}
              </div>
              <p className="text-xs" style={{ color: '#a8a294' }}>
                {sup.stages.map(k => STAGES.find(s => s.key === k)?.label).filter(Boolean).join(' · ')}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
