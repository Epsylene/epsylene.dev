import type { Metadata } from 'next'
import Link from 'next/link'
import path from 'path'
import fs from 'fs'

import { compileMDX } from 'next-mdx-remote/rsc'
import { projectComponents } from '@/app/projects/components/card'
import remarkGfm from 'remark-gfm'
import matter from 'gray-matter'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'My projects',
}

export default async function ProjectsPage() {
  const filePath = path.join(process.cwd(), 'content', 'projects.mdx')
  const file = fs.readFileSync(filePath, 'utf-8')

  // Parse frontmatter
  const { data: meta, content: source } = matter(file)

  const { content } = await compileMDX({
    source,
    components: {
      ...projectComponents,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-8">
        <h1 className="text-5xl">
          Projects
        </h1>
        <div className="mt-0">
          <Link href='/' className="text-neutral-600 dark:text-neutral-300 hover:underline">
            « Back
          </Link>
        </div>
      </section>

      {content}
    </div>
  )
}