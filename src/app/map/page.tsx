'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { DOMAINS, DOMAIN_LIST, PRODUCTS, DomainKey } from '@/lib/data'

// ─── Sunburst math ─────────────────────────────────────────────────────────────

function polar(cx: number, cy: number, r: number, angle: number) {
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as [number, number]
}

function annular(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const [x0, y0] = polar(cx, cy, r0, a0)
  const [x1, y1] = polar(cx, cy, r1, a0)
  const [x2, y2] = polar(cx, cy, r1, a1)
  const [x3, y3] = polar(cx, cy, r0, a1)
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M${x0},${y0} L${x1},${y1} A${r1},${r1} 0 ${large} 1 ${x2},${y2} L${x3},${y3} A${r0},${r0} 0 ${large} 0 ${x0},${y0} Z`
}

function buildSunburst(cx: number, cy: number) {
  const domains = DOMAIN_LIST.map(k => ({ key: k, d: DOMAINS[k] }))
  const totalSubs = domains.reduce((s, { d }) => s + d.subs.length, 0)
  const r0dom = 58, r1dom = 116, r0sub = 119, r1sub = 192
  const gap = 0.012

  let angle = -Math.PI / 2
  const arcs: { path: string; key: string; isSub: boolean; subKey?: string; color: string; labelX?: number; labelY?: number; labelText?: string; labelAngle?: number }[] = []

  for (const { key, d } of domains) {
    const span = (d.subs.length / totalSubs) * 2 * Math.PI
    const a0 = angle + gap / 2
    const a1 = angle + span - gap / 2
    if (a1 > a0) arcs.push({ path: annular(cx, cy, r0dom, r1dom, a0, a1), key, isSub: false, color: d.color })

    let sub = angle
    for (const s of d.subs) {
      const sspan = (1 / totalSubs) * 2 * Math.PI
      const sa0 = sub + gap / 2
      const sa1 = sub + sspan - gap / 2
      if (sa1 > sa0) {
        const mid = (sa0 + sa1) / 2
        const lx = cx + 204 * Math.cos(mid)
        const ly = cy + 204 * Math.sin(mid)
        arcs.push({ path: annular(cx, cy, r0sub, r1sub, sa0, sa1), key, isSub: true, subKey: s.key, color: d.color, labelX: lx, labelY: ly, labelText: s.label, labelAngle: mid })
      }
      sub += sspan
    }
    angle += span
  }
  return arcs
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function MapPage() {
  const [hovered, setHovered] = useState<DomainKey | null>(null)
  const cx = 220, cy = 220

  const arcs = useMemo(() => buildSunburst(cx, cy), [])

  const selected = hovered ? DOMAINS[hovered] : null
  const prodCount = hovered ? PRODUCTS.filter(p => p.domain === hovered).length : null

  return (
    <div style={{ background: 'var(--background)' }} className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#0f172a' }}>Semiconductor domain map</h1>
          <p className="text-sm" style={{ color: '#8a8579' }}>Hover a segment to explore domains and sub-categories.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Sunburst SVG */}
          <div className="flex-shrink-0">
            <svg width={440} height={440} style={{ display: 'block' }}>
              {/* Center text */}
              <text x={cx} y={cy - 8} textAnchor="middle" fontSize={13} fontWeight={600} fill="#0f172a">
                {hovered ? DOMAINS[hovered].label : 'AI Atlas'}
              </text>
              <text x={cx} y={cy + 12} textAnchor="middle" fontSize={11} fill="#8a8579">
                {hovered ? `${DOMAINS[hovered].subs.length} sub-categories` : 'Semiconductor domains'}
              </text>

              {/* Arcs */}
              {arcs.map((a, i) => {
                const isHighlighted = hovered ? a.key === hovered : true
                const opacity = hovered ? (a.key === hovered ? 1 : 0.2) : (a.isSub ? 0.35 : 0.9)
                return (
                  <path
                    key={i}
                    d={a.path}
                    fill={a.color}
                    opacity={opacity}
                    style={{ cursor: 'pointer', transition: 'opacity 0.15s' }}
                    onMouseEnter={() => setHovered(a.key as DomainKey)}
                    onMouseLeave={() => setHovered(null)}
                  />
                )
              })}

              {/* Sub-category labels */}
              {hovered && arcs.filter(a => a.isSub && a.key === hovered && a.labelX !== undefined).map((a, i) => {
                const angle = a.labelAngle!
                const anchor = Math.cos(angle) > 0.1 ? 'start' : Math.cos(angle) < -0.1 ? 'end' : 'middle'
                return (
                  <text
                    key={i}
                    x={a.labelX}
                    y={a.labelY}
                    textAnchor={anchor}
                    fontSize={9}
                    fill="#4a4844"
                    dy="0.35em"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {a.labelText}
                  </text>
                )
              })}

              {/* Domain ring labels when nothing hovered */}
              {!hovered && arcs.filter(a => !a.isSub).map((a, i) => {
                // find angle midpoint from path — reconstruct from domain index
                const idx = DOMAIN_LIST.indexOf(a.key as DomainKey)
                const totalSubs = DOMAIN_LIST.reduce((s, k) => s + DOMAINS[k].subs.length, 0)
                let startAngle = -Math.PI / 2
                for (let j = 0; j < idx; j++) startAngle += (DOMAINS[DOMAIN_LIST[j]].subs.length / totalSubs) * 2 * Math.PI
                const span = (DOMAINS[a.key as DomainKey].subs.length / totalSubs) * 2 * Math.PI
                const mid = startAngle + span / 2
                const lx = cx + 87 * Math.cos(mid)
                const ly = cy + 87 * Math.sin(mid)
                return (
                  <text key={i} x={lx} y={ly} textAnchor="middle" fontSize={9} fontWeight={600}
                    fill="#fff" dy="0.35em" style={{ pointerEvents: 'none', userSelect: 'none' }}>
                    {DOMAINS[a.key as DomainKey].label}
                  </text>
                )
              })}
            </svg>
          </div>

          {/* Detail panel */}
          <div className="flex-1 min-w-0">
            {selected ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 rounded-full" style={{ background: selected.color }} />
                  <h2 className="text-xl font-bold" style={{ color: '#0f172a' }}>{selected.label}</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: selected.phase === 'now' ? '#e7f0ef' : '#f1f0ec', color: selected.phase === 'now' ? '#2c6360' : '#6b7280' }}>
                    {selected.phase === 'now' ? 'In scope' : 'Coming later'}
                  </span>
                </div>
                <p className="text-sm mb-6" style={{ color: '#6b6557', lineHeight: 1.6 }}>{selected.summary}</p>

                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#a8a294' }}>Sub-categories</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selected.subs.map(s => (
                      <Link key={s.key} href={`/products?domain=${hovered}&sub=${s.key}`}
                        className="px-3 py-2 rounded-lg border text-sm transition-colors"
                        style={{ borderColor: 'var(--border)', background: '#fff', color: '#3d3b37', textDecoration: 'none' }}>
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {(prodCount ?? 0) > 0 && (
                  <Link href={`/products?domain=${hovered}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium"
                    style={{ color: '#9a6b3f', textDecoration: 'none' }}>
                    View {prodCount} product{prodCount !== 1 ? 's' : ''} in {selected.label} →
                  </Link>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold mb-4" style={{ color: '#0f172a' }}>All domains</h2>
                <div className="flex flex-col gap-2">
                  {DOMAIN_LIST.map(k => {
                    const d = DOMAINS[k]
                    const n = PRODUCTS.filter(p => p.domain === k).length
                    return (
                      <button key={k} onMouseEnter={() => setHovered(k)} onMouseLeave={() => setHovered(null)}
                        className="flex items-start gap-3 px-4 py-3 rounded-lg border text-left transition-colors"
                        style={{ borderColor: 'var(--border)', background: '#fff', cursor: 'default' }}>
                        <span className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ background: d.color }} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium" style={{ color: '#0f172a' }}>{d.label}</span>
                            <span className="text-xs" style={{ color: '#8a8579' }}>
                              {d.phase === 'now' ? (n > 0 ? `${n} products` : 'In scope') : 'Later'}
                            </span>
                          </div>
                          <p className="text-xs mt-0.5" style={{ color: '#8a8579' }}>{d.subs.length} sub-categories</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
