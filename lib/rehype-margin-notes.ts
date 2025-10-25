import { visit } from 'unist-util-visit'
import type { Element } from 'hast'

export default function rehypeMarginNotes() {
  return (tree) => {
    const footnotes = new Map()

    // Collect footnote contents
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'section' && node.properties?.dataFootnotes) {
        visit(node, 'element', (li: Element) => {
          if (li.tagName === 'li' && li.properties?.id) {
            const id = li.properties.id as string

            const paragraph = li.children.find(
              (child): child is Element =>
                child.type === 'element' && child.tagName === 'p'
            )

            if (paragraph) {
              let content = [...paragraph.children]

              // Remove backref
              content = content.filter((child) => {
                if (child.type === 'element' && child.tagName === 'a') {
                  const href = child.properties?.href as string
                  // Remove links that point back to the reference
                  return !href?.startsWith('#user-content-fnref-')
                }
                return true
              })

              footnotes.set(id, content)
            }
          }
        })
      }
    })

    // Create margin notes
    visit(tree, 'element', (node: Element, index, parent) => {
      // Find reference
      if (node.tagName === 'sup' && parent && typeof index === 'number') {
        const link = node.children.find(
          (child): child is Element =>
            child.type === 'element' &&
            child.tagName === 'a' &&
            typeof child.properties?.id === 'string' &&
            child.properties.id.startsWith('user-content-fnref-')
        )

        // Retrieve footnote
        if (link && link.properties?.id) {
          const linkId = link.properties.id as string
          const footnoteNum = linkId.replace('user-content-fnref-', '')
          const footnoteId = `user-content-fn-${footnoteNum}`

          const content = footnotes.get(footnoteId)

          if (content) {
            const marginNote: Element = {
              type: 'element',
              tagName: 'span',
              properties: {
                className: ['margin-note'],
                id: `margin-note-${footnoteNum}`
              },
              children: [
                {
                  type: 'element',
                  tagName: 'b',
                  properties: {},
                  children: [{ type: 'text', value: `${footnoteNum}. ` }]
                },
                {
                  type: 'element',
                  tagName: 'span',
                  properties: {
                    className: 'margin-note-content'
                  },
                  children: content
                }
              ]
            }

            parent.children.splice(index + 1, 0, marginNote)
          }
        }
      }
    })
  }
}