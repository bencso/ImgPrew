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

    addFunction: (name, inputs: FunctionProp[]) =>
      set((state) => {
        const preparedInputs: FunctionsInputs[] = inputs.map((input) => {
          let value: any;

          switch (input.inputType) {
            case InputTypes.select:
              value = [];
              break;
            case "number":
              value = 0;
              break;
            default:
              value = "";
          }

          return {
            name: input.name,
            input: input.inputType,
            value,
          };
        });

        state.functions.push({
          name,
          inputs: preparedInputs,
        });
      }),

    editFunction: (props: EditFunctionProps) =>
      set((state) => {
        const existingFunction = state.functions.find(
          (fn) => fn.name === props.functionName,
        );
        if (!existingFunction) return;

        const inputItem = existingFunction.inputs.find(
          (inp) => inp.name === props.inputName,
        );
        if (!inputItem) return;

        if (inputItem.input === "checkbox")
          inputItem.value = { ...inputItem.value, ...props.value };
        else inputItem.value = props.value;
      }),
  })),
);
