//TODO: Refaktorálni
import {
  calculationTypeEnum,
  DraggableImageEvent,
} from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box, Flex, Image, Span } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
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
    selectedScale,
    spriteRef,
    workPlaceRef,
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

  function calculationBorders() {
    if (
      selectedScale &&
      box &&
      box.height &&
      box.width &&
      appRef.current &&
      imageSize
    ) {
      const cropSizeRelative = {
        height: box.height ?? imageSize.height * (selectedScale?.scale ?? 1),
        width: box.width ?? imageSize.width * (selectedScale?.scale ?? 1),
      };

      const center = {
        x: appRef.current.canvas.width / 2,
        y: cropSizeRelative.height / 2,
      };

      const borderMaxTop =
        (center.y ?? 0) +
        (selectedScale.image.height * selectedScale.scale) / 2 -
        box.height / 2;

      const borderMaxBottom =
        (center.y ?? 0) -
        (selectedScale.image.height * selectedScale.scale) / 2 +
        box.height / 2;

      const borderMaxRight =
        (center.x ?? 0) +
        (selectedScale.image.width * selectedScale.scale) / 2 -
        box.width / 2;

      const borderMaxLeft =
        (center.x ?? 0) -
        (selectedScale.image.width * selectedScale.scale) / 2 +
        box.width / 2;

      console.table({
        top: borderMaxTop,
        bottom: borderMaxBottom,
        left: borderMaxLeft,
        right: borderMaxRight,
      });

      setBorderMax({
        top: borderMaxTop,
        bottom: borderMaxBottom,
        left: borderMaxLeft,
        right: borderMaxRight,
      });
    } else {
      setBorderMax(null);
    }
  }

  useEffect(() => {
    calculationBorders();
  }, [box?.height, box?.width, expandSize, expandMode, selectedScale]);

  function grabCrop(x: number, y: number) {
    if (spriteRef.current && selectedScale && box && y && x && borderMax) {
      const nextPosX = spriteRef.current.x + x;
      const nextPosY = spriteRef.current.y + y;

      if (nextPosX < borderMax.right && nextPosX > borderMax.left)
        spriteRef.current.x = nextPosX;

      if (nextPosY < borderMax.top && nextPosY > borderMax.bottom)
        spriteRef.current.y = nextPosY;

      setCropBox({
        id: selectedImg,
        box: { x: nextPosX, y: nextPosY },
      });
    }
  }

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

          {
            //
          }
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
          {
            //
          }
          {box && box.width && box.height && (
            <>
              <Box
                ref={cropRef}
                position={"absolute"}
                transform="translate(-50%, -50%)"
                top={"50%"}
                left={"50%"}
                width={box.width}
                height={box.height}
                backgroundColor="blackAlpha.300"
                border="2px solid white"
                hidden={expandMode !== "crop"}
              />

              <Moveable
                target={cropRef.current}
                edgeDraggable={false}
                origin={false}
                keepRatio={false}
                draggable={expandMode === "crop"}
                resizable={expandMode === "crop"}
                hideDefaultLines
                hideChildMoveableDefaultLines
                hideThrottleDragRotateLine
                throttleResize={1}
                throttleDrag={1}
                edge={false}
                renderDirections={["w", "s", "e", "n"]}
                onDrag={({ delta }) => {
                  const [dx, dy] = delta;
                  grabCrop(dx, dy);
                }}
                onResize={({ width, height, direction, delta }) => {
                  if (!spriteRef.current || !borderMax) return;

                  const [dx, dy] = delta;

                  let nextPosX = spriteRef.current.x;
                  let nextPosY = spriteRef.current.y;

                  if (direction[0] == 1 || direction[0] == -1) {
                    if (dx > 0) {
                      if (nextPosX > borderMax.right) {
                        nextPosX = nextPosX - 0.5;
                        spriteRef.current.x = nextPosX;
                      } else if (nextPosX < borderMax.left) {
                        nextPosX = nextPosX + 0.5;
                        spriteRef.current.x = nextPosX;
                      }
                    }
                  }

                  if (direction[1] == 1 || direction[1] == -1) {
                    if (dy > 0) {
                      if (nextPosY > borderMax.bottom) {
                        nextPosY = nextPosY - 0.5;
                        spriteRef.current.y = nextPosY;
                      } else if (nextPosY < borderMax.top) {
                        nextPosY = nextPosY + 0.5;
                        spriteRef.current.y = nextPosY;
                      }
                    }
                  }

                  if (selectedScale) {
                    const imageH =
                      selectedScale.image.height * selectedScale.scale;
                    const imageW =
                      selectedScale.image.width * selectedScale.scale;

                    if (width < imageW && imageH > height)
                      setCropBox({
                        id: selectedImg,
                        box: { height: height, width: width },
                      });

                    setCropBox({
                      id: selectedImg,
                      box: {
                        x: nextPosX,
                        y: nextPosY,
                      },
                    });
                  }
                }}
              />
            </>
          )}
        </Box>
        {
          //
        }
        <WebGlComponent />
      </Box>
      {
        //
      }
      <Moveable
        target={draggableId ? textElements[draggableId] : null}
        draggable={true}
        hideDefaultLines
        hideChildMoveableDefaultLines
        hideThrottleDragRotateLine
        origin={false}
        onDrag={(e) => {
          if (!draggableId) return;
          const [x, y] = e.beforeTranslate;

          setTextPosition(selectedImg, draggableId, {
            x,
            y,
          });
        }}
      />
    </Flex>
  );
}
