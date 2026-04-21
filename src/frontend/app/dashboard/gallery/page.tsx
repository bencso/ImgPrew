import { Center, EmptyState, Flex, VStack } from "@chakra-ui/react";
import { LuCamera } from "react-icons/lu";

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

export default function Gallery() {
  return (
    <Flex
      direction={"column"}
      h="full"
      w="full"
      minW="0"
      minH={"0"}
      flex="1"
      p={8}
    >
      {" "}
      <EmptyGallery />
    </Flex>
  );
}
