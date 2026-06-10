import { calculatePosition } from "@/helper/calculationPosition";
import { isXPositions, isYPositions } from "@/helper/checkXYPositions";
import { minMaxValidation } from "@/helper/errorHelper";
import { XPositions, YPositions } from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  Box,
  Field,
  Flex,
  Grid,
  HStack,
  IconButton,
  Input,
  NumberInput,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import {
  LuArrowDown,
  LuArrowDownLeft,
  LuArrowDownRight,
  LuArrowLeft,
  LuArrowRight,
  LuArrowUp,
  LuArrowUpLeft,
  LuArrowUpRight,
  LuDot,
} from "react-icons/lu";
import { shallow } from "zustand/shallow";

export const CopyrightImageSettingBlock = () => {
  const {
    selectedImg,
    copyrightImageRef,
    textAndImagePlaceRef,
    imageScale,
    selectedScale,
  } = useWorkSession();
  const {
    setCopyrightImageSize,
    setCopyrightImagePosition,
    setCopyrightImageOpacity,
    setCopyrightImageRelativePosition,
  } = useSessionStore();

  const image = useSessionStore(
    (s) => s.sessionData.find((img) => img.id === selectedImg),
    shallow,
  );

  const borderSize = image?.borderSize;
  const copyrightImage = image?.copyrightImage;
  const imagePosition = copyrightImage?.position;

  useEffect(() => {
    if (!copyrightImageRef) return;
    const relativePosition = copyrightImage?.relativePosition;

    if (
      !isXPositions(relativePosition?.x) ||
      !isYPositions(relativePosition?.y)
    ) {
      return;
    }

    const position = calculatePosition({
      positionX: relativePosition?.x,
      positionY: relativePosition?.y,
      elementRef: copyrightImageRef,
      textAndImagePlaceRef: textAndImagePlaceRef,
      imageScale: imageScale,
      borderSize: borderSize,
    });

    setCopyrightImagePosition(selectedImg, position, selectedScale?.scale ?? 0);
  }, [selectedScale, copyrightImage?.size]);

  if (copyrightImageRef) {
    return (
      <Stack gap={5}>
        <Field.Root>
          <Field.Label>Méret</Field.Label>
          <Input
            placeholder="Méret"
            value={Math.round(copyrightImage?.size ?? 1)}
            onChange={(e) => {
              setCopyrightImageSize(
                selectedImg,
                minMaxValidation(Math.round(Number(e.target.value ?? 1)), 0),
              );
            }}
            min={200}
            type="number"
          />
        </Field.Root>
        <Box display={"flex"} flexDir={"row"} gap={2} alignItems={"center"}>
          <Text w="fit">Áttettszőség:</Text>

          <HStack flex="1">
            <NumberInput.Root
              value={(Number.isNaN(copyrightImage?.opacity ?? 100)
                ? "100"
                : copyrightImage?.opacity
              )?.toString()}
              min={0}
              max={100}
              w={"full"}
              onValueChange={(e) => {
                setCopyrightImageOpacity(
                  selectedImg,
                  minMaxValidation(Number(e.value), 0, 100),
                );
              }}
            >
              <NumberInput.Control />
              <NumberInput.Input />
            </NumberInput.Root>
            <Text>%</Text>
          </HStack>
        </Box>
        <Flex gap={4} width="full" alignItems="center">
          <Box display={"flex"} flexDir={"row"} gap={2} alignItems={"center"}>
            <Text w="fit">X:</Text>

            <HStack flex="1">
              <NumberInput.Root
                value={Math.round(
                  typeof imagePosition?.x == "number"
                    ? (imagePosition?.x ?? 0) * (selectedScale?.scale ?? 0)
                    : 0,
                ).toString()}
                min={0}
                onValueChange={(e) => {
                  if (e.value === "-") return;

                  const imageWCP =
                    textAndImagePlaceRef?.current?.clientWidth ?? 0;
                  const maxX = Math.round(
                    imageWCP - (copyrightImageRef.width ?? 0),
                  );

                  setCopyrightImagePosition(
                    selectedImg,
                    {
                      x: minMaxValidation(Number(e.value), 0, maxX),
                      y: imagePosition?.y ?? 0,
                    },
                    selectedScale?.scale ?? 1,
                  );
                }}
              >
                <NumberInput.Control />
                <NumberInput.Input />
              </NumberInput.Root>
            </HStack>
          </Box>
          <Box display={"flex"} flexDir={"row"} gap={2} alignItems={"center"}>
            <Text w="fit">Y:</Text>

            <HStack flex="1">
              <NumberInput.Root
                value={Math.round(
                  typeof imagePosition?.y == "number"
                    ? (imagePosition?.y ?? 0) * (selectedScale?.scale ?? 0)
                    : 0,
                ).toString()}
                min={0}
                onValueChange={(e) => {
                  if (e.value === "-") return;

                  const imageHCP =
                    textAndImagePlaceRef?.current?.clientWidth ?? 0;
                  const maxY = Math.round(
                    imageHCP - (copyrightImageRef.width ?? 0),
                  );

                  setCopyrightImagePosition(
                    selectedImg,
                    {
                      x: imagePosition?.x ?? 0,
                      y: minMaxValidation(Number(e.value), 0, maxY),
                    },
                    selectedScale?.scale ?? 1,
                  );
                }}
              >
                <NumberInput.Control />
                <NumberInput.Input />
              </NumberInput.Root>
            </HStack>
          </Box>
        </Flex>
        <Grid
          display={"grid"}
          templateRows={"repeat(3, 1fr)"}
          templateColumns={"repeat(3,1fr)"}
          gap={2}
          w={"full"}
        >
          <IconButton
            colorPalette={"teal"}
            variant={"subtle"}
            w={"full"}
            h={"full"}
            disabled={
              imagePosition &&
              imagePosition.x === XPositions.LEFT &&
              imagePosition.y === YPositions.TOP
            }
            onClick={() => {
              const position = calculatePosition({
                positionX: XPositions.LEFT,
                positionY: YPositions.TOP,
                elementRef: copyrightImageRef,
                textAndImagePlaceRef: textAndImagePlaceRef,
                imageScale: imageScale,
                borderSize: borderSize,
              });
              setCopyrightImageRelativePosition(selectedImg, {
                x: XPositions.LEFT,
                y: YPositions.TOP,
              });
              setCopyrightImagePosition(
                selectedImg,
                position,
                selectedScale?.scale ?? 0,
              );
            }}
          >
            <LuArrowUpLeft />
          </IconButton>
          <IconButton
            colorPalette={"teal"}
            w={"full"}
            variant={"subtle"}
            disabled={
              imagePosition &&
              imagePosition.x === XPositions.CENTER &&
              imagePosition.y === YPositions.TOP
            }
            onClick={() => {
              const position = calculatePosition({
                positionX: XPositions.CENTER,
                positionY: YPositions.TOP,
                elementRef: copyrightImageRef,
                textAndImagePlaceRef: textAndImagePlaceRef,
                imageScale: imageScale,
                borderSize: borderSize,
              });
              setCopyrightImageRelativePosition(selectedImg, {
                x: XPositions.CENTER,
                y: YPositions.TOP,
              });
              setCopyrightImagePosition(
                selectedImg,
                position,
                selectedScale?.scale ?? 0,
              );
            }}
          >
            <LuArrowUp />
          </IconButton>
          <IconButton
            colorPalette={"teal"}
            variant={"subtle"}
            w={"full"}
            disabled={
              imagePosition &&
              imagePosition.x === XPositions.RIGHT &&
              imagePosition.y === YPositions.TOP
            }
            onClick={() => {
              const position = calculatePosition({
                positionX: XPositions.RIGHT,
                positionY: YPositions.TOP,
                elementRef: copyrightImageRef,
                textAndImagePlaceRef: textAndImagePlaceRef,
                imageScale: imageScale,
                borderSize: borderSize,
              });
              setCopyrightImageRelativePosition(selectedImg, {
                x: XPositions.RIGHT,
                y: YPositions.TOP,
              });
              setCopyrightImagePosition(
                selectedImg,
                position,
                selectedScale?.scale ?? 0,
              );
            }}
          >
            <LuArrowUpRight />
          </IconButton>

          <IconButton
            colorPalette={"teal"}
            variant={"subtle"}
            w={"full"}
            disabled={
              imagePosition &&
              imagePosition.x === XPositions.LEFT &&
              imagePosition.y === YPositions.CENTER
            }
            onClick={() => {
              const position = calculatePosition({
                positionX: XPositions.LEFT,
                positionY: YPositions.CENTER,
                elementRef: copyrightImageRef,
                textAndImagePlaceRef: textAndImagePlaceRef,
                imageScale: imageScale,
                borderSize: borderSize,
              });
              setCopyrightImageRelativePosition(selectedImg, {
                x: XPositions.LEFT,
                y: YPositions.CENTER,
              });
              setCopyrightImagePosition(
                selectedImg,
                position,
                selectedScale?.scale ?? 0,
              );
            }}
          >
            <LuArrowLeft />
          </IconButton>
          <IconButton
            colorPalette={"teal"}
            variant={"subtle"}
            w={"full"}
            disabled={
              imagePosition &&
              imagePosition.x === XPositions.CENTER &&
              imagePosition.y === YPositions.CENTER
            }
            onClick={() => {
              const position = calculatePosition({
                positionX: XPositions.CENTER,
                positionY: YPositions.CENTER,
                elementRef: copyrightImageRef,
                textAndImagePlaceRef: textAndImagePlaceRef,
                imageScale: selectedScale?.scale ?? 0,
                borderSize: borderSize,
              });
              setCopyrightImageRelativePosition(selectedImg, {
                x: XPositions.CENTER,
                y: YPositions.CENTER,
              });
              setCopyrightImagePosition(
                selectedImg,
                position,
                selectedScale?.scale ?? 0,
              );
            }}
          >
            <LuDot />
          </IconButton>
          <IconButton
            colorPalette={"teal"}
            variant={"subtle"}
            w={"full"}
            disabled={
              imagePosition &&
              imagePosition.x === XPositions.RIGHT &&
              imagePosition.y === YPositions.CENTER
            }
            onClick={() => {
              const position = calculatePosition({
                positionX: XPositions.RIGHT,
                positionY: YPositions.CENTER,
                elementRef: copyrightImageRef,
                textAndImagePlaceRef: textAndImagePlaceRef,
                imageScale: imageScale,
                borderSize: borderSize,
              });
              setCopyrightImageRelativePosition(selectedImg, {
                x: XPositions.RIGHT,
                y: YPositions.CENTER,
              });
              setCopyrightImagePosition(
                selectedImg,
                position,
                selectedScale?.scale ?? 0,
              );
            }}
          >
            <LuArrowRight />
          </IconButton>

          <IconButton
            colorPalette={"teal"}
            variant={"subtle"}
            w={"full"}
            disabled={
              imagePosition &&
              imagePosition.x === XPositions.LEFT &&
              imagePosition.y === YPositions.BOTTOM
            }
            onClick={() => {
              const position = calculatePosition({
                positionX: XPositions.LEFT,
                positionY: YPositions.BOTTOM,
                elementRef: copyrightImageRef,
                textAndImagePlaceRef: textAndImagePlaceRef,
                imageScale: imageScale,
                borderSize: borderSize,
              });
              setCopyrightImageRelativePosition(selectedImg, {
                x: XPositions.LEFT,
                y: YPositions.BOTTOM,
              });
              setCopyrightImagePosition(
                selectedImg,
                position,
                selectedScale?.scale ?? 0,
              );
            }}
          >
            <LuArrowDownLeft />
          </IconButton>
          <IconButton
            colorPalette={"teal"}
            variant={"subtle"}
            w={"full"}
            disabled={
              imagePosition &&
              imagePosition.x === XPositions.CENTER &&
              imagePosition.y === YPositions.BOTTOM
            }
            onClick={() => {
              const position = calculatePosition({
                positionX: XPositions.CENTER,
                positionY: YPositions.BOTTOM,
                elementRef: copyrightImageRef,
                textAndImagePlaceRef: textAndImagePlaceRef,
                imageScale: imageScale,
                borderSize: borderSize,
              });
              setCopyrightImageRelativePosition(selectedImg, {
                x: XPositions.CENTER,
                y: YPositions.BOTTOM,
              });
              setCopyrightImagePosition(
                selectedImg,
                position,
                selectedScale?.scale ?? 0,
              );
            }}
          >
            <LuArrowDown />
          </IconButton>
          <IconButton
            colorPalette={"teal"}
            variant={"subtle"}
            w={"full"}
            disabled={
              imagePosition &&
              imagePosition.x === XPositions.RIGHT &&
              imagePosition.y === YPositions.BOTTOM
            }
            onClick={() => {
              const position = calculatePosition({
                positionX: XPositions.RIGHT,
                positionY: YPositions.BOTTOM,
                elementRef: copyrightImageRef,
                textAndImagePlaceRef: textAndImagePlaceRef,
                imageScale: imageScale,
                borderSize: borderSize,
              });
              setCopyrightImageRelativePosition(selectedImg, {
                x: XPositions.RIGHT,
                y: YPositions.BOTTOM,
              });
              setCopyrightImagePosition(
                selectedImg,
                position,
                selectedScale?.scale ?? 0,
              );
            }}
          >
            <LuArrowDownRight />
          </IconButton>
        </Grid>
      </Stack>
    );
  }
};
