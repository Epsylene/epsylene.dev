import type { Metadata } from 'next'
import { postComponents } from '../components/post'
import { Entry } from './components/entry'
import { getPost } from '@/lib/utils'
import { compileMDX } from 'next-mdx-remote/rsc'

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Victor Rodriguez — resume',
}

export default async function Resume() {
  const source = getPost('resume')
  const { content } = await compileMDX({
    source,
    components: {
      ...postComponents,
      Entry,
    },
  })

  return (
    <>
      <div className="flex items-center mb-2">
        <h1 className="text-4xl">
          Victor Rodriguez
        </h1>
        <hr className="flex-1 mt-[0.75ch] ml-4 border-t-2 border-[#a8a095]" />
      </div>
      <p className="mb-1">HPC research engineer</p>
      <p className="text-[var(--gray)] mb-8">
        Paris, France · <a href="mailto:v.rodriguez.radius@gmail.com">v.rodriguez.radius@gmail.com</a> · <a href="/resume.pdf">pdf version</a>
      </p>
      <div>
        {content}
      </div>
    </>
  )
}
