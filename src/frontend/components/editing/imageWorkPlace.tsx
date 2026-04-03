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

//TODO: A nem Expandolosnál ami igazánból a croppolás, ott ugy lesz megoldva a dolog,
//  hogy lesz egy felső div ami overflow hiddenes és igy mindig meglesz az eredeti fotó stb.

//TODO: Mjad frissiteni kell mindig a resizeBoxot hogy jót mutasson

export default function ImageWorkPlace() {
  const {
    selectedImg,
    textElements,
    setTextElements,
    setCopyrightImageRef,
    copyrightImageRef,
    selectedScale,
  } = useWorkSession();
  const { setTextPosition, setImageSize, calculationReFixPosition } =
    useSessionStore();

  const cropSize = useSessionStore(
    (state) => state.sessionData[selectedImg].cropSize,
  );

  const cropSizeRelative = {
    height: (cropSize?.height || 0) * (selectedScale?.scale || 0),
    width: (cropSize?.width || 0) * (selectedScale?.scale || 0),
  };
  const cropRef = useRef<HTMLElement>(null);
  const workPlaceRef = useRef<HTMLDivElement>(null);

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

  const [box, setBox] = useState({
    x: 0,
    y: 0,
    width: 200,
    height: 250,
  });

  useEffect(() => {
    setBox((prev) => ({
      ...prev,
      height:
        cropSize && cropSize.height
          ? cropSizeRelative.height
          : size?.height || 0,
      width:
        cropSize && cropSize.width ? cropSizeRelative.width : size?.width || 0,
    }));
  }, [selectedScale, cropSize, selectedImg]);

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
      className="workPlaceRef"
    >
      <Box
        w={box.width}
        h={box.height}
        alignContent={"center"}
        justifyContent={"center"}
        display={"flex"}
        overflow={"hidden"}
        className="manipulalhato"
      >
        <Box
          zIndex={100}
          h={box.height}
          w={box.width}
          position={"absolute"}
          className="3"
        >
          {
            //
          }
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
          {cropSize?.width && cropSize.height && (
            <>
              <Box
                ref={cropRef}
                style={{
                  transform: `translate(${box.x}px, ${box.y}px)`,
                }}
                position={"absolute"}
                width={box.width}
                height={box.height}
                backgroundColor="blackAlpha.300"
                border="2px solid white"
                boxSizing="border-box"
              />
              {cropRef.current && box.height && box.width && (
                <Moveable
                  edgeDraggable={false}
                  origin={false}
                  target={cropRef.current}
                  draggable
                  hideDefaultLines
                  hideChildMoveableDefaultLines
                  hideThrottleDragRotateLine
                  throttleResize={1}
                  resizable
                  onDrag={({ beforeTranslate }) => {
                    setBox((prev) => ({
                      ...prev,
                      x: beforeTranslate[0],
                      y: beforeTranslate[1],
                    }));
                  }}
                  onResize={({ width, height }) => {
                    setBox((prev) => ({
                      ...prev,
                      height: height,
                      width: width,
                    }));
                  }}
                />
              )}
            </>
          )}
        </Box>
        {
          //
        }
        <WebGlComponent
          workPlaceRef={workPlaceRef}
          setSize={setSize}
          setImageSize={setImageDimension}
        />
      </Box>
      {
        //
      }
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
    </Flex>
  );
}
