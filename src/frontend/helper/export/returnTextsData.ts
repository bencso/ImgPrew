import { ExportText } from "@/interfaces/exportTexts.interface";
import { DraggableImageEvent } from "@/interfaces/interface";
import { isXPositions, isYPositions } from "../positions/checkXYPositions";
import { calculatePosition } from "../positions/calculationPosition";
import { RefObject } from "react";

type returnTextsDataType = ExportText[] | null;

export function returnTextsData(
  imageTexts: DraggableImageEvent[],
  scale: number,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  borderSize: { x: number | null; y: number | null } | undefined,
): returnTextsDataType {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (ctx)
    return imageTexts.map((text) => {
      ctx.font = `${text.fontSize * scale}px ${text.fontFamily}`;

      const textFont = ctx.measureText(text.text);
      const textSize = {
        offsetHeight: textFont.fontBoundingBoxAscent / scale,
        offsetWidth: textFont.width / scale,
      };

      let textPosition = text.position;
      const relativePosition = text.relativePosition;

      textPosition = {
        x: Number(textPosition.x),
        y: Number(textPosition.y),
      };

      if (
        isXPositions(relativePosition?.x) &&
        isYPositions(relativePosition?.y)
      ) {
        textPosition = calculatePosition({
          positionX: relativePosition?.x,
          positionY: relativePosition?.y,
          elementRef: textSize,
          referenceElement: canvasRef,
          imageScale: scale,
          borderSize: borderSize,
        });
      }

      return {
        ...text,
        uiWidth: textFont.width / scale,
        uiAscent: textFont.fontBoundingBoxAscent / scale,
        uiDescent: textFont.fontBoundingBoxDescent / scale,
      } as ExportText;
    });
  else return null;
}
