import {
  calculationTypeEnum,
  DraggableImageEvent,
} from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box, Flex, Image, Span } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import Moveable from "react-moveable";
import { shallow } from "zustand/shallow";
import WebGlComponent from "../webGlComponent";

export default function ImageWorkPlace() {
  const {
    selectedImg,
    textElements,
    setTextElements,
    setCopyrightImageRef,
    copyrightImageRef,
  } = useWorkSession();
  const { setTextPosition, setImageSize, calculationReFixPosition } =
    useSessionStore();
  const [size, setSize] = useState<{ width: number; height: number }>();

  const copyrightImage = useSessionStore(
    (s) => s.sessionData.find((sD) => sD.id === selectedImg)?.copyrightImage,
  );

  const texts = useSessionStore(
    (s) => s.sessionData.find((si) => si.id === selectedImg)?.texts || [],
    shallow,
  );

  const setTextRef = useCallback(
    (textId: string) => (el: any) => {
      if (el && textElements[textId] !== el) {
        setTextElements((prev) => ({ ...prev, [textId]: el }));
      }
    },
    [textElements],
  );

  //#region CP position manipuláció
  const [cpPosition, setCpPosition] = useState<{ x: number; y: number }>({
    x: 5,
    y: 5,
  });
  const [textPositions, setTextPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});

  const copyrightImageSize = useSessionStore((s) =>
    s.sessionData.find((sD) => sD.id === selectedImg),
  );

  useEffect(() => {
    if (!copyrightImageRef) return;
    const position = calculationReFixPosition(
      selectedImg,
      calculationTypeEnum.COPYRIGHT,
      copyrightImageRef,
    );
    setCpPosition({
      x: position.x,
      y: position.y,
    });
  }, [selectedImg, copyrightImageRef, copyrightImageSize]);

  const [draggableId, setDraggableId] = useState<string | null>(null);

  useEffect(() => {
    const newPositions: Record<string, { x: number; y: number }> = {};

    texts.forEach((element) => {
      if (!textElements[element.id]) return;

      const textPosition = calculationReFixPosition(
        selectedImg,
        calculationTypeEnum.TEXT,
        textElements[element.id],
        element.id,
      );

      newPositions[element.id] = textPosition;
    });
    setTextPositions(newPositions);
  }, [selectedImg, texts, textElements]);
  //#endregion

  function setImageDimension(width: number, height: number) {
    setImageSize(selectedImg, width, height);
  }

  return (
    <Flex
      w="full"
      h="full"
      boxSizing={"border-box"}
      overflow="hidden"
      p={4}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        zIndex={100}
        h={size?.height || 0}
        w={size?.width || 0}
        position={"absolute"}
        overflow={"hidden"}
      >
        {texts.map((element: DraggableImageEvent) => {
          return (
            <Span
              key={element.id}
              ref={setTextRef(element.id)}
              onMouseEnter={() => {
                setDraggableId(element.id);
              }}
              id={element.id}
              w={"fit"}
              h={"fit"}
              position={"absolute"}
              cursor={"pointer"}
              top={
                typeof textPositions[element.id]?.y === "number"
                  ? `${textPositions[element.id]!.y}px`
                  : "5px"
              }
              left={
                typeof textPositions[element.id]?.x === "number"
                  ? `${textPositions[element.id]!.x}px`
                  : "5px"
              }
              textWrap={"balance"}
              style={{
                fontSize: element.fontSize || 20,
                fontFamily: element.fontFamily || "Inter",
                fontWeight: element.fontWeight || 500,
                color: element.color || "#ffff",
                lineHeight: 1,
              }}
            >
              {element.text}
            </Span>
          );
        })}

        <Moveable
          target={draggableId ? textElements[draggableId] : null}
          draggable={true}
          throttleDrag={0}
          hideDefaultLines
          hideChildMoveableDefaultLines
          hideThrottleDragRotateLine
          edgeDraggable={false}
          origin={false}
          startDragRotate={0}
          throttleDragRotate={0}
          onDrag={(e) => {
            if (!draggableId) return;
            setTextPosition(selectedImg, draggableId, {
              x: e.left,
              y: e.top,
            });
          }}
        />

        {copyrightImage && copyrightImage.blob && (
          <Image
            ref={(el) => {
              if (el) setCopyrightImageRef(el);
            }}
            src={copyrightImage.blob}
            alt="copyright"
            height={copyrightImage.size + "px"}
            position={"relative"}
            left={cpPosition.x + "px"}
            top={cpPosition.y + "px"}
            draggable={false}
            userSelect={"none"}
          />
        )}
      </Box>
      <WebGlComponent setSize={setSize} setImageSize={setImageDimension} />
    </Flex>
  );
}
