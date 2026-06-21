import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box, Flex } from "@chakra-ui/react";
import { useRef, useState } from "react";
import WebGlComponent from "../webGlComponent";
import { Rnd } from "react-rnd";
import { minMaxValidation } from "@/helper/errorHelper";
import { CropGrid } from "../ui/cropgrid";
import { createCPImage } from "@/helper/workplaceHelpers/createCPImage";
import { createTexts } from "@/helper/workplaceHelpers/createTexts";
import { createMask } from "@/helper/mask/createMask";

export default function ImageWorkPlace() {
  const {
    selectedImg,
    selectedScale,
    workPlaceRef,
    canvasRef,
    overlayRef,
    appRef,
    maskContainerRef,
    maskGraphRef,
    hoverMaskGraphRef,
    maskBrushSize,
    maskErase
  } = useWorkSession();

  const { setCropBox, setTextPosition, setTextRelativePosition, addMask } =
    useSessionStore();

  const image = useSessionStore((state) =>
    state.sessionData.find((si) => si.id === selectedImg),
  );

  const [draggableText, setDraggable] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  //TODO: Nem usestate mert ugy laggos hanem ref-feljük
  const lastX = useRef<number | null>(null);
  const lastY = useRef<number | null>(null);

  const box = image?.box;
  const expandMode = image?.expandMode;
  const copyrightImage = image?.copyrightImage;
  const texts = image?.texts ?? [];
  const cropSaved = image?.cropSave ?? false;
  const borderSize = image?.borderSize;
  const imgW = image?.dimesions?.width ?? 1;
  const imgH = image?.dimesions?.height ?? 1;
  const masks = image?.masks;
  const brushSize = maskBrushSize;

  const maskGraph = maskGraphRef?.current;


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

  createMask({
    appRef,
    brushSize,
    maskContainerRef,
    hoverMaskGraphRef,
    lastX,
    lastY,
    maskGraph,
    masks,
    addMask,
    selectedImg,
    isDrawing,
    setIsDrawing,
    maskErase
  });

  const canvasH = canvasRef.current?.clientHeight ?? 1080;
  const canvasW = canvasRef.current?.clientWidth ?? 1080;

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
