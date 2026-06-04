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
    textPositions,
    workPlaceRef,
    textAndImagePlaceRef,
    imageScale,
    cpPosition,
  } = useWorkSession();
  const { setCropBox, setTextPosition, getTextPosition } = useSessionStore();

  const box = useSessionStore(
    (state) => state.sessionData.find((si) => si.id === selectedImg)?.box,
    shallow,
  );

  const borderSize = useSessionStore(
    (state) =>
      state.sessionData.find((si) => si.id === selectedImg)?.borderSize,
    shallow,
  );

  const expandMode = useSessionStore(
    (state) =>
      state.sessionData.find((si) => si.id === selectedImg)?.expandMode,
  );

  const image = useSessionStore((state) =>
    state.sessionData.find((si) => si.id === selectedImg),
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

  const cropboxScale = Math.min(
    (textAndImagePlaceRef.current?.clientWidth ?? 0) /
      (image?.dimesions?.width ?? 1),
    (textAndImagePlaceRef.current?.clientHeight ?? 0) /
      (image?.dimesions?.height ?? 1),
  );

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
          border={0}
          overflow={"hidden"}
        >
          {texts.map((element: DraggableImageEvent, index: number) => {
            return (
              <Rnd
                key={element.id}
                bounds={".manipulalhato"}
                style={{
                  zIndex: 11 + index,
                }}
                enableResizing={false}
                size={{
                  width: textElements[element.id]?.offsetWidth ?? "auto",
                  height: textElements[element.id]?.offsetHeight ?? "auto",
                }}
                onDragStop={(e, d) => {
                  setTextPosition(
                    selectedImg,
                    element.id,
                    {
                      x: d.x,
                      y: d.y,
                    },
                    imageScale,
                  );
                }}
                position={{
                  x: textPositions[element.id]
                    ? ((textPositions[element.id].x) *imageScale)
                    : 0,
                  y: textPositions[element.id]
                    ? ((textPositions[element.id].y) *imageScale)
                    : 0,
                }}
              >
                <Span
                  id={element.id}
                  w={"fit"}
                  h={(element.fontSize || 20) * imageScale + "px"}
                  ref={setTextRef(element.id)}
                  cursor={"pointer"}
                  textWrap={"balance"}
                  border={0}
                  boxSizing={"border-box"}
                  lineClamp={"none"}
                  style={{
                    fontSize: (element.fontSize || 20) * imageScale,
                    fontFamily: element.fontFamily || "Roboto",
                    fontWeight: element.fontWeight || 500,
                    color: element.color || "#ffff",
                    opacity: element.opacity || 100,
                    alignItems: "center",
                    justifyContent: "center",
                    display: "inline-flex",
                    lineHeight: 1,
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
              w={`${(copyrightImage?.size ?? 0) * imageScale}px`}
              position={"relative"}
              left={Number(cpPosition.x) * imageScale + "px"}
              top={Number(cpPosition.y) * imageScale + "px"}
              opacity={Number(copyrightImage.opacity) / 100}
              draggable={false}
              userSelect={"none"}
              zIndex={10}
            />
          )}
          {expandMode === "crop" && !cropSaved && (
            <Rnd
              size={{
                width: (box?.width ?? 1080) * cropboxScale,
                height: (box?.height ?? 1080) * cropboxScale,
              }}
              position={{
                x: (box?.x ?? 0) * cropboxScale,
                y: (box?.y ?? 0) * cropboxScale,
              }}
              minHeight={300 * cropboxScale}
              minWidth={300 * cropboxScale}
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
                    x: parseFloat(d.x.toString()) / cropboxScale,
                    y: parseFloat(d.y.toString()) / cropboxScale,
                    height:
                      (parseFloat(d.node.style.height) ?? 300) / cropboxScale,
                    width:
                      (parseFloat(d.node.style.width) ?? 300) / cropboxScale,
                    currentHeight: textAndImagePlaceRef.current?.clientHeight,
                    currentWidth: textAndImagePlaceRef.current?.clientWidth,
                  },
                });
              }}
              onResizeStop={(e, direction, ref, delta, position) => {
                const minH = 300;
                const minW = 300;
                const h = parseFloat(ref.style.height) ?? minH;
                const w = parseFloat(ref.style.width) ?? minW;
                setCropBox({
                  id: selectedImg,
                  box: {
                    x: parseFloat(position.x.toString()) / cropboxScale,
                    y: parseFloat(position.y.toString()) / cropboxScale,
                    height: minMaxValidation(
                      Number.isNaN(h) ? minH : h / cropboxScale,
                      minH * cropboxScale,
                    ),
                    width: minMaxValidation(
                      Number.isNaN(h) ? minW : w / cropboxScale,
                      minW * cropboxScale,
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
