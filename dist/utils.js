"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseHtmlAsNodes = parseHtmlAsNodes;
exports.parseNodesAsHtml = parseNodesAsHtml;

var _parse = _interopRequireDefault(require("parse5"));

var _parse5Htmlparser2TreeAdapter = _interopRequireDefault(require("parse5-htmlparser2-tree-adapter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseHtmlAsNodes(html) {
  return _parse.default.parseFragment(html).childNodes;
}

function parseNodesAsHtml(nodes) {
  const htmlFragment = _parse5Htmlparser2TreeAdapter.default.createDocumentFragment();

  nodes.forEach(node => {
    _parse5Htmlparser2TreeAdapter.default.appendChild(htmlFragment, node);
  });
  return _parse.default.serialize(htmlFragment);
}