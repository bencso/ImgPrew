"use client";

import dynamic from "next/dynamic";
import Loader from "@/components/loader";
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { LeftSide } from "@/components/sidebar/leftside";
import SideBar from "@/components/editing/sidebar";
import BottomBar from "@/components/editing/moreImagesBottomBar";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaFileExport } from "react-icons/fa";

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
      <Flex flex={1} w="full" h={"100vh"} minH={"0"} direction="column">
        <Flex
          px={isMd ? 6 : 0}
          h={"full"}
          w={"full"}
          flex={1}
          direction={isMd ? "row" : "column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box p={isMd ? 4 : 2} h={"full"} w={"full"}>
            {children}
          </Box>
          {selectedImage && isEditor && <SideBar />}
        </Flex>
        <BottomBar />
      </Flex>
    </Flex>
  );
}
