"use client";

import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box, Flex, Image, ScrollArea } from "@chakra-ui/react";

export default function BottomBar() {
  const { setSelectedImg, selectedImg } = useWorkSession();
  const { sessionData } = useSessionStore();

  return (
    sessionData.length > 1 && (
      <Flex
        borderTop={"1px solid"}
        bg={"bg.subtle"}
        borderColor={"bg.muted"}
        w={"full"}
        h={"fit"}
        justifyContent="center"
        alignItems={"center"}
        gap={2}
        flexDir={"column"}
      >
        <Flex
          gap={2}
          px={3}
          py={3}
          boxSizing={"border-box"}
          overflowX="auto"
          justifyContent={"center"}
          overflowY="hidden"          
        >
          <ScrollArea.Root width="full" size="xs">
            <ScrollArea.Viewport>
              <ScrollArea.Content py="4">
                <Flex gap="4" flexWrap="nowrap">
                  {Array.from(sessionData, (img, index) => (
                    <Box
                      key={index}
                      flex="0 0 100px"
                      aspectRatio={1}
                      borderRadius="md"
                      overflow="hidden"
                      cursor="pointer"
                      opacity={selectedImg === img.id ? 1 : 0.4}
                      transition="opacity 0.2s"
                      _hover={{ opacity: 0.8 }}
                      onClick={() => setSelectedImg(index)}
                      backgroundColor={"bg.emphasized"}
                    >
                      <Image
                        src={img.blob}
                        alt={`thumbnail-${index}`}
                        w="full"
                        h="full"
                        objectFit="cover"
                        bg="bg.muted"
                      />
                    </Box>
                  ))}
                </Flex>
              </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Corner />
          </ScrollArea.Root>
        </Flex>
      </Flex>
    )
  );
}
