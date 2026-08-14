import { CustomImage } from "@/interfaces/interface";
import { Application, Renderer } from "pixi.js";
import { RefObject } from "react";

export async function exportMaskHalds(
  selectedImage: CustomImage,
  appRef: RefObject<Application<Renderer> | null>,
): Promise<string[]> {
  let masksImageHalds: string[] = [];
  const imageMasks = selectedImage.renderTextures;

  if (imageMasks && imageMasks.length > 0 && appRef.current) {
    for (const imageMask of imageMasks) {
      masksImageHalds.push(
        await appRef.current.renderer.extract.base64({
          target: imageMask.haldSprite,
          format: "png",
          resolution: 1,
        }),
      );
    }
  }

  return masksImageHalds;
}
