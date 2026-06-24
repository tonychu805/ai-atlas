'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const LINKS = [
  { href: '/',           label: 'Home',        exact: true },
  { href: '/products',   label: 'Products' },
  { href: '/valuechain', label: 'Value Chain' },
  { href: '/suppliers',  label: 'Suppliers' },
  { href: '/glossary',   label: 'Glossary' },
]

function LogoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect width="22" height="22" rx="5" fill="#0f172a"/>
      <line x1="7.5" y1="3.5" x2="7.5" y2="18.5" stroke="#f8f7f4" strokeWidth="1.5"/>
      <line x1="14.5" y1="3.5" x2="14.5" y2="18.5" stroke="#f8f7f4" strokeWidth="1.5"/>
      <line x1="3.5" y1="7.5" x2="18.5" y2="7.5" stroke="#f8f7f4" strokeWidth="1.5"/>
      <line x1="3.5" y1="14.5" x2="18.5" y2="14.5" stroke="#f8f7f4" strokeWidth="1.5"/>
    </svg>
  )
}

export default function Nav() {
  const path = usePathname()
  return (
    <header className="border-b sticky top-0 z-50 backdrop-blur-sm"
      style={{ borderColor: 'var(--border)', background: 'rgba(248,247,244,0.95)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <LogoIcon />
          <span className="font-semibold text-sm tracking-tight" style={{ color: '#0f172a' }}>AI Atlas</span>
          <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: '#f1f0ec', color: '#8a8579' }}>BETA</span>
        </Link>
        <nav className="flex items-center">
          {LINKS.map(l => {
            const active = l.exact ? path === l.href : (path === l.href || path.startsWith(l.href + '/'))
            return (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-1 text-sm transition-colors"
                style={{
                  color: active ? '#0f172a' : '#8a8579',
                  fontWeight: active ? 500 : 400,
                  borderBottom: active ? '2px solid #0f172a' : '2px solid transparent',
                  paddingBottom: '4px',
                }}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
