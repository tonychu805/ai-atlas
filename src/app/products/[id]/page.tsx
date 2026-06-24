'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { PRODUCTS, PRODUCT_BRIEF, SUPPLIERS, SOURCES, STAGES, STATUS_STYLE, CONF_STYLE, FACET_DEFS, DOMAINS, LIFECYCLE, SUBCAT, fmtUSD, getSupplierName } from '@/lib/data'
import { Linkify } from '@/lib/linkify'

type Level = 'L1' | 'L2' | 'L3'

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? { bg: '#f1f0ec', fg: '#6b7280' }
  return <span className="text-xs px-2 py-1 rounded font-medium" style={{ background: s.bg, color: s.fg }}>{LIFECYCLE[status] ?? status}</span>
}

function ConfBadge({ conf }: { conf?: string }) {
  if (!conf) return null
  const c = CONF_STYLE[conf]
  if (!c) return null
  return <span className="text-xs font-medium" style={{ color: c.c }} title={`Confidence: ${c.l}`}>{c.l}</span>
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [level, setLevel] = useState<Level>('L1')

  const product = PRODUCTS.find(p => p.id === id)
  if (!product) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p style={{ color: '#8a8579' }}>Product not found.</p>
      <Link href="/products" style={{ color: '#9a6b3f' }}>← Back to products</Link>
    </div>
  )

  const brief = PRODUCT_BRIEF[id]
  const domain = DOMAINS[product.domain as keyof typeof DOMAINS]
  const rels = product.rels ?? []

  // Build connects-to list
  const connects = rels.map(r => {
    const target = PRODUCTS.find(p => p.id === r.target)
    return { type: r.type, name: target?.name ?? r.target, id: r.target, qty: r.qty }
  })

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

        {/* Title row */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={product.status} />
              {product.node && <span className="text-xs px-2 py-1 rounded font-mono" style={{ background: '#f3f2ee', color: '#6b6557' }}>{product.node}</span>}
            </div>
            <h1 className="text-3xl font-bold mt-2" style={{ color: '#0f172a' }}>{product.name}</h1>
            <p className="text-base mt-1" style={{ color: '#8a8579' }}>{product.vendor} · {product.family ?? product.subcat}</p>
          </div>
          {/* Reading level toggle */}
          {brief && (
            <div className="flex items-center gap-1 rounded-lg border p-1" style={{ borderColor: '#d6d3cb', background: '#fbfaf8' }}>
              {(['L1','L2','L3'] as Level[]).map(l => (
                <button key={l} onClick={() => setLevel(l)}
                  className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
                  style={{ background: level === l ? '#fff' : 'transparent', color: level === l ? '#0f172a' : '#8a8579', boxShadow: level === l ? '0 1px 3px rgba(0,0,0,0.06)' : 'none' }}>
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* In plain terms */}
        {brief && (
          <section className="rounded-xl p-6 mb-8" style={{ background: '#fff', border: '1px solid var(--border)' }}>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#a8a294' }}>In plain terms</h2>
            <p className="text-base mb-3" style={{ color: '#1c1a17', lineHeight: 1.7 }}>
              <Linkify text={brief.l1} />
            </p>
            {brief.analogy && (
              <p className="text-sm italic" style={{ color: '#8a8579' }}>
                <Linkify text={brief.analogy} />
              </p>
            )}
            {(level === 'L2' || level === 'L3') && brief.l2 && (
              <p className="text-sm mt-4" style={{ color: '#3d3b37', lineHeight: 1.7, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <Linkify text={brief.l2} />
              </p>
            )}
            {level === 'L3' && brief.l3 && (
              <p className="text-sm mt-4" style={{ color: '#3d3b37', lineHeight: 1.7, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <Linkify text={brief.l3} />
              </p>
            )}
          </section>
        )}

        {/* Why it matters */}
        {brief?.why && (
          <section className="rounded-xl p-4 mb-8 flex gap-3" style={{ background: '#fdf8f0', border: '1px solid #e8d5b5' }}>
            <span className="text-lg" style={{ lineHeight: 1 }}>⚑</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#9a6b3f' }}>Why it matters</p>
              <p className="text-sm" style={{ color: '#3d3b37', lineHeight: 1.6 }}><Linkify text={brief.why} /></p>
            </div>
          </section>
        )}

        {/* Attributes row */}
        {product.attrs && (
          <section className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#a8a294' }}>Attributes</p>
            <div className="flex flex-wrap gap-2">
              {FACET_DEFS.map(f => {
                const v = f.get(product)
                if (!v) return null
                return (
                  <span key={f.key} className="text-xs px-2.5 py-1 rounded-full border" style={{ borderColor: '#d6d3cb', color: '#3d3b37', background: '#fbfaf8' }}>
                    <span style={{ color: '#8a8579' }}>{f.label}: </span>{f.map[v] ?? v}
                  </span>
                )
              })}
            </div>
          </section>
        )}

        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          {/* Specs */}
          {product.specs.length > 0 && (
            <section className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', background: '#fff' }}>
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#a8a294' }}>Specs</h2>
              <table className="w-full text-sm">
                <tbody>
                  {product.specs.map(s => (
                    <tr key={s.label} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-2 pr-4 text-left" style={{ color: '#8a8579', width: '45%' }}>{s.label}</td>
                      <td className="py-2 font-medium" style={{ color: '#0f172a' }}>{s.value}</td>
                      <td className="py-2 pl-2 text-right"><ConfBadge conf={s.conf} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* BOM */}
          {product.bom && (
            <section className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', background: '#fff' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#a8a294' }}>BOM cost estimate</h2>
                <span className="text-xs" style={{ color: '#8a8579' }}>±{product.bom.uncertainty}%</span>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {product.bom.items.map(item => (
                    <tr key={item.label} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-2 pr-2" style={{ color: '#3d3b37' }}>
                        {item.label}
                        {item.note && <span className="text-xs block" style={{ color: '#8a8579' }}>{item.note}</span>}
                      </td>
                      <td className="py-2 text-right font-mono font-medium" style={{ color: '#0f172a' }}>{fmtUSD(item.cost)}</td>
                      <td className="py-2 pl-2"><ConfBadge conf={item.conf} /></td>
                    </tr>
                  ))}
                  <tr>
                    <td className="pt-3 font-semibold" style={{ color: '#0f172a' }}>Total</td>
                    <td className="pt-3 text-right font-mono font-bold" style={{ color: '#0f172a' }}>{fmtUSD(product.bom.total)}</td>
                    <td className="pt-3 pl-2"><ConfBadge conf={product.bom.totalConf} /></td>
                  </tr>
                </tbody>
              </table>
            </section>
          )}
        </div>

        {/* Supply chain */}
        <section className="rounded-xl border p-5 mb-8" style={{ borderColor: 'var(--border)', background: '#fff' }}>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#a8a294' }}>Supply chain</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {STAGES.map(st => {
              const sups = product.supply[st.key] ?? []
              if (!sups.length) return null
              return (
                <div key={st.key}>
                  <p className="text-xs font-medium mb-1.5" style={{ color: '#8a8579' }}>{st.label}</p>
                  <div className="flex flex-wrap gap-1">
                    {sups.map(sid => {
                      const sup = SUPPLIERS[sid]
                      return (
                        <Link key={sid} href={`/suppliers/${sid}`}
                          className="text-xs px-2 py-0.5 rounded border transition-colors"
                          style={{ borderColor: '#d6d3cb', color: '#3d3b37', background: '#fbfaf8', textDecoration: 'none' }}>
                          {sup?.name ?? sid}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Connects to */}
        {connects.length > 0 && (
          <section className="rounded-xl border p-5 mb-8" style={{ borderColor: 'var(--border)', background: '#fff' }}>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#a8a294' }}>Connects to</h2>
            <div className="flex flex-col gap-2">
              {connects.map(c => (
                <div key={c.id} className="flex items-center gap-3 text-sm">
                  <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: '#f3f2ee', color: '#6b6557' }}>
                    {c.type.replace(/_/g, ' ')}
                  </span>
                  <Link href={`/products/${c.id}`} style={{ color: '#0f172a', textDecoration: 'none' }}>
                    {c.name}
                  </Link>
                  {c.qty && <span style={{ color: '#8a8579' }}>×{c.qty}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Provenance */}
        {product.sources?.length > 0 && (
          <section className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', background: '#fbfaf8' }}>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#a8a294' }}>Sources & provenance</h2>
            <div className="flex flex-col gap-2">
              {product.sources.map(sid => {
                const src = SOURCES[sid]
                if (!src) return null
                return (
                  <div key={sid} className="flex items-start gap-3 text-xs">
                    <span className="font-mono px-1.5 py-0.5 rounded" style={{ background: '#f1f0ec', color: '#8a8579' }}>{sid}</span>
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
