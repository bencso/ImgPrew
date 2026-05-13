//TODO: Kicsit jobban elszaparálni a kódokat (refaktorálás)
"use client";

import Loader from "@/components/loader";
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
  Tabs,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  LuCamera,
  LuDownload,
  LuInfo,
  LuLayoutDashboard,
  LuRows3,
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
  {
    date: "2026-04-10",
    imgs: [
      {
        id: 0,
        text: "Zsófi fotó",
        location: "Turkey",
        date: "2026-04-10",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/400/400?random=20",
      },
      {
        id: 1,
        text: "Dóri képe",
        location: "Germany",
        date: "2026-04-10",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/400/400?random=4",
      },
      {
        id: 2,
        text: "Erik városi fotó",
        location: "France",
        date: "2026-04-10",
        lastModified: "2026-04-26",
        resolution: "1920x1080",
        img: "https://picsum.photos/300/400?random=5",
      },
      {
        id: 4,
        text: "KisJakab képe",
        location: "Hungary",
        date: "2026-04-10",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/300/400?random=1",
      },
      {
        id: 3,
        text: "Anna portré",
        location: "Austria",
        lastModified: "2026-04-26",
        date: "2026-04-10",
        img: "https://picsum.photos/500/400?random=2",
      },
      {
        id: 5,
        text: "Juli fotó",
        location: "Spain",
        date: "2026-04-10",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/400/400?random=10",
      },
      {
        id: 6,
        text: "Kata képe",
        location: "Portugal",
        date: "2026-04-10",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/300/400?random=11",
      },
    ],
  },
  {
    date: "2026-04-06",
    imgs: [
      {
        id: 7,
        text: "KisJakab képe",
        location: "Hungary",
        date: "2026-04-06",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/300/400?random=1",
      },
      {
        id: 8,
        text: "Anna portré",
        location: "Austria",
        date: "2026-04-06",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/500/400?random=2",
        resolution: "1920x1080",
      },
      {
        id: 9,
        text: "Juli fotó",
        location: "Spain",
        date: "2026-04-06",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/400/400?random=10",
      },
      {
        id: 10,
        text: "Kata képe",
        location: "Portugal",
        date: "2026-04-06",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/300/400?random=11",
      },
    ],
  },
  {
    date: "2026-04-01",
    imgs: [
      {
        id: 11,
        text: "Juli fotó",
        location: "Spain",
        lastModified: "2026-04-26",
        date: "2026-04-01",
        img: "https://picsum.photos/400/400?random=10",
      },
      {
        id: 12,
        text: "Kata képe",
        location: "Portugal",
        lastModified: "2026-04-26",
        date: "2026-04-01",
        img: "https://picsum.photos/300/400?random=11",
        resolution: "1920x1080",
      },
    ],
  },
  {
    date: "2026-03-22",
    imgs: [
      {
        id: 13,
        text: "Nóri fotó",
        location: "Sweden",
        lastModified: "2026-04-26",
        date: "2026-03-22",
        img: "https://picsum.photos/500/600?random=14",
      },
      {
        id: 14,
        text: "Olivér képe",
        location: "Norway",
        lastModified: "2026-04-26",
        date: "2026-03-22",
        img: "https://picsum.photos/500/400?random=15",
      },
    ],
  },
  {
    date: "2026-03-01",
    imgs: [
      {
        id: 15,
        text: "Hédi képe",
        lastModified: "2026-04-26",
        location: "Poland",
        date: "2026-03-01",
        img: "https://picsum.photos/700/400?random=8",
      },
      {
        id: 16,
        text: "István portré",
        location: "Czech Republic",
        date: "2026-03-01",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/400/400?random=9",
      },
    ],
  },
  {
    date: "2026-02-18",
    imgs: [
      {
        id: 17,
        text: "Fanni portré",
        location: "Italy",
        date: "2026-02-18",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/300/400?random=6",
      },
      {
        id: 18,
        text: "Gábor túra",
        location: "Slovakia",
        date: "2026-02-18",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/500/400?random=7",
      },
    ],
  },
  {
    date: "2026-02-14",
    imgs: [
      {
        id: 19,
        text: "Sára képe",
        location: "Switzerland",
        date: "2026-02-14",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/300/400?random=18",
      },
      {
        id: 20,
        text: "Tamás portré",
        location: "Greece",
        date: "2026-02-14",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/400/400?random=19",
      },
    ],
  },
  {
    date: "2026-02-05",
    imgs: [
      {
        id: 21,
        text: "Laci portré",
        location: "Netherlands",
        date: "2026-02-05",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/300/400?random=12",
      },
      {
        id: 22,
        text: "Márk utazás",
        location: "Belgium",
        lastModified: "2026-04-26",
        date: "2026-02-05",
        img: "https://picsum.photos/400/400?random=13",
      },
    ],
  },
  {
    date: "2026-01-28",
    imgs: [
      {
        id: 23,
        text: "Petra portré",
        location: "Denmark",
        date: "2026-01-28",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/600/400?random=16",
        resolution: "1920x1080",
      },
      {
        id: 24,
        text: "Ricsi fotó",
        location: "Finland",
        date: "2026-01-28",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/500/400?random=17",
      },
      {
        id: 25,
        text: "Dóri képe",
        location: "Germany",
        date: "2026-01-15",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/400/400?random=4",
      },
      {
        id: 26,
        text: "Erik városi fotó",
        location: "France",
        date: "2026-01-15",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/300/400?random=5",
      },
    ],
  },
  {
    date: "2026-01-15",
    imgs: [
      {
        id: 27,
        text: "Dóri képe",
        location: "Germany",
        date: "2026-01-15",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/400/400?random=4",
      },
      {
        id: 28,
        text: "Erik városi fotó",
        location: "France",
        lastModified: "2026-04-26",
        date: "2026-01-15",
        img: "https://picsum.photos/300/400?random=5",
      },
    ],
  },
  {
    date: "2025-08-22",
    imgs: [
      {
        id: 29,
        text: "Balázs nyaralás",
        location: "Croatia",
        date: "2025-08-22",
        lastModified: "2026-04-26",
        img: "https://picsum.photos/500/400?random=3",
      },
    ],
  },
];

