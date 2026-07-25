import { Filter, RenderTexture, Sprite } from "pixi.js";

export enum MaskCreateProps {
  DRAW = "normal",
  ERASE = "erase",
}

export interface Points {
  x: number;
  y: number;
}

export interface MasksProps {
  type: MaskCreateProps;
  brushSize: number;
  points: Points[];
}

export interface RenderLayer {
  imageSprite: Sprite;
  maskSprite: Sprite;
  maskTexture: RenderTexture;
  filter: Filter;
}