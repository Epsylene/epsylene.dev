import { slugify, getTextContent } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

function createHeading(level) {
  const Heading = ({ children }) => {
    const text = getTextContent(children)
    const slug = slugify(text)
    
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children
    )
  }

  Heading.displayName = `Heading${level}`
  return Heading
}

export function PostImage({ src, caption, scale=0.8 }: { src: string; caption?: React.ReactNode; scale?: number }) {
  const alt = getTextContent(caption)

  return (
    <figure className="flex flex-col items-center my-4">
      <div className="flex flex-col items-center" style={{ width: `${scale * 100}%`}}>
        <Image 
          src={src}
          alt={alt}
          title={alt}
          width={800}
          height={600}
          className="object-cover rounded-lg"
        />
        {caption && (
          <figcaption className="text-sm text-gray-300 italic mt-2 text-center max-w-[85%]">
            {caption}
          </figcaption>
        )}
      </div>
    </figure>
  )
}

export const postComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  PostImage,
}