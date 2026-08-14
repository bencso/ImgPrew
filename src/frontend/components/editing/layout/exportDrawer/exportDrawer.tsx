//TODO: Refaktorálás
import {
  Drawer,
  Box,
  Button,
  Flex,
  Text,
  HStack,
  Switch,
} from "@chakra-ui/react";
import { FaFileExport, FaFileImage } from "react-icons/fa";
import { LuFileBox } from "react-icons/lu";
import { ExportExifBlock } from "./exportExifBlock";
import { ExportImageBlock } from "./exportImageSelect";
import { useState } from "react";
import { ExportFileExtension } from "./exportFileExtension";
import { useSessionStore } from "@/stores/sessionData";
import { useWorkSession } from "@/providers/sessionprovider";
import { SuccessfullDialog } from "./successfullDialog";
import Loader from "@/components/loader";
import { BeatLoader } from "react-spinners";
import { calculatePosition } from "@/helper/positions/calculationPosition";
import {
  isXPositions,
  isYPositions,
} from "@/helper/positions/checkXYPositions";
import { SuccessfullyImagesProps } from "@/interfaces/export.interface";
import { calcScale } from "@/helper/sizes/calcScale";
import {
  DraggableImageEventPosition,
  XPositions,
  YPositions,
} from "@/interfaces/interface";
import PIXI, { Sprite } from "pixi.js";
import { exportSelectedImage } from "@/helper/export/exportSelectedImage";

export default function ExportDrawer() {
  const images = useSessionStore((s) => s.sessionData);
  const [selected, setSelected] = useState<number>(images.length > 1 ? -1 : 0);
  const {
    exportImageSettings,
    setExportAllFileOptimize,
    setExportFileOptimize,
  } = useSessionStore();
  const {
    canvasRef,
    workPlaceRef,
    textureRef,
    spriteRef,
    selectedImg,
    setSelectedImg,
  } = useWorkSession();

  const [successfullyImages, setSuccessfulyImages] = useState<
    SuccessfullyImagesProps[]
  >([]);
  const [successfullyImageShow, setSuccessfullyImageShow] =
    useState<boolean>(false);
  const { appRef } = useWorkSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectedImage = images.find((i) => i.id === selected);

  return (
    <>
      <SuccessfullDialog
        successfullyImages={successfullyImages}
        successfullyImageShow={successfullyImageShow}
        setSuccessfullyImageShow={setSuccessfullyImageShow}
        selectedImage={selectedImage}
      />
      <Drawer.Root size={"lg"}>
        {isLoading && <Loader showBg={false} />}
        <Box p={2}>
          {
            //#region Exportálás gomb
          }
          <Drawer.Trigger asChild hidden={isLoading}>
            <Button
              w="80px"
              h="80px"
              variant={"surface"}
              rounded={"xl"}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              disabled={isLoading}
              colorPalette={"teal"}
            >
              <FaFileExport size={"16"} />
              <Text fontSize="xx-small" textAlign={"center"} mt={0} w={"full"}>
                Exportálás
              </Text>
            </Button>
          </Drawer.Trigger>
          <Button
            w="80px"
            h="80px"
            variant={"surface"}
            rounded={"xl"}
            display="flex"
            hidden={!isLoading}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            disabled={isLoading}
            colorPalette={"red"}
          >
            <BeatLoader size={12} color={"red"} />
          </Button>
        </Box>
        {
          //#endregion
        }
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
              {images.length > 1 && (
                <ExportImageBlock
                  selected={selected}
                  setSelected={setSelected}
                />
              )}
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
                    disabled={isLoading}
                    onClick={async () => {
                      setIsLoading(true);
                      setSuccessfulyImages([]);

                      await exportSelectedImage(
                        selected,
                        appRef,
                        exportImageSettings,
                        images,
                        spriteRef,
                        textureRef,
                        setSelectedImg,
                        workPlaceRef,
                        canvasRef,
                        selectedImg,
                        setSuccessfulyImages,
                        setSuccessfullyImageShow,
                      ).then(() => {
                        setIsLoading(false);
                      });
                    }}
                  >
                    <FaFileImage size={"12"} />
                    {isLoading
                      ? "Exportálás folyamatban, kérjük várj!"
                      : "Exportálás"}
                  </Button>
                )}
                {selected === -1 && (
                  <Button
                    colorPalette={"teal"}
                    w={"full"}
                    flex={1}
                    disabled={isLoading}
                    onClick={async () => {
                      setIsLoading(true);
                      setSuccessfulyImages([]);

                      try {
                        for (const image of images) {
                          await exportSelectedImage(
                            selected,
                            appRef,
                            exportImageSettings,
                            images,
                            spriteRef,
                            textureRef,
                            setSelectedImg,
                            workPlaceRef,
                            canvasRef,
                            selectedImg,
                            setSuccessfulyImages,
                            setSuccessfullyImageShow,
                          );
                        }
                      } catch (error) {
                        console.error("Hiba az exportáláskor:", error);
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    <LuFileBox size={"12"} />
                    {isLoading
                      ? "Exportálás folyamatban, kérjük várj!"
                      : "Összes exportálása"}
                  </Button>
                )}
              </Flex>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  );
}
