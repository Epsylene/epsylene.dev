import { visit } from 'unist-util-visit'
import { Root, Element } from 'hast'

export default function rehypeMoveBibliography() {
  return (tree: Root) => {
    let bibliographyNode = null
    let bibliographyIndex = null
    let bibliographyParent = null

    // Find the bibliography
    visit(tree, 'element', (node: Element, index, parent) => {
      if (
        node.tagName === 'div' &&
        node.properties &&
        node.properties.id === 'refs'
      ) {
        bibliographyNode = node
        bibliographyIndex = index
        bibliographyParent = parent
      }
    })

    // If found, remove and append to the end
    if (bibliographyNode && bibliographyParent && bibliographyIndex != null) {
      // Remove from current position
      bibliographyParent.children.splice(bibliographyIndex, 1)

      const section = {
        type: 'element',
        tagName: 'section',
        properties: { id: 'bibliography-section' },
        children: [
          {
            type: 'element',
            tagName: 'h2',
            properties: {},
            children: [{ type: 'text', value: 'Bibliographie' }],
          },
          bibliographyNode,
        ],
      }

      // Append to the end of the parent
      bibliographyParent.children.push(section)
    }
  }
}