"use client";

import dynamic from "next/dynamic";
import Loader from "@/components/loader";
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { LeftSide } from "@/components/sidebar/leftside";
import SideBar from "@/components/editing/sidebar";
import BottomBar from "@/components/editing/moreImagesBottomBar";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { selectedImg } = useWorkSession();
  const { sessionData } = useSessionStore();
  const [selectedImage, setSelectedImage] = useState<string>();
  const path = usePathname();
  console.log(path);
  const isEditor = path === "/dashboard";

  //#region breakPoint beállíátoks (isMd)
  const isMd = useBreakpointValue(
    { base: false, sm: false, md: false, lg: true, xl: true },
    { fallback: "md" },
  );
  //#endregion

  useEffect(() => {
    if (sessionData.length > 0) setSelectedImage(sessionData[selectedImg].blob);
  }, [selectedImg, sessionData]);

  return (
    <Flex h={"100vh"} direction={isMd ? "row" : "column"} w={"full"}>
      <LeftSide />
      <Flex h="full" w="full" minW="0" minH={"0"} flex="1" direction="column">
        <Box p={4} h={"full"} w={"full"}>
          {children}
        </Box>
        <BottomBar />
      </Flex>
      {(selectedImage &&
        isEditor) && (
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
        )}
    </Flex>
  );
}