const stats = [
  {
    label: "Utoljára módosítva:",
    key: "lastModified",
    helpText: "Mikor volt utoljára szerkesztve a kép",
  },
  {
    label: "Készítés dátuma:",
    key: "date",
    helpText: "Mikor készült a kép",
  },
  {
    label: "Helyszín:",
    key: "location",
    helpText: "Hol készült a kép",
  },
  {
    label: "Képfelbontás:",
    key: "resolution",
  },
];

type ImageItem = {
  id: number;
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

interface FilterBarProps {
  galleryView: string;
  galleryViewSetter(type: string): void;
}

function BottomBar() {
  const isLg = useBreakpointValue(
    { base: false, sm: false, md: false, lg: true, xl: true },
    { ssr: false },
  );
  return (
    <Box
      px={isLg ? 8 : 4}
      position={"sticky"}
      bottom={isLg ? 8 : 4}
      left={0}
      alignSelf="flex-end"
      zIndex={10}
    >
      <Flex
        w="full"
        h="full"
        flexDir="column"
        justifyContent="space-between"
        alignItems="stretch"
        overflowY="auto"
      >
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
      </Flex>
    </Box>
  );
}
function FilterBar(props: FilterBarProps) {
  const isLg = useBreakpointValue(
    { base: false, sm: false, md: false, lg: true, xl: true },
    { ssr: false },
  );
  return (
    <Tabs.Root
      value={props.galleryView === "list" ? "list" : "default"}
      defaultValue="default"
      variant="subtle"
      position={"sticky"}
      w={"fit"}
      top={isLg ? 8 : 4}
      left={isLg ? 8 : 4}
      zIndex={10}
      colorPalette={"teal"}
      onValueChange={(e) => {
        const type =
          e.value === "default" || e.value === "list" ? e.value : "default";
        props.galleryViewSetter(type);
      }}
    >
      <Tabs.List
        bg="bg.muted"
        rounded="l3"
        p="1"
        w={"full"}
        display={"flex"}
        flexDir={"row"}
      >
        <Tabs.Trigger
          value="default"
          disabled={props.galleryView === "default"}
        >
          <LuLayoutDashboard size={20} />
        </Tabs.Trigger>
        <Tabs.Trigger disabled={props.galleryView === "list"} value="list">
          <LuRows3 size={20} />
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
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
  selectedId: number | null;
  onSelect: (id: number) => void;
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
            isSelected={selectedId === img.id}
            onClick={() => onSelect(img.id)}
          />
        );
      })}
    </Box>
  );
}

