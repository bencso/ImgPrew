import { CustomImage } from "@/interfaces/interface";
import { Application, Renderer } from "pixi.js";
import { RefObject } from "react";

export async function exportMasks(
  selectedImage: CustomImage,
  appRef: RefObject<Application<Renderer> | null>,
): Promise<string[]> {
  let masksImages: string[] = [];
  const imageMasks = selectedImage.renderTextures;

  if (imageMasks && imageMasks.length > 0 && appRef.current) {
    for (const imageMask of imageMasks) {
      masksImages.push(
        await appRef.current.renderer.extract.base64({
          target: imageMask.maskTexture,
          format: "png",
          resolution: 1,
        }),
      );
    }
  }

  return masksImages;
}
