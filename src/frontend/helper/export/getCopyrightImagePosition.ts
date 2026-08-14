import { CustomImage, XPositions, YPositions } from "@/interfaces/interface";
import { isXPositions, isYPositions } from "../positions/checkXYPositions";
import { calculatePosition } from "../positions/calculationPosition";
import { RefObject } from "react";

export async function getCopyrightImagePosition(
  selectedImage: CustomImage,
  cpRelativePosition:
    | {
        x: number | XPositions;
        y: YPositions | number;
      }
    | undefined,
  scale: number,
  canvasRef: RefObject<HTMLCanvasElement | null>,
) {
  if (
    isXPositions(cpRelativePosition?.x) &&
    isYPositions(cpRelativePosition?.y)
  ) {
    const position = calculatePosition({
      positionX: cpRelativePosition?.x,
      positionY: cpRelativePosition?.y,
      elementRef: {
        offsetHeight: Number(selectedImage.copyrightImage?.size?.height ?? 0),
        offsetWidth: Number(selectedImage.copyrightImage?.size?.width ?? 0),
      },
      referenceElement: canvasRef,
      imageScale: scale,
      borderSize: selectedImage.borderSize,
    });

    return {
      x: position.x,
      y: position.y,
    };
  }
}
