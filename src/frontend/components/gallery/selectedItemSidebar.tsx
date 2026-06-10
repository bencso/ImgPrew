import { Box, Button, DataList, Flex, HStack, IconButton, Image, Text, VStack } from "@chakra-ui/react";
import { useBreakpointValue } from "@chakra-ui/react/hooks";
import { ToggleTip } from "../ui/toggle-tip";
import { LuDownload, LuInfo } from "react-icons/lu";
import { srces } from "@/interfaces/gallery.interface";

const stats = [
  {
    label: "Utoljára módosítva:",
    key: "lastModified",
    helpText: "Mikor volt utoljára szerkesztve a kép",
  },
  {
    label: "Készítés dátuma:",
    key: "date",
    helpText: "Mikor készült a kép",
  },
  {
    label: "Helyszín:",
    key: "location",
    helpText: "Hol készült a kép",
  },
  {
    label: "Képfelbontás:",
    key: "resolution",
  },
];


export function SelectedItemSidebar({ selectedId }: { selectedId: number | null }) {
  const selectedImg = srces
    .flatMap((item) => item.imgs)
    .find((itemImg) => itemImg.id === selectedId);

  if (!selectedImg) return null;

  const isLg = useBreakpointValue(
    { base: false, sm: false, md: false, lg: true, xl: true },
    { ssr: false },
  );

  const isXl = useBreakpointValue(
    { base: false, sm: false, md: false, lg: false, xl: true },
    { ssr: false },
  );
  return (
    <Flex
      flex={1}
      gap={isLg ? 6 : 4}
      p={4}
      flexDir={"column"}
      h={"full"}
      bg={"bg.panel"}
      justifyContent={"space-between"}
      alignItems={"start"}
    >
      <VStack justifyContent={"start"} alignItems={"start"} w={"full"}>
        {isLg && (
          <Image
            w={"full"}
            h={"full"}
            src={selectedImg.img}
            minHeight={"300px"}
            maxH={"300px"}
            objectFit={"cover"}
            bg={"bg.emphasized"}
            borderRadius={"xl"}
            d="inline-block"
          />
        )}
        <Box mt={isLg ? 3 : 1} w={"full"}>
          <Text
            fontWeight={"bold"}
            w={"full"}
            maxW={"full"}
            fontSize={isLg ? "xl" : "md"}
            lineClamp={1}
          >
            {selectedImg.text}
          </Text>
        </Box>
        <DataList.Root
          w={"full"}
          divideStyle={"dotted"}
          divideY={"1px"}
          divideColor={"fg.subtle"}
          orientation={isXl ? "horizontal" : "vertical"}
        >
          {stats.map((item) => (
            <DataList.Item key={item.label} pt={isLg ? 4 : 1}>
              <DataList.ItemLabel gap={0}>
                {item.helpText && (
                  <ToggleTip
                    positioning={{
                      placement: "top-start",
                    }}
                    content={item.helpText}
                  >
                    <Text
                      userSelect={"none"}
                      display={"flex"}
                      gap={2}
                      fontSize={isLg ? "sm" : "smaller"}
                    >
                      {item.label} <LuInfo />
                    </Text>
                  </ToggleTip>
                )}
                {!item.helpText && (
                  <Text
                    userSelect={"none"}
                    display={"flex"}
                    gap={2}
                    fontSize={isLg ? "sm" : "smaller"}
                  >
                    {item.label}
                  </Text>
                )}
              </DataList.ItemLabel>
              <DataList.ItemValue
                userSelect={"all"}
                justifyContent={isXl ? "end" : "start"}
                fontSize={isLg ? "sm" : "sm"}
              >
                {Object.keys(selectedImg).includes(
                  typeof item.key === "string" ? item.key : "location",
                )
                  ? Object(selectedImg)[item.key]
                  : "Ismeretlen"}
              </DataList.ItemValue>
            </DataList.Item>
          ))}
        </DataList.Root>
      </VStack>
      <HStack w={"full"}>
        <Button flex={1} colorPalette={"teal"}>
          Szerkesztés újra
        </Button>
        <IconButton
          aria-label="Letöltés"
          variant={"surface"}
          colorPalette={"teal"}
        >
          <LuDownload />
        </IconButton>
      </HStack>
    </Flex>
  );
}