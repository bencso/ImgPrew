import { calculatePosition } from "@/helper/calculationPosition";
import { minMaxValidation } from "@/helper/errorHelper";
import {
  DraggableImageEventPosition,
  XPositions,
  YPositions,
} from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  Box,
  Flex,
  Grid,
  HStack,
  IconButton,
  NumberInput,
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

interface TextBlockPositionProps {
  id: string;
  position: DraggableImageEventPosition;
  textPosition: DraggableImageEventPosition | undefined;
}

function TextPositionInputs(props: TextBlockPositionProps) {
  const { setTextPosition } = useSessionStore();
  const { selectedImg, textAndImagePlaceRef, selectedScale } =
    useWorkSession();

  const text = useSessionStore((state) =>
    state.sessionData.find((img) => img.id === selectedImg),
  )?.texts?.find((text) => text.id === props.id);
  if (!text) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.font = `${text.fontSize * (selectedScale?.scale ?? 0)}px ${text.fontFamily}`;

  const textFont = ctx.measureText(text.text);

  return (
    <Flex gap={4} width="full" alignItems="center">
      <Box display={"flex"} flexDir={"row"} gap={2} alignItems={"center"}>
        <Text w="fit">X:</Text>

        <HStack flex="1">
          <NumberInput.Root
            value={Number(
              typeof props.position.x === "number"
                ? Math.round(
                    (props.position.x ?? 0) * (selectedScale?.scale ?? 0),
                  )
                : 0,
            ).toString()}
            min={0}
            onValueChange={(e) => {
              if (e.value === "-") return;

              const imageWCP = textAndImagePlaceRef?.current?.offsetWidth ?? 0;
              const maxX = Math.round(imageWCP - (textFont?.width ?? 0));

              setTextPosition(
                selectedImg,
                props.id,
                {
                  x: minMaxValidation(Math.round(Number(e.value)), 0, maxX),
                  y: Number(props.position.y ?? 0),
                },
                selectedScale?.scale ?? 0,
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
            value={Number(
              typeof props.position.y === "number"
                ? Math.round(
                    (props.position.y ?? 0) * (selectedScale?.scale ?? 0),
                  )
                : 0,
            ).toString()}
            min={0}
            onValueChange={(e) => {
              if (e.value === "-") return;

              const imageHCP = textAndImagePlaceRef?.current?.offsetHeight ?? 0;
              const maxY = Math.round(
                imageHCP - (textFont?.fontBoundingBoxAscent ?? 0),
              );

              setTextPosition(
                selectedImg,
                props.id,
                {
                  x: Number(props.position.x ?? 0),
                  y: minMaxValidation(Math.round(Number(e.value)), 0, maxY),
                },
                selectedScale?.scale ?? 0,
              );
            }}
          >
            <NumberInput.Control />
            <NumberInput.Input />
          </NumberInput.Root>
        </HStack>
      </Box>
    </Flex>
  );
}

export function TextBlockPosition(props: TextBlockPositionProps) {
  const { setTextPosition, setTextRelativePosition } = useSessionStore();
  const { selectedImg, textAndImagePlaceRef, textElements, selectedScale } =
    useWorkSession();

  const borderSize = useSessionStore(
    (s) => s.sessionData.find((img) => img.id === selectedImg)?.borderSize,
    shallow,
  );

  const text = useSessionStore((state) =>
    state.sessionData.find((img) => img.id === selectedImg),
  )?.texts?.find((text) => text.id === props.id);
  if (!text) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.font = `${text.fontSize * (selectedScale?.scale ?? 0)}px ${text.fontFamily}`;

  const textFont = ctx.measureText(text.text);

  const textSize = {
    offsetHeight: textFont.fontBoundingBoxAscent,
    offsetWidth: textFont.width,
  };

  return (
    <Flex gap={4} flexDir={"column"}>
      <TextPositionInputs
        id={props.id}
        position={props.position}
        textPosition={props.textPosition}
      />
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
            props.textPosition &&
            props.textPosition.x === XPositions.LEFT &&
            props.textPosition.y === YPositions.TOP
          }
          onClick={() => {
            const position = calculatePosition({
              positionX: XPositions.LEFT,
              positionY: YPositions.TOP,
              elementRef: textSize,
              textAndImagePlaceRef: textAndImagePlaceRef,
              imageScale: selectedScale?.scale ?? 0,
              borderSize: borderSize,
            });
            setTextRelativePosition(selectedImg, props.id, {
              x: XPositions.LEFT,
              y: YPositions.TOP,
            });
            setTextPosition(
              selectedImg,
              props.id,
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
            props.textPosition &&
            props.textPosition.x === XPositions.CENTER &&
            props.textPosition.y === YPositions.TOP
          }
          onClick={() => {
            const position = calculatePosition({
              positionX: XPositions.CENTER,
              positionY: YPositions.TOP,
              elementRef: textSize,
              textAndImagePlaceRef: textAndImagePlaceRef,
              imageScale: selectedScale?.scale ?? 0,
              borderSize: borderSize,
            });
            setTextRelativePosition(selectedImg, props.id, {
              x: XPositions.CENTER,
              y: YPositions.TOP,
            });
            setTextPosition(
              selectedImg,
              props.id,
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
            props.textPosition &&
            props.textPosition.x === XPositions.RIGHT &&
            props.textPosition.y === YPositions.TOP
          }
          onClick={() => {
            const position = calculatePosition({
              positionX: XPositions.RIGHT,
              positionY: YPositions.TOP,
              elementRef: textSize,
              textAndImagePlaceRef: textAndImagePlaceRef,
              imageScale: selectedScale?.scale ?? 0,
              borderSize: borderSize,
            });
            setTextRelativePosition(selectedImg, props.id, {
              x: XPositions.RIGHT,
              y: YPositions.TOP,
            });
            setTextPosition(
              selectedImg,
              props.id,
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
            props.textPosition &&
            props.textPosition.x === XPositions.LEFT &&
            props.textPosition.y === YPositions.CENTER
          }
          onClick={() => {
            const position = calculatePosition({
              positionX: XPositions.LEFT,
              positionY: YPositions.CENTER,
              elementRef: textSize,
              textAndImagePlaceRef: textAndImagePlaceRef,
              imageScale: selectedScale?.scale ?? 0,
              borderSize: borderSize,
            });
            setTextRelativePosition(selectedImg, props.id, {
              x: XPositions.LEFT,
              y: YPositions.CENTER,
            });
            setTextPosition(
              selectedImg,
              props.id,
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
            props.textPosition &&
            props.textPosition.x === XPositions.CENTER &&
            props.textPosition.y === YPositions.CENTER
          }
          onClick={() => {
            const position = calculatePosition({
              positionX: XPositions.CENTER,
              positionY: YPositions.CENTER,
              elementRef: textSize,
              textAndImagePlaceRef: textAndImagePlaceRef,
              imageScale: selectedScale?.scale ?? 0,
              borderSize: borderSize,
            });
            setTextRelativePosition(selectedImg, props.id, {
              x: XPositions.CENTER,
              y: YPositions.CENTER,
            });
            setTextPosition(
              selectedImg,
              props.id,
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
            props.textPosition &&
            props.textPosition.x === XPositions.RIGHT &&
            props.textPosition.y === YPositions.CENTER
          }
          onClick={() => {
            const position = calculatePosition({
              positionX: XPositions.RIGHT,
              positionY: YPositions.CENTER,
              elementRef: textSize,
              textAndImagePlaceRef: textAndImagePlaceRef,
              imageScale: selectedScale?.scale ?? 0,
              borderSize: borderSize,
            });
            setTextRelativePosition(selectedImg, props.id, {
              x: XPositions.RIGHT,
              y: YPositions.CENTER,
            });
            setTextPosition(
              selectedImg,
              props.id,
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
            props.textPosition &&
            props.textPosition.x === XPositions.LEFT &&
            props.textPosition.y === YPositions.BOTTOM
          }
          onClick={() => {
            const position = calculatePosition({
              positionX: XPositions.LEFT,
              positionY: YPositions.BOTTOM,
              elementRef: textSize,
              textAndImagePlaceRef: textAndImagePlaceRef,
              imageScale: selectedScale?.scale ?? 0,
              borderSize: borderSize,
            });
            setTextRelativePosition(selectedImg, props.id, {
              x: XPositions.LEFT,
              y: YPositions.BOTTOM,
            });
            setTextPosition(
              selectedImg,
              props.id,
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
            props.textPosition &&
            props.textPosition.x === XPositions.CENTER &&
            props.textPosition.y === YPositions.BOTTOM
          }
          onClick={() => {
            const position = calculatePosition({
              positionX: XPositions.CENTER,
              positionY: YPositions.BOTTOM,
              elementRef: textSize,
              textAndImagePlaceRef: textAndImagePlaceRef,
              imageScale: selectedScale?.scale ?? 0,
              borderSize: borderSize,
            });
            setTextRelativePosition(selectedImg, props.id, {
              x: XPositions.CENTER,
              y: YPositions.BOTTOM,
            });
            setTextPosition(
              selectedImg,
              props.id,
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
            props.textPosition &&
            props.textPosition.x === XPositions.RIGHT &&
            props.textPosition.y === YPositions.BOTTOM
          }
          onClick={() => {
            const position = calculatePosition({
              positionX: XPositions.RIGHT,
              positionY: YPositions.BOTTOM,
              elementRef: textSize,
              textAndImagePlaceRef: textAndImagePlaceRef,
              imageScale: selectedScale?.scale ?? 0,
              borderSize: borderSize,
            });
            setTextRelativePosition(selectedImg, props.id, {
              x: XPositions.RIGHT,
              y: YPositions.BOTTOM,
            });
            setTextPosition(
              selectedImg,
              props.id,
              position,
              selectedScale?.scale ?? 0,
            );
          }}
        >
          <LuArrowDownRight />
        </IconButton>
      </Grid>
    </Flex>
  );
}
