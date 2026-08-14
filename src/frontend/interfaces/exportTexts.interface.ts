import { DraggableImageEventPosition, XPositions, YPositions } from "./interface";

export interface ExportText {
  uiWidth: number;
  uiAscent: number;
  uiDescent: number;
  id: string;
  text: string;
  position: DraggableImageEventPosition;
  relativePosition?: { x: XPositions | number; y: YPositions | number };
  enabled: boolean;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  color: string;
  opacity: number;
}
