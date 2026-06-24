import Link from 'next/link'

export default function BrowseModeToggle({ roadmap }: { roadmap: boolean }) {
  const base = 'px-3 py-1.5 rounded-md text-sm font-medium transition-colors'
  const active = { color: '#0f172a', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }
  const inactive = { color: '#8a8579', background: 'transparent', boxShadow: 'none' }
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border p-1" style={{ borderColor: '#d6d3cb', background: '#fbfaf8' }}>
      <Link href="/products" className={base} style={{ textDecoration: 'none', ...(roadmap ? inactive : active) }}>List</Link>
      <Link href="/products?mode=roadmap" className={base} style={{ textDecoration: 'none', ...(roadmap ? active : inactive) }}>Roadmap</Link>
    </div>
  )
}
