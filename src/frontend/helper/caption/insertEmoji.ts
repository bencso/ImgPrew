import { EmojiClickData } from "emoji-picker-react";
import { RefObject } from "react";
import { restoreSelection } from "./restoreSelection";

//#region Emoji beillesztés
export function insertEmoji(
  emojiObject: EmojiClickData,
  editorRef: RefObject<HTMLTextAreaElement | null>,
  savedSelection: Range | null,
) {
  restoreSelection(savedSelection);

  const emoji = emojiObject.emoji;
  const nextNode = document.createTextNode("");
  nextNode.textContent = emoji;

  const selection = window.getSelection();
  if (!selection?.rangeCount) return;

  const range = selection?.getRangeAt(0);
  editorRef.current?.focus();
  if (!editorRef.current?.contains(range?.startContainer)) return;

  if (range) {
    range.insertNode(nextNode);

    range.setStartAfter(nextNode);
    range.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);
    editorRef.current?.focus();
  }
}
//#endregion
