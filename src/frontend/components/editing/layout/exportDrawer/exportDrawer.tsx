import {
  Drawer,
  Box,
  Button,
  Portal,
  RadioCard,
  HStack,
  Flex,
  Text,
} from "@chakra-ui/react";
import { FaFileExport, FaFileImage } from "react-icons/fa";
import { LuX, LuFileBox } from "react-icons/lu";
import { ExportExifBlock } from "./exportExifBlock";
import { ExportImageBlock } from "./exportImageSelect";
import { useState } from "react";
import { useWorkSession } from "@/providers/sessionprovider";
import { ExportFileExtension } from "./exportFileExtension";

export default function ExportDrawer() {
  const { selectedImg } = useWorkSession();
  const [selected, setSelected] = useState<number>(selectedImg);

  return (
    <Drawer.Root size={"lg"}>
      <Box p={2}>
        {
          //#region Exportálás gomb
        }
        <Drawer.Trigger asChild>
          <Button
            w="80px"
            h="80px"
            variant={"surface"}
            rounded={"xl"}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            colorPalette={"teal"}
          >
            <FaFileExport size={"16"} />
            <Text fontSize="xx-small" textAlign={"center"} mt={0} w={"full"}>
              Exportálás
            </Text>
          </Button>
        </Drawer.Trigger>
      </Box>
      {
        //#endregion
      }
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            {
              //#region Drawer Header
            }
            <Drawer.Header>
              <Drawer.Title>Exportálás</Drawer.Title>
            </Drawer.Header>
            {
              //#region Drawer Body
            }
            <Drawer.Body w={"full"} gap={12} display={"flex"} flexDir={"column"}>
              <ExportImageBlock selected={selected} setSelected={setSelected} />
              <ExportExifBlock selected={selected} setSelected={setSelected} />
              <ExportFileExtension/>
            </Drawer.Body>
            {
              //#region Drawer Footer
            }
            <Drawer.Footer>
              <Flex flexDirection={"row"} w={"full"} gap={4}>
                <Button
                  colorPalette={"teal"}
                  variant={"subtle"}
                  w={"full"}
                  flex={1}
                >
                  <FaFileImage size={"12"} />
                  Kép exportálása
                </Button>
                <Button colorPalette={"teal"} w={"full"} flex={1}>
                  <LuFileBox size={"12"} />
                  Összes exportálása
                </Button>
              </Flex>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
