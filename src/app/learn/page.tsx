'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LEARN_STEPS, TERMS, VALUE_CHAIN } from '@/lib/config'
import { Linkify } from '@/lib/linkify'

type Level = 'L1' | 'L2'

export default function LearnPage() {
  const [step, setStep] = useState(0)
  const [level, setLevel] = useState<Level>('L1')
  const current = LEARN_STEPS[step]

  function nodeHref(node: typeof current.node) {
    if (node.kind === 'term') return `/glossary/${node.id}`
    if (node.kind === 'product') return `/products/${node.id}`
    if (node.kind === 'stage') return `/valuechain`
    return '/'
  }

  return (
    <div style={{ background: 'var(--background)' }} className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-medium mb-2" style={{ color: '#9a6b3f' }}>Guided learning path</p>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#0f172a' }}>How an AI chip is made</h1>
          <p className="text-sm" style={{ color: '#8a8579' }}>
            From blank silicon to a server rack — {LEARN_STEPS.length} steps, plain English first.
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto ax-scroll pb-1">
          {LEARN_STEPS.map((s, i) => (
            <button key={i} onClick={() => setStep(i)}
              className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-colors"
              style={{
                background: step === i ? '#0f172a' : i < step ? '#e7f0ef' : '#f1f0ec',
                color: step === i ? '#fff' : i < step ? '#2c6360' : '#8a8579',
              }}>
              <span className="font-medium">{s.n}</span>
              <span className="hidden sm:inline">{s.title}</span>
            </button>
          ))}
        </div>

        {/* Step card */}
        <div className="rounded-xl border p-6 mb-6" style={{ borderColor: 'var(--border)', background: '#fff' }}>
          <div className="flex items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: '#0f172a', color: '#fff' }}>{current.n}</span>
              <h2 className="text-lg font-bold" style={{ color: '#0f172a' }}>{current.title}</h2>
            </div>
            <div className="flex items-center gap-1 rounded-lg border p-1 flex-shrink-0" style={{ borderColor: '#d6d3cb', background: '#fbfaf8' }}>
              {(['L1','L2'] as Level[]).map(l => (
                <button key={l} onClick={() => setLevel(l)}
                  className="px-3 py-1 rounded-md text-sm font-medium transition-colors"
                  style={{ background: level === l ? '#fff' : 'transparent', color: level === l ? '#0f172a' : '#8a8579', boxShadow: level === l ? '0 1px 3px rgba(0,0,0,0.06)' : 'none' }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <p className="text-base mb-4" style={{ color: '#1c1a17', lineHeight: 1.7 }}>
            <Linkify text={current.l1} />
          </p>

          {level === 'L2' && (
            <p className="text-sm mb-4" style={{ color: '#3d3b37', lineHeight: 1.7, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <Linkify text={current.l2} />
            </p>
          )}

          {/* Why it matters */}
          <div className="rounded-lg p-3 flex gap-2" style={{ background: '#fdf8f0', border: '1px solid #e8d5b5' }}>
            <span style={{ color: '#9a6b3f' }}>⚑</span>
            <p className="text-sm" style={{ color: '#6b4a1e', lineHeight: 1.55 }}>{current.why}</p>
          </div>
        </div>

        {/* Dig deeper link */}
        <div className="flex items-center justify-between mb-8">
          <Link href={nodeHref(current.node)}
            className="text-sm font-medium"
            style={{ color: '#9a6b3f', textDecoration: 'none' }}>
            {current.linkLabel} →
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
            style={{ borderColor: step === 0 ? '#e5e2db' : '#d6d3cb', color: step === 0 ? '#d6d3cb' : '#3d3b37', background: '#fff', cursor: step === 0 ? 'default' : 'pointer' }}>
            ← Previous
          </button>
          <span className="text-sm" style={{ color: '#8a8579' }}>{step + 1} / {LEARN_STEPS.length}</span>
          {step < LEARN_STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => Math.min(LEARN_STEPS.length - 1, s + 1))}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ background: '#0f172a', color: '#fff', border: '1px solid #0f172a' }}>
              Next →
            </button>
          ) : (
            <Link href="/map"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: '#0f172a', color: '#fff', textDecoration: 'none' }}>
              Explore the map →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
