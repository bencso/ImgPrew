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

//#region CustomImage
interface DraggableImageEventPosition {
  x: number;
  y: number;
}

export interface DraggableImageEvent {
  id: number;
  text: string;
  position: DraggableImageEventPosition;
  enabled: boolean;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
}

export interface CustomImage {
  id: number;
  exportFileExtension: string;
  caption?: string;
  exifDatas?: string[];
  captionSamples?: string[];
  texts?: DraggableImageEvent[];
  filters?: { name: string; value: number }[];
}

export interface SessionStore {
  //#region ADATOK
  sessionData: CustomImage[];
  setSessionData: (data: CustomImage[]) => any;
  clearSessionData: () => any;
  addImage: () => any;
  //#endregion

  //#region EXIF
  getSelectedImageExif: (id: number) => string[];
  setExifDataForImage: (id: number, exif: string[]) => any;
  //#endregion

  //#region CAPTION SAMPLES
  getCaptionSamples: (id: number) => string[];
  setCaptionSamplesForImage: (id: number, captionSamples: string[]) => any;
  //#endregion

  //#region CAPTION
  getCaptionForImage: (id: number) => string;
  setCaptionForImage: (id: number, caption: string) => any;
  //#endregion

  //#region EXPORT FILE EXTENSION
  getExportFileExtension: (id: number) => string;
  setExportFileExtension: (id: number, extension: string) => any;
  //#endregion

  //#region TEXT
  addTexts: (imageId: number, text: string) => any;
  getTexts: (imageId: number) => DraggableImageEvent[];
  setTextFontSize: (imageId: number, textId: number, fontSize: number) => any;
  setTextFontWeight: (
    imageId: number,
    textId: number,
    fontWeight: number,
  ) => any;
  setTextPosition: (
    imageId: number,
    textId: number,
    position: {
      x: number;
      y: number;
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

  //#region FILTERS
  editFilters: (id: number, filterName: string, value: string | number) => any;
  getFilterValue: (id: number, filterName: string) => number | null;
  getFilters: (id: number) => {
    brightness: number;
    contrast: number;
    saturation: number;
    exposure: number;
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
    ws: RefObject<WebSocket | null>,
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
  imgs: string[];
  setImgs: Dispatch<SetStateAction<string[]>>;
  selectedImg: number;
  setSelectedImg: Dispatch<SetStateAction<number>>;
  sessionData: CustomImage[];
  setSessionData: Dispatch<SetStateAction<CustomImage[]>>;
  functions: FunctionItem[];
  addFunction: (name: string, inputs: FunctionProp[]) => void;
  editFunction: (
    ws: RefObject<WebSocket | null>,
    selectedImg: number,
    functionName: string,
    inputName: string,
    value: any,
  ) => void;
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
