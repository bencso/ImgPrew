//TODO: Refaktorálni

import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import WebGlComponent from "../webGlComponent";
import { Rnd } from "react-rnd";
import { minMaxValidation } from "@/helper/errorHelper";
import { CropGrid } from "../ui/cropgrid";
import { calculatePosition } from "@/helper/calculationPosition";
import { BitmapText, ImageSource, Sprite, Texture } from "pixi.js";
import { isXPositions, isYPositions } from "@/helper/checkXYPositions";

export default function ImageWorkPlace() {
  const {
    selectedImg,
    selectedScale,
    workPlaceRef,
    canvasRef,
    overlayRef,
    setCopyrightImageRef,
    appRef,
    copyrightImageRef,
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

  const cropboxScale = Math.min(
    (canvasRef.current?.clientWidth ?? 0) / (image?.dimesions?.width ?? 1),
    (canvasRef.current?.clientHeight ?? 0) / (image?.dimesions?.height ?? 1),
  );
  const scale = selectedScale?.scale ?? 1;

  overlayRef.current?.removeChildren();

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  texts.forEach((text) => {
    if (appRef.current) {
      appRef.current.stage.hitArea = appRef.current.screen;
      appRef.current.stage.eventMode = "static";
      appRef.current.stage.interactiveChildren = true;
      appRef.current.stage.off("pointerdown");
      appRef.current.stage.off("pointermove");
      appRef.current.stage.off("pointerup");
      appRef.current.stage.off("pointerupoutside");
    }

    let textPosition = text.position;
    const relativePosition = text.relativePosition;

    ctx.font = `${text.fontSize * (selectedScale?.scale ?? 0)}px ${text.fontFamily}`;

    const textFont = ctx.measureText(text.text);
    const textSize = {
      offsetHeight: textFont.fontBoundingBoxAscent,
      offsetWidth: textFont.width,
    };

    textPosition = {
      x: Number(textPosition.x) * scale,
      y: Number(textPosition.y) * scale,
    };

    if (
      isXPositions(relativePosition?.x) &&
      isYPositions(relativePosition?.y)
    ) {
      textPosition = calculatePosition({
        positionX: relativePosition?.x,
        positionY: relativePosition?.y,
        elementRef: textSize,
        referenceElement: canvasRef,
        imageScale: scale,
        borderSize: borderSize,
      });
    }

    const textElement = new BitmapText({
      text: text.text,
      style: {
        fontFamily: text.fontFamily,
        fontSize: text.fontSize * scale,
        fill: text.color,
      },
    });

    textElement.roundPixels = true;
    textElement.x = Number(textPosition.x) ?? 0;
    textElement.y = Number(textPosition.y) ?? 0;

    textElement.eventMode = "static";
    textElement.cursor = "pointer";
    textElement.interactive = true;

    textElement.on("pointerdown", (_event) => {
      setDraggable(text.id);
      textElement.anchor = 0.5;
    });

    appRef.current?.stage.on("pointermove", (event) => {
      console.log(draggableText);
      if (draggableText === text.id) {
        const newPosition = event.global;
        textElement.position.set(newPosition.x, newPosition.y);
      }
    });

    appRef.current?.stage.on("pointerup", () => {
      setDraggable(null);
      setTextPosition(
        selectedImg,
        text.id,
        {
          x: textElement.x,
          y: textElement.y,
        },
        scale,
      );
      setTextRelativePosition(selectedImg, text.id, {
        x: 0,
        y: 0,
      });
    });

    overlayRef.current?.addChild(textElement);
  });

  //COPYRIGHT IMAGE

  if (copyrightImage?.blob) {
    const imageElement = new Image();
    if (copyrightImage?.blob) imageElement.src = copyrightImage?.blob;

    const copyrightImageSource = new ImageSource({
      resource: imageElement,
    });
    const copyrightImageTexture = new Texture({
      source: copyrightImageSource,
    });

    const copyrightImageSprite = new Sprite(copyrightImageTexture);

    let position = copyrightImage?.position;
    const relativePosition = copyrightImage?.relativePosition;

    copyrightImageSprite.height = (copyrightImage.size?.height ?? 300) * scale;
    copyrightImageSprite.width = (copyrightImage.size?.width ?? 300) * scale;

    if (
      isXPositions(relativePosition?.x) &&
      isYPositions(relativePosition?.y)
    ) {
      position = calculatePosition({
        positionX: relativePosition?.x,
        positionY: relativePosition?.y,
        elementRef: {
          offsetHeight:
            copyrightImage.size?.height ?? copyrightImageSprite.height,
          offsetWidth: copyrightImage.size?.width ?? copyrightImageSprite.width,
        },
        referenceElement: canvasRef,
        imageScale: scale,
        borderSize: borderSize,
      });
    }

    copyrightImageSprite.x = position?.x ? Number(position.x) * scale : 0;
    copyrightImageSprite.y = position?.y ? Number(position.y) * scale : 0;

    overlayRef.current?.addChild(copyrightImageSprite);
  }

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
        h={canvasRef.current?.clientHeight ?? 1080}
        w={canvasRef.current?.clientWidth ?? 1080}
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
            maxHeight={canvasRef.current?.clientHeight}
            maxWidth={canvasRef.current?.clientWidth}
            bounds={canvasRef.current?.firstElementChild ?? ""}
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
                  width: (parseFloat(d.node.style.width) ?? 300) / cropboxScale,
                  currentHeight: canvasRef.current?.clientHeight,
                  currentWidth: canvasRef.current?.clientWidth,
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
                  currentHeight: canvasRef.current?.clientHeight,
                  currentWidth: canvasRef.current?.clientWidth,
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
