'use client'

import { forwardRef } from 'react'

interface SearchInputProps {
  onSearchChange: (query: string) => void
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput({ onSearchChange }, ref) {
    return (
      <label className="flex items-baseline gap-2 w-full max-w-xs">
        <span className="text-[#a8a095] select-none">/</span>
        <input
          ref={ref}
          type="text"
          placeholder="type to search"
          onChange={e => onSearchChange(e.target.value)}
          className="w-full bg-transparent border-b border-[#a8a095]/40 focus:border-[#ff2957] focus:outline-none py-1 text-[#e3e1de] placeholder:text-[#a8a095]/50"
        />
      </label>
    )
  }
)
