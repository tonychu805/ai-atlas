'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { TERMS, PRODUCTS, SUPPLIERS, SOURCES, STAGES } from '@/lib/data'
import { Linkify } from '@/lib/linkify'

type Level = 'L1' | 'L2' | 'L3'

const CAT_LABEL: Record<string, string> = {
  concept: 'Concept', process: 'Process', component: 'Component',
  material: 'Material', metric: 'Metric', org_type: 'Organisation type',
}

const REL_LABEL: Record<string, string> = {
  broader: 'Broader concept', narrower: 'Narrower concept', part_of: 'Part of', see_also: 'See also',
}

export default function TermPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [level, setLevel] = useState<Level>('L1')
  const term = TERMS[id]

  if (!term) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p style={{ color: '#8a8579' }}>Term not found.</p>
      <Link href="/glossary" style={{ color: '#9a6b3f' }}>← Glossary</Link>
    </div>
  )

  const hasL2 = Boolean(term.l2)
  const hasL3 = Boolean(term.l3)

  return (
    <div style={{ background: 'var(--background)' }} className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8" style={{ color: '#8a8579' }}>
          <Link href="/glossary" style={{ color: '#8a8579', textDecoration: 'none' }}>Glossary</Link>
          <span>›</span>
          <span style={{ color: '#0f172a' }}>{term.term}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: '#f3f2ee', color: '#6b7280' }}>
                {CAT_LABEL[term.category] ?? term.category}
              </span>
              {term.acronym && (
                <span className="font-mono text-sm" style={{ color: '#8a8579' }}>{term.acronym}</span>
              )}
            </div>
            <h1 className="text-3xl font-bold" style={{ color: '#0f172a' }}>{term.term}</h1>
          </div>
          {(hasL2 || hasL3) && (
            <div className="flex items-center gap-1 rounded-lg border p-1 flex-shrink-0" style={{ borderColor: '#d6d3cb', background: '#fbfaf8' }}>
              {(['L1','L2','L3'] as Level[]).map(l => {
                const disabled = (l === 'L2' && !hasL2) || (l === 'L3' && !hasL3)
                return (
                  <button key={l} onClick={() => !disabled && setLevel(l)} disabled={disabled}
                    className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
                    style={{ background: level === l ? '#fff' : 'transparent', color: level === l ? '#0f172a' : disabled ? '#d6d3cb' : '#8a8579', boxShadow: level === l ? '0 1px 3px rgba(0,0,0,0.06)' : 'none', cursor: disabled ? 'default' : 'pointer' }}>
                    {l}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Definition block */}
        <section className="rounded-xl border p-6 mb-6" style={{ borderColor: 'var(--border)', background: '#fff' }}>
          <p className="text-base mb-3" style={{ color: '#1c1a17', lineHeight: 1.7 }}>
            <Linkify text={term.l1} />
          </p>
          {term.analogy && (
            <p className="text-sm italic" style={{ color: '#8a8579' }}>
              <Linkify text={term.analogy} />
            </p>
          )}
          {(level === 'L2' || level === 'L3') && term.l2 && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="text-sm" style={{ color: '#3d3b37', lineHeight: 1.7 }}>
                <Linkify text={term.l2} />
              </p>
            </div>
          )}
          {level === 'L3' && term.l3 && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="text-sm" style={{ color: '#3d3b37', lineHeight: 1.7 }}>
                <Linkify text={term.l3} />
              </p>
            </div>
          )}
        </section>

        {/* Why it matters */}
        {term.why && (
          <section className="rounded-xl p-4 mb-6 flex gap-3" style={{ background: '#fdf8f0', border: '1px solid #e8d5b5' }}>
            <span className="text-lg" style={{ lineHeight: 1 }}>⚑</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#9a6b3f' }}>Why it matters</p>
              <p className="text-sm" style={{ color: '#3d3b37', lineHeight: 1.6 }}><Linkify text={term.why} /></p>
            </div>
          </section>
        )}

        {/* Process steps */}
        {term.process && (
          <section className="rounded-xl border p-5 mb-6" style={{ borderColor: 'var(--border)', background: '#fff' }}>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#a8a294' }}>
              In the fab — {STAGES.find(s => s.key === term.process!.stage)?.label ?? term.process.stage}
            </h2>
            <ol className="text-sm space-y-2" style={{ color: '#3d3b37' }}>
              {term.process.steps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full text-center text-xs font-medium leading-5 mt-0.5"
                    style={{ background: '#f3f2ee', color: '#8a8579' }}>{i + 1}</span>
                  <Linkify text={s} />
                </li>
              ))}
            </ol>
            {term.process.equipment && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#a8a294' }}>Key equipment</p>
                <div className="flex flex-wrap gap-2">
                  {term.process.equipment.map(sid => (
                    <Link key={sid} href={`/suppliers/${sid}`}
                      className="text-xs px-2 py-0.5 rounded border"
                      style={{ borderColor: '#d6d3cb', color: '#3d3b37', background: '#fbfaf8', textDecoration: 'none' }}>
                      {SUPPLIERS[sid]?.name ?? sid}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Connects to */}
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          {/* Relations */}
          {term.relations && term.relations.length > 0 && (
            <section className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', background: '#fff' }}>
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#a8a294' }}>Connects to</h2>
              <div className="flex flex-col gap-2">
                {term.relations.map(r => (
                  <div key={r.target + r.type} className="flex items-center gap-2 text-sm">
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#f3f2ee', color: '#6b7280' }}>
                      {REL_LABEL[r.type] ?? r.type}
                    </span>
                    <Link href={`/glossary/${r.target}`} style={{ color: '#9a6b3f', textDecoration: 'none' }}>
                      {TERMS[r.target]?.term ?? r.target}
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related products */}
          {term.products && term.products.length > 0 && (
            <section className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', background: '#fff' }}>
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#a8a294' }}>Related products</h2>
              <div className="flex flex-col gap-2">
                {term.products.map(pid => {
                  const p = PRODUCTS.find(pr => pr.id === pid)
                  return (
                    <Link key={pid} href={`/products/${pid}`} style={{ color: '#0f172a', textDecoration: 'none', fontSize: 14 }}>
                      {p?.name ?? pid}
                    </Link>
                  )
                })}
              </div>
            </section>
          )}
        </div>

        {/* Related entities */}
        {term.entities && term.entities.length > 0 && (
          <section className="rounded-xl border p-5 mb-6" style={{ borderColor: 'var(--border)', background: '#fff' }}>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#a8a294' }}>Key companies</h2>
            <div className="flex flex-wrap gap-2">
              {term.entities.map(sid => (
                <Link key={sid} href={`/suppliers/${sid}`}
                  className="text-sm px-3 py-1.5 rounded-lg border transition-colors"
                  style={{ borderColor: '#d6d3cb', color: '#3d3b37', background: '#fbfaf8', textDecoration: 'none' }}>
                  {SUPPLIERS[sid]?.name ?? sid}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Sources */}
        {term.sources && term.sources.length > 0 && (
          <section className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', background: '#fbfaf8' }}>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#a8a294' }}>Sources</h2>
            {term.sources.map(sid => {
              const src = SOURCES[sid]
              if (!src) return null
              return (
                <div key={sid} className="flex items-start gap-3 text-xs mb-2">
                  <span className="font-mono px-1.5 py-0.5 rounded" style={{ background: '#f1f0ec', color: '#8a8579' }}>{sid}</span>
                  <div>
                    <p style={{ color: '#3d3b37' }}>{src.title}</p>
                    <p style={{ color: '#a8a294' }}>{src.meta}</p>
                  </div>
                </div>
              )
            })}
          </section>
        )}
      </div>
    </div>
  )
}
