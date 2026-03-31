//TODO: Holnap (04.01) megcsinálni hogy lehessen a szövegeket pontsabban gombokkal is irányitani
import { XPositions, YPositions } from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  Accordion,
  Box,
  Button,
  ColorPicker,
  createListCollection,
  Flex,
  Grid,
  HStack,
  IconButton,
  Input,
  NumberInput,
  parseColor,
  Portal,
  Select,
  Span,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  LuArrowDown,
  LuArrowDownLeft,
  LuArrowDownRight,
  LuArrowLeft,
  LuArrowRight,
  LuArrowUp,
  LuArrowUpLeft,
  LuArrowUpRight,
  LuDot,
  LuPen,
  LuTrash,
} from "react-icons/lu";
import { shallow } from "zustand/shallow";

const fontWeightCollection = createListCollection({
  items: [
    { label: "Thin", value: "100" },
    { label: "Extra Light", value: "200" },
    { label: "Light", value: "300" },
    { label: "Normal", value: "400" },
    { label: "Medium", value: "500" },
    { label: "Semi Bold", value: "600" },
    { label: "Bold", value: "700" },
    { label: "Extra Bold", value: "800" },
    { label: "Black", value: "900" },
  ],
});

export default function TextBlock() {
  const { selectedImg, textElements } = useWorkSession();
  const {
    addTexts,
    setTextFontSize,
    setTextFontWeight,
    deleteText,
    setTextColor,
    setTextPosition,
    getTextPosition,
    editText,
  } = useSessionStore();
  const texts = useSessionStore(
    (s) => s.sessionData.find((si) => si.id === selectedImg)?.texts || [],
    shallow,
  );

  const imageSize = useSessionStore(
    (s) => s.sessionData.find((img) => img.id === selectedImg)?.dimesions,
    shallow,
  );
  const [editId, setEditId] = useState<string | null>(null);
  const [text, setText] = useState("");

  const textFromStore = useSessionStore(
    (s) =>
      s.sessionData
        .find((i) => i.id === selectedImg)
        ?.texts?.find((ti) => ti.id === editId)?.text || "",
    shallow,
  );

  useEffect(() => {
    if (!editId) return;
    setText(textFromStore);
  }, [editId, textFromStore]);

  return (
    <Box>
      <Flex gap={2}>
        <Input
          placeholder="Szöveg"
          value={text}
          onChange={(e) => setText(e.target.value)}
          variant="outline"
        />
        <Button
          variant="outline"
          colorPalette="teal"
          onClick={() => {
            if (!text) return;
            if (!editId) {
              addTexts(selectedImg, text);
            } else {
              editText(selectedImg, editId, text);
            }
            setEditId(null);
            setText("");
          }}
        >
          {!editId ? "Hozzáadás" : "Módosítás"}
        </Button>
      </Flex>

      {texts.length > 0 && (
        <Stack gap="2" mt={4}>
          <Accordion.Root variant="enclosed" collapsible>
            {texts.map((text) => {
              const element = textElements[text.id];

              if (!element) return;
              const textPosition = getTextPosition(selectedImg, text.id);

              return (
                <Accordion.Item key={text.id} value={text.id}>
                  <Accordion.ItemTrigger>
                    <Span
                      overflow={"hidden"}
                      maxW={"full"}
                      textWrap={"nowrap"}
                      flex="1"
                    >
                      {text.text}
                    </Span>

                    <Box
                      p={1}
                      borderRadius={"md"}
                      color={"cyan.400"}
                      border={"1px solid"}
                      borderColor={"cyan.700/50"}
                      _hover={{
                        bgColor: "cyan.700/50",
                      }}
                      key={text.id + "-edit"}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditId(text.id);
                      }}
                    >
                      <LuPen />
                    </Box>
                    <Box
                      p={1}
                      borderRadius={"md"}
                      color={"red.400"}
                      border={"1px solid"}
                      borderColor={"red.700/50"}
                      _hover={{
                        bgColor: "red.700/50",
                      }}
                      key={text.id + "-delete"}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteText(selectedImg, text.id);
                      }}
                    >
                      <LuTrash />
                    </Box>
                  </Accordion.ItemTrigger>

                  <Accordion.ItemContent>
                    <Accordion.ItemBody gap={4} display="flex" flexDir="column">
                      {/* Szöveg méret */}
                      <Flex gap={4} width="full" alignItems="center">
                        <Text w="fit">Méret</Text>

                        <HStack flex="1">
                          <NumberInput.Root
                            value={(text.fontSize || 20).toString()}
                            min={0}
                            onValueChange={(e) =>
                              setTextFontSize(
                                selectedImg,
                                text.id,
                                e.valueAsNumber,
                              )
                            }
                          >
                            <NumberInput.Control />
                            <NumberInput.Input />
                          </NumberInput.Root>

                          <Text fontSize="sm" color="gray.500">
                            px
                          </Text>
                        </HStack>
                      </Flex>

                      {/* Szöveg vastagság */}
                      <Flex gap={4} width="full" alignItems="center">
                        <Text w="fit">Vastagság</Text>

                        <Select.Root
                          flex="1"
                          collection={fontWeightCollection}
                          value={[text.fontWeight?.toString() ?? "500"]}
                          onValueChange={(e) =>
                            setTextFontWeight(
                              selectedImg,
                              text.id,
                              Number(e.value[0]),
                            )
                          }
                        >
                          <Select.HiddenSelect />

                          <Select.Control>
                            <Select.Trigger>
                              <Select.ValueText placeholder="Válasszon" />
                            </Select.Trigger>

                            <Select.IndicatorGroup>
                              <Select.Indicator />
                            </Select.IndicatorGroup>
                          </Select.Control>

                          <Portal>
                            <Select.Positioner>
                              <Select.Content>
                                {fontWeightCollection.items.map((item) => (
                                  <Select.Item key={item.value} item={item}>
                                    {item.label} ({item.value})
                                    <Select.ItemIndicator />
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select.Positioner>
                          </Portal>
                        </Select.Root>
                      </Flex>

                      {/* Szöveg színe */}
                      <Flex gap={4} width="full" alignItems="center">
                        <Text w="fit">Szín</Text>
                        <ColorPicker.Root
                          onValueChange={(details) => {
                            setTextColor(
                              selectedImg,
                              text.id,
                              details.value.toString("hex"),
                            );
                          }}
                          w={"full"}
                          value={parseColor(text.color)}
                        >
                          <ColorPicker.HiddenInput />
                          <ColorPicker.Control>
                            <ColorPicker.Input />
                            <ColorPicker.Trigger />
                          </ColorPicker.Control>
                          <Portal>
                            <ColorPicker.Positioner>
                              <ColorPicker.Content>
                                <ColorPicker.Area />
                                <HStack>
                                  <ColorPicker.EyeDropper
                                    size="xs"
                                    variant="outline"
                                  />
                                  <ColorPicker.Sliders />
                                </HStack>
                              </ColorPicker.Content>
                            </ColorPicker.Positioner>
                          </Portal>
                        </ColorPicker.Root>
                      </Flex>
                      {/* Szöveg elhelyezése */}
                      <Grid
                        display={"grid"}
                        templateRows={"repeat(3, 1fr)"}
                        templateColumns={"repeat(3,1fr)"}
                        gap={2}
                        w={"full"}
                      >
                        <IconButton
                          colorPalette={"teal"}
                          variant={"subtle"}
                          w={"full"}
                          h={"full"}
                          disabled={
                            textPosition &&
                            textPosition.x === XPositions.LEFT &&
                            textPosition.y === YPositions.TOP
                          }
                          onClick={() => {
                            setTextPosition(selectedImg, text.id, {
                              x: XPositions.LEFT,
                              y: YPositions.TOP,
                            });
                          }}
                        >
                          <LuArrowUpLeft />
                        </IconButton>
                        <IconButton
                          colorPalette={"teal"}
                          w={"full"}
                          variant={"subtle"}
                          disabled={
                            textPosition &&
                            textPosition.x === XPositions.CENTER &&
                            textPosition.y === YPositions.TOP
                          }
                          onClick={() => {
                            if (imageSize)
                              setTextPosition(selectedImg, text.id, {
                                x: XPositions.CENTER,
                                y: YPositions.TOP,
                              });
                          }}
                        >
                          <LuArrowUp />
                        </IconButton>
                        <IconButton
                          colorPalette={"teal"}
                          variant={"subtle"}
                          w={"full"}
                          disabled={
                            textPosition &&
                            textPosition.x === XPositions.RIGHT &&
                            textPosition.y === YPositions.TOP
                          }
                          onClick={() => {
                            if (imageSize)
                              setTextPosition(selectedImg, text.id, {
                                x: XPositions.RIGHT,
                                y: YPositions.TOP,
                              });
                          }}
                        >
                          <LuArrowUpRight />
                        </IconButton>

                        <IconButton
                          colorPalette={"teal"}
                          variant={"subtle"}
                          w={"full"}
                          disabled={
                            textPosition &&
                            textPosition.x === XPositions.LEFT &&
                            textPosition.y === YPositions.CENTER
                          }
                          onClick={() => {
                            if (imageSize)
                              setTextPosition(selectedImg, text.id, {
                                x: XPositions.LEFT,
                                y: YPositions.CENTER,
                              });
                          }}
                        >
                          <LuArrowLeft />
                        </IconButton>
                        <IconButton
                          colorPalette={"teal"}
                          variant={"subtle"}
                          w={"full"}
                          disabled={
                            textPosition &&
                            textPosition.x === XPositions.CENTER &&
                            textPosition.y === YPositions.CENTER
                          }
                          onClick={() => {
                            if (imageSize)
                              setTextPosition(selectedImg, text.id, {
                                x: XPositions.CENTER,
                                y: YPositions.CENTER,
                              });
                          }}
                        >
                          <LuDot />
                        </IconButton>
                        <IconButton
                          colorPalette={"teal"}
                          variant={"subtle"}
                          w={"full"}
                          disabled={
                            textPosition &&
                            textPosition.x === XPositions.RIGHT &&
                            textPosition.y === YPositions.CENTER
                          }
                          onClick={() => {
                            if (imageSize)
                              setTextPosition(selectedImg, text.id, {
                                x: XPositions.RIGHT,
                                y: YPositions.CENTER,
                              });
                          }}
                        >
                          <LuArrowRight />
                        </IconButton>

                        <IconButton
                          colorPalette={"teal"}
                          variant={"subtle"}
                          w={"full"}
                          disabled={
                            textPosition &&
                            textPosition.x === XPositions.LEFT &&
                            textPosition.y === YPositions.BOTTOM
                          }
                          onClick={() => {
                            if (imageSize)
                              setTextPosition(selectedImg, text.id, {
                                x: XPositions.LEFT,
                                y: YPositions.BOTTOM,
                              });
                          }}
                        >
                          <LuArrowDownLeft />
                        </IconButton>
                        <IconButton
                          colorPalette={"teal"}
                          variant={"subtle"}
                          w={"full"}
                          disabled={
                            textPosition &&
                            textPosition.x === XPositions.CENTER &&
                            textPosition.y === YPositions.BOTTOM
                          }
                          onClick={() => {
                            if (imageSize)
                              setTextPosition(selectedImg, text.id, {
                                x: XPositions.CENTER,
                                y: YPositions.BOTTOM,
                              });
                          }}
                        >
                          <LuArrowDown />
                        </IconButton>
                        <IconButton
                          colorPalette={"teal"}
                          variant={"subtle"}
                          w={"full"}
                          disabled={
                            textPosition &&
                            textPosition.x === XPositions.RIGHT &&
                            textPosition.y === YPositions.BOTTOM
                          }
                          onClick={() => {
                            if (imageSize)
                              setTextPosition(selectedImg, text.id, {
                                x: XPositions.RIGHT,
                                y: YPositions.BOTTOM,
                              });
                          }}
                        >
                          <LuArrowDownRight />
                        </IconButton>
                      </Grid>
                    </Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>
        </Stack>
      )}
    </Box>
  );
}
