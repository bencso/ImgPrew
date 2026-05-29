//TODO: Refaktorálni

import {
  calculationTypeEnum,
  DraggableImageEvent,
} from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box, Flex, Grid, GridItem, Image, Span } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { shallow } from "zustand/shallow";
import WebGlComponent from "../webGlComponent";
import { Rnd } from "react-rnd";
import { minMaxValidation } from "@/helper/errorHelper";

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
  const { calculationReFixPosition, setCropBox, setTextPosition } =
    useSessionStore();

  const box = useSessionStore(
    (state) => state.sessionData.find((si) => si.id === selectedImg)?.box,
    shallow,
  );

  const expandMode = useSessionStore(
    (state) =>
      state.sessionData.find((si) => si.id === selectedImg)?.expandMode,
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
      imageScale
    });

    setCpPosition({
      x: position.x  * (typeof copyrightImage?.position?.x === "number" ? imageScale : 1),
      y: position.y  * (typeof copyrightImage?.position?.y === "number" ? imageScale : 1),
    });
  }, [selectedImg, copyrightImageRef, copyrightImageSize]);

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
        imageScale
      });

      const positions = image?.texts?.find(
        (it) => it.id === element.id,
      )?.position;

      newPositions[element.id] = {
        x: textPosition.x * (typeof positions?.x === "number" ? imageScale : 1),
        y: textPosition.y * (typeof positions?.y === "number" ? imageScale : 1),
      };
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

  const scaleX = box?.currentHeight
    ? (textAndImagePlaceRef.current?.clientHeight ?? 0) /
      (image?.dimesions?.height ?? 0)
    : 1;
  const scaleY = box?.currentWidth
    ? (textAndImagePlaceRef.current?.clientWidth ?? 0) /
      (image?.dimesions?.width ?? 0)
    : 1;

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
          h={"full"}
          w={"full"}
          className="3"
          overflow={"hidden"}
        >
          {texts.map((element: DraggableImageEvent) => {
            return (
              <Rnd
                key={element.id}
                bounds={".manipulalhato"}
                enableResizing={false}
                minWidth={"fit"}
                minHeight={"fit"}
                onDragStop={(e, d) => {
                  setTextPosition(
                    selectedImg,
                    element.id,
                    {
                      x: parseFloat(d.x.toString()),
                      y: parseFloat(d.y.toString()),
                    },
                    imageScale,
                  );
                }}
                position={{
                  x: textPositions[element.id]
                    ? (textPositions[element.id].x ?? 0)
                    : 0,
                  y: textPositions[element.id]
                    ? (textPositions[element.id].y ?? 0)
                    : 0,
                }}
              >
                <Span
                  id={element.id}
                  w={"fit"}
                  h={"fit"}
                  ref={setTextRef(element.id)}
                  cursor={"pointer"}
                  textWrap={"balance"}
                  lineClamp={"none"}
                  lineHeight={"normal"}
                  style={{
                    fontSize: (element.fontSize || 20) * imageScale ,
                    fontFamily: element.fontFamily || "Roboto",
                    fontWeight: element.fontWeight || 500,
                    color: element.color || "#ffff",
                    opacity: element.opacity || 100
                  }}
                >
                  {element.text}
                </Span>
              </Rnd>
            );
          })}
          {copyrightImage && copyrightImage.blob && (
            <Image
              ref={(el) => {
                if (el) setCopyrightImageRef(el);
              }}
              src={copyrightImage.blob}
              alt="copyright"
              w={(copyrightImage.size  ?? 0) * imageScale + "px"}
              position={"relative"}
              left={Number(cpPosition.x) + "px"}
              top={Number(cpPosition.y) + "px"}
              opacity={Number(copyrightImage.opacity) / 100}
              draggable={false}
              userSelect={"none"}
            />
          )}
          {expandMode === "crop" && !cropSaved && (
            <Rnd
              size={{
                width: (box?.width ?? 1080) * (scaleX ?? 1),
                height: (box?.height ?? 1080) * (scaleY ?? 1),
              }}
              position={{
                x: (box?.x ?? 0) * (scaleX ?? 1),
                y: (box?.y ?? 0) * (scaleY ?? 1),
              }}
              minHeight={300}
              minWidth={300}
              maxHeight={textAndImagePlaceRef.current?.clientHeight}
              maxWidth={textAndImagePlaceRef.current?.clientWidth}
              bounds={".manipulalhato"}
              enableResizing
              style={{
                zIndex: 1000,
              }}
              onDragStop={(e, d) => {
                setCropBox({
                  id: selectedImg,
                  box: {
                    x: parseFloat(d.x.toString()),
                    y: parseFloat(d.y.toString()),
                    height: parseFloat(d.node.style.height) ?? 300,
                    width: parseFloat(d.node.style.width) ?? 300,
                    currentHeight: textAndImagePlaceRef.current?.clientHeight,
                    currentWidth: textAndImagePlaceRef.current?.clientWidth,
                  },
                });
              }}
              onResizeStop={(e, direction, ref, delta, position) => {
                setCropBox({
                  id: selectedImg,
                  box: {
                    x: parseFloat(position.x.toString()),
                    y: parseFloat(position.y.toString()),
                    height: minMaxValidation(
                      parseFloat(ref.style.height) ?? 300,
                      300,
                    ),
                    width: minMaxValidation(
                      parseFloat(ref.style.width) ?? 300,
                      300,
                    ),
                    currentHeight: textAndImagePlaceRef.current?.clientHeight,
                    currentWidth: textAndImagePlaceRef.current?.clientWidth,
                  },
                });
              }}
            >
              <Grid
                position="absolute"
                top="0"
                left="0"
                w="100%"
                h="100%"
                templateColumns="repeat(3, 1fr)"
                templateRows="repeat(3, 1fr)"
                pointerEvents="none"
                border="2px solid white"
                borderCollapse={"collapse"}
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <GridItem
                    key={i}
                    border="1px dashed rgba(255, 255, 255, 0.5)"
                  />
                ))}
                <Box
                  h={"full"}
                  w={"full"}
                  position={"absolute"}
                  boxShadow="1px 1px 0px 100vh #00000047"
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
              </Grid>
            </Rnd>
          )}
        </Box>
        <WebGlComponent />
      </Box>
    </Flex>
  );
}
