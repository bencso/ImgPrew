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
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";

import { useState } from "react";
import { LuCamera, LuDownload, LuInfo } from "react-icons/lu";

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
    diff: 12,
    helpText: "Mikor volt utoljára szerkesztve a kép",
  },
  {
    label: "Készítés dátuma:",
    value: "2026. 04. 12.",
    diff: 12,
    helpText: "Mikor készült a kép",
  },
  {
    label: "Helyszín:",
    value: "Budapest, HU",
    diff: 4.5,
    helpText: "Hol készült a kép",
  },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>();
  const isMd = useBreakpointValue(
    { base: false, sm: false, md: false, lg: true, xl: true },
    { ssr: false },
  );

  return (
    <Grid
      templateColumns={typeof selectedImage === "number" ? "80% 20%" : "100%"}
      h="full"
      w="full"
      minH={"0"}
    >
      <GridItem
        h="full"
        w={"full"}
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
            mdDown: { columnCount: 0 },
            md: { columnCount: 1 },
            lgDown: { columnCount: 2 },
            lg: { columnCount: 2 },
            xl: { columnCount: 3 },
            xlTo2xl: { columnCount: 3 },
          }}
        >
          {srces.map((src, index) => (
            <Image
              key={src + "-" + index}
              src={src}
              alt="Alt"
              w="100%"
              mb="8px"
              borderRadius="md"
              display="block"
              cursor="pointer"
              onClick={() => {
                setSelectedImage(index);
              }}
            />
          ))}
        </Box>
      </GridItem>
      {typeof selectedImage === "number" && (
        <GridItem>
          <Flex
            flex={1}
            gap={6}
            p={4}
            flexDir={"column"}
            h={"full"}
            bg={"bg.muted"}
            justifyContent={"space-between"}
            alignItems={"start"}
          >
            <VStack justifyContent={"start"} alignItems={"start"} w={"full"}>
              <Image
                w={"full"}
                minH={0}
                h={"full"}
                maxH={"300px"}
                objectFit={"fill"}
                bg={"bg.emphasized"}
                borderRadius={"xl"}
                d="inline-block"
                src={srces[selectedImage]}
                alt={srces[selectedImage] + " kép"}
              />
              <Box mt={3}>
                <Text fontWeight={"bold"}>imgprew.png</Text>
              </Box>
              <DataList.Root
                w={"full"}
                divideStyle={"dotted"}
                divideY={"1px"}
                divideColor={"fg.subtle"}
                orientation="horizontal"
              >
                {stats.map((item) => (
                  <DataList.Item key={item.label} pt={4}>
                    <DataList.ItemLabel gap={0}>
                      {item.label}{" "}
                      <ToggleTip content={item.helpText}>
                        <Button size="xs" variant="ghost">
                          <LuInfo />
                        </Button>
                      </ToggleTip>
                    </DataList.ItemLabel>
                    <DataList.ItemValue justifyContent={"end"}>
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
        </GridItem>
      )}
    </Grid>
  );
}
