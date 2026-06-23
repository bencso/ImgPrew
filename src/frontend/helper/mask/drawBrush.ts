import { Graphics } from "pixi.js";

export function drawBrush(
  maskGraph: Graphics,
  x: number,
  y: number,
  brushSize: number,
) {
  maskGraph.circle(x, y, brushSize);
  maskGraph.fill({
    color:  0xffffff,
  });
}
