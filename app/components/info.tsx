'use client'
import { ReactNode } from 'react'
import { useState } from 'react'

export default function Info({ title, children }: { title: string, children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="">
      <button
        className="mb-2 flex font-semibold items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <svg
          className={`ml-1 mb-0.5 ${isOpen ? 'rotate-180 mt-2.5 ml-2' : ''}`}
          width="16" 
          height="16" 
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 10 13 14 9" />
        </svg>
      </button>
      {isOpen && (
        <div className="ml-3 [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mt-3">
          {children}
        </div>
      )}
    </div>
  )
}