"use client";

import { ToggleTip } from "@/components/ui/toggle-tip";
import {
  Box,
  Button,
  Center,
  DataList,
  EmptyState,
  Flex,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Image,
  Input,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";

import { useState } from "react";
import {
  LuCamera,
  LuDownload,
  LuFilter,
  LuInfo,
  LuMousePointer2,
} from "react-icons/lu";

function EmptyGallery() {
  return (
    <Center h={"full"}>
      <EmptyState.Root size="md">
        <EmptyState.Content>
          <EmptyState.Indicator>
            <LuCamera />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>A galériád üres</EmptyState.Title>
            <EmptyState.Description>
              Itt fognak megjelenni a szerkesztett fotóid, amint elmentetted.
            </EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    </Center>
  );
}

const srces = [
  "https://picsum.photos/200/400",
  "https://picsum.photos/300/200",
  "https://picsum.photos/400/400",
  "https://picsum.photos/500/700",
  "https://picsum.photos/600/500",
  "https://picsum.photos/700/400",
  "https://picsum.photos/800/500",
  "https://picsum.photos/900/700",
  "https://picsum.photos/1000/800",
  "https://picsum.photos/1100/900",
];

const stats = [
  {
    label: "Utoljára módosítva:",
    value: "2026. 04. 12.",
    helpText: "Mikor volt utoljára szerkesztve a kép",
  },
  {
    label: "Készítés dátuma:",
    value: "2026. 04. 12.",
    helpText: "Mikor készült a kép",
  },
  {
    label: "Helyszín:",
    value: "Budapest, HU",
    helpText: "Hol készült a kép",
  },
  {
    label: "Képfelbontás:",
    value: "1200x1200 (4:3)",
  },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>();
  const isLg = useBreakpointValue(
    { base: false, sm: false, md: false, lg: true, xl: true },
    { ssr: false },
  );

  const isXl = useBreakpointValue(
    { base: false, sm: false, md: false, lg: false, xl: true },
    { ssr: false },
  );

  return (
    <Grid
      templateColumns={isLg ? "80% 20%" : "100%"}
      h="full"
      w="full"
      minH={"0"}
    >
      <GridItem
        h="full"
        w={"full"}
        position={"relative"}
        maxH={"100vh"}
        scrollBehavior={"auto"}
        overflowY={"scroll"}
        scrollbarWidth={"3"}
      >
        <Box
          p={4}
          flex={1}
          css={{
            columnGap: "8px",
            base: { columnCount: 1 },
            sm: { columnCount: 2 },
            md: { columnCount: 3 },
          }}
        >
          {srces.map((src, index) => (
            <Box
              key={src + "-" + index}
              borderRadius="md"
              cursor="pointer"
              overflow="hidden"
              position={"relative"}
              onClick={() => setSelectedImage(index)}
              mb={"8px"}
            >
              <Image
                src={src}
                alt="Alt"
                w="100%"
                display="block"
                borderRadius="md"
              />
              {index === selectedImage && (
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  w="100%"
                  h="100%"
                  bgGradient="to-t"
                  gradientFrom="teal.400"
                  opacity={0.7}
                  gradientTo="transparent"
                  pointerEvents="none"
                />
              )}
            </Box>
          ))}
        </Box>

        <Center position={"sticky"} px={4} bottom={isLg ? 4 : 2} left={0}>
          <VStack w={"full"} alignItems={"end"} gap={isLg ? 2 : 1}>
            <Button
              aria-label="Filter"
              w={"fit"}
              p={2}
              variant={"surface"}
              rounded={"lg"}
              boxShadow={"xl"}
            >
              <LuFilter />
            </Button>
            <Box
              w={"full"}
              p={2}
              bg={"bg.panel"}
              rounded={"xl"}
              boxShadow={"xl"}
            >
              <Input
                placeholder="Keresés"
                size="md"
                variant={"subtle"}
                colorPalette={"teal"}
                rounded={"lg"}
                bg={"bg.emphasized"}
              />
            </Box>
          </VStack>
        </Center>
      </GridItem>
      {
        <GridItem>
          {typeof selectedImage === "number" && (
            <Flex
              flex={1}
              gap={isLg ? 6 : 4}
              p={4}
              flexDir={"column"}
              h={"full"}
              bg={"bg.panel"}
              justifyContent={"space-between"}
              alignItems={"start"}
            >
              <VStack justifyContent={"start"} alignItems={"start"} w={"full"}>
                {isLg && (
                  <Image
                    w={"full"}
                    h={"full"}
                    minHeight={"300px"}
                    maxH={"300px"}
                    objectFit={"cover"}
                    bg={"bg.emphasized"}
                    borderRadius={"xl"}
                    d="inline-block"
                    src={srces[selectedImage]}
                    alt={srces[selectedImage] + " kép"}
                  />
                )}
                <Box mt={isLg ? 3 : 1} w={"full"}>
                  <Text
                    fontWeight={"bold"}
                    w={"full"}
                    maxW={"full"}
                    fontSize={isLg ? "xl" : "md"}
                    lineClamp={1}
                  >
                    imgprew.png
                  </Text>
                </Box>
                <DataList.Root
                  w={"full"}
                  divideStyle={"dotted"}
                  divideY={"1px"}
                  divideColor={"fg.subtle"}
                  orientation={isXl ? "horizontal" : "vertical"}
                >
                  {stats.map((item) => (
                    <DataList.Item key={item.label} pt={isLg ? 4 : 1}>
                      <DataList.ItemLabel gap={0}>
                        {item.helpText && (
                          <ToggleTip
                            positioning={{
                              placement: "top-start",
                            }}
                            content={item.helpText}
                          >
                            <Text
                              userSelect={"none"}
                              display={"flex"}
                              gap={2}
                              fontSize={isLg ? "sm" : "smaller"}
                            >
                              {item.label} <LuInfo />
                            </Text>
                          </ToggleTip>
                        )}
                        {!item.helpText && (
                          <Text
                            userSelect={"none"}
                            display={"flex"}
                            gap={2}
                            fontSize={isLg ? "sm" : "smaller"}
                          >
                            {item.label}
                          </Text>
                        )}
                      </DataList.ItemLabel>
                      <DataList.ItemValue
                        userSelect={"all"}
                        justifyContent={isXl ? "end" : "start"}
                        fontSize={isLg ? "sm" : "sm"}
                      >
                        {item.value}
                      </DataList.ItemValue>
                    </DataList.Item>
                  ))}
                </DataList.Root>
              </VStack>
              <HStack w={"full"}>
                <Button flex={1} colorPalette={"teal"}>
                  Szerkesztés újra
                </Button>
                <IconButton
                  aria-label="Letöltés"
                  variant={"surface"}
                  colorPalette={"teal"}
                >
                  <LuDownload />
                </IconButton>
              </HStack>
            </Flex>
          )}
          {typeof selectedImage !== "number" && (
            <Center h={"full"}>
              <EmptyState.Root size="sm">
                <EmptyState.Content>
                  <EmptyState.Indicator>
                    {isLg && <LuMousePointer2 />}
                  </EmptyState.Indicator>
                  <VStack textAlign="center">
                    <EmptyState.Title>
                      Válassz ki valamit a galériádból
                    </EmptyState.Title>
                  </VStack>
                </EmptyState.Content>
              </EmptyState.Root>
            </Center>
          )}
        </GridItem>
      }
    </Grid>
  );
}
