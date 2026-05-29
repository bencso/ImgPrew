import {
  Drawer,
  Box,
  Button,
  Portal,
  Flex,
  Text,
  Image,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
  DialogCloseTrigger,
  Link,
  HStack,
  Switch,
} from "@chakra-ui/react";
import { FaFileExport, FaFileImage } from "react-icons/fa";
import { LuFileBox } from "react-icons/lu";
import { ExportExifBlock } from "./exportExifBlock";
import { ExportImageBlock } from "./exportImageSelect";
import { useEffect, useState } from "react";
import { ExportFileExtension } from "./exportFileExtension";
import { useSessionStore } from "@/stores/sessionData";
import { useWorkSession } from "@/providers/sessionprovider";

export default function ExportDrawer() {
  const images = useSessionStore((s) => s.sessionData);
  const [selected, setSelected] = useState<number>(images.length > 1 ? -1 : 0);
  const {
    exportImageSettings,
    exportAllImageSettings,
    setExportAllFileOptimize,
    setExportFileOptimize,
  } = useSessionStore();
  const [successfullyImage, setSuccessfulyImage] = useState<string>("");
  const [successfullyImageShow, setSuccessfullyImageShow] =
    useState<boolean>(false);
  const { appRef } = useWorkSession();

  const selectedImage = images.find((i) => i.id === selected);

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
      <DialogRoot
        open={successfullyImageShow}
        onOpenChange={(e) => setSuccessfullyImageShow(e.open)}
        motionPreset="slide-in-bottom"
      >
        <DialogContent
          borderRadius="l3"
          boxShadow="2xl"
          zIndex={"max"}
          pos={"absolute"}
          right={4}
          bottom={4}
          p={0}
          m={0}
        >
          <DialogHeader borderBottomWidth="1px" py={4}>
            <DialogTitle fontSize="lg" fontWeight="bold">
              Sikeres exportálás!
            </DialogTitle>
          </DialogHeader>

          <DialogBody
            p={6}
            bg="bg.muted"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              src={successfullyImage}
              alt="Kiexportált kép"
              maxH="50vh"
              objectFit="contain"
              borderRadius="l2"
              shadow="md"
            />
          </DialogBody>

          <DialogFooter borderTopWidth="1px" gap={3}>
            <DialogActionTrigger asChild>
              <Button variant="ghost">Bezárás</Button>
            </DialogActionTrigger>

            <Button
              as={"a"}
              //@ts-ignore
              href={successfullyImage}
              download={`exportalas.${selectedImage?.exportSettings?.fileExtension ?? "jpg"}`}
              bg="brand.solid"
            >
              Letöltés
            </Button>
          </DialogFooter>

          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
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
              <HStack>
                <Switch.Root
                  checked={selectedImage?.exportSettings?.optimize}
                  onCheckedChange={(e) => {
                    if (selected !== -1) {
                      setExportFileOptimize(selected, e.checked);
                    } else {
                      setExportAllFileOptimize(e.checked);
                    }
                  }}
                >
                  <Switch.HiddenInput />
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                  <Switch.Label>Optimalizálás</Switch.Label>
                </Switch.Root>
              </HStack>
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

                      let copyrightImage = null;

                      if (selectedImage.copyrightImage?.blob) {
                        let copyrightBlob = await fetch(
                          selectedImage.copyrightImage.blob,
                        ).then((res) => res.blob());
                        copyrightImage = new File(
                          [copyrightBlob],
                          `copyright_${selectedImage.id}`,
                        );
                      }

                      const body = {
                        extension:
                          selectedImage.exportSettings?.fileExtension ?? "jpg",
                        exif_data:
                          selectedImage.exportSettings?.exifDatas ?? [],
                        border_size: selectedImage.borderSize?.x ?? 0,
                        border_color: selectedImage.expandBackground ?? "#fff",
                        copyright_image_size:
                          selectedImage.copyrightImage?.size,
                        copyright_image_position:
                          selectedImage.copyrightImage?.position,
                        copyright_image_opacity:
                          selectedImage.copyrightImage?.opacity,
                        texts: selectedImage.texts,
                        optimize:
                          selectedImage.exportSettings?.optimize ?? false,
                      };

                      const formData = new FormData();
                      formData.append("file", imageBlobFile);
                      formData.append("lut", haldFile, "hald.png");
                      if (copyrightImage) {
                        formData.append(
                          "copyright_image",
                          copyrightImage,
                          "copyright.png",
                        );
                      }
                      formData.append("body", JSON.stringify(body));

                      await fetch("/api/images/export", {
                        method: "POST",
                        body: formData,
                      })
                        .catch(() => null)
                        .then(async (res) => {
                          if (res) {
                            const blob = await res?.blob();
                            const imageUrl = URL.createObjectURL(blob);
                            setSuccessfulyImage(imageUrl);
                            setSuccessfullyImageShow(true);
                          }
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
