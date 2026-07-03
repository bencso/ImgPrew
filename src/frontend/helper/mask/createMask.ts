import { MasksProps } from "@/interfaces/mask.interface";
import {
  Application,
  Container,
  ContainerChild,
  FillGradient,
  Graphics,
  Renderer,
  RenderTexture,
  Sprite,
} from "pixi.js";
import { Dispatch, RefObject, SetStateAction, useEffect } from "react";
import { drawLine } from "./drawLine";

interface createMaskProps {
  appRef: RefObject<Application<Renderer> | null>;
  isDrawing: boolean;
  setIsDrawing: Dispatch<SetStateAction<boolean>>;
  lastY: RefObject<number | null>;
  lastX: RefObject<number | null>;
  brushSize: number;
  hoverMaskGraphRef: RefObject<Graphics>;
  masks: MasksProps[] | undefined;
  selectedImg: number;
  maskErase: boolean;
  maskContainer: Container<ContainerChild> | null;
  brushRef: RefObject<Graphics | null>;
  renderTextureRef: RefObject<RenderTexture | null>;
  sharpness: number;
}

export const createMask = (props: createMaskProps) => {
  const appRef = props.appRef;
  const hoverMaskGraphRef = props.hoverMaskGraphRef;
  const brushSize = props.brushSize;
  const selectedImg = props.selectedImg;
  const maskErase = props.maskErase;
  const maskContainer = props.maskContainer;
  const brushRef = props.brushRef.current;
  const renderTexture = props.renderTextureRef.current;
  const sharpness = props.sharpness ?? 0;

  const gradient = new FillGradient({
    type: "radial",
    center: { x: 0.5, y: 0.5 },
    innerRadius: 0,
    outerCenter: { x: 0.5, y: 0.5 },
    outerRadius: 0.5,
    colorStops: [
      { offset: 0, color: "#ff0000" },
      { offset: sharpness, color: "#ff0000" },
      { offset: 1, color: "#ff000000" },
    ],
    textureSpace: "local",
  });

  function paint(x: number, y: number) {
    if (!brushRef) return;

    brushRef.clear();

    if (maskErase === false) {
      brushRef.blendMode = "normal";
      brushRef.circle(x, y, brushSize);
      brushRef.fill(gradient);
    } else {
      brushRef.blendMode = "erase";
      brushRef.circle(x, y, brushSize);
      brushRef.fill(gradient);
    }

    if (appRef.current && renderTexture && maskContainer) {
      appRef.current.renderer.render({
        container: maskContainer,
        target: renderTexture,
        clear: false,
      });
    }
  }

  appRef.current?.stage.on("pointermove", (e) => {
    const x = e.global.x;
    const y = e.global.y;

    hoverMaskGraphRef.current.x = x;
    hoverMaskGraphRef.current.y = y;

    if (
      props.isDrawing === false ||
      !props.lastX.current ||
      !props.lastY.current
    )
      return;

    drawLine(props.lastX.current, props.lastY.current, x, y, brushSize, paint);

    props.lastX.current = e.global.x;
    props.lastY.current = e.global.y;
  });

  appRef.current?.stage.on("pointerup", () => {
    if (!brushRef) return;

    props.setIsDrawing(false);
  });

  appRef.current?.stage.on("pointerdown", (e) => {
    props.setIsDrawing(true);

    props.lastX.current = e.global.x;
    props.lastY.current = e.global.y;

    if (
      props.lastX &&
      typeof props.lastX === "number" &&
      props.lastY &&
      typeof props.lastY === "number"
    ) {
      paint(props.lastX, props.lastY);
    }
  });

  useEffect(() => {
    hoverMaskGraphRef.current.clear();
    hoverMaskGraphRef.current.circle(0, 0, brushSize);
    hoverMaskGraphRef.current.fill(gradient);
  }, [selectedImg, brushSize, sharpness]);
};
