import type { Metadata } from 'next'
import Link from 'next/link'
import path from 'path'
import fs from 'fs'

import { compileMDX } from 'next-mdx-remote/rsc'
import matter from 'gray-matter'
import { Excerpt } from './components/excerpt'
import { ExcerptsView } from './components/excerpts-view'

export const metadata: Metadata = {
  title: 'Excerpts',
  description: 'A commonplace book of quotes and passages',
}

export default async function ExcerptsPage() {
  const filePath = path.join(process.cwd(), 'content', 'excerpts.mdx')
  const file = fs.readFileSync(filePath, 'utf-8')

  // Parse frontmatter
  const { content: source } = matter(file)

  const { content } = await compileMDX({
    source,
    components: {
      Excerpt
    },
  })

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 min-h-screen flex flex-col">
      <section className="mb-0">
        <h1 className="text-5xl">
          Excerpts
        </h1>
        <div className="mt-0">
          <Link href='/etc' className="text-neutral-300 hover:underline">
            « Back
          </Link>
        </div>
      </section>
      <ExcerptsView content={content} />
    </div>
  )
}
