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
  const images = useSessionStore((s) => s.sessionData);
  const [selected, setSelected] = useState<number>(images.length > 1 ? -1 : 0);
  const { exportImageSettings, exportAllImageSettings } = useSessionStore();
  const { appRef } = useWorkSession();

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
                    onClick={async () => {
                      const exportData = await exportImageSettings(
                        selected,
                        appRef,
                      );

                      const selectedImage = images.find(
                        (i) => i.id === selected,
                      );

                      if (!selectedImage) return;

                      const blob = await fetch(selectedImage.blob).then((res) =>
                        res.blob(),
                      );
                      const haldBlob = await fetch(exportData.hald).then(
                        (res) => res.blob(),
                      );

                      const imageBlobFile = new File(
                        [blob],
                        `image_${selectedImage.id}`,
                      );

                      const haldFile = new File(
                        [haldBlob],
                        `hald_${selectedImage.id}`,
                      );

                      const body = {
                        extension: selectedImage.exportSettings?.fileExtension ?? "jpg",
                        exif_data: selectedImage.exportSettings?.exifDatas ?? [],
                        border_size: selectedImage.borderSize?.x ?? 0,
                        border_color: selectedImage.expandBackground ?? "#fff"
                      };

                      console.log(body);

                      const formData = new FormData();
                      formData.append("file", imageBlobFile);
                      formData.append("lut", haldFile, "hald.png");
                      formData.append("body", JSON.stringify(body));

                      await fetch("/api/images/export", {
                        method: "POST",
                        body: formData,
                      }).catch(() => null);
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
                    onClick={async () => {
                      console.log(await exportAllImageSettings(appRef));
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
