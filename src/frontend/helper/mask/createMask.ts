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
import { Dispatch, RefObject, SetStateAction } from "react";
import { drawLine } from "./drawLine";

interface createMaskProps {
  appRef: RefObject<Application<Renderer> | null>;
  maskGraph: Graphics | null;
  isDrawing: boolean;
  setIsDrawing: Dispatch<SetStateAction<boolean>>;
  lastX: number | null;
  lastY: number | null;
  brushSize: number;
  hoverMaskGraphRef: RefObject<Graphics>;
  maskContainerRef: RefObject<Container<ContainerChild> | null>;
  masks: MasksProps[] | undefined;
  selectedImg: number;
  addMask: (
    id: number,
    type: MaskCreateProps,
    brushSize: number,
    point: Points,
  ) => void;
  setLastX: Dispatch<SetStateAction<number | null>>;
  setLastY: Dispatch<SetStateAction<number | null>>;
}

export const createMask = (props: createMaskProps) => {
  const appRef = props.appRef;
  const hoverMaskGraphRef = props.hoverMaskGraphRef;
  const maskGraph = props.maskGraph;
  const brushSize = props.brushSize;
  const maskContainerRef = props.maskContainerRef;
  const addMask = props.addMask;
  const selectedImg = props.selectedImg;

  appRef.current?.stage.on("pointerdown", (e) => {
    props.setIsDrawing(true);
    if (!maskGraph) return;

    props.setLastX(e.global.x);
    props.setLastY(e.global.y);

    if(props.lastX && props.lastY)
    drawBrush(maskGraph, props.lastX, props.lastY);
  });

  appRef.current?.stage.on("pointermove", (e) => {
    const x = e.global.x;
    const y = e.global.y;

    if (
      hoverMaskGraphRef.current &&
      !maskContainerRef.current?.getChildByLabel(
        hoverMaskGraphRef.current.label,
      )
    ) {
      maskContainerRef.current?.addChild(hoverMaskGraphRef.current);
      hoverMaskGraphRef.current.circle(0, 0, 30);
      hoverMaskGraphRef.current.fill({
        color: 0xff0000,
        alpha: 0.3,
      });
    }

    hoverMaskGraphRef.current.x = x;
    hoverMaskGraphRef.current.y = y;

    if (props.isDrawing === false || !maskGraph || !props.lastX || !props.lastY) return;

    drawLine(
      props.lastX,
      props.lastY,
      x,
      y,
      brushSize,
      maskGraph,
      selectedImg,
      addMask,
    );

    props.setLastX(e.global.x);
    props.setLastY(e.global.y);
  });

  appRef.current?.stage.on("pointerup", () => {
    props.setIsDrawing(false);
  });
};
