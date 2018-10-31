"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _photonCore = _interopRequireDefault(require("@photonsh/photon-core"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function photon() {
  const highlighter = await (0, _photonCore.default)();

  async function highlight(document) {
    async function walkNode(node) {
      let newNode = node;

      if (node.nodeName === 'pre' && node.childNodes !== undefined && node.childNodes.length === 1 && (node.childNodes[0].nodeName === 'code' || node.childNodes[0].nodeName === 'samp') && node.childNodes[0].attrs !== undefined && node.childNodes[0].attrs.length && node.childNodes[0].attrs.find(attr => attr.name === 'class' && /\blang(?:uage)?-([\w-]+)\b/i.test(attr.value)) && node.childNodes[0].childNodes !== undefined && node.childNodes[0].childNodes.length === 1 && node.childNodes[0].childNodes[0].value !== undefined && node.childNodes[0].childNodes[0].value !== '') {
        const highlightedSnippet = await highlighter((0, _utils.parseNodesAsHtml)([node.childNodes[0]]));
        const highlightedNode = (0, _utils.parseHtmlAsNodes)(highlightedSnippet)[0];
        highlightedNode.parentNode = node.parentNode;

        if (highlightedNode.nodeName === 'div') {
          newNode = highlightedNode;
        } else {
          newNode.childNodes[0] = highlightedNode;
        }
      } else if (node.nodeName !== 'pre' && node.childNodes !== undefined && node.childNodes.length) {
        newNode.childNodes = await Promise.all(node.childNodes.map(walkNode));
      }

      return newNode;
    }

    const nodes = (0, _utils.parseHtmlAsNodes)(document);
    return (0, _utils.parseNodesAsHtml)((await Promise.all(nodes.map(walkNode))));
  }

  return highlight;
}

var _default = photon;
exports.default = _default;