function ImageList({
  imgs,
  selectedId,
  onSelect,
}: {
  imgs: ImageItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const isLg = useBreakpointValue(
    { base: false, sm: false, md: false, lg: true, xl: true },
    { ssr: false },
  );

  return (
    <Box>
      {imgs.map((img, i) => {
        const id = img.img + i;

        return (
          <Grid
            key={id}
            py={2}
            px={2}
            borderBottom={"1px solid"}
            borderBlockColor={"teal"}
            templateColumns={isLg ? "repeat(3,1fr)" : "repeat(2,1fr)"}
            bg={selectedId === img.id ? "teal/30" : "bg"}
            onClick={() => onSelect(img.id)}
            _hover={{
              bg: selectedId === img.id ? "teal/80" : "teal.800",
            }}
          >
            <GridItem paddingEnd={isLg ? 8 : 4}>
              <Text fontSize={"md"} lineClamp={1}>
                {img.text || "Ismeretlen"}
              </Text>
            </GridItem>
            {isLg && (
              <GridItem paddingEnd={isLg ? 8 : 4}>
                <Text fontSize={"md"} lineClamp={1}>
                  {moment(img.date).fromNow() || "Ismeretlen"}
                </Text>
              </GridItem>
            )}
            <GridItem paddingEnd={isLg ? 0 : 4}>
              <Text textAlign={"right"} lineClamp={1} fontSize={"md"}>
                {img.location || "Ismeretlen"}
              </Text>
            </GridItem>
          </Grid>
        );
      })}
    </Box>
  );
}

function SelectedItemCol({ selectedId }: { selectedId: number | null }) {
  const selectedImg = srces
    .flatMap((item) => item.imgs)
    .find((itemImg) => itemImg.id === selectedId);

  if (!selectedImg) return null;

  const isLg = useBreakpointValue(
    { base: false, sm: false, md: false, lg: true, xl: true },
    { ssr: false },
  );

  const isXl = useBreakpointValue(
    { base: false, sm: false, md: false, lg: false, xl: true },
    { ssr: false },
  );
  return (
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
            src={selectedImg.img}
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
            {selectedImg.text}
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
                {Object.keys(selectedImg).includes(
                  typeof item.key === "string" ? item.key : "location",
                )
                  ? Object(selectedImg)[item.key]
                  : "Ismeretlen"}
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
  );
}

export default function Gallery() {
  // const [images, setImages] = useState<ImageGroup[]>([]);
  const [selectedId, setSelectedId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);
  const [galleryView, setGalleryView] = useState<string>("default");

  const isLg = useBreakpointValue({
    base: false,
    sm: false,
    md: false,
    lg: true,
    xl: true,
  });

  useEffect(() => {
    const stored = localStorage.getItem("galleryView");
    if (stored) setGalleryView(JSON.parse(stored));
    else galleryViewSetter("default");

    setLoading(false);
  }, []);

  function galleryViewSetter(type: string) {
    setGalleryView(type);
    localStorage.setItem("galleryView", JSON.stringify(type));
  }

  if (!srces.length) {
    return (
      <Center h="full">
        <EmptyGallery />
      </Center>
    );
  }

  if (loading) {
    return (
      <Center h="full">
        <Loader />
      </Center>
    );
  }

  moment.locale("hu");

  return (
    <>
      <Grid
        templateColumns={{ base: "1fr", lg: typeof selectedId !== "undefined" ?  "4fr 1fr" : "1fr" }}
        h="full"
        userSelect={"none"}
      >
        <GridItem overflowY="auto">
          <FilterBar
            galleryView={galleryView}
            galleryViewSetter={galleryViewSetter}
          />
          {galleryView === "default"
            ? srces.map((group) => (
                <Box key={group.date} p={isLg ? 8 : 4}>
                  <DateHeader date={group.date} />

                  <ImageGrid
                    imgs={group.imgs}
                    selectedId={selectedId ?? null}
                    onSelect={setSelectedId}
                  />
                </Box>
              ))
            : srces.map((group) => (
                <Box key={group.date} p={8}>
                  <DateHeader date={group.date} />
                  <ImageList
                    imgs={group.imgs}
                    selectedId={selectedId ?? null}
                    onSelect={setSelectedId}
                  />
                </Box>
              ))}
          <BottomBar />
        </GridItem>

        { typeof selectedId !== "undefined" && (
          <GridItem>
            <SelectedItemCol selectedId={selectedId ?? null} />
          </GridItem>
        )}
      </Grid>
    </>
  );
}
