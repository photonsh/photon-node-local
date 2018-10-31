import parse5 from 'parse5'
import treeAdapter from 'parse5-htmlparser2-tree-adapter'

function parseHtmlAsNodes(html) {
  return parse5.parseFragment(html).childNodes
}

function parseNodesAsHtml(nodes) {
  const htmlFragment = treeAdapter.createDocumentFragment()

  nodes.forEach((node) => {
    treeAdapter.appendChild(htmlFragment, node)
  })

  return parse5.serialize(htmlFragment)
}

export { parseHtmlAsNodes, parseNodesAsHtml }
