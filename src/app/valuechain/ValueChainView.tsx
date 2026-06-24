'use client'

import { useState } from 'react'
import Link from 'next/link'
import { VALUE_CHAIN, MODEL_LABEL, MODEL_COLOR, type Supplier } from '@/lib/data'

export default function ValueChainView({ suppliers }: { suppliers: Record<string, Supplier> }) {
  const [open, setOpen]     = useState<string | null>(VALUE_CHAIN[0].key)
  const [stageFilter, setStageFilter] = useState<string>('')

  const visibleStages = stageFilter
    ? VALUE_CHAIN.filter(s => s.key === stageFilter)
    : VALUE_CHAIN

  return (
    <div style={{ background: 'var(--background)' }} className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#0f172a' }}>The value chain</h1>
          <p className="text-sm" style={{ color: '#8a8579' }}>
            Seven stages from design tools to customer delivery. Click a stage to expand.
          </p>
        </div>

        {/* Stage filter pills */}
        <div className="flex flex-wrap gap-2 mb-7">
          <button
            onClick={() => setStageFilter('')}
            className="px-3 py-1.5 rounded-full text-sm border transition-colors"
            style={{
              borderColor: stageFilter ? '#d6d3cb' : '#0f172a',
              background: stageFilter ? '#fff' : '#0f172a',
              color: stageFilter ? '#6b6557' : '#fff',
            }}
          >
            All stages
          </button>
          {VALUE_CHAIN.map(stage => (
            <button
              key={stage.key}
              onClick={() => {
                const next = stageFilter === stage.key ? '' : stage.key
                setStageFilter(next)
                if (next) setOpen(next)
              }}
              className="px-3 py-1.5 rounded-full text-sm border transition-colors"
              style={{
                borderColor: stageFilter === stage.key ? '#0f172a' : '#d6d3cb',
                background: stageFilter === stage.key ? '#0f172a' : '#fff',
                color: stageFilter === stage.key ? '#fff' : '#6b6557',
              }}
            >
              {stage.label}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-2">
          {visibleStages.map(stage => {
            const isOpen = open === stage.key
            const supplierCount = stage.groups.reduce((n, g) => n + g.ids.length, 0)
            const idx = VALUE_CHAIN.findIndex(s => s.key === stage.key)

            return (
              <div key={stage.key} className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)', background: '#fff' }}>
                {/* Accordion header */}
                <button
                  className="w-full flex items-center gap-4 px-5 py-4 text-left"
                  onClick={() => setOpen(isOpen ? null : stage.key)}
                >
                  <span className="text-sm font-medium w-5 text-right flex-shrink-0 font-mono" style={{ color: '#a8a294' }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{stage.label}</p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: '#f1f0ec', color: '#8a8579' }}
                      >
                        {supplierCount} supplier{supplierCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: '#8a8579' }}>{stage.desc}</p>
                  </div>
                  <span className="text-sm flex-shrink-0" style={{ color: '#a8a294' }}>{isOpen ? '−' : '+'}</span>
                </button>

                {/* Accordion body */}
                {isOpen && (
                  <div className="px-5 pb-5 border-t" style={{ borderColor: 'var(--border)' }}>
                    {/* Sub-activities as tag pills */}
                    <div className="mt-4 mb-5">
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#a8a294' }}>Activities</p>
                      <div className="flex flex-wrap gap-1.5">
                        {stage.subs.map(s => (
                          <span
                            key={s}
                            className="text-xs px-2.5 py-1 rounded-full border"
                            style={{ borderColor: '#d6d3cb', color: '#6b6557', background: '#f8f7f4' }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Supplier groups */}
                    {stage.groups.map(g => (
                      <div key={g.title} className="mb-4">
                        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#a8a294' }}>{g.title}</p>
                        <div className="flex flex-wrap gap-2">
                          {g.ids.map(sid => {
                            const sup = suppliers[sid]
                            if (!sup) return null
                            const model = sup.models[0]
                            const mc = model ? (MODEL_COLOR[model] ?? { bg: '#f1f0ec', fg: '#6b7280' }) : null
                            return (
                              <Link
                                key={sid}
                                href={`/suppliers/${sid}`}
                                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors hover:border-gray-400"
                                style={{ borderColor: '#d6d3cb', background: '#fbfaf8', color: '#3d3b37', textDecoration: 'none' }}
                              >
                                <span>{sup.name}</span>
                                {mc && model && (
                                  <span
                                    className="text-xs px-1.5 py-0.5 rounded"
                                    style={{ background: mc.bg, color: mc.fg }}
                                  >
                                    {MODEL_LABEL[model] ?? model}
                                  </span>
                                )}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
