"use client";

import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box, Tag, Textarea } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";


export default function Page() {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const { getSelectedImageExif } = useSessionStore();
  const { selectedImg } = useWorkSession();
  const [tags, setTags] = useState<string[]>([]);
  const tagRegex = /\[([^\]]+)\]/g;

  useEffect(() => {
    const exifs = getSelectedImageExif(selectedImg);
    exifs && setTags(exifs);
  }, [selectedImg]);

  function createTag(tag: string) {
    const span = document.createElement("span");
    const nextNode = document.createTextNode("");
    span.className = "customTag";
    span.contentEditable = "false";
    span.style.userSelect = "all";
    span.textContent = tag;

    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection?.getRangeAt(0);

    if (range) {
      range.deleteContents();
      range.insertNode(nextNode)
      range.insertNode(span);

      range.setStartAfter(nextNode);
      range.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(range);
      editorRef.current?.focus();
    }
  }

  function insertTag(text: string) {
    if (tags.includes(text)) {
      createTag(text);
    }
  }



  return (
    <Box h="full" px={30}>

      <Box>
        <p>Tagek:</p>
        <Tag.Root onClick={() => { insertTag("tag") }} transition={"all 2ms"} _hover={{ backgroundColor: "teal.800", borderColor: "teal.950" }} size={"xl"} key={1} rounded="full">
          <Tag.Label>{"tag"}</Tag.Label>
        </Tag.Root>
        <Box mt={3} display={"flex"} flexWrap={"wrap"} spaceX={2} spaceY={2}>{tags.map((tag, index) => {
          return (
            <Tag.Root onClick={() => { insertTag(tag) }} transition={"all 2ms"} _hover={{ backgroundColor: "teal.800", borderColor: "teal.950" }} size={"xl"} key={index} rounded="full">
              <Tag.Label>{tag}</Tag.Label>
            </Tag.Root>
          )
        })}</Box>
      </Box>
      <Box
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        backgroundColor={"teal.900"}
        onInput={(e) => {
          var cleanedText;
          const selection = window.getSelection();
          if (!selection?.rangeCount) return;

          const range = selection?.getRangeAt(0);
          const cursorText = range.startContainer;
          const inputText = cursorText.textContent;
          const matches = inputText?.match(tagRegex);
          if (matches && inputText) {
            matches.map((match) => {
              cleanedText = match.replaceAll("[", "").replaceAll("]", "").trim();
              if (tags.includes(cleanedText)) {
                const start = inputText.indexOf(match);
                const end = start + match.length;
                const matchRange = document.createRange();
                matchRange.setStart(cursorText, start);
                matchRange.setEnd(cursorText, end);
                matchRange.deleteContents();

                createTag(match);
              }
            })
          }
        }}
      />
    </Box>
  )
}