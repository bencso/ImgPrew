import { UUID } from "crypto";
import { Application, Renderer, Sprite, Texture, TextureSource } from "pixi.js";
import {
  Dispatch,
  HTMLInputTypeAttribute,
  ReactNode,
  RefObject,
  SetStateAction,
} from "react";

//#region InputTypes
export enum InputTypes {
  select = "select",
  customElement = "customElement",
}
//#endregion

//#region FiltersImage
export interface ImageFilters {
  name: string;
  value: string | number;
}
//#endregion

// ref: sessionData.ts: calculationReFixPosition()
export enum calculationTypeEnum {
  TEXT = "text",
  COPYRIGHT = "copyrightImage",
}

export enum XPositions {
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center",
}

export enum YPositions {
  TOP = "top",
  BOTTOM = "bottom",
  CENTER = "center",
}

//#region CustomImage
export interface DraggableImageEventPosition {
  x: number | XPositions;
  y: number | YPositions;
}

export interface DraggableImageEvent {
  id: string;
  text: string;
  position: DraggableImageEventPosition;
  enabled: boolean;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  color: string;
}

export interface CustomImage {
  //DEFAULT IMAGE SETTINGS
  id: number;
  blob: string;
  exportFileExtension: string;
  filters?: { name: string; value: number }[];
  dimesions?: { width: number; height: number };
  //EXIF, CAPTION
  exifDatas?: string[];
  caption?: string;
  captionSamples?: string[];
  //SZÖVEG
  texts?: DraggableImageEvent[];
  //COPYRIGHT IMAGE
  copyrightImage?: {
    blob?: string;
    position?: {
      x: XPositions;
      y: YPositions;
    };
    size?: number;
  };
  //EXPAND MODE
  expandMode: string;
  expandBackground: string;
  expandSize?: {
    width: number;
    height: number;
  };
  //CROP BOX
  box?: {
    x: number | null;
    y: number | null;
    width: number | null;
    height: number | null;
  };
  cropSize?: { width: number | null; height: number | null };
  //BORDER
  borderSize?: { x: number | null; y: number | null };
}

export interface SessionStore {
  //#region ADATOK
  sessionData: CustomImage[];
  setSessionData: (data: CustomImage[]) => any;
  clearSessionData: () => any;
  addImage: (
    blob: string,
    exifData?: string[] | undefined,
    captionSamples?: string[] | undefined,
  ) => void;
  //#endregion

  //#region Segédfüggvények
  calculationReFixPosition: (
    id: number,
    type: calculationTypeEnum,
    elementRef: HTMLElement | HTMLImageElement | HTMLDivElement,
    textAndImagePlaceRef?: any,
    textId?: string,
  ) => any;
  //#endregion

  //#region MÉRETEK
  setImageSize: (id: number, width: number, height: number) => void;
  setCropBox: ({
    id,
    x,
    y,
    width,
    height,
  }: {
    id: number;
    x?: number | null;
    y?: number | null;
    width?: number | null;
    height?: number | null;
  }) => void;
  //#endregion

  //#region Copyright kép
  uploadCopyrightImage: (id: number, blob: ArrayBuffer) => void;
  clearCopyrightImage: (id: number) => void;
  setCopyrightImagePosition: (
    id: number,
    position: {
      x: XPositions;
      y: YPositions;
    },
  ) => void;
  setCopyrightImageSize: (id: number, size: number) => void;
  //#endregion

  //#region EXIF
  setExifDataForImage: (id: number, exif: string[]) => any;
  //#endregion

  //#region CAPTION SAMPLES
  setCaptionSamplesForImage: (id: number, captionSamples: string[]) => any;
  //#endregion

  //#region CAPTION
  getCaptionForImage: (id: number) => string;
  setCaptionForImage: (id: number, caption: string) => any;
  //#endregion

  //#region EXPORT FILE EXTENSION
  setExportFileExtension: (id: number, extension: string) => any;
  //#endregion

