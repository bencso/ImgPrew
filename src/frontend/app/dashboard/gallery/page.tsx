//TODO: Kicsit jobban elszaparálni a kódokat (refaktorálás)
"use client";

import { ImageGrid } from "@/components/gallery/views/imageGrid";
import { SelectedItemSidebar } from "@/components/gallery/selectedItemSidebar";
import Loader from "@/components/loader";
import {
  FilterBarProps,
  ImageItem,
  srces,
} from "@/interfaces/gallery.interface";
import {
  Box,
  Center,
  EmptyState,
  Flex,
  Grid,
  GridItem,
  Input,
  Tabs,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { LuCamera, LuLayoutDashboard, LuRows3 } from "react-icons/lu";
import { ImageList } from "@/components/gallery/views/imageList";
import { BottomBar } from "@/components/gallery/bottomBar";

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

function DateHeader({ date }: { date: string }) {
  return (
    <Text fontWeight="bold" fontSize="xl" my={5}>
      {moment(date).calendar()}
    </Text>
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
        templateColumns={{
          base: "1fr",
          lg: typeof selectedId !== "undefined" ? "4fr 1fr" : "1fr",
        }}
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

        {typeof selectedId !== "undefined" && (
          <GridItem>
            <SelectedItemSidebar selectedId={selectedId ?? null} />
          </GridItem>
        )}
      </Grid>
    </>
  );
}
