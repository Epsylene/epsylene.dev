'use client'

import { ReactNode, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { SearchInput } from './search-input'
import { WordsSoup, subscribeToModalState } from './word'

interface WordsPageWrapperProps {
  content: ReactNode
}

export function WordsContent({ content }: WordsPageWrapperProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const unsubscribe = subscribeToModalState(setIsModalOpen)
    return unsubscribe
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block search input when a modal is open
      if (isModalOpen) {
        return
      }

      // Don't trigger if user is typing in a text input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Don't trigger on special keys (except backspace)
      if ((e.ctrlKey || e.metaKey || e.altKey) && e.key !== 'Backspace') {
        return
      }

      // Focus input and add the character or handle backspace
      if (inputRef.current) {
        if (/^[a-z0-9]$/i.test(e.key)) {
          e.preventDefault()
          inputRef.current.focus()
          inputRef.current.value += e.key
          setSearchQuery(inputRef.current.value)
        } else if (e.key === 'Backspace') {
          e.preventDefault()
          inputRef.current.focus()
          inputRef.current.value = inputRef.current.value.slice(0, -1)
          setSearchQuery(inputRef.current.value)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen])

  return (
    <>
      <div className="mb-8">
        <SearchInput ref={inputRef} onSearchChange={setSearchQuery} />
      </div>
      <WordsSoup searchQuery={searchQuery}>
        {content}
      </WordsSoup>
    </>
  )
}
