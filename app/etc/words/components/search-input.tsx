'use client'

import { forwardRef } from 'react'

interface SearchInputProps {
  onSearchChange: (query: string) => void
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput({ onSearchChange }, ref) {
    const handleChange = (value: string) => {
      onSearchChange(value)
    }

    return (
      <input
        ref={ref}
        type="text"
        placeholder="Search words..."
        onChange={(e) => handleChange(e.target.value)}
        className="mt-4 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
      />
    )
  }
)
