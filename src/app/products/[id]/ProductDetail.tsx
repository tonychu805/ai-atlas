'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  PRODUCT_BRIEF, SOURCES, STAGES, STATUS_STYLE, CONF_STYLE,
  FACET_DEFS, DOMAINS, LIFECYCLE, fmtUSD,
  type Product, type ProductSummary, type Supplier,
} from '@/lib/data'
import { Linkify } from '@/lib/linkify'
import GenerationStrip from './GenerationStrip'

type Level = 'L1' | 'L2' | 'L3'
type BriefEntry = { l1: string; analogy?: string; l2?: string; l3?: string; why?: string; keyTerms?: string[] }

const REL_DISPLAY: Record<string, string> = {
  competes_with: 'Competes with',
  uses: 'Uses',
}
const REL_ORDER = ['competes_with', 'uses']

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? { bg: '#f1f0ec', fg: '#6b7280' }
  return (
    <span className="text-xs px-2 py-1 rounded font-medium" style={{ background: s.bg, color: s.fg }}>
      {LIFECYCLE[status] ?? status}
    </span>
  )
}

function ConfBadge({ conf }: { conf?: string }) {
  if (!conf) return null
  const c = CONF_STYLE[conf]
  if (!c) return null
  return <span className="text-xs font-medium" style={{ color: c.c }} title={`Confidence: ${c.l}`}>{c.l}</span>
}

