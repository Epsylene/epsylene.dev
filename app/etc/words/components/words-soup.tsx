'use client'

import { useEffect, useRef } from 'react'
import type { WordData } from './words-content'

const SCALE_REACH = 120 // px from a word at which it starts growing
const MAX_SCALE = 1.45

interface WordsSoupProps {
  words: WordData[]
  onSelect: (id: string) => void
  frozen: boolean
}

export function WordsSoup({ words, onSelect, frozen }: WordsSoupProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const refs = useRef(new Map<string, HTMLAnchorElement>())

  // Fisheye effect: words swell as the cursor approaches. One
  // rAF-throttled listener writes transforms directly; distances are
  // measured against cached layout rects (transforms don't move
  // layout, so the cache stays valid while words scale).
  useEffect(() => {
    if (frozen || !containerRef.current) return

    interface Entry {
      el: HTMLAnchorElement
      left: number
      top: number
      right: number
      bottom: number
      width: number
    }
    let rows: Entry[][] = []
    let raf = 0
    const mouse = { x: -9999, y: -9999 }

    const measure = () => {
      const entries: Entry[] = []
      refs.current.forEach(el => {
        el.style.transform = ''
        el.style.zIndex = ''
        const r = el.getBoundingClientRect()
        entries.push({
          el,
          left: r.left + window.scrollX,
          top: r.top + window.scrollY,
          right: r.right + window.scrollX,
          bottom: r.bottom + window.scrollY,
          width: r.width,
        })
      })
      // Group into rows (same flex line = same top), sorted by x
      const byRow = new Map<number, Entry[]>()
      entries.forEach(e => {
        const key = Math.round(e.top)
        const row = byRow.get(key)
        if (row) row.push(e)
        else byRow.set(key, [e])
      })
      rows = [...byRow.values()]
      rows.forEach(row => row.sort((a, b) => a.left - b.left))
    }

    const growth = (e: Entry, x: number, y: number) => {
      const cx = Math.max(e.left, Math.min(x, e.right))
      const cy = Math.max(e.top, Math.min(y, e.bottom))
      const d = Math.hypot(x - cx, y - cy)
      // Quadratic falloff: the hovered word pops, close neighbors
      // swell only gently
      const f = d < SCALE_REACH ? 1 - d / SCALE_REACH : 0
      const s = 1 + f * f * (MAX_SCALE - 1)
      return { s, g: (s - 1) * e.width }
    }

    const apply = () => {
      raf = 0
      const x = mouse.x + window.scrollX
      const y = mouse.y + window.scrollY
      // Each word grows around its own center, pushing everything on
      // its left half a growth leftward and everything on its right
      // half a growth rightward. Summing those pushes (prefix sums)
      // keeps every gap exactly intact, and — since who-is-left-of-whom
      // never depends on the cursor, only the smoothly varying growths
      // do — the whole field is continuous: no snapping when the
      // cursor crosses word boundaries
      rows.forEach(row => {
        const grown = row.map(e => growth(e, x, y))
        const total = grown.reduce((sum, w) => sum + w.g, 0)
        let before = 0
        row.forEach((e, i) => {
          const { s, g } = grown[i]
          const after = total - before - g
          set(e.el, (before - after) / 2, s)
          before += g
        })
      })
    }

    const set = (el: HTMLAnchorElement, tx: number, s: number) => {
      if (Math.abs(tx) > 0.5 || s > 1.01) {
        el.style.transform = `translateX(${tx.toFixed(1)}px) scale(${s.toFixed(3)})`
        el.style.zIndex = s > 1.05 ? '10' : ''
      } else {
        el.style.transform = ''
        el.style.zIndex = ''
      }
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      schedule()
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
      schedule()
    }

    measure()
    // Re-measure when the soup reflows (resize, font swap, filtering);
    // measuring resets the transforms, so re-apply for the current
    // cursor position afterwards
    const resizeObserver = new ResizeObserver(() => {
      measure()
      schedule()
    })
    resizeObserver.observe(containerRef.current)

    window.addEventListener('mousemove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      resizeObserver.disconnect()
      if (raf) cancelAnimationFrame(raf)
      refs.current.forEach(el => {
        el.style.transform = ''
        el.style.zIndex = ''
      })
    }
  }, [frozen, words])

  return (
    // px-8 gives the outermost words room to be pushed into without
    // overflowing the container (which would flip the horizontal
    // scrollbar on and off and jitter the ResizeObserver)
    <div ref={containerRef} className="font-unicode flex flex-wrap justify-center gap-x-3 gap-y-2 px-8 pb-8">
      {words.map(w => (
        <a
          key={w.id}
          id={w.id}
          href={`#${w.id}`}
          ref={el => {
            if (el) refs.current.set(w.id, el)
            else refs.current.delete(w.id)
          }}
          onClick={e => {
            e.preventDefault()
            onSelect(w.id)
          }}
          className="text-lg leading-none text-[#c7bebe] hover:text-[#ff2957] transition-[transform,color] duration-100 ease-out"
          style={{ wordSpacing: '-0.25em' }}
        >
          {w.title}
        </a>
      ))}
      {words.length === 0 && (
        <span className="text-[#a8a095] italic">no matches</span>
      )}
    </div>
  )
}
