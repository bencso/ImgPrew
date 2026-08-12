import { CustomImage } from "@/interfaces/interface";
import { Application, Sprite, Texture } from "pixi.js";
import { RefObject } from "react";
import { start } from "repl";

export interface applyFiltersProps {
  startIndex?: number;
  image: CustomImage | undefined;
  spriteRef: RefObject<Sprite | null>;
  appRef: RefObject<Application | null>;
  textureRef: RefObject<Texture | null>;
  renderSpriteRef: RefObject<Sprite | null>;
}

export function applyFilters(props: applyFiltersProps) {
  const startIndex = props.startIndex ? props.startIndex : 0;
  const image = props.image;
  const lutFilter = image?.lutFilter;
  const haldSprite = image?.haldSprite;
  const spriteRef = props.spriteRef;
  const appRef = props.appRef;
  const textureRef = props.textureRef;
  const renderSpriteRef = props.renderSpriteRef.current;

  if (!appRef.current) return;

  const imageFilter = image?.filter;

  if (spriteRef.current && imageFilter && haldSprite) {
    spriteRef.current.filters = lutFilter
      ? [lutFilter, imageFilter]
      : [imageFilter];
    haldSprite.filters = lutFilter ? [lutFilter, imageFilter] : [imageFilter];
  }

  if (
    image &&
    image.renderTextures &&
    image.renderTextures.length > 0 &&
    spriteRef.current
  ) {
    let input =
      startIndex === 0
        ? textureRef.current
        : image.renderTextures[startIndex - 1].resultTexture;

    const layers = image.renderTextures;

    for (let i = startIndex; i < layers.length; i++) {
      const layer = image.renderTextures[i];

      if (spriteRef.current && renderSpriteRef) {
        renderSpriteRef.texture = input;

        if (layer.filter && appRef.current) {
          if (layer.filter.resources.layer_mask !== layer.maskTexture.source)
            layer.filter.resources.layer_mask = layer.maskTexture.source;

          layer.haldSprite.filters = [layer.filterMask];
          renderSpriteRef.filters = [layer.filter];

          appRef.current.renderer.render({
            container: renderSpriteRef,
            target: layer.resultTexture,
            clear: true,
          });

          input = layer.resultTexture;
        }
      }
    }

    spriteRef.current.texture = input;
    spriteRef.current.filters = [];
  }
}
