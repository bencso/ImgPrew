export enum MaskCreateProps {
  DRAW,
  ERASE,
}

export interface Points {
  x: number;
  y: number;
}

export interface MasksProps {
  type: MaskCreateProps;
  brushSize: number;
  points: Points[];
}
