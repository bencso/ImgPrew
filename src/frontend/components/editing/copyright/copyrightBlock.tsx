import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  Accordion,
  Box,
  Button,
  Code,
  ColorPicker,
  FileUpload,
  FileUploadList,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Input,
  NumberInput,
  parseColor,
  Portal,
  Select,
  Span,
  Stack,
  Text,
  useFileUpload,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
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
  LuCopyright,
  LuCornerUpLeft,
  LuDot,
  LuTrash,
  LuUpload,
} from "react-icons/lu";
import { shallow } from "zustand/shallow";
import { ACCEPTED_FILES } from "@/components/upload/dropzone";
import { toaster } from "@/components/ui/toaster";

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

export default function CopyrightBlock() {
  const { selectedImg, textElements } = useWorkSession();
  const {
    uploadCopyrightImage,
    clearCopyrightImage,
    setCopyrightImagePosition,
    setTextFontSize,
    setTextFontWeight,
    deleteText,
    setTextColor,
    setTextPosition,
  } = useSessionStore();
  const texts = useSessionStore((s) => s.getTexts(selectedImg), shallow);
  const imageSize = useSessionStore(
    (s) => s.getImageSize(selectedImg),
    shallow,
  );

  const fileUpload = useFileUpload({
    maxFiles: 1,
    accept: ACCEPTED_FILES.join(","),
    onFileReject(details) {
      if (details.files.length > 0) {
        toaster.create({
          title: "Hiba történt feltöltés közben!",
          description: `Maximum 1 fájlt tölthetsz fel.`,
          type: "error",
        });
      }
      return (details.files = []);
    },
  });

  const accepted = fileUpload.acceptedFiles;

  if (accepted.length > 0)
    accepted[0].arrayBuffer().then((buffer) => {
      uploadCopyrightImage(selectedImg, buffer);
    });

  return (
    <Box>
      <Flex gap={2}>
        <FileUpload.RootProvider value={fileUpload} w="full">
          <FileUpload.HiddenInput />
          {accepted.length <= 0 ? (
            <FileUpload.Dropzone
              w={"full"}
              backgroundColor={"teal.subtle/30"}
              transition={"all 0.2s ease-in-out"}
              cursor={"pointer"}
              _hover={{ backgroundColor: "teal.subtle/40" }}
            >
              <Icon size="2xl" color="teal.fg">
                <LuCopyright />
              </Icon>
              <FileUpload.DropzoneContent>
                <Box>Húzza be a feltölteni kívánt fájlokat</Box>
                <Box color="fg.muted">
                  {ACCEPTED_FILES.map((file) => {
                    return file.replaceAll("image/", "");
                  }).join(", ")}
                </Box>
              </FileUpload.DropzoneContent>
            </FileUpload.Dropzone>
          ) : (
            <Box
              overflowY={"scroll"}
              scrollbar={"hidden"}
              maxH={200}
              w={"full"}
            >
              <FileUpload.ItemGroup>
                {accepted.map((file) => (
                  <FileUpload.Item key={file.name} file={file}>
                    <FileUpload.ItemPreview />
                    <FileUpload.ItemDeleteTrigger />
                  </FileUpload.Item>
                ))}
              </FileUpload.ItemGroup>
            </Box>
          )}
        </FileUpload.RootProvider>
      </Flex>

      <Stack gap="2" mt={4}>
        <Accordion.Root variant="enclosed" collapsible>
          {texts.map((text) => {
            //TODO: A logikát átültetni a store-ba és itt csak azt átadni hogy bal-lent, bal, jobb-fel
            // (mert így fogjuk átadni majd a backendnek)
            const element = textElements[text.id];
            if (!element) return;
            console.log(imageSize ? imageSize : null);

            const imagHeigtWithText = imageSize
              ? imageSize.height - element.offsetHeight - 20
              : null;

            const imagWidthWithText = imageSize
              ? imageSize.width - element.offsetWidth - 20
              : null;

            const imageHalfWithText = imageSize
              ? imageSize.width / 2 - element.offsetWidth / 2
              : null;

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
                              y: 10,
                              x: 20,
                            });
                          }}
                        >
                          <LuArrowUpLeft />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            if (element && imageSize && imageHalfWithText)
                              setTextPosition(selectedImg, text.id, {
                                y: 10,
                                x: imageHalfWithText,
                              });
                          }}
                        >
                          <LuArrowUp />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            if (element && imageSize && imagWidthWithText)
                              setTextPosition(selectedImg, text.id, {
                                y: 10,
                                x: imagWidthWithText,
                              });
                          }}
                        >
                          <LuArrowUpRight />
                        </IconButton>
                      </GridItem>
                      <GridItem display={"flex"} gap={2}>
                        <IconButton
                          onClick={() => {
                            if (element && imageSize && imagHeigtWithText)
                              setTextPosition(selectedImg, text.id, {
                                y: imagHeigtWithText / 2,
                                x: 10,
                              });
                          }}
                        >
                          <LuArrowLeft />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            if (
                              element &&
                              imageSize &&
                              imagHeigtWithText &&
                              imageHalfWithText
                            )
                              setTextPosition(selectedImg, text.id, {
                                y: imagHeigtWithText / 2,
                                x: imageHalfWithText,
                              });
                          }}
                        >
                          <LuDot />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            if (
                              element &&
                              imageSize &&
                              imagHeigtWithText &&
                              imagWidthWithText
                            )
                              setTextPosition(selectedImg, text.id, {
                                y: imagHeigtWithText / 2,
                                x: imagWidthWithText,
                              });
                          }}
                        >
                          <LuArrowRight />
                        </IconButton>
                      </GridItem>
                      <GridItem display={"flex"} gap={2}>
                        <IconButton
                          onClick={() => {
                            if (element && imageSize && imagHeigtWithText)
                              setTextPosition(selectedImg, text.id, {
                                y: imagHeigtWithText,
                                x: 20,
                              });
                          }}
                        >
                          <LuArrowDownLeft />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            if (
                              element &&
                              imageSize &&
                              imagHeigtWithText &&
                              imageHalfWithText
                            )
                              setTextPosition(selectedImg, text.id, {
                                y: imagHeigtWithText,
                                x: imageHalfWithText,
                              });
                          }}
                        >
                          <LuArrowDown />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            if (
                              element &&
                              imageSize &&
                              imagHeigtWithText &&
                              imagWidthWithText
                            )
                              setTextPosition(selectedImg, text.id, {
                                y: imagHeigtWithText,
                                x: imagWidthWithText,
                              });
                          }}
                        >
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
