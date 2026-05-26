//TODO: Refaktorálni, és bug vadászat (fontos rész)
"use client";

import { useColorMode } from "@/components/ui/color-mode";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  Box,
  Button,
  createListCollection,
  Flex,
  Float,
  Portal,
  ScrollArea,
  Select,
  Separator,
  Span,
  Stack,
  Tag,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  EmojiClickData,
  EmojiStyle,
  SkinTonePickerLocation,
  SkinTones,
  SuggestionMode,
  Theme,
} from "emoji-picker-react";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { LuLaugh } from "react-icons/lu";
import { shallow } from "zustand/shallow";

export default function CaptionBlock() {
  //#region refek és egéb useState állapotok
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [emojiOpen, setEmojiOpen] = useState<boolean>(false);

  const isTableSize = useBreakpointValue(
    { base: false, sm: false, md: false, lg: false, xl: true },
    { ssr: false, fallback: "md" },
  );
  //#endregion

  //#region contextek
  const { sessionData, setCaptionForImage, getCaptionForImage } =
    useSessionStore();
  const { selectedImg } = useWorkSession();
  const { colorMode } = useColorMode();
  //#endregion

  //#region caption useStatek
  const [captionSamples, setCaptionSamples] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);
  //#endregion

  //#region EmojiPicker import és tagRegex
  const tagRegex = /\[([^\]]+)\]/g;
  const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
    ssr: false,
  });
  //#endregion

  //#region Kijelölés megtartása
  function saveSelection() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedSelection(selection.getRangeAt(0).cloneRange());
    }
  }

  //#region Megtartott kijelölés újridézése
  function restoreSelection() {
    const selection = window.getSelection();
    if (savedSelection && selection) {
      selection.removeAllRanges();
      selection.addRange(savedSelection);
    }
  }

  const exifs =
    useSessionStore(
      (s) => s.sessionData.find((img) => img.id === selectedImg)?.exifDatas,
      shallow,
    )?.map((i: any)=>{
    return i["item"]
  }) || [];


  const samples =
    useSessionStore(
      (s) =>
        s.sessionData.find((img) => img.id === selectedImg)?.captionSamples,
      shallow,
    ) || [];

  useMemo(() => {
    setSelectedSample(null);
    exifs && setTags(exifs);
    samples && setCaptionSamples(samples);
    loadCaptionTextForImage();
  }, [sessionData, selectedImg]);

  //#region Captionök betöltése a képnek megfelelően

  function loadCaptionTextForImage() {
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
            insertTag(text);
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
    } else if (editorRef && editorRef.current)
      editorRef.current.textContent = "";
  }
  //#endregion

  //#region CreateTag
  function createTag(tag: string) {
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

  //#region Emoji beillesztés
  function emojiClick(emojiObject: EmojiClickData) {
    restoreSelection();
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
      setEmojiOpen(false);
    }
  }
  //#endregion

  //#region Tag beillesztés
  function insertTag(text: string) {
    if (tags.indexOf(text) > 0) {
      createTag(text);
    }
  }
  //#endregion

  //#region Sample alkalmazása
  function onClickApplyBtn() {
    if (editorRef.current) {
      editorRef.current.textContent = "";
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
            insertTag(text);
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

  const collection = createListCollection({
    items: captionSamples ?? [],
    itemToValue: (item: any) => item.item,
    itemToString: (item: any) => item.key,
  });

  return (
    <Box
      display="flex"
      flexDirection={isTableSize ? "column" : "column"}
      w={"full"}
      h="full"
      gap="2"
    >
      {
        //#region SAMPLE VÁLASZTÓ
      }
      {captionSamples.length > 0 && (
        <>
          <Text fontSize={"sm"} color={"fg.muted"}>
            Előre létrehozott caption-ök:
          </Text>
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
                  <Select.ValueText
                    maxW={"130px"}
                    color={"fg.muted"}
                    placeholder="Kérjük, válasszon egy samplet"
                  />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner w={"fit"}>
                  <Select.Content w={"fit"}>
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
            <Button
              size={"sm"}
              variant={"surface"}
              colorPalette={"teal"}
              onClick={() => {
                onClickApplyBtn();
              }}
            >
              Alkalmaz
            </Button>
          </Box>
          <Separator my={2} />
        </>
      )}
      {
        //#endregion
        //#region CAPTION VÁLASZTÓ
      }
      {tags.length > 0 && (
        <Box display="flex" flexDirection="row" flex="1" gap="2">
          <ScrollArea.Root
            width="100%"
            size="xs"
            scrollbar="hidden"
            alignItems={"center"}
          >
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
      )}
      <Text fontSize={"sm"} color={"fg.muted"}>
        Caption szöveg:
      </Text>
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
        css={{
          boxSizing: "border-box",
          "&:focus": {
            borderColor: "teal.6",
            boxShadow: "0 0 0 2px rgba(45, 212, 191, 0.2)",
          },
        }}
      />
      {
        //#endregion
      }
    </Box>
  );
}
