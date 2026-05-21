"use client";

import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  Box,
  Flex,
  Image,
  ScrollArea,
  useBreakpointValue,
} from "@chakra-ui/react";

export default function ImagesSide() {
  const { setSelectedImg, selectedImg, isLoading } = useWorkSession();
  const { sessionData } = useSessionStore();

  //#region breakPoint beállíátoks (isMd)
  const isMd = useBreakpointValue(
    { base: false, sm: false, md: false, lg: true, xl: true },
    { fallback: "md" },
  );
  //#endregion

  return (
    sessionData.length > 1 &&
    !isLoading && (
      <Flex
        maxH={!isMd ? "100px" : "full"}
        w={isMd ? "fit" : "full"}
        h={"full"}
        my={isMd ? 0 : 2}
        gap={2}
>
        <ScrollArea.Root
        >
          <ScrollArea.Viewport h={"full"} justifyContent={"center"}
              alignItems={"center"}
              >
            <ScrollArea.Content
              display={"flex"}
              flexDir={isMd ? "column" : "row"}
              w={isMd ? "fit" : "full"}
              justifyContent={"center"}
              alignItems={"center"}
              
            >
              {Array.from(sessionData, (img, index) => (
                <Box
                  key={index}
                  aspectRatio={1}
                  borderRadius="l3"
                  overflow={"hidden"}
                  cursor="pointer"
                  opacity={selectedImg === img.id ? 1 : 0.4}
                  transition="opacity 0.2s"
                  _hover={{ opacity: 0.8 }}
                  onClick={() => setSelectedImg(index)}
                  backgroundColor={"bg.emphasized"}
                  mb={isMd ? 3 : 0}
                  ms={!isMd ? 3 : 0}
                  w={"100px"}
                  h={"100px"}
                >
                  <Image
                    src={img.blob}
                    alt={`thumbnail-${index}`}
                    h={"full"}
                    w={"full"}
                    objectFit="cover"
                    bg="bg.muted"
                  />
                </Box>
              ))}
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Corner />
        </ScrollArea.Root>
      </Flex>
    )
  );
}
