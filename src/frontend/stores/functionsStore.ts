import {
  EditFunctionProps,
  FunctionProp,
  FunctionsInputs,
  FunctionsState,
  InputTypes,
} from "@/interfaces/interface";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const useFunctionsStore = create<FunctionsState>()(
  immer((set) => ({
    functions: [],

 
    editFunction: (props: EditFunctionProps) =>
      set((state) => {
        const existingFunction = state.functions.find(
          (fn:any) => fn.name === props.functionName,
        );
        if (!existingFunction) return;

        const inputItem = existingFunction.inputs.find(
          (inp:any) => inp.name === props.inputName,
        );
        if (!inputItem) return;

        if (inputItem.input === "checkbox")
          inputItem.value = { ...inputItem.value, ...props.value };
        else inputItem.value = props.value;
      }),
  })),
);
