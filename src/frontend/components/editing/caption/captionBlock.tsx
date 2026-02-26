"use client";

import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box, Button, createListCollection, Flex, Float, Portal, ScrollArea, Select, Separator, Span, Stack, Tag, Text, useBreakpointValue } from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import { EmojiClickData, EmojiStyle, SkinTonePickerLocation, SkinTones, SuggestionMode, Theme } from 'emoji-picker-react';
import { LuLaugh } from "react-icons/lu";
import { useColorMode } from "@/components/ui/color-mode";
import dynamic from "next/dynamic";

export default function CaptionBlock() {
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const [selectedSample, setSelectedSample] = useState<string | null>(null);

    const [emojiOpen, setEmojiOpen] = useState<boolean>(false);
    const { getSelectedImageExif, sessionData, getCaptionSamples } = useSessionStore();
    const { selectedImg } = useWorkSession();
    const { colorMode } = useColorMode();

    const [captionSamples, setCaptionSamples] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const tagRegex = /\[([^\]]+)\]/g;
    const [savedSelection, setSavedSelection] = useState<Range | null>(null);

    const isTableSize = useBreakpointValue(
        { base: false, sm: false, md: false, lg: false, xl: true },
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
        const samples = getCaptionSamples(selectedImg);
        exifs && setTags(exifs);
        console.log(samples);
        samples && setCaptionSamples(samples);
    }, [sessionData, selectedImg]);

    function createTag(tag: string) {
        const selection = window.getSelection();
        if (!selection?.rangeCount) return;

        const range = selection?.getRangeAt(0);
        if (!editorRef.current?.contains(range?.startContainer)) return;

        const span = document.createElement("span");
        const nextNode = document.createTextNode("");
        span.className = "customTag";
        span.style.userSelect = "all";
        span.contentEditable = "false";
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
        onclick = () => {
            range.deleteContents();
        }

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
            setEmojiOpen(false);
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

    const collection = createListCollection({
        items: captionSamples ?? [],
        itemToValue: (item: any) => item.item,
        itemToString: (item: any) => item.key
    });


    return (
        <Box display="flex" flexDirection={isTableSize ? "column" : "column"} w={"full"} h="full" gap="2">
            {
                /*
                 * SAMPLE VÁLASZTÓ
                 */
            }
            <Text fontSize={"sm"} color={"fg.muted"}>Előre létrehozott caption-ök:</Text>
            <Box display="flex" flexDirection="row" gap={4}>
                <Select.Root
                    variant={"subtle"}
                    collection={collection}
                    size="sm"
                    scrollbar={"hidden"}
                    onSelect={(e) => {
                        setSelectedSample(e.value);
                    }}
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText maxW={"130px"} color={"fg.muted"} placeholder="Kérjük, válasszon egy samplet" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner w={"fit"}>
                            <Select.Content w={"fit"}>
                                {
                                    //TODO: Egy typeot példányosítani neki :)
                                }
                                {captionSamples.map((tag: any) => (
                                    <Select.Item item={tag} key={tag.key}>
                                        <Stack gap="0">
                                            <Select.ItemText>{tag.key}</Select.ItemText>
                                            <Span color="fg.muted" textStyle="xs">
                                                {tag.item}
                                            </Span>
                                        </Stack>
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
                <Button size={"sm"} variant={"surface"} colorPalette={"teal"} onClick={() => {
                    if (editorRef.current) {
                        {
                            // TODO: ITT EZ NEM LESZ JÓ, SZÓVAL NEM ÁTIRNI KELL HANEM UGY KELL MAJD MEGCSINÁLNI HOGY
                            //  VÉGIG TERÁLUNK A SAMPLEN és egyesével betesszük mintha irnánk akár vagy egy külön functiont kell ráirni majd :)
                        }
                        editorRef.current.innerText = selectedSample || "";
                    }
                }}>
                    Alkalmaz
                </Button>
            </Box>
            <Separator my={2} />
            {
                /*
                 * CAPTION VÁLASZTÓ
                 */
            }
            <Box display="flex" flexDirection="row" flex="1" gap="2">
                <ScrollArea.Root width="100%" size="xs" scrollbar="hidden" alignItems={"center"}>
                    <ScrollArea.Viewport
                        css={{
                            "--scroll-shadow-size": "3rem",
                            maskImage: "linear-gradient(to right, #000 85%, transparent)",
                            "&[data-at-top=false]": {
                                maskImage: "linear-gradient(to right, #000 85%, transparent)",
                            },
                            "&[data-at-bottom=false]": {
                                maskImage: "linear-gradient(to right, #000 85%, transparent)",
                            },
                            "&[data-at-top=true][data-at-bottom=true]": {
                                maskImage: "linear-gradient(to right, #000, #000)",
                            },
                        }}
                    >
                        <ScrollArea.Content>
                            <Flex gap="1.5" flexWrap="nowrap" align="center" py="1">
                                {tags.map((tag, index) => (
                                    <Tag.Root
                                        key={tag + index}
                                        onClick={() => insertTag(tag)}
                                        colorScheme="teal"
                                        size="lg"
                                        rounded="full"
                                        css={{
                                            scrollSnapAlign: "start",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Tag.Label>{tag}</Tag.Label>
                                    </Tag.Root>
                                ))}
                                <Box w="3rem" flexShrink={0} />
                            </Flex>
                        </ScrollArea.Content>
                    </ScrollArea.Viewport>
                </ScrollArea.Root>
                {isTableSize && (
                    <Flex justify="flex-end" mb="1">
                        <Button
                            size="sm"
                            onClick={() => {
                                saveSelection();
                                setEmojiOpen(!emojiOpen);
                            }}
                            colorPalette="teal"
                            variant="ghost"
                            css={{ flexShrink: 0 }}
                        >
                            <LuLaugh />
                        </Button>
                        <Float placement={"middle-start"} offset={20}>
                            <EmojiPicker
                                height={350}
                                width={320}
                                defaultSkinTone={SkinTones.LIGHT}
                                emojiStyle={EmojiStyle.FACEBOOK}
                                lazyLoadEmojis
                                searchPlaceHolder="Keresés"
                                suggestedEmojisMode={SuggestionMode.FREQUENT}
                                skinTonePickerLocation={SkinTonePickerLocation.PREVIEW}
                                theme={colorMode === "dark" ? Theme.DARK : Theme.LIGHT}
                                open={emojiOpen}
                                onEmojiClick={emojiClick}
                            />
                        </Float>
                    </Flex>
                )}
            </Box>
            <Text fontSize={"sm"} color={"fg.muted"}>Caption szöveg:</Text>
            <Box
                flex="1"
                minH="120px"
                maxH="400px"
                width="100%"
                minW="100%"
                maxW="100%"
                borderColor="teal"
                borderWidth={1}
                ref={editorRef}
                focusRing="none"
                contentEditable
                suppressContentEditableWarning
                p="3"
                borderRadius="lg"
                overflowY="auto"
                onInput={changeTextTag}
                css={{
                    boxSizing: 'border-box',
                    '&:focus': {
                        borderColor: 'teal.6',
                        boxShadow: '0 0 0 2px rgba(45, 212, 191, 0.2)',
                    },
                }}
            />
        </Box>
    )
}