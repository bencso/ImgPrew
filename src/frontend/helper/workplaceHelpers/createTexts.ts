import { DraggableImageEvent } from "@/interfaces/interface";
import { CreateTextsProps } from "@/interfaces/workplaceHelper.interface";
import { isXPositions, isYPositions } from "../positions/checkXYPositions";
import { calculatePosition } from "../positions/calculationPosition";
import { BitmapText } from "pixi.js";

export function createTexts(props: CreateTextsProps) {
  const texts = props.texts ?? [];
  const appRef = props.appRef;
  const scale = props.scale ?? 1;
  const canvasRef = props.canvasRef;
  const borderSize = props.borderSize;
  const draggableText = props.draggableText;
  const overlayRef = props.overlayRef;
  const selectedImg = props.selectedImg;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  texts.forEach((text: DraggableImageEvent) => {
    if (appRef.current) {
      appRef.current.stage.hitArea = appRef.current.screen;
      appRef.current.stage.eventMode = "static";
      appRef.current.stage.interactiveChildren = true;
      appRef.current.stage.off("pointerdown");
      appRef.current.stage.off("pointermove");
      appRef.current.stage.off("pointerup");
      appRef.current.stage.off("pointerupoutside");
    }

    let textPosition = text.position;
    const relativePosition = text.relativePosition;

    ctx.font = `${text.fontSize * scale}px ${text.fontFamily}`;

    const textFont = ctx.measureText(text.text);
    const textSize = {
      offsetHeight: textFont.fontBoundingBoxAscent/scale,
      offsetWidth: textFont.width/scale,
    };

    textPosition = {
      x: Number(textPosition.x) ,
      y: Number(textPosition.y) ,
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

    const textElement = new BitmapText({
      text: text.text,
      style: {
        fontFamily: text.fontFamily,
        fontSize: text.fontSize * scale,
        fill: text.color,
      },
    });

    textElement.roundPixels = true;
    textElement.x = (Number(textPosition.x) ?? 0) * scale;
    textElement.y = (Number(textPosition.y) ?? 0) * scale;

    textElement.eventMode = "static";
    textElement.cursor = "pointer";
    textElement.interactive = true;

    textElement.on("pointerdown", (_event) => {
      props.setDraggable(text.id);
      textElement.anchor = 0.5;
    });

    appRef.current?.stage.on("pointermove", (event) => {
      if (draggableText === text.id) {
        const newPosition = event.global;
        textElement.position.set(newPosition.x, newPosition.y);
      }
    });

    appRef.current?.stage.on("pointerup", () => {
      props.setDraggable(null);
      props.setTextPosition(
        selectedImg,
        text.id,
        {
          x: textElement.x,
          y: textElement.y,
        },
        scale,
      );
      props.setTextRelativePosition(selectedImg, text.id, {
        x: 0,
        y: 0,
      });
    });

    overlayRef.current?.addChild(textElement);
  });
}
