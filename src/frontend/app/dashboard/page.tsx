"use client";

import keyboardShortcuts from "@/components/editing/keyboardShortCuts";
import BottomBar from "@/components/editing/moreImagesBottomBar";
import SideBar from "@/components/editing/sidebar";
import TopBar from "@/components/editing/topBar";
import { ImageDropZone } from "@/components/upload/dropzone";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ImageWorkPlace = dynamic(
  () => import("@/components/editing/imageWorkPlace"),
  { ssr: false },
);

export default function Page() {
  //#region contextek
  const { step, setStep, setSelectedImg, selectedImg } = useWorkSession();
  const { sessionData } = useSessionStore();
  const [selectedImage, setSelectedImage] = useState<string>();

  keyboardShortcuts({
    selectedImg,
    setSelectedImage,
    setSelectedImg,
    sessionData,
    setStep,
    step,
  });

  //#region breakPoint beállíátoks (isMd)
  const isMd = useBreakpointValue(
    { base: false, sm: false, md: false, lg: true, xl: true },
    { fallback: "md" },
  );
  //#endregion

  useEffect(() => {
    if (sessionData.length > 0) setSelectedImage(sessionData[selectedImg].blob);
  }, [selectedImg, sessionData]);

  if (step === 0) return <ImageDropZone />;
  if (step === 1)
    return (
      <Flex
        direction={!isMd ? "column" : "row"}
        h="full"
        w="full"
        minW="0"
        minH={"0"}
        flex="1"
      >
        <Flex h="full" w="full" minW="0" minH={"0"} flex="1" direction="column">
          <TopBar setSelectedImage={setSelectedImage} />
          <Box flex="1" minH="0" h={"full"} w={"full"} minW={0} p={4}>
            {selectedImage && <ImageWorkPlace />}
          </Box>
          <BottomBar />
        </Flex>

        <Flex
          w={isMd ? "fit" : "full"}
          h={!isMd ? "fit" : "full"}
          minH="0"
          minW="0"
          flexShrink={0}
          direction={isMd ? "column" : "row"}
          borderLeftWidth={isMd ? "1px" : 0}
          borderColor="border.disabled"
        >
          <SideBar />
        </Flex>
      </Flex>
    );
}
