import { visit } from 'unist-util-visit'
import { Element, Root } from 'hast'

function transformId(id: string): string {
  // Footnotes: user-content-fn- to fn
  if (id.startsWith('user-content-fn-')) {
    return id.replace('user-content-fn-', 'fn')
  }

  // Footnote refs: user-content-fnref- to fnref
  if (id.startsWith('user-content-fnref-')) {
    return id.replace('user-content-fnref-', 'fnref')
  }

  // Bibliography: bib-authorYear to authorYear
  if (id.startsWith('bib-')) {
    return id.replace('bib-', '')
  }

  return id
}

function transformHref(href: string): string {
  if (href.startsWith('#')) {
    const originalId = href.slice(1)
    return '#' + transformId(originalId)
  }

  return href
}

export default function rehypeTransformIds() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      // Replace IDs
      if (node.properties?.id && typeof node.properties.id === 'string') {
        node.properties.id = transformId(node.properties.id)
      }

      // Update hrefs that point to transformed IDs
      if (node.tagName === 'a' && node.properties?.href && typeof node.properties.href === 'string') {
        node.properties.href = transformHref(node.properties.href)
      }
    })
  }
}