function BriefContent({ brief, level, setLevel }: {
  brief: BriefEntry
  level: Level
  setLevel: (l: Level) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3 gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a8a294' }}>In plain terms</p>
        <div className="flex items-center gap-1 rounded-lg border p-0.5" style={{ borderColor: '#d6d3cb', background: '#fbfaf8' }}>
          {(['L1', 'L2', 'L3'] as Level[]).map(l => (
            <button key={l} onClick={() => setLevel(l)}
              className="px-2.5 py-0.5 rounded-md text-xs font-medium transition-colors"
              style={{ background: level === l ? '#fff' : 'transparent', color: level === l ? '#0f172a' : '#8a8579', boxShadow: level === l ? '0 1px 3px rgba(0,0,0,0.06)' : 'none' }}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <p className="text-sm mb-3" style={{ color: '#1c1a17', lineHeight: 1.75 }}>
        <Linkify text={brief.l1} />
      </p>
      {brief.analogy && (
        <p className="text-sm italic mb-3" style={{ color: '#8a8579' }}>
          <Linkify text={brief.analogy} />
        </p>
      )}
      {(level === 'L2' || level === 'L3') && brief.l2 && (
        <p className="text-sm mt-3" style={{ color: '#3d3b37', lineHeight: 1.75, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <Linkify text={brief.l2} />
        </p>
      )}
      {level === 'L3' && brief.l3 && (
        <p className="text-sm mt-3" style={{ color: '#3d3b37', lineHeight: 1.75, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <Linkify text={brief.l3} />
        </p>
      )}
      {brief.why && (
        <div className="mt-4 rounded-lg p-3 flex gap-2" style={{ background: '#fdf8f0', border: '1px solid #e8d5b5' }}>
          <span style={{ lineHeight: 1 }}>⚑</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#9a6b3f' }}>Why it matters</p>
            <p className="text-xs" style={{ color: '#3d3b37', lineHeight: 1.6 }}><Linkify text={brief.why} /></p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProductDetail({ product, productNames, suppliers, summaries }: {
  product: Product
  productNames: Record<string, string>
  suppliers: Record<string, Supplier>
  summaries: ProductSummary[]
}) {
  const [level, setLevel] = useState<Level>('L1')

  const brief = PRODUCT_BRIEF[product.id]
  const domain = DOMAINS[product.domain as keyof typeof DOMAINS]
  const hasSpecs = product.specs.length > 0

  // Relationships — group by type, exclude succeeds/fabbed_by/packaged_by
  const relsByType: Record<string, { target: string; qty?: number }[]> = {}
  for (const r of product.rels ?? []) {
    if (!REL_DISPLAY[r.type]) continue
    if (!relsByType[r.type]) relsByType[r.type] = []
    relsByType[r.type].push(r)
  }
  const hasRels = REL_ORDER.some(t => relsByType[t]?.length)

  // Suppliers grouped by stage
  const stageGroups = STAGES
    .map(st => ({
      stage: st,
      sids: product.supply[st.key] ?? [],
    }))
    .filter(g => g.sids.length > 0)
  const totalSuppliers = stageGroups.reduce((n, g) => n + g.sids.length, 0)

  // Dense 2-column specs split
  const specHalf = Math.ceil(product.specs.length / 2)
  const leftSpecs = product.specs.slice(0, specHalf)
  const rightSpecs = product.specs.slice(specHalf)

  return (
    <div style={{ background: 'var(--background)' }} className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8" style={{ color: '#8a8579' }}>
          <Link href="/products" style={{ color: '#8a8579', textDecoration: 'none' }}>Products</Link>
          <span>›</span>
          {domain && <Link href={`/products?domain=${product.domain}`} style={{ color: '#8a8579', textDecoration: 'none' }}>{domain.label}</Link>}
          {domain && <span>›</span>}
          <span style={{ color: '#0f172a' }}>{product.name}</span>
        </div>

        {/* Title */}
        <div className="mb-6">
          <div className="mb-2">
            <StatusBadge status={product.status} />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: '#0f172a' }}>{product.name}</h1>
          <p className="text-base mt-1" style={{ color: '#8a8579' }}>{product.vendor} · {product.family ?? product.subcat}</p>
        </div>

        {/* Generation chain */}
        <GenerationStrip product={product} summaries={summaries} />

        {/* Hero: image + description, or description alone */}
        {product.image_url ? (
          <div className="grid sm:grid-cols-2 gap-8 mb-8 items-start">
            <div className="rounded-xl overflow-hidden" style={{ background: '#f1f0ec', aspectRatio: '4/3' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image_url}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div>
              {brief
                ? <BriefContent brief={brief} level={level} setLevel={setLevel} />
                : <p className="text-sm" style={{ color: '#a8a294' }}>No description available yet.</p>
              }
            </div>
          </div>
        ) : brief ? (
          <section className="rounded-xl p-6 mb-8" style={{ background: '#fff', border: '1px solid var(--border)' }}>
            <BriefContent brief={brief} level={level} setLevel={setLevel} />
          </section>
        ) : null}

        {/* Related products (competes_with, uses) */}
        {hasRels && (
          <section className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#a8a294' }}>Related products</p>
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)', background: '#fff' }}>
              {REL_ORDER.filter(t => relsByType[t]?.length).map((t, i) => (
                <div key={t}
                  className="flex items-start gap-4 px-4 py-3"
                  style={{ borderTop: i > 0 ? '1px solid var(--border)' : undefined }}>
                  <span className="text-xs pt-0.5 shrink-0" style={{ color: '#8a8579', width: 100 }}>{REL_DISPLAY[t]}</span>
                  <div className="flex flex-wrap gap-2">
                    {relsByType[t].map(r => (
                      <Link
                        key={r.target}
                        href={`/products/${r.target}`}
                        className="text-xs px-2.5 py-1 rounded-full border transition-shadow hover:shadow-sm"
                        style={{ borderColor: '#d6d3cb', background: '#fbfaf8', color: '#3d3b37', textDecoration: 'none' }}
                      >
                        {productNames[r.target] ?? r.target}
                        {r.qty && <span style={{ color: '#8a8579' }}> ×{r.qty}</span>}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Suppliers grouped by stage */}
        {totalSuppliers > 0 && (
          <section className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#a8a294' }}>
              Suppliers ({totalSuppliers})
            </p>
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <table className="w-full text-sm">
                <tbody>
                  {stageGroups.map(({ stage, sids }) => (
                    <>
                      <tr key={`stage-${stage.key}`} style={{ background: '#f8f7f4', borderTop: '1px solid var(--border)' }}>
                        <td
                          colSpan={1}
                          className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
                          style={{ color: '#a8a294' }}
                        >
                          {stage.label}
                        </td>
                      </tr>
                      {sids.map(sid => (
                        <tr key={sid} style={{ borderTop: '1px solid var(--border)', background: '#fff' }}>
                          <td className="py-2.5 px-4">
                            <Link
                              href={`/suppliers/${sid}`}
                              style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 500 }}
                              className="hover:underline"
                            >
                              {suppliers[sid]?.name ?? sid}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Attributes */}
        {product.attrs && FACET_DEFS.some(f => f.get(product)) && (
          <section className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#a8a294' }}>Attributes</p>
            <div className="flex flex-wrap gap-2">
              {FACET_DEFS.map(f => {
                const v = f.get(product)
                if (!v) return null
                return (
                  <span key={f.key} className="text-xs px-2.5 py-1 rounded-full border"
                    style={{ borderColor: '#d6d3cb', color: '#3d3b37', background: '#fbfaf8' }}>
                    <span style={{ color: '#8a8579' }}>{f.label}: </span>{f.map[v] ?? v}
                  </span>
                )
              })}
            </div>
          </section>
        )}

        {/* Specs — dense 2-column */}
        {hasSpecs && (
          <section className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#a8a294' }}>Specifications</p>
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="grid sm:grid-cols-2" style={{ background: '#fff' }}>
                <table className="w-full text-sm">
                  <tbody>
                    {leftSpecs.map(s => (
                      <tr key={s.label} style={{ borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
                        <td className="py-2.5 px-4" style={{ color: '#8a8579', width: '45%' }}>{s.label}</td>
                        <td className="py-2.5 px-4 text-right font-medium" style={{ color: '#0f172a' }}>
                          {s.value}
                          {s.conf && <span className="ml-1.5"><ConfBadge conf={s.conf} /></span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table className="w-full text-sm">
                  <tbody>
                    {rightSpecs.map(s => (
                      <tr key={s.label} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="py-2.5 px-4" style={{ color: '#8a8579', width: '45%' }}>{s.label}</td>
                        <td className="py-2.5 px-4 text-right font-medium" style={{ color: '#0f172a' }}>
                          {s.value}
                          {s.conf && <span className="ml-1.5"><ConfBadge conf={s.conf} /></span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* BOM */}
        {product.bom && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a8a294' }}>BOM cost estimate</p>
              <span className="text-xs" style={{ color: '#8a8579' }}>±{product.bom.uncertainty}%</span>
            </div>
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <table className="w-full text-sm" style={{ background: '#fff' }}>
                <tbody>
                  {product.bom.items.map(item => (
                    <tr key={item.label} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-2.5 px-4" style={{ color: '#3d3b37' }}>
                        {item.label}
                        {item.note && <span className="text-xs block" style={{ color: '#8a8579' }}>{item.note}</span>}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-medium" style={{ color: '#0f172a' }}>
                        {fmtUSD(item.cost)}
                      </td>
                      <td className="py-2.5 pr-4"><ConfBadge conf={item.conf} /></td>
                    </tr>
                  ))}
                  <tr style={{ background: '#fbfaf8' }}>
                    <td className="pt-3 pb-3 px-4 font-semibold" style={{ color: '#0f172a' }}>Total</td>
                    <td className="pt-3 pb-3 px-4 text-right font-mono font-bold" style={{ color: '#0f172a' }}>
                      {fmtUSD(product.bom.total)}
                    </td>
                    <td className="pt-3 pb-3 pr-4"><ConfBadge conf={product.bom.totalConf} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Sources */}
        {product.sources?.length > 0 && (
          <section className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', background: '#fbfaf8' }}>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#a8a294' }}>Sources & provenance</h2>
            <div className="flex flex-col gap-2">
              {product.sources.map(sid => {
                const src = SOURCES[sid]
                if (!src) return null
                return (
                  <div key={sid} className="flex items-start gap-3 text-xs">
                    <span className="font-mono px-1.5 py-0.5 rounded shrink-0" style={{ background: '#f1f0ec', color: '#8a8579' }}>{sid}</span>
                    <div>
                      <p style={{ color: '#3d3b37' }}>{src.title}</p>
                      <p style={{ color: '#a8a294' }}>{src.meta}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
