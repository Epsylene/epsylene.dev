import { formatDate, getPost, getPostSlugs } from '@/lib/utils'
import Link from 'next/link'
import path from 'path'
import fs from 'fs'

import { postComponents } from '@/app/components/post'
import { MarginNoteHandler } from '@/app/components/margin-note'
import { compileMDX } from 'next-mdx-remote/rsc'
import matter from 'gray-matter'

import remarkGfm from 'remark-gfm'
import rehypeCitation from 'rehype-citation'
import Toc from '@/app/components/toc'
import rehypeLinkifyBibliography from '@/lib/rehype-linkify-bibliography'
import rehypeMoveBibliography from '@/lib/rehype-move-bibliography'
import rehypeToc, { TocItem } from '@/lib/rehype-toc'
import rehypeFootnoteHeading from '@/lib/rehype-footnote-heading'
import rehypeFootnoteBacklinks from '@/lib/rehype-footnote-backlinks'
import rehypeMarginNotes from '@/lib/rehype-margin-notes'
import rehypeTransformIds from '@/lib/rehype-transform-ids'

export function generateStaticParams() {
  const slugs = getPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function BlogPost({ params }) {
  const { slug } = await params
  const post = getPost(slug)

  // Parse frontmatter
  const { data: meta, content: source } = matter(post)

  // Add bibliography if refs.bib exists
  const bibFsPath = path.join(process.cwd(), 'public', 'assets', slug, 'refs.bib')
  const hasBibliography = fs.existsSync(bibFsPath)

  const rehypeCitationProps = hasBibliography
    ? { bibliography: `/public/assets/${slug}/refs.bib`, linkCitations: true }
    : {}

  const headings: TocItem[] = []

  const { content } = await compileMDX({
    source,
    components: postComponents, 
    options: {
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
        ],
        rehypePlugins: [
          [ rehypeCitation, rehypeCitationProps ],
          rehypeTransformIds,
          rehypeMarginNotes,
          rehypeFootnoteHeading,
          rehypeFootnoteBacklinks,
          rehypeLinkifyBibliography,
          rehypeMoveBibliography,
          [ rehypeToc, headings ]
        ]
      },   
    }
  })

  return (
    <div className="page-layout">
      <div className="toc-sidebar">
        <Toc headings={headings} />
      </div>
      <section className="content">
        <MarginNoteHandler />
        <div className="mb-0">
          <Link href='/' className="text-neutral-600 dark:text-neutral-300 hover:underline">
            « Accueil
          </Link>
        </div>
        <h1 className="title">
          {meta.title}
        </h1>
        <div className="flex justify-between items-center mt-2 mb-8 text-sm">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            <time>{formatDate(meta.date)}</time>
          </p>
        </div>
        <article className="prose">
          { content }
        </article>
      </section>
    </div>
  )
}