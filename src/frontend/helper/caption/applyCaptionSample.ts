import { tagRegex } from "@/consts/regexForCaptions";
import { RefObject } from "react";
import { createTag } from "./createTag";

//#region Sample alkalmazása
export function applyCaptionSample(
  editorRef: RefObject<HTMLTextAreaElement | null>,
  selectedSample: string | null,
  tags: string[],
  selectedImg: number,
  setCaptionForImage: (id: number, caption: string) => void,
) {
  if (editorRef.current) {
    editorRef.current.textContent = "";

    // A tagek [tag] alakzatának átalakítása: tag formátumba, hogy az normálisan nézzen ki szövegként
    const regexMatchTexts = selectedSample
      ?.match(tagRegex)
      ?.map((element) => element.replace("[", "").replace("]", ""));

    selectedSample
      ?.split(tagRegex)
      .filter(Boolean)
      .map((text) => {
        editorRef.current?.focus();

        if (
          text &&
          regexMatchTexts?.some((element) => element.toString() === text)
        ) {
          if (tags.indexOf(text) > 0) createTag(text, editorRef);
        } else {
          const nextNode = document.createTextNode(text);
          const selection = window.getSelection();
          if (!selection?.rangeCount) return;

          const range = selection?.getRangeAt(0);
          if (!editorRef.current?.contains(range?.startContainer)) return;
          if (range) {
            range.deleteContents();
            range.insertNode(nextNode);
            range.setStartAfter(nextNode);
            range.collapse(true);
            selection?.removeAllRanges();
            selection?.addRange(range);
            editorRef.current?.focus();
          }
        }
      });
  }

  setCaptionForImage(selectedImg, editorRef.current?.textContent || "");
}
//#endregion
