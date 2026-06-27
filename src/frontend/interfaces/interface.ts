import {
  HTMLChakraProps,
  JsxStyleProps,
  SliderValueChangeDetails,
  SystemStyleObject,
} from "@chakra-ui/react";
import { UUID } from "crypto";
import { ColorMapFilter } from "pixi-filters";
import {
  Application,
  Container,
  ContainerChild,
  Filter,
  Graphics,
  Renderer,
  RenderTexture,
  Sprite,
  Texture,
  TextureSource,
} from "pixi.js";
import {
  Dispatch,
  HTMLInputTypeAttribute,
  ReactNode,
  RefObject,
  SetStateAction,
} from "react";
import { MaskCreateProps, MasksProps, Points } from "./mask.interface";

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
  relativePosition?: { x: XPositions | number; y: YPositions | number };
  enabled: boolean;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  color: string;
  opacity: number;
}

//#region CopyRightImage
export interface CopyrightImage {
  blob?: string;
  position?: DraggableImageEventPosition;
  defaultSize?: { height: number; width: number };
  size?: { height: number; width: number };
  opacity?: number;
  relativePosition?: { x: XPositions | number; y: YPositions | number };
}
//#endregion

//#region CropBox
export interface CropBox {
  x?: number | null;
  y?: number | null;
  width?: number | null;
  height?: number | null;
  currentHeight?: number | null;
  currentWidth?: number | null;
}
//#endregion

//#region ExportSettings
export interface ExportSettings {
  fileExtension?: string;
  exifDatas?: string[];
  optimize?: boolean;
  haldImage?: string | undefined;
}
//#endregion

//#region CustomImage
export interface CustomImage {
  //DEFAULT IMAGE SETTINGS
  id: number;
  blob: string;
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
    padding?: number;
  };
  //CROP BOX
  box?: CropBox;
  cropSave?: boolean;
  cropSize?: { width: number | null; height: number | null };
  //BORDER
  borderSize?: { x: number | null; y: number | null };
  //LUT
  lutFilter?: ColorMapFilter | null;
  lutFile?: File | null;
  // Export settings
  exportSettings?: ExportSettings;
  haldSprite: Sprite | any;
  //Mask
  masks?: any[];
  maskContainer?: Container<ContainerChild> | any;
}

