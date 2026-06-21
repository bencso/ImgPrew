import { Graphics } from "pixi.js";

  export function drawBrush(maskGraph: Graphics, x: number, y: number) {
    maskGraph.circle(x, y, 30);
    maskGraph.fill({
      color: 0xff0000,
    });
  }