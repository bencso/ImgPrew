import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  Box,
  Flex,
  Kbd,
  Separator,
  Image,
  useBreakpointValue,
  ScrollArea,
} from "@chakra-ui/react";

export default function BottomBar() {
  const { step, setSelectedImg, selectedImg } = useWorkSession();
  const { sessionData } = useSessionStore();

  //#region breakPoint beállíátoks (isMd)
  const isMd = useBreakpointValue(
    { base: false, sm: false, md: false, lg: true, xl: true },
    { ssr: false, fallback: "md" },
  );
  //#endregion

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
        gap={4}
        flexDir={"column"}
      >
        {sessionData.length > 1 && (
          <Flex
            gap={4}
            px={4}
            py={4}
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
        )}
      </Flex>
    )
  );
}