//#region CalculationReFixPositionProps
export interface CalculationReFixPositionProps {
  front?: boolean;
  positionX: XPositions;
  positionY: YPositions;
  elementRef: { offsetWidth: number; offsetHeight: number };
  referenceElement: RefObject<HTMLCanvasElement | null>;
  imageScale: number;
  borderSize:
    | {
        x: number | null;
        y: number | null;
      }
    | undefined;
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
  vibrance: number;
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
      x: XPositions | number;
      y: YPositions | number;
    },
    imageScale: number,
  ) => void;
  setCopyrightImageRelativePosition: (
    id: number,
    position: {
      x: number | XPositions;
      y: YPositions | number;
    },
  ) => void;
  setCopyrightImageOpacity: (id: number, opacity: number) => void;
  setCopyrightImageSize: (
    id: number,
    size: number,
    imageScale?: number,
  ) => void;
  calculateImageSize: (
    id: number,
    width: number,
    imageScale?: number,
  ) => {
    height: number;
    width: number;
  };
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

  //#region OPTIMIZE
  setExportFileOptimize: (id: number, optimize: boolean) => void;
  setExportAllFileOptimize: (optimize: boolean) => void;
  //#endregion

  //#region EXPORT
  setExportFileExtension: (id: number, extension: string) => void;
  setExportAllFileExtension: (extension: string) => void;
  setExportExifs: (id: number, exifs: string[]) => void;
  setHaldImage: (id: number, haldImage: string) => void;
  exportImageSettings: (id: number) => Promise<any>;
  //#endregion

  //#region TEXT
  addTexts: (
    imageId: number,
    text: string,
    referenceElement: RefObject<HTMLCanvasElement | null>,
  ) => void;
  deleteText: (imageId: number, textId: string) => void;
  editText: (imageId: number, textId: string, text: string) => void;
  setTextFontSize: (
    imageId: number,
    textId: string,
    fontSize: number,
    imageScale: number,
  ) => void;
  setTextFontWeight: (
    imageId: number,
    textId: string,
    fontWeight: number,
  ) => void;
  setTextFontFamily: (
    imageId: number,
    textId: string,
    fontFamily: string,
  ) => void;
  getTextPosition: (
    selectedImage: number,
    textId: string,
  ) => {
    x: number | XPositions;
    y: number | YPositions;
  };
  setTextPosition: (
    imageId: number,
    textId: string,
    position: {
      x: number | XPositions;
      y: number | YPositions;
    },
    scale: number,
  ) => void;
  setTextRelativePosition: (
    imageId: number,
    textId: string,
    position: {
      x: number | XPositions;
      y: number | YPositions;
    },
  ) => void;
  setTextColor: (imageId: number, textId: string, color: string) => void;
  setTextOpacity: (imageId: number, textId: string, opacity: number) => void;
  //#endregion

  //#region EXPAND
  setExpandMode: (id: number, mode: string) => void;
  setExpandBackground: (id: number, color: string) => void;
  setExpandSize: (
    id: number,
    size: {
      width: number;
      height: number;
    },
    padding?: number,
  ) => void;
  //#endregion

  //#region BORDER
  setBorderSize(id: number, borderSize: { x: number; y: number }): void;
  //#endregion

  //#region FILTERS
  editFilters: (id: number, filterName: string, value: string | number) => void;
  getFilterValue: (id: number, filterName: string) => number | undefined;
  getFilters: (id: number) => FilterProps;
  //#endregion

  //#region LUT
  setLut: (
    id: number,
    lutFilter: ColorMapFilter | null,
    lutFile: File | null,
  ) => void;
  //#endregion

  //#region Masks
  addMask: (id: number, type: string, brushSize: number, point: Points) => void;
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
  copyrightImageRef: Sprite | null;
  setCopyrightImageRef: Dispatch<SetStateAction<Sprite | null>>;
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
  selectedChannel: string;
  setSelectedChannel: Dispatch<SetStateAction<string>>;
  webglFilterRef: RefObject<Filter | null>;
  imageScale: number;
  setImageScale: Dispatch<SetStateAction<number>>;
  textPositions: Record<
    string,
    {
      x: number;
      y: number;
    }
  >;
  setTextPositions: Dispatch<
    SetStateAction<
      Record<
        string,
        {
          x: number;
          y: number;
        }
      >
    >
  >;
  overlayRef: RefObject<Container<ContainerChild> | null>;
  hoverMaskGraphRef: RefObject<Graphics>;
  maskErase: boolean;
  setMaskEraseMode: Dispatch<SetStateAction<boolean>>;
  maskBrushSize: number;
  setMaskBrushSize: Dispatch<SetStateAction<number>>;
  renderTextureRef: RefObject<RenderTexture | null>;
  outputSpriteRef: RefObject<Sprite | null>;
  brushRef: RefObject<Graphics | null>;
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
  style?: SystemStyleObject;
  value?: any;
}
//#endregion

//#region EditItemProp
export interface EditItemProp {
  function: string;
  icon?: ReactNode;
  inputs: FunctionProp[];
  hide?: boolean;
}
//#endregion

//#region WorkSessionProviderProps
export interface WorkSessionProviderProps {
  children: ReactNode;
}
//#endregion

//#region ParamProps
export interface ParamProps {
  red_red_channel: number;
  green_red_channel: number;
  blue_red_channel: number;
  red_green_channel: number;
  green_green_channel: number;
  blue_green_channel: number;
  red_blue_channel: number;
  green_blue_channel: number;
  blue_blue_channel: number;
  red_channel_offset: number;
  green_channel_offset: number;
  blue_channel_offset: number;
}
//#endregion
