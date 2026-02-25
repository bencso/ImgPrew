"use client";

import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box, Button, Float, Tag, useBreakpointValue } from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import { EmojiClickData, EmojiStyle, SkinTonePickerLocation, SkinTones, SuggestionMode, Theme } from 'emoji-picker-react';
import { LuLaugh } from "react-icons/lu";
import { useColorMode } from "@/components/ui/color-mode";
import dynamic from "next/dynamic";

export default function CustomTagEditor() {
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const [emojiOpen, setEmojiOpen] = useState<boolean>(false);
    const { getSelectedImageExif } = useSessionStore();
    const { selectedImg } = useWorkSession();
    const { colorMode } = useColorMode();
    const [tags, setTags] = useState<string[]>([]);
    const tagRegex = /\[([^\]]+)\]/g;
    const [savedSelection, setSavedSelection] = useState<Range | null>(null);
    const isMd = useBreakpointValue(
        { base: false, sm: false, md: false, lg: true, xl: true },
        { ssr: false, fallback: "md" }
    );


    const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

    function saveSelection() {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            setSavedSelection(selection.getRangeAt(0).cloneRange());
        }
    }

    function restoreSelection() {
        const selection = window.getSelection();
        if (savedSelection && selection) {
            selection.removeAllRanges();
            selection.addRange(savedSelection);
        }
    }

    useMemo(() => {
        const exifs = getSelectedImageExif(selectedImg);
        exifs && setTags(exifs);
    }, [selectedImg]);

    function createTag(tag: string) {
        const selection = window.getSelection();
        if (!selection?.rangeCount) return;

        const range = selection?.getRangeAt(0);
        if (!editorRef.current?.contains(range?.startContainer)) return;

        const span = document.createElement("span");
        const nextNode = document.createTextNode("");
        span.className = "customTag";
        span.style.userSelect = "all";
        span.textContent = tag;
        Object.assign(span.style, {
            display: "inline-flex",
            alignItems: "center",
            padding: "0.2rem 0.5rem",
            borderRadius: "0.375rem",
            backgroundColor: "#b2f5ea",
            color: "#234e52",
            fontSize: "0.875rem",
            fontWeight: "500",
            userSelect: "all",
            cursor: "default",
            margin: "0 0.25rem 0.25rem 0"
        });

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

    function emojiClick(emojiObject: EmojiClickData) {
        restoreSelection();
        const emoji = emojiObject.emoji;
        const nextNode = document.createTextNode("");
        nextNode.textContent = emoji;

        const selection = window.getSelection();
        if (!selection?.rangeCount) return;

        const range = selection?.getRangeAt(0);
        if (!editorRef.current?.contains(range?.startContainer)) return;

        if (range) {
            range.insertNode(nextNode)

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

    function changeTextTag() {
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
    }


    return (
        <Box h="full">
            <Box>
                {/* <Box mt={3} display={"flex"} flexWrap={"wrap"} spaceX={2} spaceY={2}>{tags.map((tag, index) => {
                    return (
                        <Tag.Root onClick={() => {
                            insertTag(tag);
                        }} colorScheme={"teal"} size={"xl"} key={index} rounded="full">
                            <Tag.Label>{tag}</Tag.Label>
                        </Tag.Root>
                    )
                })}</Box> */}
            </Box>
            <Box>
                {isMd && <><Button mb={2} size={"sm"} onClick={() => {
                    saveSelection();
                    setEmojiOpen(!emojiOpen);
                }} colorPalette="teal" variant="ghost">
                    <LuLaugh />
                </Button>
                    <Float placement={"middle-end"} offset={"-40"}>
                        <EmojiPicker height={350} defaultSkinTone={SkinTones.LIGHT} emojiStyle={EmojiStyle.FACEBOOK} lazyLoadEmojis searchPlaceHolder="Keresés" suggestedEmojisMode={SuggestionMode.FREQUENT} skinTonePickerLocation={SkinTonePickerLocation.PREVIEW} theme={colorMode === "dark" ? Theme.DARK : Theme.LIGHT} open={emojiOpen} onEmojiClick={emojiClick} />
                    </Float></>}
                <Box
                    mt={3}
                    borderColor={"teal"}
                    borderWidth={1}
                    ref={editorRef}
                    focusRing={"none"}
                    contentEditable
                    suppressContentEditableWarning
                    p={3}
                    borderRadius={"lg"}
                    onInput={changeTextTag}
                />
            </Box>
        </Box>
    )
}