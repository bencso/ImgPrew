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
  const { selectedImg, textAndImagePlaceRef } = useWorkSession();

  const image = useSessionStore((state) =>
    state.sessionData.find((si) => si.id === selectedImg),
  );

  const imageScale = Math.min(
    (textAndImagePlaceRef.current?.clientHeight ?? 0) /
      (image?.dimesions?.height ?? 0),
    (textAndImagePlaceRef.current?.clientWidth ?? 0) /
      (image?.dimesions?.width ?? 0),
  );

  return (
    <Flex gap={4} width="full" alignItems="center">
      <Box display={"flex"} flexDir={"row"} gap={2} alignItems={"center"}>
        <Text w="fit">X:</Text>

        <HStack flex="1">
          <NumberInput.Root
            value={(
              Number(
                typeof props.position.x === "number"
                  ? (props.position.x ?? 0)
                  : 0,
              ) * imageScale
            ).toString()}
            min={0}
            onValueChange={(e) => {
              if (e.value === "-") return;
              setTextPosition(
                selectedImg,
                props.id,
                {
                  x: minMaxValidation(Number(e.value), 0),
                  y: Number(props.position.y ?? 0) * imageScale,
                },
                imageScale,
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
            value={(
              Number(
                typeof props.position.y === "number"
                  ? (props.position.y ?? 0)
                  : 0,
              ) * imageScale
            ).toString()}
            min={0}
            onValueChange={(e) => {
              if (e.value === "-") return;
              setTextPosition(
                selectedImg,
                props.id,
                {
                  x: Number(props.position.x ?? 0) * imageScale,
                  y: minMaxValidation(Number(e.value), 0),
                },
                imageScale,
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
  const { setTextPosition } = useSessionStore();
  const { selectedImg, textAndImagePlaceRef } = useWorkSession();
  const imageSize = useSessionStore(
    (s) => s.sessionData.find((img) => img.id === selectedImg)?.dimesions,
    shallow,
  );

  const image = useSessionStore((state) =>
    state.sessionData.find((si) => si.id === selectedImg),
  );

  const imageScale = Math.min(
    (textAndImagePlaceRef.current?.clientHeight ?? 0) /
      (image?.dimesions?.height ?? 0),
    (textAndImagePlaceRef.current?.clientWidth ?? 0) /
      (image?.dimesions?.width ?? 0),
  );

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
            setTextPosition(
              selectedImg,
              props.id,
              {
                x: XPositions.LEFT,
                y: YPositions.TOP,
              },
              imageScale,
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
            if (imageSize)
              setTextPosition(
                selectedImg,
                props.id,
                {
                  x: XPositions.CENTER,
                  y: YPositions.TOP,
                },
                imageScale,
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
            if (imageSize)
              setTextPosition(
                selectedImg,
                props.id,
                {
                  x: XPositions.RIGHT,
                  y: YPositions.TOP,
                },
                imageScale,
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
            if (imageSize)
              setTextPosition(
                selectedImg,
                props.id,
                {
                  x: XPositions.LEFT,
                  y: YPositions.CENTER,
                },
                imageScale,
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
            if (imageSize)
              setTextPosition(
                selectedImg,
                props.id,
                {
                  x: XPositions.CENTER,
                  y: YPositions.CENTER,
                },
                imageScale,
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
            if (imageSize)
              setTextPosition(
                selectedImg,
                props.id,
                {
                  x: XPositions.RIGHT,
                  y: YPositions.CENTER,
                },
                imageScale,
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
            if (imageSize)
              setTextPosition(
                selectedImg,
                props.id,
                {
                  x: XPositions.LEFT,
                  y: YPositions.BOTTOM,
                },
                imageScale,
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
            if (imageSize)
              setTextPosition(
                selectedImg,
                props.id,
                {
                  x: XPositions.CENTER,
                  y: YPositions.BOTTOM,
                },
                imageScale,
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
            if (imageSize)
              setTextPosition(
                selectedImg,
                props.id,
                {
                  x: XPositions.RIGHT,
                  y: YPositions.BOTTOM,
                },
                imageScale,
              );
          }}
        >
          <LuArrowDownRight />
        </IconButton>
      </Grid>
    </Flex>
  );
}
