'use client'

import { ReactNode } from 'react'

export interface WordProps {
  title: string
  children?: ReactNode
}

// Marker component: WordsContent reads the props off each <Word>
// element in the compiled MDX and renders the soup and the modal
// itself, so this never actually renders.
export function Word(props: WordProps) {
  void props
  return null
}

export function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .normalize('NFD') // Normalize (remove accents)
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}
