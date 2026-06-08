"use client";

import { Box, Flex, Skeleton, useBreakpointValue } from "@chakra-ui/react";
import SideBar from "@/components/editing/layout/sidebar";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { usePathname } from "next/navigation";
import { LeftSide } from "@/components/sidebar/leftside";
import ImagesSide from "@/components/editing/layout/imagesSide";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { selectedImg, isLoading } = useWorkSession();
  const { sessionData } = useSessionStore();
  const path = usePathname();
  const isEditor = path === "/dashboard";

  //#region breakPoint beállíátoks (isMd)
  const isMd = useBreakpointValue(
    { base: false, sm: false, md: false, lg: true, xl: true },
    { fallback: "md" },
  );
  //#endregion

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
          {sessionData.length > 0 && isEditor && (
            
              <ImagesSide />
            
          )}
          <Box h={"full"} w={"full"} p={4} boxSizing={"border-box"}>
            {children}
          </Box>
          {sessionData.length > 0 && isEditor && (
              <SideBar />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
