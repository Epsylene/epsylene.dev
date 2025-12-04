import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import matter from 'gray-matter'
import { Vibrant } from 'node-vibrant/node'

export function getPostsDirectory() {
  return path.join(process.cwd(), 'content', 'posts')
}

export function getPostSlugs() {
  // Read all files in the posts folder
  const postsDirectory = getPostsDirectory()
  
  let entries
  try {
    entries = fs.readdirSync(postsDirectory, { withFileTypes: true })
  } catch (error) {
    return []
  }

  // Remove .mdx extension to get slugs
  return entries
    .map(file => (
      file.name.replace(/\.mdx$/, '')
    )
  )
}

export function getPost(slug: string) {
  const file = path.join(getPostsDirectory(), `${slug}.mdx`)
  
  let post
  try {
    post = fs.readFileSync(file, 'utf-8')
  } catch (error) {
    return notFound()
  }

  return post
}

export function getPostMeta(slug: string) {
  const post = getPost(slug)
  const { data: meta, content } = matter(post)
  return meta
}

export function formatDate(date) {
  return new Date(date).toISOString().split('T')[0]
}

export function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .normalize('NFD') // Normalize (remove accents)
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

export function getTextContent(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return node.toString()
  if (Array.isArray(node)) return node.map(getTextContent).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    return getTextContent((node as React.ReactElement<{ children?: React.ReactNode }>).props.children)
  }

  return ''
}

export async function extractImageColor(imagePath: string): Promise<string> {
  const filePath = path.join(process.cwd(), 'public', imagePath)
  const palette = await Vibrant.from(filePath).getPalette()
  
  // Get a muted or dark muted swatch for subtlety
  const swatch = palette.DarkMuted || palette.Muted || palette.Vibrant
  
  return swatch?.hex || '#000' // fallback to black
}