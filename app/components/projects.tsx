import Image from 'next/image'
import Link from 'next/link'
import Info from './info'
import React from 'react'
import { ReactNode } from 'react'
import { slugify, getTextContent, extractImageColor } from '@/lib/utils'

interface ProjectCardProps {
  title: string
  link?: string
  image: string
  children: ReactNode
}

export function CardGrid({ children }: { children: ReactNode }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 mb-12">
      {children}
    </div>
  )
}

export async function Card({ title, link, image, children }: ProjectCardProps) {
  const color = await extractImageColor(image)
  // const colorDark = darkenColor(color, 0.2)
  
  return (
    <div className="break-inside-avoid mb-6">
      <Link href={link}>
        <div
          className="pb-2.5 pt-2 rounded-t-md text-center text-xl font-semibold hover:brightness-75 transition-all"
          style={{ backgroundColor: `${color}` }}
        >
          <h3>{title}</h3>
        </div>
      </Link>
      <div className="relative w-full mx-auto aspect-[4/3]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div
        className="p-6 pt-4 pb-3 rounded-b-md [&>p]:mb-3 [&>p]:leading-relaxed [&>ul]:mb-3 [&>ul]:ml-5 [&>ul]:list-disc [&>ul]:space-y-1 [&>ul>li]:leading-relaxed [&>*:last-child]:mb-2"
        style={{ backgroundColor: `${color}` }}
      >
        {children}
      </div>
    </div>
  )
}

function createHeading(level) {
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

export const projectComponents = {
  Card,
  Info,
  CardGrid,
  h1: createHeading(1),
  h2: createHeading(2),
}