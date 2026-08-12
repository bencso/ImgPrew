"use client";

import keyboardShortcuts from "@/handlers/shortcuts/keyboardShortcuts";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { useBreakpointValue } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import SideBar from "@/components/editing/layout/sidebar";
import { LeftSide } from "@/components/sidebar/leftside";
import ImagesSide from "@/components/editing/layout/imagesSide";

const UploadImageBlock = dynamic(
  () => import("@/components/upload/uploadImageBlock"),
  { ssr: false },
);

const ImageWorkPlace = dynamic(
  () => import("@/components/editing/imageWorkPlace"),
  { ssr: false },
);

export default function Page() {
  //#region contextek
  const { step, setStep, setSelectedImg, selectedImg, appRef } =
    useWorkSession();
  const { sessionData, setHaldImage } = useSessionStore();
  const [selectedImage, setSelectedImage] = useState<string>();

  const path = usePathname();
  const isEditor = path === "/";

  //#region breakPoint beállíátoks (isMd)
  const isMd = useBreakpointValue(
    { base: false, sm: false, md: false, lg: true, xl: true },
    { fallback: "md" },
  );
  //#endregion

  keyboardShortcuts({
    selectedImg,
    setSelectedImage,
    setSelectedImg,
    setStep,
    step,
    setHaldImage,
    appRef,
  });

  useEffect(() => {
    if (sessionData.length > 0) setSelectedImage(sessionData[selectedImg].blob);
  }, [selectedImg, sessionData]);


  return (
    <Flex h={"100vh"} direction={isMd ? "row" : "column"} w={"full"}>
      <LeftSide />
      <Flex flex={1} w="full" h={"100vh"} minH={"0"} direction="column">
        <Flex
          px={isMd ? 3 : 0}
          h={"full"}
          w={"full"}
          flex={1}
          bg={"bg.muted/30"}
          direction={isMd ? "row" : "column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {sessionData.length > 0 && isEditor && <ImagesSide />}
          <Box h={"full"} w={"full"} p={4} boxSizing={"border-box"}>
            {step === 0 && <UploadImageBlock />}
            {step === 1 && selectedImage && <ImageWorkPlace />}
          </Box>
          {sessionData.length > 0 && isEditor && <SideBar />}
        </Flex>
      </Flex>
    </Flex>
  );
}
