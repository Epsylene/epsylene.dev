'use client'

import { Children, ReactNode, isValidElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SearchInput } from './search-input'
import { WordsSoup } from './words-soup'
import { WordModal } from './word-modal'
import { Word, WordProps, slugify } from './word'

export interface WordData {
  title: string
  id: string
  body: ReactNode
}

// Walk the compiled MDX tree and pull out the <Word> elements
function collect(node: ReactNode, out: WordData[] = []): WordData[] {
  Children.forEach(node, child => {
    if (!isValidElement(child)) return
    const props = child.props as WordProps
    if (child.type === Word || typeof props.title === 'string') {
      out.push({ title: props.title, id: slugify(props.title), body: props.children })
    } else {
      collect(props.children, out)
    }
  })
  return out
}

export function WordsContent({ content }: { content: ReactNode }) {
  const words = useMemo(() => collect(content), [content])
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filtered soup: prefix matches first, then substring matches
  const shown = useMemo(() => {
    const q = slugify(query)
    if (!q) return words
    const alpha = (a: WordData, b: WordData) => a.id.localeCompare(b.id)
    const starts = words.filter(w => w.id.startsWith(q)).sort(alpha)
    const contains = words.filter(w => !w.id.startsWith(q) && w.id.includes(q)).sort(alpha)
    return [...starts, ...contains]
  }, [words, query])

  const selected = selectedId ? words.find(w => w.id === selectedId) ?? null : null

  const open = useCallback((id: string) => {
    setSelectedId(id)
    window.history.pushState(null, '', `#${id}`)
  }, [])

  const close = useCallback(() => {
    setSelectedId(null)
    window.history.pushState(null, '', window.location.pathname)
  }, [])

  // Browse neighbors in the order currently shown in the soup
  const step = useCallback((delta: number) => {
    const list = shown.length > 0 ? shown : words
    if (!selectedId || list.length === 0) return
    const idx = list.findIndex(w => w.id === selectedId)
    const next = list[(Math.max(idx, 0) + delta + list.length) % list.length]
    setSelectedId(next.id)
    window.history.replaceState(null, '', `#${next.id}`)
  }, [selectedId, shown, words])

  const random = useCallback(() => {
    const list = shown.length > 0 ? shown : words
    if (list.length === 0) return
    open(list[Math.floor(Math.random() * list.length)].id)
  }, [shown, words, open])

  const setSearch = useCallback((value: string) => {
    if (inputRef.current) inputRef.current.value = value
    setQuery(value)
  }, [])

  // Open from #hash on load, and follow back/forward navigation
  useEffect(() => {
    const check = () => {
      const id = window.location.hash.slice(1)
      setSelectedId(id && words.some(w => w.id === id) ? id : null)
    }
    check()
    window.addEventListener('hashchange', check)
    return () => window.removeEventListener('hashchange', check)
  }, [words])

  // Lock body scroll while the modal is open
  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [selected])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return

      if (selected) {
        if (e.key === 'Escape') close()
        else if (e.key === 'ArrowRight') step(1)
        else if (e.key === 'ArrowLeft') step(-1)
        return
      }

      if (e.key === 'Enter') {
        if (query && shown.length > 0) open(shown[0].id)
        return
      }
      if (e.key === 'Escape') {
        setSearch('')
        inputRef.current?.blur()
        return
      }

      // The input handles its own editing; anywhere else, typing
      // funnels into the search box
      if (e.target === inputRef.current) return
      if (/^[a-z0-9]$/i.test(e.key)) {
        e.preventDefault()
        inputRef.current?.focus()
        setSearch((inputRef.current?.value ?? '') + e.key)
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        inputRef.current?.focus()
        setSearch((inputRef.current?.value ?? '').slice(0, -1))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, close, step, open, shown, query, setSearch])

  return (
    <>
      <div className="mt-6 mb-10 flex items-baseline gap-6">
        <SearchInput ref={inputRef} onSearchChange={setQuery} />
        <button
          onClick={e => { e.currentTarget.blur(); random() }}
          className="text-[#a8a095] hover:text-[#ff2957] text-sm shrink-0"
        >
          [ random ]
        </button>
        <span className="ml-auto text-sm text-[#a8a095] shrink-0">
          {query ? `${shown.length}/${words.length}` : `${words.length} words`}
        </span>
      </div>
      <WordsSoup words={shown} onSelect={open} frozen={!!selected} />
      {selected && <WordModal word={selected} onClose={close} />}
    </>
  )
}
