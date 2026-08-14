import { RefObject } from "react";

//#region Létrehozza a Tag-eket az editor-ban,
// és ezeknek a stílusát, ez azért kell, hogy jobban látható legyen mik a tagek a szövegben
export function createTag(
  tag: string,
  editorRef: RefObject<HTMLTextAreaElement | null>,
) {
  const selection = window.getSelection();
  editorRef.current?.focus();
  if (!selection?.rangeCount) return;

  const range = selection?.getRangeAt(0);
  if (!editorRef.current?.contains(range?.startContainer)) return;

  const span = document.createElement("span");
  const nextNode = document.createTextNode(" ");
  span.className = "customTag";
  span.style.userSelect = "all";
  span.contentEditable = "false";
  span.textContent = tag;
  Object.assign(span.style, {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.2rem 0.5rem",
    borderRadius: "0.375rem",
    backgroundColor: "#234E52",
    color: "#E6FFFA",
    fontSize: "0.875rem",
    fontWeight: "500",
    userSelect: "all",
    cursor: "not-allowed",
    margin: "0 0.25rem 0.25rem 0",
    appearance: "none",
  });

  span.onclick = () => {
    range.deleteContents();
    span.remove();
  };

  if (range) {
    range.deleteContents();
    range.insertNode(nextNode);
    range.insertNode(span);

    range.setStartAfter(nextNode);
    range.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);
    editorRef.current?.focus();
  }
}
//#endregion
