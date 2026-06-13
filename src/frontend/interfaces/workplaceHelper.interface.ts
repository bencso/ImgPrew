import { Dispatch, RefObject, SetStateAction } from "react";
import {
  CopyrightImage,
  DraggableImageEvent,
  XPositions,
  YPositions,
} from "./interface";
import { Application, Container, ContainerChild, Renderer } from "pixi.js";

export interface CreateCPImageProps {
  copyrightImage: CopyrightImage | undefined;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  borderSize:
    | {
        x: number | null;
        y: number | null;
      }
    | undefined;
  scale: number;
  overlayRef: RefObject<Container<ContainerChild> | null>;
}

export interface CreateTextsProps {
  texts: DraggableImageEvent[];
  copyrightImage: CopyrightImage | undefined;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  borderSize:
    | {
        x: number | null;
        y: number | null;
      }
    | undefined;
  scale: number;
  overlayRef: RefObject<Container<ContainerChild> | null>;
  appRef: RefObject<Application<Renderer> | null>;
  draggableText: string | null;
  setDraggable: Dispatch<SetStateAction<string | null>>;
  setTextPosition: (
    imageId: number,
    textId: string,
    position: {
      x: number | XPositions;
      y: number | YPositions;
    },
    scale: number,
  ) => void;
  setTextRelativePosition: (
    imageId: number,
    textId: string,
    position: {
      x: number | XPositions;
      y: number | YPositions;
    },
  ) => void;
  selectedImg: number;
}
