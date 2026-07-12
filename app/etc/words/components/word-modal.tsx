'use client'

import type { WordData } from './words-content'

interface WordModalProps {
  word: WordData
  onClose: () => void
}

export function WordModal({ word, onClose }: WordModalProps) {
  return (
    <div
      className="fixed inset-0 flex items-start justify-center p-8 z-50 overflow-y-auto bg-[#00000082]"
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        key={word.id}
        className="bg-[#131418] text-[#c7bebe] shadow-xl max-w-3xl w-full p-6 my-auto portrait:text-sm animate-[excerpt-in_0.3s_ease-out_both]"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-3xl portrait:text-2xl text-[#ff2957] font-bold" style={{ wordSpacing: '-0.2em' }}>
            {word.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-2xl portrait:text-xl leading-none shrink-0"
          >
            ×
          </button>
        </div>
        <div className="prose-lg portrait:prose-base prose-p:m-0 prose-p:mb-2 prose-p:mt-4 prose-p:text-[1em] prose-ul:m-0 prose-ul:mr-5 prose-ol:m-0 prose-ol:mr-5 prose-ol:mb-2 prose-li:m-0 prose-a:text-red-400 prose-a:hover:underline prose-blockquote:border-l-4 prose-blockquote:border-red-400/65 prose-blockquote:pl-4 prose-blockquote:my-4 prose-blockquote:text-[0.96em] prose-blockquote:leading-6 prose-h4:text-2xl prose-h4:font-bold text-[#c7bebe] leading-7 text-wrap max-w-max prose-ol:list-decimal prose-ol:mt-5 prose-ul:list-disc marker:text-[#8b8585]">
          {word.body}
        </div>
        <div className="mt-6 text-right text-xs text-[#a8a095]/60 portrait:hidden">
          ← → — browse · esc — close
        </div>
      </div>
    </div>
  )
}
