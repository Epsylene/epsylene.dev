import { visit } from 'unist-util-visit'
import type { Root, Element } from 'hast'

export default function rehypeFootnoteBacklinks() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      // Find the footnotes section
      if (
        node.tagName === 'section' &&
        node.properties?.dataFootnotes === true
      ) {
        // Find the ordered list
        visit(node, 'element', (childNode: Element) => {
          if (childNode.tagName === 'ol') {
            // Remove default styling
            childNode.properties = {
              ...childNode.properties,
              style: 'list-style: none; padding-left: 0;',
            }

            // Process each footnote item
            childNode.children = childNode.children.map((footnoteItem: Element) => {
              if (footnoteItem.tagName === 'li') {
                const fnId = footnoteItem.properties?.id as string
                const refId = fnId.replace('fn', 'fnref')
                
                // Get content
                const content = footnoteItem.children.find(
                  (child) => child.type === 'element' && child.tagName === 'p'
                ) as Element
  
                // Remove backlink
                content.children = content.children.filter((child) => {
                  if (child.type === 'element' && child.tagName === 'a') {
                    const href = child.properties?.href as string
                    return href !== `#${refId}`
                  }
                  return true
                })

                // Create clickable backlink number
                const number = refId.replace('fnref', '')
                const numberLink: Element = {
                  type: 'element',
                  tagName: 'a',
                  properties: {
                    href: `#${refId}`,
                    className: 'footnote-number',
                  },
                  children: [{ type: 'text', value: `${number}.` }],
                }
  
                // Content wrapper
                const contentSpan: Element = {
                  type: 'element',
                  tagName: 'span',
                  properties: {
                    className: 'footnote-content',
                  },
                  children: content.children,
                }

                return {
                  ...footnoteItem,
                  children: [ numberLink, { type: 'text', value: ' ' }, contentSpan],
                }
              }

              return footnoteItem
            })
          }
        })
      }
    })
  }
}