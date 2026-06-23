//TODO: Egy külön réteg hogy a blendmode erase jó legyen (szerintem ugy lesz jó...)
import {
  MaskCreateProps,
  MasksProps,
  Points,
} from "@/interfaces/mask.interface";
import {
  Application,
  Container,
  ContainerChild,
  Graphics,
  Renderer,
} from "pixi.js";
import { drawBrush } from "./drawBrush";
import { Dispatch, RefObject, SetStateAction, use, useEffect } from "react";
import { drawLine } from "./drawLine";

interface createMaskProps {
  appRef: RefObject<Application<Renderer> | null>;
  maskGraph: Graphics | null;
  maskDeleteGraph: Graphics | null;
  isDrawing: boolean;
  setIsDrawing: Dispatch<SetStateAction<boolean>>;
  lastY: RefObject<number | null>;
  lastX: RefObject<number | null>;
  brushSize: number;
  hoverMaskGraphRef: RefObject<Graphics>;
  maskContainerRef: RefObject<Container<ContainerChild> | null>;
  masks: MasksProps[] | undefined;
  selectedImg: number;
  addMask: (id: number, type: string, brushSize: number, point: Points) => void;
  maskErase: boolean;
}

export const createMask = (props: createMaskProps) => {
  const appRef = props.appRef;
  const hoverMaskGraphRef = props.hoverMaskGraphRef;
  const brushSize = props.brushSize;
  const maskContainerRef = props.maskContainerRef;
  const addMask = props.addMask;
  const selectedImg = props.selectedImg;
  const maskErase = props.maskErase;
  console.log(maskErase);
  const maskGraph = maskErase == true ? props.maskDeleteGraph : props.maskGraph;

  const type = maskErase ? MaskCreateProps.ERASE : MaskCreateProps.DRAW;

  useEffect(() => {
    const child = maskContainerRef.current?.getChildByLabel(
      hoverMaskGraphRef.current.label,
    );

    if (child) maskContainerRef.current?.removeChild(child);
    maskContainerRef.current?.addChild(hoverMaskGraphRef.current);
    hoverMaskGraphRef.current.clear();
    hoverMaskGraphRef.current.circle(0, 0, brushSize);
    hoverMaskGraphRef.current.fill({
      color: 0xff0000,
      alpha: 0.3,
    });
  }, [selectedImg, brushSize]);

  appRef.current?.stage.on("pointerdown", (e) => {
    props.setIsDrawing(true);
    if (!maskGraph) return;

    props.lastX.current = e.global.x;
    props.lastY.current = e.global.y;

    if (props.lastX && props.lastY)
      drawBrush(
        maskGraph,
        props.lastX.current,
        props.lastY.current,
        brushSize,
      );
  });

  appRef.current?.stage.on("pointermove", (e) => {
    const x = e.global.x;
    const y = e.global.y;

    hoverMaskGraphRef.current.x = x;
    hoverMaskGraphRef.current.y = y;

    if (
      props.isDrawing === false ||
      !maskGraph ||
      !props.lastX.current ||
      !props.lastY.current
    )
      return;

    drawLine(
      props.lastX.current,
      props.lastY.current,
      x,
      y,
      brushSize,
      maskGraph,
      selectedImg,
      addMask,
      type,
    );

    props.lastX.current = e.global.x;
    props.lastY.current = e.global.y;
  });

  appRef.current?.stage.on("pointerup", () => {
    props.setIsDrawing(false);
  });
};