  //#region TEXT
  addTexts: (imageId: number, text: string) => any;
  deleteText: (imageId: number, textId: string) => void;
  editText: (imageId: number, textId: string, text: string) => void;
  setTextFontSize: (imageId: number, textId: string, fontSize: number) => any;
  setTextFontWeight: (
    imageId: number,
    textId: string,
    fontWeight: number,
  ) => any;
  getTextPosition: (
    selectedImage: number,
    textId: string,
  ) => DraggableImageEventPosition | undefined;
  setTextPosition: (
    imageId: number,
    textId: string,
    position: {
      x: number | XPositions;
      y: number | YPositions;
    },
  ) => void;
  setTextColor: (imageId: number, textId: string, color: string) => void;
  //#endregion

  //#region EXPAND
  setExpandMode: (id: number, mode: string) => void;
  setExpandBackground: (id: number, rgba: string) => void;
  setExpandSize: (
    id: number,
    size: {
      width: number;
      height: number;
    },
  ) => void;
  //#endregion

  //#region EXPORT
  exportAllDataForImage: (
    id: number,
  ) => { caption?: string; fileExtension: string } | null;
  //#endregion

  //#region HISTOGRAM
  convertHistogram: (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    imgSrc: string,
  ) => any;
  //#endregion

  //#region BORDER
  setBorderSize(id: number, borderSize: { x: number; y: number }): void;
  //#endregion

  //#region FILTERS
  editFilters: (id: number, filterName: string, value: string | number) => any;
  getFilterValue: (id: number, filterName: string) => number | null;
  getFilters: (id: number) => {
    brightness: number;
    contrast: number;
    saturation: number;
    gamma: number;
    temperature: number;
    noise: number;
    highlights: number;
    shadows: number;
    whites: number;
    blacks: number;
  };
  //#endregion
}
//#endregion

//#region FunctionsInputs
export interface FunctionsInputs {
  name: string;
  input: InputTypes | HTMLInputTypeAttribute;
  value: any;
}
//#endregion

//#region FunctionItem
export interface FunctionItem {
  name: string;
  inputs: FunctionsInputs[];
}
//#endregion

//#region FunctionsState
export interface FunctionsState {
  functions: FunctionItem[];
  addFunction: (name: string, inputs: FunctionProp[]) => void;
  editFunction: (
    selectedImg: number,
    functionName: string,
    inputName: string,
    value: any,
  ) => void;
}
//#endregion

//#region WorkSessionContextProps
export interface WorkSessionContextProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  selectedImg: number;
  setSelectedImg: Dispatch<SetStateAction<number>>;
  sessionData: CustomImage[];
  setSessionData: Dispatch<SetStateAction<CustomImage[]>>;
  functions: FunctionItem[];
  addFunction: (name: string, inputs: FunctionProp[]) => void;
  editFunction: (
    selectedImg: number,
    functionName: string,
    inputName: string,
    value: any,
  ) => void;
  textElements: Record<string, HTMLElement>;
  setTextElements: Dispatch<SetStateAction<Record<UUID, HTMLElement>>>;
  copyrightImageRef: HTMLImageElement | null;
  setCopyrightImageRef: Dispatch<SetStateAction<HTMLImageElement | null>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  selectedScale:
    | {
        image: {
          height: number;
          width: number;
        };
        scale: number;
        position: {
          x: number;
          y: number;
        };
      }
    | undefined;
  setSelectedScale: Dispatch<
    SetStateAction<
      | {
          image: {
            height: number;
            width: number;
          };
          scale: number;
          position: {
            x: number;
            y: number;
          };
        }
      | undefined
    >
  >;
  spriteRef: RefObject<Sprite | null>;
  textureRef: RefObject<Texture<TextureSource<any>> | null>;
  workPlaceRef: RefObject<HTMLDivElement | null>;
  appRef: RefObject<Application<Renderer> | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  textAndImagePlaceRef: RefObject<HTMLDivElement | null>;
}
//#endregion

//#region FunctionProp
export interface FunctionProp {
  name: string;
  inputType: InputTypes | HTMLInputTypeAttribute;
  options?: any[] | HTMLElement | ReactNode | null;
  onChange?: void | null;
  defaultValue?: string | null;
  min?: number | null;
  max?: number | null;
  step?: number;
  icon?: ReactNode | null;
  clearFunc?: void;
}
//#endregion

//#region EditItemProp
export interface EditItemProp {
  function: string;
  icon?: ReactNode;
  inputs: FunctionProp[];
}
//#endregion

//#region WorkSessionProviderProps
export interface WorkSessionProviderProps {
  children: ReactNode;
}
//#endregion
