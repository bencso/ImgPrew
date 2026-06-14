import { CropBox } from "@/interfaces/interface";
import { Sprite, Texture, Application, Renderer, TextureSource } from "pixi.js";
import { RefObject } from "react";

export const calcScale = ({
  workPlaceRef,
  appRef,
  textureRef,
  spriteRef,
  imageSize,
  expandMode,
  expandSize,
  canvasRef,
  cropSaved,
  box,
  borderSize,
}: {
  workPlaceRef: RefObject<HTMLDivElement | null>;
  appRef: RefObject<Application<Renderer> | null>;
  textureRef: RefObject<Texture<TextureSource<any>> | null>;
  spriteRef: RefObject<Sprite | null>;
  imageSize:
    | {
        width: number;
        height: number;
      }
    | undefined;
  expandMode: string;
  expandSize:
    | {
        width: number;
        height: number;
        padding?: number | undefined;
      }
    | undefined;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  cropSaved: boolean | undefined;
  box: CropBox | undefined;
  borderSize:
    | {
        x: number | null;
        y: number | null;
      }
    | undefined;
}) => {
  if (
    !workPlaceRef.current ||
    !appRef.current ||
    !textureRef.current ||
    !spriteRef.current
  )
    return 1;

  const imgW = textureRef.current.width;
  const imgH = textureRef.current.height;

  const areaW = workPlaceRef.current.offsetWidth;
  const areaH = workPlaceRef.current.offsetHeight;

  if (expandMode === "expand" && expandSize) {
    if (!canvasRef.current || !textureRef.current || !imageSize) return 1;

    const h = expandSize.height;
    const w = expandSize.width;

    const canvasScale = Math.min(areaW / w, areaH / h);

    return canvasScale;
  } else {
    const scale = Math.min(areaH / imgH, areaW / imgW);

    if (expandMode === "crop" && cropSaved === true) {
      if (
        !textureRef.current ||
        !workPlaceRef.current ||
        !appRef.current ||
        !box ||
        !spriteRef.current ||
        !imageSize ||
        !box.x ||
        !box.y ||
        !box.height ||
        !box.width ||
        !canvasRef.current
      )
        return 1;

      const scaleX = box?.currentWidth
        ? (workPlaceRef.current?.clientWidth ?? 0) / imageSize.width
        : 1;
      const scaleY = box?.currentHeight
        ? (workPlaceRef.current?.clientHeight ?? 0) / imageSize.height
        : 1;

      const h = box.height * scaleY;
      const w = box.width * scaleX;

      const defaultImageScaleH =
        imageSize.height / workPlaceRef.current?.clientHeight;
      const defaultImageScaleW =
        imageSize.width / workPlaceRef.current?.clientWidth;

      const canvasW = w * defaultImageScaleW;
      const canvasH = h * defaultImageScaleH;

      const targetH = Math.floor(canvasH + (borderSize?.y ?? 0));
      const targetW = Math.floor(canvasW + (borderSize?.x ?? 0));

      const scale = Math.min(
        canvasRef.current.clientHeight / (targetH ?? 0),
        canvasRef.current.clientWidth / (targetW ?? 0),
      );

      return scale;
    }

    if (expandMode === "no" || (expandMode === "crop" && cropSaved === false)) {
      return scale;
    }

    if (expandMode === "border") {
      const borderSizeX = typeof borderSize?.x === "number" ? borderSize?.x : 0;
      const borderSizeY = typeof borderSize?.y === "number" ? borderSize?.y : 0;

      const imgW = imageSize?.width ?? 0;
      const imgH = imageSize?.height ?? 0;

      const h = imgH + borderSizeX;
      const w = imgW + borderSizeY;

      let scale = Math.min(
        workPlaceRef.current.clientHeight / (h ?? 0),
        workPlaceRef.current.clientWidth / (w ?? 0),
      );

      return scale;
    }
    return 1;
  }
};
