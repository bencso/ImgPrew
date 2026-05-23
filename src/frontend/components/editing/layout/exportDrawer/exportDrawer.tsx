import { Drawer, Box, Button, Portal, Flex, Text } from "@chakra-ui/react";
import { FaFileExport, FaFileImage } from "react-icons/fa";
import { LuFileBox } from "react-icons/lu";
import { ExportExifBlock } from "./exportExifBlock";
import { ExportImageBlock } from "./exportImageSelect";
import { useState } from "react";
import { ExportFileExtension } from "./exportFileExtension";
import { useSessionStore } from "@/stores/sessionData";
import { useWorkSession } from "@/providers/sessionprovider";

export default function ExportDrawer() {
  const [selected, setSelected] = useState<number>(-1);
  const { exportImageSettings, exportAllImageSettings } = useSessionStore();
  const { appRef } = useWorkSession();
  const haldSprite = useSessionStore((s) =>
    s.sessionData.find((i) => i.id === selected),
  )?.haldSprite;

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
            <Drawer.Body
              w={"full"}
              gap={12}
              display={"flex"}
              flexDir={"column"}
            >
              <ExportImageBlock selected={selected} setSelected={setSelected} />
              {selected !== -1 && (
                <ExportExifBlock
                  selected={selected}
                  setSelected={setSelected}
                />
              )}
              <ExportFileExtension
                selected={selected}
                setSelected={setSelected}
              />
            </Drawer.Body>
            {
              //#region Drawer Footer
            }
            <Drawer.Footer>
              <Flex flexDirection={"row"} w={"full"} gap={4}>
                {selected !== -1 && (
                  <Button
                    colorPalette={"teal"}
                    w={"full"}
                    flex={1}
                    onClick={() => {
                      console.log(exportImageSettings(selected));

                      if (!appRef.current || !haldSprite) return;

                      appRef.current.renderer.extract.download({
                        target: haldSprite,
                        filename: "haldLUT.png",
                      });
                    }}
                  >
                    <FaFileImage size={"12"} />
                    Kép exportálása
                  </Button>
                )}
                {selected === -1 && (
                  <Button
                    colorPalette={"teal"}
                    w={"full"}
                    flex={1}
                    onClick={() => {
                      console.log(exportAllImageSettings());
                    }}
                  >
                    <LuFileBox size={"12"} />
                    Összes exportálása
                  </Button>
                )}
              </Flex>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
