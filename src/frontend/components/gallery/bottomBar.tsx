import { Box, Flex, Input, useBreakpointValue } from "@chakra-ui/react";

export function BottomBar() {
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