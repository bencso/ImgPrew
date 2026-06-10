//TODO: Refaktorálni

import { DraggableImageEvent } from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box, Flex, Grid, GridItem, Image, Span } from "@chakra-ui/react";
import { useCallback, useEffect } from "react";
import { shallow } from "zustand/shallow";
import WebGlComponent from "../webGlComponent";
import { Rnd } from "react-rnd";
import { minMaxValidation } from "@/helper/errorHelper";
import { CropGrid } from "../ui/cropgrid";
import { isXPositions, isYPositions } from "@/helper/checkXYPositions";
import { calculatePosition } from "@/helper/calculationPosition";

export default function ImageWorkPlace() {
  const {
    selectedImg,
    textElements,
    setTextElements,
    setCopyrightImageRef,
    selectedScale,
    workPlaceRef,
    textAndImagePlaceRef,
  } = useWorkSession();
  const { setCropBox, setTextPosition, getTextPosition } = useSessionStore();
  //TODO: Refaktorálás -> a sok különböző usesessionstore helyett egy is elég hisz mindegyik image
  const image = useSessionStore((state) =>
    state.sessionData.find((si) => si.id === selectedImg),
  );

  const box = image?.box;
  const cpPosition = image?.copyrightImage?.position;
  const expandMode = image?.expandMode;
  const copyrightImage = image?.copyrightImage;
  const borderSize = image?.borderSize;
  const texts = image?.texts ?? [];
  const cropSaved = image?.cropSave ?? false;

  const setTextRef = useCallback(
    (textId: string) => (el: any) => {
      if (el && textElements[textId] !== el) {
        setTextElements((prev) => ({ ...prev, [textId]: el }));
      }
    },
    [textElements],
  );

  useEffect(() => {
    if (!texts) return;
    texts.forEach((text) => {
      const textPosition = text.relativePosition;
      if (!isXPositions(textPosition?.x) || !isYPositions(textPosition?.y)) {
        return;
      }

      const position = calculatePosition({
        positionX: textPosition.x,
        positionY: textPosition.y,
        elementRef: textElements[text.id],
        textAndImagePlaceRef: textAndImagePlaceRef,
        imageScale: selectedScale?.scale ?? 0,
        borderSize: borderSize,
      });
      setTextPosition(
        selectedImg,
        text.id,
        position,
        selectedScale?.scale ?? 0,
      );
    });
  }, [selectedScale]);

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
      justifyContent={"center"}
      alignItems={"center"}
      mx={"auto"}
      className="workPlaceRef"
    >
      <Box
        position={"relative"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        className="manipulalhato"
      >
        <Box
          zIndex={100}
          ref={textAndImagePlaceRef}
          position={"absolute"}
          top={0}
          left={0}
          h={"full"}
          w={"full"}
          className="3"
          border={0}
          overflow={"hidden"}
        >
          {texts.map((element: DraggableImageEvent, index: number) => {
            const textPosition = getTextPosition(selectedImg, element.id);

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctx.font = `${element.fontSize * (selectedScale?.scale ?? 0)}px ${element.fontFamily}`;

            const textFont = ctx.measureText(element.text);

            return (
              <Rnd
                key={element.id}
                bounds={".manipulalhato"}
                style={{
                  zIndex: 11 + index,
                }}
                enableResizing={false}
                onDragStop={(_e, d) => {
                  const x = d.lastX;
                  const y = d.lastY;

                  setTextPosition(
                    selectedImg,
                    element.id,
                    {
                      x,
                      y,
                    },
                    selectedScale?.scale ?? 0,
                  );
                }}
                position={{
                  x:
                    typeof textPosition.x === "number"
                      ? Math.round(textPosition.x * (selectedScale?.scale ?? 0))
                      : 0,
                  y:
                    typeof textPosition.y === "number"
                      ? Math.round(textPosition.y * (selectedScale?.scale ?? 0))
                      : 0,
                }}
              >
                {
                  //TODO: Font méretezés néha nem lehet olyan kicsi mint kéne, erre valami megoldás?!
                }
                <Span
                  id={element.id}
                  w={"auto"}
                  h={"auto"}
                  ref={setTextRef(element.id)}
                  cursor={"pointer"}
                  textWrap={"balance"}
                  border={0}
                  boxSizing={"border-box"}
                  lineClamp={"none"}
                  style={{
                    fontSize: Math.round(
                      element.fontSize * (selectedScale?.scale ?? 0),
                    ),
                    fontFamily: element.fontFamily || "Roboto",
                    fontWeight: element.fontWeight || 500,
                    color: element.color || "#ffff",
                    opacity: element.opacity || 100,
                    display: "block",
                    height: `${Math.round(textFont.fontBoundingBoxAscent + textFont.fontBoundingBoxDescent)}px`,
                    width: "auto",
                    lineHeight: `${Math.round(textFont.fontBoundingBoxAscent + textFont.fontBoundingBoxDescent)}px`,
                    padding: 0,
                    margin: 0,
                    textRendering: "optimizeLegibility",
                    WebkitFontSmoothing: "antialiased",
                    MozOsxFontSmoothing: "grayscale",
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
              w={`${(copyrightImage?.size ?? 0) * (selectedScale?.scale ?? 0)}px`}
              position={"relative"}
              left={Number(cpPosition?.x ?? 0) + "px"}
              top={Number(cpPosition?.y ?? 0) + "px"}
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
              onDragStop={(_e, d) => {
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
              onResizeStop={(_e, _direction, ref, _delta, position) => {
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
              <CropGrid />
            </Rnd>
          )}
        </Box>
        <WebGlComponent />
      </Box>
    </Flex>
  );
}
