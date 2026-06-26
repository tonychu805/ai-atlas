import Link from 'next/link'
import { TERMS } from '@/lib/config'

const CAT_LABEL: Record<string, string> = {
  concept: 'Concepts', process: 'Processes', component: 'Components',
  material: 'Materials', metric: 'Metrics', org_type: 'Organisation types',
}
const CAT_ORDER = ['concept','process','component','material','metric','org_type']

export default function GlossaryPage() {
  const byCategory: Record<string, { id: string; term: typeof TERMS[string] }[]> = {}
  for (const [id, term] of Object.entries(TERMS)) {
    if (!byCategory[term.category]) byCategory[term.category] = []
    byCategory[term.category].push({ id, term })
  }

  return (
    <div style={{ background: 'var(--background)' }} className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#0f172a' }}>Knowledge base</h1>
          <p className="text-sm" style={{ color: '#8a8579' }}>
            Plain language first. Every term opens with a one-liner, then the working explanation and full technical detail — with sources and what it connects to.
          </p>
        </div>

        {CAT_ORDER.filter(c => byCategory[c]).map(cat => (
          <section key={cat} className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#a8a294' }}>
              {CAT_LABEL[cat] ?? cat}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {byCategory[cat].map(({ id, term }) => (
                <Link key={id} href={`/glossary/${id}`}
                  className="block p-4 rounded-xl border transition-shadow hover:shadow-sm"
                  style={{ borderColor: 'var(--border)', background: '#fff', textDecoration: 'none' }}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>{term.term}</span>
                    {term.acronym && <span className="text-xs font-mono" style={{ color: '#8a8579' }}>{term.acronym}</span>}
                  </div>
                  <p className="text-xs" style={{ color: '#6b6557', lineHeight: 1.55, WebkitLineClamp: 2, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical' as const }}>
                    {term.l1}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
