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
import moment from "moment";
import { useState } from "react";
import { LuCamera, LuDownload, LuFilter, LuInfo } from "react-icons/lu";

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
  {
    date: "2026-04-10",
    imgs: [
      {
        text: "Zsófi fotó",
        location: "Turkey",
        date: "2026-04-10",
        img: "https://picsum.photos/400/400?random=20",
      },
      {
        text: "Dóri képe",
        location: "Germany",
        date: "2026-01-15",
        img: "https://picsum.photos/400/400?random=4",
      },
      {
        text: "Erik városi fotó",
        location: "France",
        date: "2026-01-15",
        img: "https://picsum.photos/300/400?random=5",
      },
      {
        text: "KisJakab képe",
        location: "Hungary",
        date: "2026-04-06",
        img: "https://picsum.photos/300/400?random=1",
      },
      {
        text: "Anna portré",
        location: "Austria",
        date: "2026-04-06",
        img: "https://picsum.photos/500/400?random=2",
      },
      {
        text: "Juli fotó",
        location: "Spain",
        date: "2026-04-01",
        img: "https://picsum.photos/400/400?random=10",
      },
      {
        text: "Kata képe",
        location: "Portugal",
        date: "2026-04-01",
        img: "https://picsum.photos/300/400?random=11",
      },
    ],
  },
  {
    date: "2026-04-06",
    imgs: [
      {
        text: "KisJakab képe",
        location: "Hungary",
        date: "2026-04-06",
        img: "https://picsum.photos/300/400?random=1",
      },
      {
        text: "Anna portré",
        location: "Austria",
        date: "2026-04-06",
        img: "https://picsum.photos/500/400?random=2",
      },
      {
        text: "Juli fotó",
        location: "Spain",
        date: "2026-04-01",
        img: "https://picsum.photos/400/400?random=10",
      },
      {
        text: "Kata képe",
        location: "Portugal",
        date: "2026-04-01",
        img: "https://picsum.photos/300/400?random=11",
      },
    ],
  },
  {
    date: "2026-04-01",
    imgs: [
      {
        text: "Juli fotó",
        location: "Spain",
        date: "2026-04-01",
        img: "https://picsum.photos/400/400?random=10",
      },
      {
        text: "Kata képe",
        location: "Portugal",
        date: "2026-04-01",
        img: "https://picsum.photos/300/400?random=11",
      },
    ],
  },
  {
    date: "2026-03-22",
    imgs: [
      {
        text: "Nóri fotó",
        location: "Sweden",
        date: "2026-03-22",
        img: "https://picsum.photos/500/600?random=14",
      },
      {
        text: "Olivér képe",
        location: "Norway",
        date: "2026-03-22",
        img: "https://picsum.photos/500/400?random=15",
      },
    ],
  },
  {
    date: "2026-03-01",
    imgs: [
      {
        text: "Hédi képe",
        location: "Poland",
        date: "2026-03-01",
        img: "https://picsum.photos/700/400?random=8",
      },
      {
        text: "István portré",
        location: "Czech Republic",
        date: "2026-03-01",
        img: "https://picsum.photos/400/400?random=9",
      },
    ],
  },
  {
    date: "2026-02-18",
    imgs: [
      {
        text: "Fanni portré",
        location: "Italy",
        date: "2026-02-18",
        img: "https://picsum.photos/300/400?random=6",
      },
      {
        text: "Gábor túra",
        location: "Slovakia",
        date: "2026-02-18",
        img: "https://picsum.photos/500/400?random=7",
      },
    ],
  },
  {
    date: "2026-02-14",
    imgs: [
      {
        text: "Sára képe",
        location: "Switzerland",
        date: "2026-02-14",
        img: "https://picsum.photos/300/400?random=18",
      },
      {
        text: "Tamás portré",
        location: "Greece",
        date: "2026-02-14",
        img: "https://picsum.photos/400/400?random=19",
      },
    ],
  },
  {
    date: "2026-02-05",
    imgs: [
      {
        text: "Laci portré",
        location: "Netherlands",
        date: "2026-02-05",
        img: "https://picsum.photos/300/400?random=12",
      },
      {
        text: "Márk utazás",
        location: "Belgium",
        date: "2026-02-05",
        img: "https://picsum.photos/400/400?random=13",
      },
    ],
  },
  {
    date: "2026-01-28",
    imgs: [
      {
        text: "Petra portré",
        location: "Denmark",
        date: "2026-01-28",
        img: "https://picsum.photos/600/400?random=16",
      },
      {
        text: "Ricsi fotó",
        location: "Finland",
        date: "2026-01-28",
        img: "https://picsum.photos/500/400?random=17",
      },
      {
        text: "Dóri képe",
        location: "Germany",
        date: "2026-01-15",
        img: "https://picsum.photos/400/400?random=4",
      },
      {
        text: "Erik városi fotó",
        location: "France",
        date: "2026-01-15",
        img: "https://picsum.photos/300/400?random=5",
      },
    ],
  },
  {
    date: "2026-01-15",
    imgs: [
      {
        text: "Dóri képe",
        location: "Germany",
        date: "2026-01-15",
        img: "https://picsum.photos/400/400?random=4",
      },
      {
        text: "Erik városi fotó",
        location: "France",
        date: "2026-01-15",
        img: "https://picsum.photos/300/400?random=5",
      },
    ],
  },
  {
    date: "2025-08-22",
    imgs: [
      {
        text: "Balázs nyaralás",
        location: "Croatia",
        date: "2025-08-22",
        img: "https://picsum.photos/500/400?random=3",
      },
    ],
  },
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

