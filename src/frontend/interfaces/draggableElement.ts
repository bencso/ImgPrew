import React, { createRef } from "react";
import Draggable from "react-draggable";
import { Box, Text } from "@chakra-ui/react";

interface DraggableImageEventPosition {
  x: number;
  y: number;
}

interface TextStyles {
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
}

export class DraggableImageEvent {
  text: string;
  textStyles: TextStyles;
  position: DraggableImageEventPosition;
  enabled: boolean = false;
  nodeRef: React.RefObject<HTMLDivElement | null>;

  constructor(text: string, position: DraggableImageEventPosition) {
    this.text = text;
    this.position = position;
    this.enabled = true;
    this.nodeRef = createRef<HTMLDivElement>();
    this.textStyles = {
      fontSize: 20,
      fontFamily: "Inter",
      fontWeight: 500,
    };
  }

  get textParam() {
    return {
      text: this.text,
      ...this.textStyles,
    };
  }

  set fontSize(size: number) {
    this.textStyles.fontSize = size;
  }

  handleDrag = (e: any, data: any) => {
    this.position = {
      x: data.x,
      y: data.y,
    };
  };
}
