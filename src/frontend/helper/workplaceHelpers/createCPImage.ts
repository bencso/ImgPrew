import { ImageSource, Sprite, Texture } from "pixi.js";
import { isXPositions, isYPositions } from "../positions/checkXYPositions";
import { calculatePosition } from "../positions/calculationPosition";
import { CreateCPImageProps } from "@/interfaces/workplaceHelper.interface";

export function createCPImage(props: CreateCPImageProps) {
  const copyrightImage = props.copyrightImage;
  const canvasRef = props.canvasRef;
  const borderSize = props.borderSize;
  const scale = props.scale;
  const overlayRef = props.overlayRef;

  if (copyrightImage?.blob) {
    const imageElement = new Image();
    if (copyrightImage?.blob) imageElement.src = copyrightImage?.blob;

    const copyrightImageSource = new ImageSource({
      resource: imageElement,
    });
    const copyrightImageTexture = new Texture({
      source: copyrightImageSource,
    });

    const copyrightImageSprite = new Sprite(copyrightImageTexture);

    let position = copyrightImage?.position;
    const relativePosition = copyrightImage?.relativePosition;

    copyrightImageSprite.height = (copyrightImage.size?.height ?? 300) * scale;
    copyrightImageSprite.width = (copyrightImage.size?.width ?? 300) * scale;

    if (
      isXPositions(relativePosition?.x) &&
      isYPositions(relativePosition?.y)
    ) {
      position = calculatePosition({
        positionX: relativePosition?.x,
        positionY: relativePosition?.y,
        elementRef: {
          offsetHeight:
            copyrightImage.size?.height ?? copyrightImageSprite.height,
          offsetWidth: copyrightImage.size?.width ?? copyrightImageSprite.width,
        },
        referenceElement: canvasRef,
        imageScale: scale,
        borderSize: borderSize,
      });
    }

    copyrightImageSprite.x = position?.x ? Number(position.x) * scale : 0;
    copyrightImageSprite.y = position?.y ? Number(position.y) * scale : 0;

    overlayRef.current?.addChild(copyrightImageSprite);
  }
}
