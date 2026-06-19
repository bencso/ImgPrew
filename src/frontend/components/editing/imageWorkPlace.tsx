import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import WebGlComponent from "../webGlComponent";
import { Rnd } from "react-rnd";
import { minMaxValidation } from "@/helper/errorHelper";
import { CropGrid } from "../ui/cropgrid";
import { createCPImage } from "@/helper/workplaceHelpers/createCPImage";
import { createTexts } from "@/helper/workplaceHelpers/createTexts";
import { Container, Graphics, Sprite, Texture } from "pixi.js";

export default function ImageWorkPlace() {
  const {
    selectedImg,
    selectedScale,
    workPlaceRef,
    canvasRef,
    overlayRef,
    appRef,
    maskContainerRef,
  } = useWorkSession();
  const { setCropBox, setTextPosition, setTextRelativePosition } =
    useSessionStore();

  const image = useSessionStore((state) =>
    state.sessionData.find((si) => si.id === selectedImg),
  );

  const [draggableText, setDraggable] = useState<string | null>(null);

  const box = image?.box;
  const expandMode = image?.expandMode;
  const copyrightImage = image?.copyrightImage;
  const texts = image?.texts ?? [];
  const cropSaved = image?.cropSave ?? false;
  const borderSize = image?.borderSize;
  const imgW = image?.dimesions?.width ?? 1;
  const imgH = image?.dimesions?.height ?? 1;

  const cropboxScale = Math.min(
    (canvasRef.current?.clientWidth ?? 0) / imgW,
    (canvasRef.current?.clientHeight ?? 0) / imgH,
  );

  const scale = selectedScale?.scale ?? 1;

  overlayRef.current?.removeChildren();

  if (maskContainerRef.current) {
    maskContainerRef.current.eventMode = "static";
    maskContainerRef.current.interactive = true;
  }

  if (appRef.current) {
    appRef.current.stage.hitArea = appRef.current.screen;
    appRef.current.stage.eventMode = "static";
    appRef.current.stage.interactiveChildren = true;
    appRef.current.stage.off("pointerdown");
    appRef.current.stage.off("pointermove");
    appRef.current.stage.off("pointerup");
    appRef.current.stage.off("pointerupoutside");
  }

  createTexts({
    texts,
    scale,
    appRef,
    canvasRef,
    borderSize,
    overlayRef,
    setDraggable,
    setTextPosition,
    setTextRelativePosition,
    copyrightImage,
    draggableText,
    selectedImg,
  });

  createCPImage({
    overlayRef,
    copyrightImage,
    canvasRef,
    scale,
    borderSize,
  });

  const canvasH = canvasRef.current?.clientHeight ?? 1080;
  const canvasW = canvasRef.current?.clientWidth ?? 1080;

  enum MaskCreateProps {
    DRAW,
    ERASE,
  }

  interface Points {
    x: number;
    y: number;
  }

  interface MasksProps {
    type: MaskCreateProps;
    brushSize: number;
    points: Points[];
  }

  let masks: MasksProps[] = [];

  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let brushSize = 30;

  const maskGraph = new Graphics();
  maskContainerRef.current?.addChild(maskGraph);

  function drawBrush(x: number, y: number) {
    maskGraph.circle(x, y, 30);
    maskGraph.fill({
      color: 0xff0000,
    });
  }

  function maskCreate(
    brushSize: number,
    type: MaskCreateProps,
    point: { x: number; y: number },
  ) {
    let currentMask = masks.find(
      (mask) => mask.type === type && mask.brushSize === brushSize,
    );

    if (currentMask) {
      currentMask.points.push(point);
    } else {
      masks.push({
        type,
        brushSize,
        points: [point],
      });
    }
  }

  // Linear interpolation : https://hu.wikipedia.org/wiki/Interpol%C3%A1ci%C3%B3
  function drawLine(x1: number, y1: number, x2: number, y2: number) {
    // Különbség számítás
    const dx = x2 - x1;
    const dy = y2 - y1;

    // Pitagorasz tétel
    const distance = Math.sqrt(dx * dx + dy * dy);

    // A két pont közötti távolság "megrajzolása"
    for (let i = 0; i <= distance; i += brushSize) {
      const a = i / distance;

      const x = x1 + dx * a;
      const y = y1 + dy * a;

      maskCreate(30, MaskCreateProps.DRAW, {
        x,
        y,
      });

      drawBrush(x, y);
    }
  }

  appRef.current?.stage.on("pointerdown", (e) => {
    isDrawing = true;

    lastX = e.global.x;
    lastY = e.global.y;

    drawBrush(lastX, lastY);
  });

  appRef.current?.stage.on("pointermove", (e) => {
    if (!isDrawing) return;

    const x = e.global.x;
    const y = e.global.y;

    drawLine(lastX, lastY, x, y);

    lastX = x;
    lastY = y;
  });

  appRef.current?.stage.on("pointerup", () => {
    isDrawing = false;
    console.log(masks);
  });

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
        h={canvasH}
        w={canvasW}
        position={"absolute"}
        zIndex={expandMode === "crop" && !cropSaved ? "overlay" : "-100"}
      >
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
            maxHeight={canvasH}
            maxWidth={canvasW}
            bounds={canvasRef.current?.firstElementChild ?? ""}
            enableResizing
            style={{
              zIndex: 1000,
            }}
            onDragStop={(_e, d) => {
              const x = parseFloat(d.x.toString()) / cropboxScale;
              const y = parseFloat(d.y.toString()) / cropboxScale;

              const height =
                (parseFloat(d.node.style.height) ?? 300) / cropboxScale;
              const width =
                (parseFloat(d.node.style.width) ?? 300) / cropboxScale;

              setCropBox({
                id: selectedImg,
                box: {
                  x,
                  y,
                  height,
                  width,
                  currentHeight: canvasH,
                  currentWidth: canvasW,
                },
              });
            }}
            onResizeStop={(_e, _direction, ref, _delta, position) => {
              const minH = 300;
              const minW = 300;
              const h = parseFloat(ref.style.height) ?? minH;
              const w = parseFloat(ref.style.width) ?? minW;

              const height = minMaxValidation(
                Number.isNaN(h) ? minH : h / cropboxScale,
                minH * cropboxScale,
              );
              const width = minMaxValidation(
                Number.isNaN(h) ? minW : w / cropboxScale,
                minW * cropboxScale,
              );

              const x = parseFloat(position.x.toString()) / cropboxScale;
              const y = parseFloat(position.y.toString()) / cropboxScale;
              setCropBox({
                id: selectedImg,
                box: {
                  x,
                  y,
                  height,
                  width,
                  currentHeight: canvasH,
                  currentWidth: canvasW,
                },
              });
            }}
          >
            <CropGrid />
          </Rnd>
        )}
      </Box>
      <WebGlComponent />
    </Flex>
  );
}
