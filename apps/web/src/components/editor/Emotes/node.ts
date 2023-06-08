import { EditorConfig, TextNode } from "lexical";

export class EmoticonNode extends TextNode {
  __className;

  static getType() {
    return "emoticon";
  }

  static clone(node: EmoticonNode) {
    return new EmoticonNode(node.__className, node.__text, node.__key);
  }

  constructor(className: string, text: string, key?: string) {
    super(text, key);
    this.__className = className;
  }

  createDOM(config: EditorConfig) {
    const dom = super.createDOM(config);
    dom.className = this.__className;
    return dom;
  }
}

export function $isEmoticonNode(node: TextNode) {
  return node instanceof EmoticonNode;
}

export function $createEmoticonNode(className: string, emoticonText: string) {
  return new EmoticonNode(className, emoticonText).setMode("token");
}
