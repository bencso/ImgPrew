import { BLEND_MODES, Graphics } from "pixi.js";

  export function drawBrush(maskGraph: Graphics, x: number, y: number, type: BLEND_MODES, brushSize: number) {
    maskGraph.circle(x, y, brushSize);
    maskGraph.fill({
      color: 0xff0000,
    });
    maskGraph.blendMode = type;
  }