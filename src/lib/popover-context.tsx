'use client'

import { createContext, useContext, useState, useRef, useCallback, ReactNode } from 'react'
import { TERMS } from './data'

interface PopoverState {
  termId: string
  x: number
  y: number
}

interface PopoverCtx {
  open: (termId: string, x: number, y: number) => void
  scheduleClose: () => void
  cancelClose: () => void
  pop: PopoverState | null
}

const Ctx = createContext<PopoverCtx>({
  open: () => {},
  scheduleClose: () => {},
  cancelClose: () => {},
  pop: null,
})

export function PopoverProvider({ children }: { children: ReactNode }) {
  const [pop, setPop] = useState<PopoverState | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const open = useCallback((termId: string, x: number, y: number) => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null }
    setPop({ termId, x, y })
  }, [])

  const scheduleClose = useCallback(() => {
    timer.current = setTimeout(() => setPop(null), 160)
  }, [])

  const cancelClose = useCallback(() => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null }
  }, [])

  return (
    <Ctx.Provider value={{ open, scheduleClose, cancelClose, pop }}>
      {children}
      {pop && <Popover state={pop} onMouseEnter={cancelClose} onMouseLeave={scheduleClose} />}
    </Ctx.Provider>
  )
}

export function usePopover() { return useContext(Ctx) }

function Popover({ state, onMouseEnter, onMouseLeave }: {
  state: PopoverState
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  const term = TERMS[state.termId]
  if (!term) return null
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'fixed',
        left: Math.min(state.x, window.innerWidth - 296),
        top: state.y + 16,
        width: 280,
        zIndex: 9999,
        background: '#fff',
        border: '1px solid #e5e2db',
        borderRadius: 10,
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        padding: '12px 14px',
        fontSize: 13,
        lineHeight: '1.55',
        color: '#1c1a17',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4, color: '#0f172a' }}>
        {term.term}{term.acronym ? ` (${term.acronym})` : ''}
      </div>
      <div style={{ color: '#3d3b37', marginBottom: term.analogy ? 8 : 0 }}>{term.l1}</div>
      {term.analogy && (
        <div style={{ fontStyle: 'italic', color: '#8a8579', fontSize: 12 }}>{term.analogy}</div>
      )}
      <a href={`/glossary/${state.termId}`} style={{ display: 'block', marginTop: 8, fontSize: 12, color: '#9a6b3f', textDecoration: 'none' }}>
        Full entry →
      </a>
    </div>
  )
}
