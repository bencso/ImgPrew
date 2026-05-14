//TODO: Refaktorálni

// Úgy kéne valahogy megcsinálni, hogy lenne egy olyan ami számolja külön a bal és fentről számított "távolságot" a cropnál mert nekünk azt kell majd megadni a
// saved croppnál hogy jól levágjuk a képet, mert azt csak be kell talán szoroznunk egy scale faktorral és jó lesz

// Vagy az a módszer, hogy a képet kizoomoltatjuk hogy lászódjon teljes egészében, és felette azon megjelenik maga a cropper, és ugy könnyebb kiszámolni is a dolgokat bal és fentről

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
import { Rnd } from "react-rnd";

export default function ImageWorkPlace() {
  const {
    selectedImg,
    textElements,
    setTextElements,
    setCopyrightImageRef,
    copyrightImageRef,
    selectedScale,
    spriteRef,
    workPlaceRef,
    canvasRef,
    appRef,
    textAndImagePlaceRef,
  } = useWorkSession();
  const { setTextPosition, calculationReFixPosition, setCropBox } =
    useSessionStore();

  const box = useSessionStore(
    (state) => state.sessionData.find((si) => si.id === selectedImg)?.box,
  );

  const imageSize = useSessionStore(
    (state) => state.sessionData.find((si) => si.id === selectedImg)?.dimesions,
    shallow,
  );

  const expandMode = useSessionStore(
    (state) =>
      state.sessionData.find((si) => si.id === selectedImg)?.expandMode,
  );

  const expandSize = useSessionStore(
    (state) =>
      state.sessionData.find((si) => si.id === selectedImg)?.expandSize,
  );

  const cropRef = useRef<HTMLElement>(null);

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
  const [borderMax, setBorderMax] = useState<{
    top: number;
    bottom: number;
    left: number;
    right: number;
  } | null>(null);

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
        width={
          expandMode === "crop" && box && box.width ? `${box.width}px` : "100%"
        }
        height={
          expandMode === "crop" && box && box.height
            ? `${box.height}px`
            : "100%"
        }
        alignContent={"center"}
        justifyContent={"center"}
        position={"relative"}
        display={"flex"}
        overflow={"hidden"}
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
          <Rnd
            minHeight={300}
            minWidth={300}
            enableResizing
            style={{
              zIndex: 1000,
              boxShadow: "1px 1px 0px 100vh #00000070"
            }}
            bounds={"parent"}
            default={{
              width: 300,
              height: 300,
              x: 0,
              y: 0,
            }}
          >
            <Box
              h={"full"}
              w={"full"}
              position={"relative"}
              border={"1px solid"}
              borderColor={"teal.800"}
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                w="20px"
                h="20px"
                borderTop="2px solid"
                borderLeft="2px solid"
                borderColor="teal"
              />
              <Box
                position="absolute"
                top={0}
                right={0}
                w="20px"
                h="20px"
                borderTop="2px solid"
                borderRight="2px solid"
                borderColor="teal"
              />
              <Box
                position="absolute"
                top={0}
                left={"calc(50% - 15px)"}
                translateX={"-50%"}
                w="30px"
                borderTop="2px solid"
                borderColor="teal"
              />
              <Box
                position="absolute"
                bottom={0}
                left={"calc(50% - 15px)"}
                translateX={"-50%"}
                w="30px"
                borderTop="2px solid"
                borderColor="teal"
              />
                <Box
                position="absolute"
                left={0}
                top={"calc(50% - 15px)"}
                translateY={"-50%"}
                h="30px"
                borderLeft="2px solid"
                borderColor="teal"
              /> 
              <Box
                position="absolute"
                right={0}
                top={"calc(50% - 15px)"}
                translateY={"-50%"}
                h="30px"
                borderRight="2px solid"
                borderColor="teal"
              />
              <Box
                position="absolute"
                bottom={0}
                right={0}
                w="20px"
                h="20px"
                borderBottom="2px solid"
                borderRight="2px solid"
                borderColor="teal"
              />
               <Box
                position="absolute"
                bottom={0}
                left={0}
                w="20px"
                h="20px"
                borderBottom="2px solid"
                borderLeft="2px solid"
                borderColor="teal"
              />
            </Box>
          </Rnd>
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
