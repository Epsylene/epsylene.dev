'use client'

import { Children, ReactNode, isValidElement, useCallback, useEffect, useMemo, useState } from 'react'
import { Excerpt, ExcerptProps } from './excerpt'

interface ExcerptData extends Omit<ExcerptProps, 'children'> {
  body: ReactNode
  length: number
}

function textOf(node: ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (isValidElement(node)) {
    return textOf((node.props as { children?: ReactNode }).children)
  }
  return ''
}

const EXCERPT_KEYS = ['author', 'source', 'year', 'kind', 'lang'] as const

// Walk the compiled MDX tree and pull out the <Excerpt> elements,
// descending through fragments and wrappers along the way
function collect(node: ReactNode, out: ExcerptData[] = []): ExcerptData[] {
  Children.forEach(node, child => {
    if (!isValidElement(child)) return
    const props = child.props as ExcerptProps
    const isExcerpt = child.type === Excerpt || EXCERPT_KEYS.some(key => key in props)
    if (isExcerpt) {
      const { children: body, ...meta } = props
      out.push({ ...meta, body, length: textOf(body).length })
    } else {
      collect(props.children, out)
    }
  })
  return out
}

// The shorter the excerpt, the larger it is set
function sizeClass(length: number): string {
  if (length < 90) return 'text-2xl md:text-3xl leading-normal'
  if (length < 260) return 'text-xl md:text-2xl leading-normal'
  if (length < 600) return 'text-lg md:text-xl leading-relaxed'
  return 'text-base md:text-lg leading-relaxed'
}

const TILTS = ['-rotate-[0.6deg]', 'rotate-[0.4deg]', '-rotate-[0.3deg]', 'rotate-[0.5deg]']

function Attribution({ item, className }: { item: ExcerptData; className?: string }) {
  const { author, source, year } = item
  if (!author && !source && !year) return null

  return (
    <div className={`text-[#a8a095] ${className ?? ''}`}>
      {'— '}
      {author && <span className="text-foreground">{author}</span>}
      {source && <>{author && ', '}<i>{source}</i></>}
      {year && ((author || source) ? ` (${year})` : year)}
    </div>
  )
}

function Tags({ item }: { item: ExcerptData }) {
  const tags = [item.kind === 'verse' ? 'verse' : null, item.lang ?? null].filter(Boolean)
  if (tags.length === 0) return null
  return <span>{tags.map(tag => ` · ${tag}`)}</span>
}

