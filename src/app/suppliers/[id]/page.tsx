import Link from 'next/link'
import { STAGES, MODEL_LABEL, MODEL_COLOR, STATUS_STYLE, LIFECYCLE } from '@/lib/data'
import { getProducts, getSuppliers } from '@/lib/db'

function ModelBadge({ model }: { model: string }) {
  const c = MODEL_COLOR[model] ?? { bg: '#f1f0ec', fg: '#6b7280' }
  return (
    <span className="text-xs px-2 py-0.5 rounded font-medium"
      style={{ background: c.bg, color: c.fg }}>
      {MODEL_LABEL[model] ?? model}
    </span>
  )
}

export default async function SupplierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [suppliers, products] = await Promise.all([getSuppliers(), getProducts()])
  const sup = suppliers[id]

  if (!sup) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p style={{ color: '#8a8579' }}>Supplier not found.</p>
      <Link href="/suppliers" style={{ color: '#9a6b3f' }}>← Back to suppliers</Link>
    </div>
  )

  // Find products this supplier is involved with
  const relatedProducts = products.filter(p =>
    Object.values(p.supply).some(ids => ids.includes(id))
  )

  return (
    <div style={{ background: 'var(--background)' }} className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8" style={{ color: '#8a8579' }}>
          <Link href="/suppliers" style={{ color: '#8a8579', textDecoration: 'none' }}>Suppliers</Link>
          <span>›</span>
          <span style={{ color: '#0f172a' }}>{sup.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#0f172a' }}>{sup.name}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              {sup.models.map(m => <ModelBadge key={m} model={m} />)}
              <span className="text-sm" style={{ color: '#8a8579' }}>· {sup.hq}</span>
            </div>
          </div>
        </div>

        {/* Value chain stages */}
        <section className="rounded-xl border p-5 mb-6" style={{ borderColor: 'var(--border)', background: '#fff' }}>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#a8a294' }}>Supply chain stages</h2>
          <div className="flex flex-wrap gap-2">
            {STAGES.filter(st => sup.stages.includes(st.key)).map(st => (
              <Link key={st.key} href={`/valuechain`}
                className="px-3 py-1.5 rounded-lg border text-sm transition-colors"
                style={{ borderColor: '#d6d3cb', color: '#3d3b37', background: '#fbfaf8', textDecoration: 'none' }}>
                {st.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', background: '#fff' }}>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#a8a294' }}>
              Products in supply chain ({relatedProducts.length})
            </h2>
            <div className="flex flex-col gap-3">
              {relatedProducts.map(p => {
                const stages = STAGES.filter(st => (p.supply[st.key] ?? []).includes(id))
                const st = STATUS_STYLE[p.status] ?? { bg: '#f1f0ec', fg: '#6b7280' }
                return (
                  <div key={p.id} className="flex items-center gap-3">
                    <Link href={`/products/${p.id}`} style={{ textDecoration: 'none', flex: 1 }}>
                      <p className="text-sm font-medium" style={{ color: '#0f172a' }}>{p.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#8a8579' }}>
                        {stages.map(s => s.label).join(' · ')}
                      </p>
                    </Link>
                    <span className="text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0"
                      style={{ background: st.bg, color: st.fg }}>
                      {LIFECYCLE[p.status] ?? p.status}
                    </span>
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
