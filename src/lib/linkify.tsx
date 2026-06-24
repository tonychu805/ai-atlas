'use client'

import { ReactNode, Fragment } from 'react'
import { TERMS } from './data'
import { usePopover } from './popover-context'

// Build alias → termId map
const ALIAS_MAP: Record<string, string> = {}
for (const [id, t] of Object.entries(TERMS)) {
  ALIAS_MAP[t.term.toLowerCase()] = id
  if (t.acronym) ALIAS_MAP[t.acronym.toLowerCase()] = id
  for (const a of t.aliases ?? []) ALIAS_MAP[a.toLowerCase()] = id
}

// Sort by length descending so longer aliases match first
const SORTED_ALIASES = Object.keys(ALIAS_MAP).sort((a, b) => b.length - a.length)

export function Linkify({ text }: { text: string }): ReactNode {
  const { open, scheduleClose } = usePopover()

  // Build a regex that matches any alias
  const escaped = SORTED_ALIASES.map(a => a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (!escaped.length) return <>{text}</>
  const re = new RegExp(`(${escaped.join('|')})`, 'gi')

  const parts = text.split(re)
  const seen = new Set<string>()

  return (
    <>
      {parts.map((part, i) => {
        const lower = part.toLowerCase()
        const id = ALIAS_MAP[lower]
        if (id && !seen.has(id)) {
          seen.add(id)
          return (
            <TermSpan key={i} termId={id} label={part}
              onOpen={(x, y) => open(id, x, y)}
              onLeave={scheduleClose}
            />
          )
        }
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}

function TermSpan({ termId, label, onOpen, onLeave }: {
  termId: string; label: string
  onOpen: (x: number, y: number) => void
  onLeave: () => void
}) {
  return (
    <a
      href={`/glossary/${termId}`}
      onMouseEnter={e => onOpen((e.currentTarget as HTMLElement).getBoundingClientRect().left, (e.currentTarget as HTMLElement).getBoundingClientRect().top)}
      onMouseLeave={onLeave}
      onClick={e => e.preventDefault()}
      style={{
        color: '#9a6b3f',
        textDecoration: 'underline',
        textDecorationStyle: 'dotted',
        textUnderlineOffset: 3,
        cursor: 'help',
      }}
    >
      {label}
    </a>
  )
}
