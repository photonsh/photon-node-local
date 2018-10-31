import photonCore from '@photonsh/photon-core'

import { parseHtmlAsNodes, parseNodesAsHtml } from './utils'

async function photon() {
  const highlighter = await photonCore()

  async function highlight(document) {
    async function walkNode(node) {
      let newNode = node

      if (
        node.nodeName === 'pre'
        && node.childNodes !== undefined
        && node.childNodes.length === 1
        && (node.childNodes[0].nodeName === 'code' || node.childNodes[0].nodeName === 'samp')
        && node.childNodes[0].attrs !== undefined
        && node.childNodes[0].attrs.length
        && node.childNodes[0].attrs.find((attr) => (attr.name === 'class' && (/\blang(?:uage)?-([\w-]+)\b/i).test(attr.value)))
        && node.childNodes[0].childNodes !== undefined
        && node.childNodes[0].childNodes.length === 1
        && node.childNodes[0].childNodes[0].value !== undefined
        && node.childNodes[0].childNodes[0].value !== ''
      ) {
        const highlightedSnippet = await highlighter(parseNodesAsHtml([node.childNodes[0]]))

        const highlightedNode = parseHtmlAsNodes(highlightedSnippet)[0]

        highlightedNode.parentNode = node.parentNode

        if (highlightedNode.nodeName === 'div') {
          newNode = highlightedNode
        } else {
          newNode.childNodes[0] = highlightedNode
        }
      } else if (node.nodeName !== 'pre' && node.childNodes !== undefined && node.childNodes.length) {
        newNode.childNodes = await Promise.all(node.childNodes.map(walkNode))
      }

      return newNode
    }

    const nodes = parseHtmlAsNodes(document)

    return parseNodesAsHtml(await Promise.all(nodes.map(walkNode)))
  }

  return highlight
}

export default photon