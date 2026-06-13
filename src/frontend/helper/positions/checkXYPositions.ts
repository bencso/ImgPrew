import { XPositions, YPositions } from "@/interfaces/interface";

  export function isXPositions(value: unknown): value is XPositions {
    return Object.values(XPositions).includes(value as XPositions) ?? false;
  }

  export function isYPositions(value: unknown): value is YPositions {
    return Object.values(YPositions).includes(value as YPositions) ?? false;
  }