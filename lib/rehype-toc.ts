import { visit } from 'unist-util-visit'
import { Root } from 'hast'
import { slugify } from '@/lib/utils'

export type TocItem = {
  depth: number
  text: string
  id: string
}

function extractText(node): string {
  if (node.type === 'text') return node.value
  if (node.children) {
    return node.children.map(extractText).join('')
  }
  return ''
}

export default function rehypeToc(toc: TocItem[]) {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'h2' || node.tagName === 'h3') {
        const depth = node.tagName === 'h2' ? 2 : 3
        const text = extractText(node)
        const id = slugify(text)

        toc.push({ depth, text, id })
      }
    })
  }
}