//TODO: Refaktorálni

import { DraggableImageEvent } from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box, Flex, Grid, GridItem, Image, Span } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import WebGlComponent from "../webGlComponent";
import { Rnd } from "react-rnd";
import { minMaxValidation } from "@/helper/errorHelper";
import { CropGrid } from "../ui/cropgrid";
import { calculatePosition } from "@/helper/calculationPosition";
import { BitmapText, Text } from "pixi.js";

export default function ImageWorkPlace() {
  const {
    selectedImg,
    setCopyrightImageRef,
    selectedScale,
    workPlaceRef,
    canvasRef,
    overlayRef,
    appRef,
  } = useWorkSession();
  const { setCropBox, setTextPosition } = useSessionStore();

  const image = useSessionStore((state) =>
    state.sessionData.find((si) => si.id === selectedImg),
  );

  const [draggableText, setDraggable] = useState<string | null>(null);

  const box = image?.box;
  const cpPosition = image?.copyrightImage?.position;
  const expandMode = image?.expandMode;
  const copyrightImage = image?.copyrightImage;
  const texts = image?.texts ?? [];
  const cropSaved = image?.cropSave ?? false;

  const cropboxScale = Math.min(
    (canvasRef.current?.clientWidth ?? 0) / (image?.dimesions?.width ?? 1),
    (canvasRef.current?.clientHeight ?? 0) / (image?.dimesions?.height ?? 1),
  );

  overlayRef.current?.removeChildren();

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

    const textPosition = text.position;
    const scale = selectedScale?.scale ?? 1;

    const textElement = new BitmapText({
      text: text.text,
      style: {
        fontFamily: text.fontFamily,
        fontSize: text.fontSize * scale,
        fill: text.color,
      },
    });

    textElement.roundPixels = true;
    textElement.x = Number(textPosition.x) * (selectedScale?.scale ?? 1);
    textElement.y = Number(textPosition.y) * (selectedScale?.scale ?? 1);

    textElement.eventMode = "static";
    textElement.cursor = "pointer";
    textElement.interactive = true;

    textElement.on("pointerdown", (event) => {
      setDraggable(text.id);
      textElement.anchor = 0.5;
    });

    appRef.current?.stage.on("pointermove", (event) => {
      console.log(draggableText);
      if (draggableText === text.id) {
        const newPosition = event.global;
        textElement.position.set(newPosition.x, newPosition.y);

        setTextPosition(
          selectedImg,
          text.id,
          {
            x: newPosition.x,
            y: newPosition.y,
          },
          selectedScale?.scale ?? 1,
        );
      }
    });

    appRef.current?.stage.on("pointerup", () => {
      console.log("Elengedve");
      setDraggable(null);
    });

    overlayRef.current?.addChild(textElement);
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
      <WebGlComponent />
    </Flex>
  );
}
