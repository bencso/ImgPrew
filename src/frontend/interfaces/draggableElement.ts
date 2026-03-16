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
  id: number;
  text: string;
  textStyles: TextStyles;
  position: DraggableImageEventPosition;
  enabled: boolean = false;

  constructor(id: number, text: string, position: DraggableImageEventPosition) {
    this.id = id;
    this.text = text;
    this.position = position;
    this.enabled = true;
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
