import { MasksProps, RenderLayer } from "@/interfaces/mask.interface";
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
  selectedLayer: number | null;
  scale: number;
  spriteRef: RefObject<Sprite | null>;
}

export const createMask = (props: createMaskProps) => {
  const appRef = props.appRef;
  const hoverMaskGraphRef = props.hoverMaskGraphRef;
  const selectedImg = props.selectedImg;
  const maskErase = props.maskErase;
  const brushRef = props.brushRef.current;
  const renderTexture = props.renderTextureRef.current;
  const sharpness = props.sharpness ?? 0;
  const selectedLayer = props.selectedLayer ?? null;
  const scale = props.scale ?? 1;
  const brushSize = props.brushSize;

  const gradient = new FillGradient({
    type: "radial",
    center: { x: 0.5, y: 0.5 },
    innerRadius: 0,
    outerCenter: { x: 0.5, y: 0.5 },
    outerRadius: 0.5,
    colorStops: [
      { offset: 0, color: "rgba(255,255,255,1)" },
      { offset: sharpness, color: "#fff" },
      { offset: 1, color: "rgba(255,0,0,0)" },
    ],
    textureSpace: "local",
  });

  function paint(x: number, y: number) {
    if (!brushRef || selectedLayer === null) return;

    brushRef.clear();

    if (maskErase === false) {
      brushRef.blendMode = "normal";
      brushRef.circle(x / scale, y / scale, brushSize / scale);
      brushRef.fill(gradient);
    } else {
      brushRef.blendMode = "erase";
      brushRef.circle(x / scale, y / scale, brushSize / scale);
      brushRef.fill(gradient);
    }

    if (appRef.current && renderTexture && brushRef) {
      appRef.current.renderer.render({
        container: brushRef,
        target: renderTexture,
        clear: false,
      });
    }
  }

  appRef.current?.stage.on("pointermove", (e) => {
    const localPos = e.global;

    if (!localPos) return;

    const x = localPos.x;
    const y = localPos.y;

    hoverMaskGraphRef.current.x = x;
    hoverMaskGraphRef.current.y = y;

    if (
      props.isDrawing === false ||
      !props.lastX.current ||
      !props.lastY.current ||
      selectedLayer === null
    )
      return;

    drawLine(props.lastX.current, props.lastY.current, x, y, brushSize, paint);

    props.lastX.current = x;
    props.lastY.current = y;
  });

  appRef.current?.stage.on("pointerup", () => {
    if (!brushRef || selectedLayer === null) return;

    props.setIsDrawing(false);
  });

  appRef.current?.stage.on("pointerdown", (e) => {
    props.setIsDrawing(true);
    const localPos = e.global;

    if (!localPos) return;

    props.lastX.current = localPos.x;
    props.lastY.current = localPos.y;

    if (selectedLayer !== null) paint(localPos.x, localPos.y);
  });

  useEffect(() => {
    hoverMaskGraphRef.current.clear();

    if (selectedLayer !== null) {
      hoverMaskGraphRef.current.circle(0, 0, brushSize);
      hoverMaskGraphRef.current.fill(gradient);
    }
  }, [selectedImg, brushSize, sharpness, selectedLayer]);
};
