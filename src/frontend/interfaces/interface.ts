import { SliderValueChangeDetails } from "@chakra-ui/react";
import { UUID } from "crypto";
import { Application, Filter, Renderer, Sprite, Texture, TextureSource } from "pixi.js";
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

//#region CopyRightImage
export interface CopyrightImage {
  blob?: string;
  position?: {
    x: XPositions;
    y: YPositions;
  };
  size?: number;
}
//#endregion

//#region CropBox
export interface CropBox {
  x?: number | null;
  y?: number | null;
  width?: number | null;
  height?: number | null;
}
//#endregion

//#region CustomImage
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
  copyrightImage?: CopyrightImage;
  //EXPAND MODE
  expandMode: string;
  expandBackground: string;
  expandSize?: {
    width: number;
    height: number;
  };
  //CROP BOX
  box?: CropBox;
  cropSave?: boolean;
  cropSize?: { width: number | null; height: number | null };
  //BORDER
  borderSize?: { x: number | null; y: number | null };
}

//#region CalculationReFixPositionProps
export interface CalculationReFixPositionProps {
  id: number;
  type: calculationTypeEnum;
  elementRef: HTMLElement;
  textAndImagePlaceRef: RefObject<HTMLDivElement | null>;
  textId?: string;
}
//#endregion

//#region FilterProps
export interface FilterProps {
  brightness: number;
  contrast: number;
  exposure: number;
  temperature: number;
  tint: number;
  saturation: number;
  hue: number;
  value: number;
  black: number;
  white: number;
  gamma: number;
  outblack: number;
  outwhite: number;
  red_red_channel: number;
  red_green_channel: number;
  red_blue_channel: number;
  green_red_channel: number;
  green_green_channel: number;
  green_blue_channel: number;
  blue_red_channel: number;
  blue_green_channel: number;
  blue_blue_channel: number;
  red_channel_offset: number;
  green_channel_offset: number;
  blue_channel_offset: number;
  vibrance: number
}
//#endregion

export interface SessionStore {
  //#region ADATOK
  sessionData: CustomImage[];
  setSessionData: (data: CustomImage[]) => void;
  clearSessionData: () => void;
  addImage: (
    blob: string,
    exifData?: string[] | undefined,
    captionSamples?: string[] | undefined,
  ) => void;
  //#endregion

  //#region Segédfüggvények
  calculationReFixPosition: (props: CalculationReFixPositionProps) => {
    x: number;
    y: number;
  };
  //#endregion

  //#region MÉRETEK
  setImageSize: (id: number, width: number, height: number) => void;
  setCropBox: ({ id, box }: { id: number; box: CropBox }) => void;
  setCropSave: (id: number) => void;
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
  setExifDataForImage: (id: number, exif: string[]) => void;
  //#endregion

  //#region CAPTION SAMPLES
  setCaptionSamplesForImage: (id: number, captionSamples: string[]) => void;
  //#endregion

  //#region CAPTION
  getCaptionForImage: (id: number) => string;
  setCaptionForImage: (id: number, caption: string) => void;
  //#endregion

  //#region EXPORT FILE EXTENSION
  setExportFileExtension: (id: number, extension: string) => void;
  //#endregion

  //#region TEXT
  addTexts: (imageId: number, text: string) => void;
  deleteText: (imageId: number, textId: string) => void;
  editText: (imageId: number, textId: string, text: string) => void;
  setTextFontSize: (imageId: number, textId: string, fontSize: number) => void;
  setTextFontWeight: (
    imageId: number,
    textId: string,
    fontWeight: number,
  ) => void;
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

  //#region BORDER
  setBorderSize(id: number, borderSize: { x: number; y: number }): void;
  //#endregion

  //#region FILTERS
  editFilters: (id: number, filterName: string, value: string | number) => void;
  getFilterValue: (id: number, filterName: string) => number | undefined;
  getFilters: (id: number) => FilterProps;
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
  editFunction: (props: EditFunctionProps) => void;
}
//#endregion

//#region SelectedScale
export interface SelectedScale {
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
//#endregion

//#region EditFunction Props
export interface EditFunctionProps {
  selectedImg: number;
  functionName: string;
  inputName: string;
  value: any;
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
  editFunction: (props: EditFunctionProps) => void;
  textElements: Record<string, HTMLElement>;
  setTextElements: Dispatch<SetStateAction<Record<UUID, HTMLElement>>>;
  copyrightImageRef: HTMLImageElement | null;
  setCopyrightImageRef: Dispatch<SetStateAction<HTMLImageElement | null>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  selectedScale: SelectedScale | undefined;
  setSelectedScale: Dispatch<SetStateAction<SelectedScale | undefined>>;
  spriteRef: RefObject<Sprite | null>;
  textureRef: RefObject<Texture<TextureSource<any>> | null>;
  workPlaceRef: RefObject<HTMLDivElement | null>;
  appRef: RefObject<Application<Renderer> | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  textAndImagePlaceRef: RefObject<HTMLDivElement | null>;
  selectedChannel: string ;
  setSelectedChannel: Dispatch<SetStateAction<string>>;
   webglFilterRef: RefObject<Filter | null>
}
//#endregion

//#region FunctionProp
export interface FunctionProp {
  name: string;
  inputType: InputTypes | HTMLInputTypeAttribute;
  options?: any[] | HTMLElement | ReactNode | null;
   onChange?: (e: SliderValueChangeDetails | any) => void;
  onChangeEnd?: (e: SliderValueChangeDetails | any) => void;
  defaultValue?: string | null;
  min?: number | null;
  max?: number | null;
  step?: number;
  icon?: ReactNode | null;
  clearFunc?: () => void;
  resetValue?: number;
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
