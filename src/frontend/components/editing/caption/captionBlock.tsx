//TODO: Refaktorálni, és bug vadászat (fontos rész)
"use client";

import { applyCaptionSample } from "@/helper/caption/applyCaptionSample";
import { createTag } from "@/helper/caption/createTag";
import { insertEmoji } from "@/helper/caption/insertEmoji";
import { loadCaptionTextForImage } from "@/helper/caption/loadCaptionText";
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
import { useTheme } from "next-themes";
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
  const { theme } = useTheme();
  //#endregion

  //#region caption useStatek
  const [captionSamples, setCaptionSamples] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);
  //#endregion

  //#region EmojiPicker import
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
  //#endregion

  const exifs =
    useSessionStore(
      (s) => s.sessionData.find((img) => img.id === selectedImg)?.exifDatas,
      shallow,
    )?.map((i: any) => {
      return i["item"];
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
    loadCaptionTextForImage(tags, editorRef, selectedImg, getCaptionForImage);
  }, [sessionData, selectedImg]);

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
                applyCaptionSample(
                  editorRef,
                  selectedSample,
                  tags,
                  selectedImg,
                  setCaptionForImage,
                );
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
                  {tags.map((text, index) => (
                    <Tag.Root
                      key={text + index}
                      onClick={() => {
                        if (tags.indexOf(text) > 0) {
                          createTag(text, editorRef);
                        }
                      }}
                      colorScheme="teal"
                      size="lg"
                      rounded="full"
                      css={{
                        scrollSnapAlign: "start",
                        flexShrink: 0,
                      }}
                    >
                      <Tag.Label>{text}</Tag.Label>
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
                  theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
                  open={emojiOpen}
                  onEmojiClick={(e) => {
                    insertEmoji(e, editorRef, savedSelection);
                    setEmojiOpen(false);
                  }}
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
