import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { FunctionsInputs, FunctionsState, FunctionProp, InputTypes } from "@/interfaces/interface";

export const useFunctionsStore = create<FunctionsState>()(
  immer((set) => ({
    functions: [],

    addFunction: (name, inputs: FunctionProp[]) =>
      set((state) => {
        const preparedInputs: FunctionsInputs[] = inputs.map((input) => {
          let value: any;

          switch (input.inputType) {
            case InputTypes.CHECKBOX:
              value = {};
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

    editFunction: (ws, functionName, inputName, value) =>
      set((state) => {
        const existingFunction = state.functions.find(
          (fn) => fn.name === functionName
        );
        if (!existingFunction) return;

        const inputItem = existingFunction.inputs.find(
          (inp) => inp.name === inputName
        );
        if (!inputItem) return;
        
        inputItem.value = { ...inputItem.value, ...value }

        ws.current?.send(
          JSON.stringify({
            message: "function",
            data: {
              name: functionName,
              input: inputName,
              value,
            },
          })
        );
      }),
  }))
);