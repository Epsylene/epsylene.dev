import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { ReactNode } from 'react'

import Info from './info'
import createHeading from './headings'
import { extractImageColor } from '@/lib/utils'

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
        className="p-6 pt-4 pb-3 rounded-b-md [&>p]:mb-3 [&>p]:leading-relaxed [&>ul,ol]:mb-3 [&>ul,ol]:ml-5 [&>ul,ol]:space-y-1 [&>ul>li]:leading-relaxed [&>*:last-child]:mb-2"
        style={{ backgroundColor: `${color}` }}
      >
        {children}
      </div>
    </div>
  )
}

export const projectComponents = {
  Card,
  Info,
  CardGrid,
  h1: createHeading(1),
  h2: createHeading(2),
}