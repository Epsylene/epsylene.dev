'use client'

import { ReactNode } from 'react'

export interface ExcerptProps {
  author?: string
  source?: string
  year?: string
  kind?: 'prose' | 'verse'
  lang?: string
  children?: ReactNode
}

// Marker component: ExcerptsView reads the props off each <Excerpt>
// element in the compiled MDX and lays the content out itself, so
// this never actually renders.
export function Excerpt(props: ExcerptProps) {
  void props
  return null
}
