import { Root, Element, Text } from 'hast';
import { visit } from 'unist-util-visit';

export default function rehypeLinkifyBibliography() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      // Get all bibliography entries
      const className = node.properties?.className;
      if (Array.isArray(className) && className.includes('csl-entry')) {
        visit(node, 'text', (textNode: Text, index, parent) => {
          if (index == null || !parent) return

          // Avoid reprocessing <a> tags
          if (parent.type === 'element' && parent.tagName === 'a') return

          // Get all URLs in the text node
          const text = textNode.value
          const urlRegex = /(https?:\/\/[^\s]+)/g
          const matches = [...text.matchAll(urlRegex)]
          
          if (matches.length === 0) return

          const newNodes: (Text | Element)[] = []
          let lastIndex = 0

          matches.forEach((match) => {
            const url = match[0]
            const start = match.index!

            // Push text before the URL
            if (start > lastIndex) {
              newNodes.push({
                type: 'text',
                value: text.slice(lastIndex, start),
              })
            }

            // Push the link node
            newNodes.push({
              type: 'element',
              tagName: 'a',
              properties: {
                href: url,
                target: '_blank',
                rel: 'noopener noreferrer',
                className: ['entry-link'],
              },
              children: [{ type: 'text', value: url }],
            })

            lastIndex = start + url.length
          })

          // Push remaining text after the last URL
          if (lastIndex < text.length) {
            newNodes.push({
              type: 'text',
              value: text.slice(lastIndex),
            })
          }

          // Replace the original text node with the new nodes
          parent.children.splice(index, 1, ...newNodes)
        })
      }
    })
  }
}