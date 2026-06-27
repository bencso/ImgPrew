import { CalculationReFixPositionProps } from "@/interfaces/interface";

export const calculatePosition = (props: CalculationReFixPositionProps) => {
  const imageScale = props.imageScale;

  if (!props.referenceElement.current) return;
  let x, y;

  const height = props.referenceElement.current.offsetHeight / imageScale;
  const width = props.referenceElement.current.offsetWidth / imageScale;

  const imageHalf = width / 2 - props.elementRef.offsetWidth / 2;

  const imageWCP = width - props.elementRef.offsetWidth;
  const imageHCP = height - props.elementRef.offsetHeight;

  const bX = props.borderSize?.x ?? 30;
  const bY = props.borderSize?.y ?? 30;

  x = props.positionX ?? bX;
  y = props.positionY ?? bY;

  const map: any = {
    left: {
      top: { x: bX, y: bY },
      center: { x: bX, y: imageHCP / 2 },
      bottom: { x: bX, y: imageHCP - bY },
    },
    center: {
      top: { x: imageHalf, y: bY },
      center: { x: imageHalf, y: imageHCP / 2 },
      bottom: {
        x: imageHalf,
        y: imageHCP - bY,
      },
    },
    right: {
      top: { x: imageWCP - bX, y: bY },
      center: {
        x: imageWCP - bX,
        y: imageHCP / 2,
      },
      bottom: {
        x: imageWCP - bX,
        y: imageHCP - bY,
      },
    },
  };

  
  return map[x][y] ?? { x, y };
};
