import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

import Info from './info'
import createHeading from '@/app/components/headings'
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
      <div
        className="flex justify-center pb-2.5 pt-2 rounded-t-md text-xl font-semibold transition-all"
        style={{ backgroundColor: `${color}` }}
      >
          {link ? (
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${title} repository`}
          className="text-current hover:opacity-80"
        >
          <div className="flex items-center gap-2 px-4">
            <h3 className="m-0">{title}</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 .297C5.373.297 0 5.67 0 12.297c0 5.297 3.438 9.793 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.874.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.805 5.624-5.476 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .321.216.694.825.576C20.565 22.09 24 17.592 24 12.297 24 5.67 18.627.297 12 .297z" />
            </svg>
          </div>
        </Link>
          ) : 
          (
            <h3 className="px-4 m-0">{title}</h3>
          )}
      </div>
      <div className="relative w-full mx-auto aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
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