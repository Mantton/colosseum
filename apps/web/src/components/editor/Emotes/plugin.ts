import { useEffect } from "react";
import { $createEmoticonNode } from "./node";
import { LexicalEditor, TextNode } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

function emoticonTransform(node: TextNode) {
  const textContent = node.getTextContent();

  const matches = [...textContent.matchAll(/:(\w+):/g)];

  for (const match of matches) {
    const text = match[1];
    const index = match.index!;
    console.log(text, index, node);
    const emoticon = $createEmoticonNode("bg-red-500", text);
  }

  if (textContent === ":avo:") {
    // node.replace($createEmoticonNode("bg-red-500", "avo"));
    node.setTextContent("not avo");
  } else if (textContent === ":)") {
    node.replace($createEmoticonNode("", "🙂"));
  }
}

function useEmoticons(editor: LexicalEditor) {
  useEffect(() => {
    const removeTransform = editor.registerNodeTransform(
      TextNode,
      emoticonTransform
    );
    return () => {
      removeTransform();
    };
  }, [editor]);
}

export default function EmoticonPlugin() {
  const [editor] = useLexicalComposerContext();
  useEmoticons(editor);
  return null;
}
