//TODO: Refaktorálni
//TODO: A croppolásnál ha mentünk akkor

import {
  calculationTypeEnum,
  DraggableImageEvent,
} from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box, Flex, Image, Span } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { shallow } from "zustand/shallow";
import WebGlComponent from "../webGlComponent";
import { Rnd, RndDragEvent } from "react-rnd";

export default function ImageWorkPlace() {
  const {
    selectedImg,
    textElements,
    setTextElements,
    setCopyrightImageRef,
    copyrightImageRef,
    selectedScale,
    workPlaceRef,
    textAndImagePlaceRef,
  } = useWorkSession();
  const { calculationReFixPosition } = useSessionStore();

  const box = useSessionStore(
    (state) => state.sessionData.find((si) => si.id === selectedImg)?.box,
  );

  const expandMode = useSessionStore(
    (state) =>
      state.sessionData.find((si) => si.id === selectedImg)?.expandMode,
  );

  const expandSize = useSessionStore(
    (state) =>
      state.sessionData.find((si) => si.id === selectedImg)?.expandSize,
  );

  const copyrightImage = useSessionStore(
    (s) => s.sessionData.find((sD) => sD.id === selectedImg)?.copyrightImage,
  );

  const texts = useSessionStore(
    (s) => s.sessionData.find((si) => si.id === selectedImg)?.texts || [],
    shallow,
  );

  const cropSaved = useSessionStore(
    (s) => s.sessionData.find((si) => si.id === selectedImg)?.cropSave || false,
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
    const position = calculationReFixPosition({
      id: selectedImg,
      type: calculationTypeEnum.COPYRIGHT,
      elementRef: copyrightImageRef,
      textAndImagePlaceRef,
    });
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

      const textPosition = calculationReFixPosition({
        id: selectedImg,
        type: calculationTypeEnum.TEXT,
        elementRef: textElements[element.id],
        textAndImagePlaceRef: textAndImagePlaceRef,
        textId: element.id,
      });

      newPositions[element.id] = textPosition;
    });

    setTextPositions(newPositions);
  }, [
    selectedImg,
    texts,
    textElements,
    expandSize,
    expandMode,
    box,
    selectedScale,
  ]);
  //#endregion

  return (
    <Flex
      ref={workPlaceRef}
      h={"full"}
      w={"full"}
      boxSizing={"border-box"}
      overflow="hidden"
      justifyContent={"center"}
      alignItems={"center"}
      mx={"auto"}
      className="workPlaceRef"
    >
      <Box
        alignContent={"center"}
        justifyContent={"center"}
        position={"relative"}
        display={"flex"}
        className="manipulalhato"
      >
        <Box
          zIndex={100}
          ref={textAndImagePlaceRef}
          position={"absolute"}
          transform="translate(-50%, -50%)"
          top={"50%"}
          left={"50%"}
          className="3"
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
                textWrap={"balance"}
                left={
                  textPositions[element.id]
                    ? `${textPositions[element.id].x}px`
                    : "20px"
                }
                top={
                  textPositions[element.id]
                    ? `${textPositions[element.id].y}px`
                    : "20px"
                }
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
          {expandMode === "crop" && !cropSaved && (
            <Rnd
              /*
            size={{
              width: expandSize?.width 
            }}
            */
              enableResizing
              style={{
                zIndex: 1000,
              }}
              bounds={"parent"}
              default={{
                width: 300,
                height: 300,
                x: 0,
                y: 0,
              }}
              onDrag={(e: RndDragEvent) => {
                if (!e.target) return;

                const target = e.target as HTMLElement;
                console.log(target.parentElement?.style.transform);
              }}
              onResize={(e) => {
                if (!e.target) return;
                const target = e.target as HTMLElement;
                const targetParent = target.offsetParent as HTMLElement;
                console.log(targetParent.style.transform);
              }}
            >
              <Box
                h={"full"}
                w={"full"}
                position={"relative"}
                border={"2px solid"}
                borderColor={"white/50"}
                boxShadow="1px 1px 0px 100vh #00000070"
              >
                <Box
                  position="absolute"
                  top={"-0.5"}
                  left={"-0.5"}
                  w="20px"
                  h="20px"
                  borderTop="2px solid"
                  borderLeft="2px solid"
                  borderColor="white"
                />
                <Box
                  position="absolute"
                  top={"-0.5"}
                  right={"-0.5"}
                  w="20px"
                  h="20px"
                  borderTop="2px solid"
                  borderRight="2px solid"
                  borderColor="white"
                />
                <Box
                  position="absolute"
                  top={"-0.5"}
                  left={"calc(50% - 15px )"}
                  translateX={"-50%"}
                  w="30px"
                  borderTop="2px solid"
                  borderColor="white"
                />
                <Box
                  position="absolute"
                  bottom={"-0.5"}
                  left={"calc(50% - 15px)"}
                  translateX={"-50%"}
                  w="30px"
                  borderTop="2px solid"
                  borderColor="white"
                />
                <Box
                  position="absolute"
                  left={"-0.5"}
                  top={"calc(50% - 15px)"}
                  translateY={"-50%"}
                  h="30px"
                  borderLeft="2px solid"
                  borderColor="white"
                />
                <Box
                  position="absolute"
                  right={"-0.5"}
                  top={"calc(50% - 15px)"}
                  translateY={"-50%"}
                  h="30px"
                  borderRight="2px solid"
                  borderColor="white"
                />
                <Box
                  position="absolute"
                  bottom={"-0.5"}
                  right={"-0.5"}
                  w="20px"
                  h="20px"
                  borderBottom="2px solid"
                  borderRight="2px solid"
                  borderColor="white"
                />
                <Box
                  position="absolute"
                  bottom={"-0.5"}
                  left={"-0.5"}
                  w="20px"
                  h="20px"
                  borderBottom="2px solid"
                  borderLeft="2px solid"
                  borderColor="white"
                />
              </Box>
            </Rnd>
          )}
        </Box>
        <WebGlComponent />
      </Box>
      {
        //
      }

      {/* <Moveable
        target={draggableId ? textElements[draggableId] : null}
        draggable={true}
        hideDefaultLines
        bounds={spriteRef.current}
        hideChildMoveableDefaultLines
        hideThrottleDragRotateLine
        origin={false}
        onDrag={(e: any) => {
          if (!draggableId) return;
          const [x, y] = e.beforeTranslate;

          setTextPosition(selectedImg, draggableId, {
            x,
            y,
          });
        }}
      /> */}
    </Flex>
  );
}
