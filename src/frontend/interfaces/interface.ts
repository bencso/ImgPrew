import { Dispatch, HTMLInputTypeAttribute, ReactNode, RefObject, SetStateAction } from "react";

export enum InputTypes {
    CHECKBOX = "checkbox"
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
    functions: FunctionItem[];
    addFunction: (name: string, inputs: FunctionProp[]) => void;
    editFunction: (
        ws: RefObject<WebSocket | null>,
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
