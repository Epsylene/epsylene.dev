import React from 'react'
import { slugify, getTextContent } from '@/lib/utils'

export function createHeading(level) {
  const Heading = ({ children }) => {
    const text = getTextContent(children)
    const slug = slugify(text)

    // Font sizes based on heading level
    const size = {
      2: 'text-3xl',
      3: 'text-2xl',
    }

    const tag = {
      2: '#',
      3: '##',
    }
    
    return React.createElement(
      `h${level}`,
      { id: slug, className: `${size[level]} mb-4` },
      React.createElement('a', {
        href: `#${slug}`,
        key: `link-${slug}`,
        className: `before:content-['${tag[level]}'] before:text-[var(--gray)] border-b-0 mr-3`,
      }),
      children
    )
  }

  Heading.displayName = `Heading${level}`
  return Heading
}

export const postComponents = {
  h2: createHeading(2),
  h3: createHeading(3),
}