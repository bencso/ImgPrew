import { RefObject } from "react";
import { createTag } from "./createTag";

//#region A képhez megfelelő caption-ok betöltése
export function loadCaptionTextForImage(
  tags: string[],
  editorRef: RefObject<HTMLTextAreaElement | null>,
  selectedImg: number,
  getCaptionForImage: (id: number) => string,
) {
  const caption = getCaptionForImage(selectedImg);
  if (caption !== null && editorRef.current) {
    const editor = editorRef.current;
    editor.textContent = "";

    const escapedTags = [...tags]
      .sort((a, b) => b.localeCompare(a))
      .map((tag) => tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const testRegex = new RegExp(`(${escapedTags.join("|")})`, "g");

    const regexMatchTexts = caption
      ?.match(testRegex)
      ?.map((element) => element.replace("[", "").replace("]", ""));

    caption
      ?.split(testRegex)
      .filter(Boolean)
      .forEach((text) => {
        if (text && regexMatchTexts?.includes(text)) {
          if (tags.indexOf(text) > 0) {
            createTag(text, editorRef);
          }
        } else {
          const textNode = document.createTextNode(text);

          const range = document.createRange();
          range.selectNodeContents(editor);
          range.collapse(false);

          range.insertNode(textNode);

          range.setStartAfter(textNode);
          range.collapse(true);

          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      });
  } else if (editorRef && editorRef.current) editorRef.current.textContent = "";
}
//#endregion