export function ExcerptsView({ content }: { content: ReactNode }) {
  const items = useMemo(() => collect(content), [content])
  const [current, setCurrent] = useState<number | null>(null)
  const [showIndex, setShowIndex] = useState(false)
  const [cols, setCols] = useState(1)

  // Track the responsive column count of the index wall, so the slips
  // can be dealt out in reading order (left to right, then down)
  useEffect(() => {
    const lg = window.matchMedia('(min-width: 1024px)')
    const sm = window.matchMedia('(min-width: 640px)')
    const update = () => setCols(lg.matches ? 3 : sm.matches ? 2 : 1)
    update()
    lg.addEventListener('change', update)
    sm.addEventListener('change', update)
    return () => {
      lg.removeEventListener('change', update)
      sm.removeEventListener('change', update)
    }
  }, [])

  const select = useCallback((i: number) => {
    setCurrent(i)
    setShowIndex(false)
    window.history.replaceState(null, '', `#${i + 1}`)
  }, [])

  const openIndex = useCallback(() => {
    setShowIndex(true)
    window.history.replaceState(null, '', '#index')
  }, [])

  const closeIndex = useCallback(() => {
    setShowIndex(false)
    if (current !== null) {
      window.history.replaceState(null, '', `#${current + 1}`)
    }
  }, [current])

  const draw = useCallback(() => {
    if (items.length === 0) return
    let next = Math.floor(Math.random() * items.length)
    while (items.length > 1 && next === current) {
      next = Math.floor(Math.random() * items.length)
    }
    select(next)
  }, [items.length, current, select])

  const step = useCallback((delta: number) => {
    if (items.length === 0) return
    select((((current ?? 0) + delta) % items.length + items.length) % items.length)
  }, [items.length, current, select])

  // On mount, honor a #n or #index deep link, otherwise draw at random
  useEffect(() => {
    if (items.length === 0) return
    const hash = window.location.hash.slice(1)
    const n = parseInt(hash, 10)
    if (!Number.isNaN(n) && n >= 1 && n <= items.length) {
      setCurrent(n - 1)
    } else {
      if (hash === 'index') setShowIndex(true)
      setCurrent(Math.floor(Math.random() * items.length))
    }
  }, [items.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === ' ') {
        e.preventDefault()
        draw()
      } else if (e.key === 'ArrowRight') {
        step(1)
      } else if (e.key === 'ArrowLeft') {
        step(-1)
      } else if (e.key === 'i') {
        if (showIndex) closeIndex()
        else openIndex()
      } else if (e.key === 'Escape') {
        closeIndex()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [draw, step, showIndex, openIndex, closeIndex])

  const item = current !== null ? items[current] : null

  if (showIndex) {
    return (
      <div className="flex-1 py-10">
        <div className="flex items-baseline justify-between mb-8">
          <span className="text-sm tracking-widest text-[#a8a095]">
            index — {items.length} excerpts
          </span>
          <button
            onClick={e => { e.currentTarget.blur(); closeIndex() }}
            className="text-[#a8a095] hover:text-[#ff2957] text-sm"
          >
            [ back ]
          </button>
        </div>
        <div className="flex gap-4">
          {Array.from({ length: cols }, (_, c) => (
            <div key={c} className="flex-1 min-w-0">
              {items.map((it, i) => i % cols === c && (
                <button
                  key={i}
                  onClick={() => select(i)}
                  style={{ animationDelay: `${Math.min(i * 35, 600)}ms` }}
                  className={`block w-full text-left mb-4 p-4 border transition-all duration-150 bg-[color-mix(in_srgb,var(--foreground)_4%,transparent)] hover:border-[#ff2957] hover:-translate-y-0.5 hover:rotate-0 animate-[excerpt-in_0.4s_ease-out_both] ${TILTS[i % TILTS.length]} ${i === current ? 'border-[#ff2957]/70' : 'border-[#a8a095]/25'}`}
                >
                  <div className="text-xs text-[#a8a095] mb-2">
                    n° <span className="text-[#ff2957]">{i + 1}</span>
                    <Tags item={it} />
                  </div>
                  <div className={`text-sm line-clamp-5 [&_p]:mb-2 [&_p:last-child]:mb-0 ${it.kind === 'verse' ? 'italic' : ''}`}>
                    {it.body}
                  </div>
                  <Attribution item={it} className="mt-3 text-xs text-right" />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col justify-center py-14">
        {item && (
          <figure
            key={current}
            className={`mx-auto animate-[excerpt-in_0.5s_ease-out_both] ${item.kind === 'verse' ? 'w-fit max-w-[65ch]' : 'w-full max-w-[65ch]'}`}
          >
            <div className="text-xs tracking-widest text-[#a8a095] mb-7">
              n° <span className="text-[#ff2957]">{current! + 1}</span>/{items.length}
              <Tags item={item} />
            </div>
            <blockquote className={`${sizeClass(item.length)} [&_p]:mb-5 [&_p:last-child]:mb-0 ${item.kind === 'verse' ? 'italic' : ''}`}>
              {item.body}
            </blockquote>
            <Attribution item={item} className="mt-8 text-right text-base" />
          </figure>
        )}
      </div>
      <div className="flex items-center justify-center gap-6 pb-3">
        <button
          onClick={e => { e.currentTarget.blur(); step(-1) }}
          aria-label="previous excerpt"
          className="text-[#a8a095] hover:text-[#ff2957] text-2xl leading-none"
        >
          ‹
        </button>
        <button
          onClick={e => { e.currentTarget.blur(); draw() }}
          className="text-[#a8a095] hover:text-[#ff2957]"
        >
          [ draw ]
        </button>
        <button
          onClick={e => { e.currentTarget.blur(); openIndex() }}
          className="text-[#a8a095] hover:text-[#ff2957]"
        >
          [ index ]
        </button>
        <button
          onClick={e => { e.currentTarget.blur(); step(1) }}
          aria-label="next excerpt"
          className="text-[#a8a095] hover:text-[#ff2957] text-2xl leading-none"
        >
          ›
        </button>
      </div>
      <p className="text-center text-xs text-[#a8a095]/60 pb-4 portrait:hidden">
        space — draw · ← → — browse · i — index
      </p>
    </div>
  )
}
