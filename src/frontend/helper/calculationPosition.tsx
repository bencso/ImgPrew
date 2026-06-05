import { CalculationReFixPositionProps } from "@/interfaces/interface";
//TODO: Még majd annyit hogy ha változik az értéke a képnek vagy a szöveg méretének akkor újra kell számolni annak fgv-nyben

export const calculatePosition = (props: CalculationReFixPositionProps) => {
  const imageScale = props.imageScale;

  if (!props.textAndImagePlaceRef.current) return;
  let x, y;

  const height = props.textAndImagePlaceRef.current.offsetHeight;
  const width = props.textAndImagePlaceRef.current.offsetWidth;

  const imageHalf = width / 2 - props.elementRef.offsetWidth / 2;

  const imageWCP = width - props.elementRef.offsetWidth;
  const imageHCP = height - props.elementRef.offsetHeight;

  const bX =
    (props.borderSize?.x === undefined || props.borderSize.x === null
      ? 0
      : props.borderSize.x) +
    30 * imageScale;
  const bY =
    (props.borderSize?.y === undefined || props.borderSize.y === null
      ? 0
      : props.borderSize.y) +
    30 * imageScale;

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
