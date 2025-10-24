import { visit } from 'unist-util-visit'
import type { Root, Element } from 'hast'

export default function rehypeFootnoteHeading() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (
        node.tagName === 'h2' &&
        node.properties?.id === 'footnote-label'
      ) {
        const firstChild = node.children[0]
        if (firstChild && firstChild.type === 'text') {
          firstChild.value = 'Notes et références'
        }
      }
    })
  }
}