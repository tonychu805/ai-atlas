'use client'

import { useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const LINKS = [
  { href: '/',             label: 'Home',         exact: true },
  { href: '/products',     label: 'Products' },
  { href: '/roadmap',      label: 'Roadmap' },
  { href: '/supply-chain', label: 'Supply Chain' },
  {
    href: '/valuechain',   label: 'Learn',
    dropdown: [
      { href: '/packaging', label: 'Packaging' },
    ],
  },
  { href: '/suppliers',    label: 'Suppliers' },
  { href: '/glossary',     label: 'Glossary' },
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
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function openDropdown() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setDropdownOpen(true)
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 120)
  }

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

            if (l.dropdown) {
              const dropActive = active || l.dropdown.some(d => path === d.href || path.startsWith(d.href + '/'))
              return (
                <div
                  key={l.href}
                  className="relative"
                  onMouseEnter={openDropdown}
                  onMouseLeave={scheduleClose}
                >
                  <Link
                    href={l.href}
                    className="px-3 py-1 text-sm transition-colors flex items-center gap-1"
                    style={{
                      color: dropActive ? '#0f172a' : '#8a8579',
                      fontWeight: dropActive ? 500 : 400,
                      borderBottom: dropActive ? '2px solid #0f172a' : '2px solid transparent',
                      paddingBottom: '4px',
                    }}
                  >
                    {l.label}
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginTop: 1 }}>
                      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>

                  {dropdownOpen && (
                    <div
                      className="absolute top-full left-0 mt-1 rounded-lg border py-1 min-w-36"
                      style={{ background: '#fff', borderColor: '#e5e2db', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    >
                      {l.dropdown.map(d => {
                        const dActive = path === d.href || path.startsWith(d.href + '/')
                        return (
                          <Link
                            key={d.href}
                            href={d.href}
                            className="block px-4 py-2 text-sm transition-colors hover:bg-gray-50"
                            style={{ color: dActive ? '#0f172a' : '#3d3b37', fontWeight: dActive ? 500 : 400 }}
                          >
                            {d.label}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

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
