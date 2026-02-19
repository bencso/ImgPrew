import { Dispatch, HTMLInputTypeAttribute, ReactNode, RefObject, SetStateAction } from "react";

export enum InputTypes {
    select = "select"
}

export interface CustomImage {
    id: number;
    exifDatas?: string[];
    caption?: string;
}


export interface SessionStore {
    sessionData: CustomImage[];
    addImage: () => void;
    setSessionData: (data: CustomImage[]) => void;
    getSelectedImageExif: (id: number) => string[];
    setExifDataForImage: (id: number, exif: string[]) => CustomImage | undefined;
}

export interface FunctionsInputs {
    name: string;
    input: InputTypes | HTMLInputTypeAttribute;
    value: any;
}

export interface FunctionItem {
    name: string;
    inputs: FunctionsInputs[];
}

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

export interface FunctionProp {
    name: string;
    inputType: InputTypes | HTMLInputTypeAttribute;
    options?: any[];
}

export interface EditItemProp {
    function: string;
    icon?: ReactNode;
    inputs?: FunctionProp[];
}

export interface WorkSessionProviderProps {
    children: ReactNode;
}

