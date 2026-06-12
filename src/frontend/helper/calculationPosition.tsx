import { CalculationReFixPositionProps } from "@/interfaces/interface";

export const calculatePosition = (props: CalculationReFixPositionProps) => {
  const imageScale = props.imageScale;


  if (!props.referenceElement.current) return;
  let x, y;

  const height = props.referenceElement.current.offsetHeight / imageScale;
  const width = props.referenceElement.current.offsetWidth / imageScale;

  const imageHalf = width / 2 - props.elementRef.offsetWidth / imageScale / 2;

  const imageWCP = width - props.elementRef.offsetWidth / imageScale;
  const imageHCP = height - props.elementRef.offsetHeight / imageScale;

  const bX = props.borderSize?.x ?? 30;
  const bY = props.borderSize?.y ?? 30;

  x = props.positionX ?? bX;
  y = props.positionY ?? bY;
  
  const map: any = {
    left: {
      top: { x: bX * imageScale, y: bY * imageScale },
      center: { x: bX * imageScale, y: (imageHCP / 2) * imageScale },
      bottom: { x: bX * imageScale, y: (imageHCP - bY) * imageScale },
    },
    center: {
      top: { x: imageHalf * imageScale, y: bY * imageScale },
      center: { x: imageHalf * imageScale, y: (imageHCP / 2) * imageScale },
      bottom: {
        x: imageHalf * imageScale,
        y: (imageHCP - bY) * imageScale,
      },
    },
    right: {
      top: { x: (imageWCP - bX) * imageScale, y: bY * imageScale },
      center: {
        x: (imageWCP - bX) * imageScale,
        y: (imageHCP / 2) * imageScale,
      },
      bottom: {
        x: (imageWCP - bX) * imageScale,
        y: (imageHCP - bY) * imageScale,
      },
    },
  };
  
  console.log("calculate");
console.log(map[x][y]);
  return map[x][y] ?? { x, y };
};
