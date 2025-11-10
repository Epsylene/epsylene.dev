import React from 'react'
import { slugify, getTextContent } from '@/lib/utils'

export default function createHeading(level) {
  const Heading = ({ children }) => {
    const text = getTextContent(children)
    const slug = slugify(text)

    // Font sizes based on heading level
    const size = {
      1: 'text-4xl',
      2: 'text-3xl',
      3: 'text-2xl',
      4: 'text-xl',
      5: 'text-lg',
      6: 'text-base',
    }
    
    return React.createElement(
      `h${level}`,
      { id: slug, className: `relative group ${size[level]} mb-6` },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'absolute invisible group-hover:visible no-underline -ml-[1em] pr-2 w-4/5 max-w-[700px] cursor-pointer after:content-["#"] after:text-neutral-300 dark:after:text-neutral-700',
        }),
      ],
      children
    )
  }

  Heading.displayName = `Heading${level}`
  return Heading
}