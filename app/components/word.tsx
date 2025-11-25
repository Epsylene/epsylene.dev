'use client'
import { ReactNode, useState } from 'react'

interface WordProps {
  title: string
  children: ReactNode
}

export function Word({ title, children }: WordProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="hover:text-blue-600 transition-colors"
      >
        {title}
      </button>
    )
  }

  return (
    <span className="inline-block w-full my-4">
      <div className="flex justify-center">
        <div className="p-4 border-2 w-[50%] border-blue-600 rounded-lg bg-blue-50 text-black shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-bold text-blue-600">{title}</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-gray-600 hover:text-gray-900 shrink-0"
            >
              Close
            </button>
          </div>
          <div className="prose prose-sm max-w-none">{children}</div>
        </div>
      </div>
    </span>
  )
}