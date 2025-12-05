import type { Metadata } from 'next'
import Link from 'next/link'
import path from 'path'
import fs from 'fs'

import { compileMDX } from 'next-mdx-remote/rsc'
import { Word, WordLine } from '@/app/components/word'
import remarkGfm from 'remark-gfm'
import matter from 'gray-matter'

export const metadata: Metadata = {
  title: 'Words',
  description: 'List of words',
}

export default async function WordsPage() {
  const filePath = path.join(process.cwd(), 'content', 'words.mdx')
  const file = fs.readFileSync(filePath, 'utf-8')

  // Parse frontmatter
  const { data: meta, content: source } = matter(file)

  const { content } = await compileMDX({
    source,
    components: {
      Word,
      WordLine
    },
    options: {
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
        ],
      }
    }
  })

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <section className="mb-8">
        <h1 className="text-5xl">
          Words
        </h1>
        <div className="mt-0">
          <Link href='/' className="text-neutral-600 dark:text-neutral-300 hover:underline">
            « Back
          </Link>
        </div>
      </section>
        <div className="space-y-2">
          {content}
        </div>
    </div>
  )
}