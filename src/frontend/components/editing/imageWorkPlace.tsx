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

    textAndImagePlaceRef,
  } = useWorkSession();
  const {
    setTextPosition,
    setImageSize,
    calculationReFixPosition,
    setCropBox,
  } = useSessionStore();

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

  const [renderDirections, setRenderDirections] = useState<string[]>([]);
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

  const copyrightImageSize = useSessionStore((s) =>
    s.sessionData.find((sD) => sD.id === selectedImg),
  );

  useEffect(() => {
    if (!copyrightImageRef) return;
    const position = calculationReFixPosition(
      selectedImg,
      calculationTypeEnum.COPYRIGHT,
      copyrightImageRef,
      textAndImagePlaceRef,
    );
    setCpPosition({
      x: position.x,
      y: position.y,
    });
  }, [selectedImg, copyrightImageRef, copyrightImageSize]);

  useEffect(() => {
    calculationBorders();
  }, [box]);

  const [draggableId, setDraggableId] = useState<string | null>(null);

  useEffect(() => {
    const newPositions: Record<string, { x: number; y: number }> = {};

    texts.forEach((element) => {
      if (!textElements[element.id]) return;

      const textPosition = calculationReFixPosition(
        selectedImg,
        calculationTypeEnum.TEXT,
        textElements[element.id],
        textAndImagePlaceRef,
        element.id,
      );

      newPositions[element.id] = textPosition;
    });

    setTextPositions(newPositions);
  }, [selectedImg, texts, textElements, expandSize, expandMode, box]);
  //#endregion

  function setImageDimension(width: number, height: number) {
    setImageSize(selectedImg, width, height);
  }

  function calculationBorders() {
    if (selectedScale) {
      const borderMaxRight =
        selectedScale.position.x -
        (selectedScale?.image.width / 2) * selectedScale?.scale +
        (box?.width ?? 0) / 2;
      const borderMaxLeft =
        selectedScale.position.x +
        (selectedScale?.image.width / 2) * selectedScale?.scale -
        (box?.width ?? 0) / 2;
      //
      const borderMaxBottom =
        selectedScale.position.y -
        selectedScale?.image.height * selectedScale?.scale +
        (box?.height ?? 0);

      const borderMaxTop = selectedScale.position.y;
      return [borderMaxTop, borderMaxRight, borderMaxBottom, borderMaxLeft];
    }
    return [null, null, null, null];
  }

  function setDirectionsCrop(
    borderMaxBottom: number,
    borderMaxLeft: number,
    borderMaxRight: number,
    borderMaxTop: number,
  ) {
    if (!box || !box.x || !box.y) return;
    const directions = [];

    if (box.x > borderMaxRight) directions.push("e");
    if (box.x < borderMaxLeft) directions.push("w");
    if (box.y > borderMaxBottom) directions.push("s");
    if (box.y < borderMaxTop) directions.push("n");

    setRenderDirections(directions);
  }

  function grabCrop(x: number, y: number) {
    if (spriteRef.current && selectedScale && box && y && x) {
      const nextPosX = spriteRef.current.x + x;
      const nextPosY = spriteRef.current.y + y;

      //
      const [borderMaxTop, borderMaxRight, borderMaxBottom, borderMaxLeft] =
        calculationBorders();

      if (borderMaxTop && borderMaxRight && borderMaxBottom && borderMaxLeft) {
        if (nextPosX > borderMaxRight && nextPosX < borderMaxLeft)
          spriteRef.current.x = nextPosX;

        if (nextPosY < borderMaxTop && nextPosY > borderMaxBottom)
          spriteRef.current.y = nextPosY;

        setCropBox({
          id: selectedImg,
          x: nextPosX,
          y: nextPosY,
        });

        setDirectionsCrop(
          borderMaxBottom,
          borderMaxLeft,
          borderMaxRight,
          borderMaxTop,
        );
      }
    }
  }

  return (
    <Flex
      ref={workPlaceRef}
      h={"full"}
      w={"full"}
      boxSizing={"border-box"}
      overflow="hidden"
      p={4}
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
                renderDirections={renderDirections}
                onDrag={({ delta }) => {
                  const [dx, dy] = delta;
                  grabCrop(dx, dy);
                }}
                onResize={({ width, height, direction, delta }) => {
                  if (!spriteRef.current) return;

                  const [dx, dy] = delta;

                  const [top, right, bottom, left] = calculationBorders();
                  if (!top || !right || !bottom || !left) return;

                  let nextPosX = spriteRef.current.x;
                  let nextPosY = spriteRef.current.y;

                  if (direction[0] == 1 || direction[0] == -1) {
                    if (dx > 0) {
                      if (nextPosX > right) {
                        nextPosX = nextPosX - 0.5;
                        spriteRef.current.x = nextPosX;
                      } else if (nextPosX < left) {
                        nextPosX = nextPosX + 0.5;
                        spriteRef.current.x = nextPosX;
                      }
                    }
                  }

                  if (direction[1] == 1 || direction[1] == -1) {
                    if (dy > 0) {
                      if (nextPosY > bottom) {
                        nextPosY = nextPosY - 0.5;
                        spriteRef.current.y = nextPosY;
                      } else if (nextPosY < top) {
                        nextPosY = nextPosY + 0.5;
                        spriteRef.current.y = nextPosY;
                      }
                    }
                  }

                  if (
                    imageSize &&
                    width < imageSize.width &&
                    imageSize.height > height
                  )
                    setCropBox({
                      id: selectedImg,
                      height: height,
                      width: width,
                    });

                  setCropBox({
                    id: selectedImg,
                    x: nextPosX,
                    y: nextPosY,
                  });

                  setDirectionsCrop(bottom, left, right, top);
                }}
              />
            </>
          )}
        </Box>
        {
          //
        }
        <WebGlComponent setImageSize={setImageDimension} />
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
          console.log(e.beforeTranslate);
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
