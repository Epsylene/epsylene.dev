import { getTextContent } from '@/lib/utils'
import createHeading from '@/app/components/headings'
import Image from 'next/image'
import React from 'react'

export function PostImage({ src, caption, scale=0.8 }: { src: string; caption?: React.ReactNode; scale?: number }) {
  const alt = getTextContent(caption)

  return (
    <figure className="flex flex-col items-center my-6">
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