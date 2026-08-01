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

  async function exportSelectedImage(id: number) {
    const exportData = await exportImageSettings(id);

    let selectedImage = images.find((i) => i.id === id);
    if (!selectedImage) return;

    let haldImage = exportData.hald ?? "";
    let masksImages = [];
    let masksImageHalds = [];

    if (id === selectedImg) {
      if (selectedImage && appRef.current) {
        haldImage = await appRef.current.renderer.extract.base64({
          target: selectedImage.haldSprite,
          format: "png",
          resolution: 1,
        });
      }

      const imageMasks = selectedImage.renderTextures;

      
        if (imageMasks && imageMasks.length > 0 && appRef.current) {
          for (const imageMask of imageMasks) {
            masksImages.push(
              await appRef.current.renderer.extract.base64({
                target: imageMask.maskTexture,
                format: "png",
                resolution: 1,
              }),
            );

            masksImageHalds.push(
              await appRef.current.renderer.extract.base64({
                target: imageMask.haldSprite,
                format: "png",
                resolution: 1,
              }),
            );
        }
      }
    }

    if (exportData.hald === undefined && appRef.current) {
      setSelectedImg(id);
      haldImage = await appRef.current.renderer.extract.base64({
        target: selectedImage.haldSprite,
        format: "png",
        resolution: 1,
      });
    }

    const scale = calcScale({
      workPlaceRef,
      appRef,
      textureRef,
      spriteRef,
      expandMode: selectedImage.expandMode,
      expandSize: selectedImage.expandSize,
      canvasRef,
      cropSaved: selectedImage.cropSave,
      box: selectedImage.box,
      borderSize: selectedImage.borderSize,
      imageSize: selectedImage.dimesions,
    });

    let copyrightImage = null;
    let cpImagePostion = {
      x: 0,
      y: 0,
    };

    const cpRelativePosition = selectedImage.copyrightImage?.relativePosition;

    const blob = await fetch(selectedImage.blob).then((res) => res.blob());
    const haldBlob = await fetch(haldImage).then((res) => res.blob());

    const imageBlobFile = new File([blob], `image_${selectedImage.id}`);
    const haldFile = new File([haldBlob], `hald_${selectedImage.id}`);

    if (selectedImage.copyrightImage?.blob) {
      let copyrightBlob = await fetch(selectedImage.copyrightImage.blob).then(
        (res) => res.blob(),
      );

      copyrightImage = new File(
        [copyrightBlob],
        `copyright_${selectedImage.id}`,
      );

      if (
        isXPositions(cpRelativePosition?.x) &&
        isYPositions(cpRelativePosition?.y)
      ) {
        const position = calculatePosition({
          positionX: cpRelativePosition?.x,
          positionY: cpRelativePosition?.y,
          elementRef: {
            offsetHeight: Number(
              selectedImage.copyrightImage?.size?.height ?? 0,
            ),
            offsetWidth: Number(selectedImage.copyrightImage?.size?.width ?? 0),
          },
          referenceElement: canvasRef,
          imageScale: scale,
          borderSize: selectedImage.borderSize,
        });

        cpImagePostion = {
          x: position.x,
          y: position.y,
        };
      }
    }

    let texts: (
      | {
          uiWidth: number;
          uiAscent: number;
          uiDescent: number;
          id: string;
          text: string;
          position: DraggableImageEventPosition;
          relativePosition?: { x: XPositions | number; y: YPositions | number };
          enabled: boolean;
          fontSize: number;
          fontFamily: string;
          fontWeight: number;
          color: string;
          opacity: number;
        }
      | undefined
    )[] = [];

    if (selectedImage.texts && selectedImage.texts.length > 0) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      texts = selectedImage.texts?.map((text) => {
        if (!ctx) return;
        ctx.font = `${text.fontSize * scale}px ${text.fontFamily}`;

        const textFont = ctx.measureText(text.text);
        const textSize = {
          offsetHeight: textFont.fontBoundingBoxAscent / scale,
          offsetWidth: textFont.width / scale,
        };

        let textPosition = text.position;
        const relativePosition = text.relativePosition;

        textPosition = {
          x: Number(textPosition.x),
          y: Number(textPosition.y),
        };

        if (
          isXPositions(relativePosition?.x) &&
          isYPositions(relativePosition?.y)
        ) {
          textPosition = calculatePosition({
            positionX: relativePosition?.x,
            positionY: relativePosition?.y,
            elementRef: textSize,
            referenceElement: canvasRef,
            imageScale: scale,
            borderSize: selectedImage.borderSize,
          });
        }

        return {
          ...text,
          uiWidth: textFont.width / scale,
          uiAscent: textFont.fontBoundingBoxAscent / scale,
          uiDescent: textFont.fontBoundingBoxDescent / scale,
        };
      });
    }

    const expandSize =
      selectedImage.expandMode === "expand"
        ? {
            ...selectedImage.expandSize,
            padding: selectedImage.expandSize?.padding ?? 0,
          }
        : {
            width: selectedImage.box?.width ?? 0,
            height: selectedImage.box?.height ?? 0,
            padding: 0,
          };

    const expandPosition =
      selectedImage.expandMode === "crop"
        ? {
            x: selectedImage.box?.x ?? 0,
            y: selectedImage.box?.y ?? 0,
          }
        : { x: 0, y: 0 };

    const body = {
      extension: selectedImage.exportSettings?.fileExtension ?? "jpg",
      exif_data: selectedImage.exportSettings?.exifDatas ?? [],
      border_size: selectedImage.borderSize?.x ?? 0,
      border_color: selectedImage.expandBackground ?? "#fff",
      copyright_image_size: selectedImage.copyrightImage?.size?.width ?? 0,
      copyright_image_position: cpImagePostion,
      copyright_image_opacity: selectedImage.copyrightImage?.opacity,
      texts: texts,
      optimize: selectedImage.exportSettings?.optimize ?? false,
      expand_mode: selectedImage.expandMode ?? "no",
      expand_size: expandSize,
      expand_position: expandPosition,
      expand_color: selectedImage.expandBackground ?? "#fff",
      masks_number: masksImages.length,
    };

    const formData = new FormData();

    formData.append("file", imageBlobFile);
    formData.append("lut", haldFile, "hald.png");

    if (copyrightImage)
      formData.append("copyright_image", copyrightImage, "copyright.png");

    if (masksImages.length > 0) {
      for (let index = 0; index < masksImages.length; index++) {
        const mask = masksImages[index];

        const maskFile = new File([mask], `mask_${index}`);
        formData.append(`masks_files`, maskFile, `mask_${index}.png`);
      }
    }

    if (masksImageHalds.length > 0) {
      for (let index = 0; index < masksImageHalds.length; index++) {
        const haldImage = masksImageHalds[index];

        const haldImageFile = new File([haldImage], `mask_hald_${index}`);
        formData.append(
          `masks_hald_files`,
          haldImageFile,
          `mask_hald_${index}.png`,
        );
      }
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

          setSuccessfulyImages((prev) => [
            ...prev,
            {
              title: String(selectedImage.id),
              data: imageUrl,
              extension: body.extension,
            } as SuccessfullyImagesProps,
          ]);
          setSuccessfullyImageShow(true);
        }
      });
  }

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

                      await exportSelectedImage(selected).then(() => {
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
                          await exportSelectedImage(image.id);
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
