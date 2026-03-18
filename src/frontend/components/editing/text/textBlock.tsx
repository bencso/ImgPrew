import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  Accordion,
  Box,
  Button,
  ColorPicker,
  Flex,
  Grid,
  GridItem,
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
import { useState } from "react";
import { createListCollection } from "@chakra-ui/react";
import {
  LuAlignCenter,
  LuArrowDown,
  LuArrowDownLeft,
  LuArrowDownRight,
  LuArrowLeft,
  LuArrowRight,
  LuArrowUp,
  LuArrowUpLeft,
  LuArrowUpRight,
  LuCornerUpLeft,
  LuDot,
  LuTrash,
} from "react-icons/lu";

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
  const { selectedImg, textRefs } = useWorkSession();
  const {
    addTexts,
    setTextFontSize,
    setTextFontWeight,
    deleteText,
    setTextColor,
    setTextPosition,
  } = useSessionStore();
  const texts = useSessionStore((s) => s.getTexts(selectedImg));
  const imageSize = useSessionStore((s) => s.getImageSize(selectedImg));

  const [text, setText] = useState("");

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
            addTexts(selectedImg, text);
            setText("");
          }}
        >
          Hozzáadás
        </Button>
      </Flex>

      <Stack gap="2" mt={4}>
        <Accordion.Root variant="enclosed" collapsible>
          {texts.map((text) => {
            return (
              <Accordion.Item key={text.id} value={text.id.toString() || ""}>
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
                    color={"red.400"}
                    border={"1px solid"}
                    borderColor={"red.700/50"}
                    _hover={{
                      bgColor: "red.700/50",
                    }}
                    key={text.id}
                    onClick={() => {
                      deleteText(selectedImg, text.id);
                    }}
                  >
                    <LuTrash />
                  </Box>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>

                <Accordion.ItemContent>
                  <Accordion.ItemBody gap={4} display="flex" flexDir="column">
                    {/* Szöveg elhelyezése */}
                    <Grid
                      templateRows={"repeat(3, 1fr)"}
                      gap={2}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <GridItem display={"flex"} gap={2}>
                        <IconButton
                          onClick={() => {
                            setTextPosition(selectedImg, text.id, {
                              y: 5,
                              x: 10,
                            });
                          }}
                        >
                          <LuArrowUpLeft />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            const element = textRefs?.current?.[text.id];

                            if (element && imageSize) {
                              const imageHalfWithText = imageSize
                                ? imageSize.width / 2 - element.offsetWidth / 2
                                : null;

                              if (imageHalfWithText)
                                setTextPosition(selectedImg, text.id, {
                                  y: 5,
                                  x: imageHalfWithText,
                                });
                            }
                          }}
                        >
                          <LuArrowUp />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            const element = textRefs?.current?.[text.id];
                            if (element && imageSize) {
                              const imageWidthWithText = imageSize
                                ? imageSize.width - (element.offsetWidth + 10)
                                : null;

                              if (imageWidthWithText)
                                setTextPosition(selectedImg, text.id, {
                                  y: 5,
                                  x: imageWidthWithText,
                                });
                            }
                          }}
                        >
                          <LuArrowUpRight />
                        </IconButton>
                      </GridItem>
                      <GridItem display={"flex"} gap={2}>
                        <IconButton
                          onClick={() => {
                            const element = textRefs?.current?.[text.id];
                            if (element && imageSize) {
                              const imagHeigtWithText = imageSize
                                ? imageSize.height / 2 -
                                  (element.offsetHeight + 10)
                                : null;

                              if (imagHeigtWithText)
                                setTextPosition(selectedImg, text.id, {
                                  y: imagHeigtWithText,
                                  x: 10,
                                });
                            }
                          }}
                        >
                          <LuArrowLeft />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            const element = textRefs?.current?.[text.id];
                            if (element && imageSize) {
                              const imagHeigtWithText = imageSize
                                ? imageSize.height / 2 -
                                  (element.offsetHeight / 2 - 10)
                                : null;

                              const imagWidthWithText = imageSize
                                ? imageSize.width / 2 -
                                  (element.offsetWidth / 2 - 10)
                                : null;

                              if (imagHeigtWithText && imagWidthWithText)
                                setTextPosition(selectedImg, text.id, {
                                  y: imagHeigtWithText,
                                  x: imagWidthWithText,
                                });
                            }
                          }}
                        >
                          <LuDot />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            const element = textRefs?.current?.[text.id];
                            if (element && imageSize) {
                              const imagHeigtWithText = imageSize
                                ? imageSize.height / 2 -
                                  (element.offsetHeight / 2 - 10)
                                : null;

                              const imagWidthWithText = imageSize
                                ? imageSize.width - (element.offsetWidth + 10)
                                : null;

                              if (imagHeigtWithText && imagWidthWithText)
                                setTextPosition(selectedImg, text.id, {
                                  y: imagHeigtWithText,
                                  x: imagWidthWithText,
                                });
                            }
                          }}
                        >
                          <LuArrowRight />
                        </IconButton>
                      </GridItem>
                      <GridItem display={"flex"} gap={2}>
                        <IconButton>
                          <LuArrowDownLeft />
                        </IconButton>
                        <IconButton>
                          <LuArrowDown />
                        </IconButton>
                        <IconButton>
                          <LuArrowDownRight />
                        </IconButton>
                      </GridItem>
                    </Grid>

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
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            );
          })}
        </Accordion.Root>
      </Stack>
    </Box>
  );
}
