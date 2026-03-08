import { Dispatch, HTMLInputTypeAttribute, ReactNode, RefObject, SetStateAction } from "react";

//#region InputTypes
export enum InputTypes {
    select = "select",
    customElement = "customElement"
}
//#endregion

//#region CustomImage
export interface CustomImage {
    id: number;
    exifDatas?: string[];
    captionSamples?: string[];
    caption?: string;
    exportFileExtension?: string;
}
//#endregion

//#region SessionStore
export interface SessionStore {
    sessionData: CustomImage[];
    addImage: () => void;
    setSessionData: (data: CustomImage[]) => void;
    getSelectedImageExif: (id: number) => string[];
    setExifDataForImage: (id: number, exif: string[]) => CustomImage | undefined;
    getCaptionSamples: (id: number) => string[];
    setCaptionSamplesForImage: (id: number, captionSamples: string[]) => CustomImage | undefined;
    getCaptionForImage: (id: number) => string;
    setCaptionForImage: (id: number, caption: string) => CustomImage | undefined;
    getExportFileExtension: (id: number) => string;
    setExportFileExtension: (id: number, extension: string) => CustomImage | undefined;
    exportAllDataForImage: (id: number) => void;
    convertHistogram(canvasRef: any, img: any): any[] | undefined;
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
        value: any
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
        value: any
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
    icon?: ReactNode | null;
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

