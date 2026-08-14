import { CustomImage } from "@/interfaces/interface";
import { Application, Renderer } from "pixi.js";
import { RefObject } from "react";

export async function exportHald(
  id: number,
  selectedImg: number,
  selectedImage: CustomImage,
  appRef: RefObject<Application<Renderer> | null>,
) {
  if (id === selectedImg) {
    if (selectedImage && appRef.current) {
      return await appRef.current.renderer.extract.base64({
        target: selectedImage.haldSprite,
        format: "png",
        resolution: 1,
      });
    }
  }
}