type ImageItem = {
  text: string;
  location: string;
  date: string;
  img: string;
};

type ImageGroup = {
  date: string;
  imgs: ImageItem[];
};

function DateHeader({ date }: { date: string }) {
  return (
    <Text fontWeight="bold" fontSize="xl" my={5}>
      {moment(date).calendar()}
    </Text>
  );
}

function BottomBar() {
  const isLg = useBreakpointValue(
    { base: false, sm: false, md: false, lg: true, xl: true },
    { ssr: false },
  );
  return (
    <Center position={"sticky"} bottom={isLg ? 4 : 2} left={0} px={8}>
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
        <Box w={"full"} p={2} bg={"bg.panel"} rounded={"xl"} boxShadow={"xl"}>
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
  );
}

function ImageCard({
  img,
  isSelected,
  onClick,
}: {
  img: ImageItem;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      borderRadius="md"
      cursor="pointer"
      overflow="hidden"
      position="relative"
      userSelect={"none"}
      onClick={onClick}
      mb="8px"
    >
      <Image src={img.img} alt={img.text} w="100%" borderRadius="md" />
      {isSelected && (
        <Box
          position="absolute"
          inset={0}
          bgGradient="to-t"
          gradientFrom="teal.400"
          opacity={0.7}
          gradientTo="transparent"
        />
      )}
    </Box>
  );
}

function ImageGrid({
  imgs,
  selectedId,
  onSelect,
}: {
  imgs: ImageItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <Box
      css={{
        columnGap: "8px",
        columnCount: { base: 1, sm: 2, md: 3 },
      }}
    >
      {imgs.map((img, i) => {
        const id = img.img + i;

        return (
          <ImageCard
            key={id}
            img={img}
            isSelected={selectedId === id}
            onClick={() => onSelect(id)}
          />
        );
      })}
    </Box>
  );
}

export default function Gallery() {
  const [images, setImages] = useState<ImageGroup[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const isLg = useBreakpointValue(
    { base: false, sm: false, md: false, lg: true, xl: true },
    { ssr: false },
  );

  const isXl = useBreakpointValue(
    { base: false, sm: false, md: false, lg: false, xl: true },
    { ssr: false },
  );

  if (!srces.length) {
    return (
      <Center h="full">
        <EmptyGallery />
      </Center>
    );
  }

  return (
    <>
      <Grid
        templateColumns={{ base: "1fr", lg: "4fr 1fr" }}
        h="full"
        userSelect={"none"}
      >
        <GridItem overflowY="auto">
          {srces.map((group) => (
            <Box key={group.date} p={8}>
              <DateHeader date={group.date} />

              <ImageGrid
                imgs={group.imgs}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </Box>
          ))}
          <BottomBar />
        </GridItem>

        <GridItem>
          {selectedId && (
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
        </GridItem>
      </Grid>
    </>
  );
}
