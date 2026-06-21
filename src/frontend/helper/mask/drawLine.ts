import {
  MaskCreateProps,
  MasksProps,
  Points,
} from "@/interfaces/mask.interface";
import { drawBrush } from "./drawBrush";
import { Graphics } from "pixi.js";

// Linear interpolation : https://hu.wikipedia.org/wiki/Interpol%C3%A1ci%C3%B3
export function drawLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  brushSize: number,
  maskGraph: Graphics,
   selectedImg: number,
  addMask: (id: number, type: MaskCreateProps, brushSize: number, point: Points) => void
) {
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

      addMask(selectedImg, MaskCreateProps.DRAW, 30, {
        x,
        y,
      });

    drawBrush(maskGraph, x, y);
  }
}
