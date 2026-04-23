import { EditItemProp } from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { SliderValueChangeDetails } from "@chakra-ui/react";
import { Sprite } from "pixi.js";
import { RefObject, useMemo, useState } from "react";
import {
  LuBlend,
  LuCaptions,
  LuChartBar,
  LuCircleDotDashed,
  LuContrast,
  LuCopyright,
  LuFilter,
  LuFrame,
  LuImageDown,
  LuImageUpscale,
  LuSun,
  LuThermometer,
  LuType,
} from "react-icons/lu";
import CaptionBlock from "./caption/captionBlock";
import CopyrightBlock from "./copyright/copyrightBlock";
import { EditItem } from "./edititem";
import ResizeBlock from "./resize/resizeBlock";
import TextBlock from "./text/textBlock";

const sidebarElements = (
  exportAllDataForImage: any,
  setExportFileExtension: any,
  selectedImg: any,
  selectedExtension: any,
  editFilters: any,
  getFilterValue: any,
  spriteRef: RefObject<Sprite | null>,
  setExpandMode: (id: number, mode: string) => void,
  setBorderSize: (
    id: number,
    borderSize: {
      x: number;
      y: number;
    },
  ) => void,
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
    | undefined,
) => {
  return [
    {
      function: "Kép szöveg",
      icon: <LuCaptions />,
      inputs: [
        {
          name: "",
          inputType: "customElement",
          options: <CaptionBlock />,
        },
      ],
    },
    {
      function: "Szűrők",
      icon: <LuFilter />,
      inputs: [
        {
          name: "Fényerő",
          icon: <LuSun />,
          min: 0,
          max: 2,
          step: 0.01,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "brightness") ?? 1,
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "brightness", e.value[0]);
          },
          clearFunc: () => {
            editFilters(selectedImg, "brightness", 1);
          },
        },
        {
          name: "Kontraszt",
          icon: <LuContrast />,
          min: -1,
          max: 1,
          step: 0.01,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "contrast") ?? 0,
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "contrast", e.value[0]);
          },
          clearFunc: () => {
            editFilters(selectedImg, "contrast", 0);
          },
        },
        {
          name: "Telítettésg",
          icon: <LuBlend />,
          min: -1,
          max: 1,
          step: 0.01,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "saturation") ?? 0,
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "saturation", e.value[0]);
          },
          clearFunc: () => {
            editFilters(selectedImg, "saturation", 0);
          },
        },
        {
          name: "Blacks / Whites",
          icon: <LuChartBar />,
          min: -1,
          max: 1,
          step: 0.01,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "gamma") ?? 0,
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "gamma", e.value[0]);
          },
          clearFunc: () => {
            editFilters(selectedImg, "gamma", 0);
          },
        },
        {
          name: "Hőmérséklet",
          icon: <LuThermometer />,
          min: 0.5,
          max: 1.5,
          step: 0.01,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "temperature") ?? 1,
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "temperature", e.value[0]);
          },
          clearFunc: () => {
            editFilters(selectedImg, "temperature", 1);
          },
        },
        {
          name: "Zaj",
          icon: <LuCircleDotDashed />,
          min: 0,
          max: 0.5,
          step: 0.01,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "noise") ?? 0,
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "noise", e.value[0]);
          },
          clearFunc: () => {
            editFilters(selectedImg, "noise", 0);
          },
        },
      ],
    },
    {
      function: "Szövegek",
      icon: <LuType />,
      inputs: [
        {
          name: "",
          inputType: "customElement",
          options: <TextBlock />,
        },
      ],
    },
    {
      function: "Overlay kép",
      icon: <LuCopyright />,
      inputs: [
        {
          name: "",
          inputType: "customElement",
          options: <CopyrightBlock />,
        },
      ],
    },
    {
      function: "Képkeret",
      icon: <LuFrame />,
      inputs: [
        {
          name: "Képkeret méret",
          inputType: "number",
          onChange: (e: any) => {
            const number = e.target.valueAsNumber;
            if (
              !spriteRef.current ||
              typeof number !== "number" ||
              !selectedScale
            )
              return;

            if (typeof number === "number") {
              if (number > 0) {
                setExpandMode(selectedImg, "border");

                setBorderSize(selectedImg, {
                  x: number,
                  y: number,
                });
              } else {
                setExpandMode(selectedImg, "no");
              }
            }
          },
        },
      ],
    },
    {
      function: "Méretezés",
      icon: <LuImageUpscale />,
      inputs: [
        {
          name: "",
          inputType: "customElement",
          options: <ResizeBlock />,
        },
      ],
    },
    // {
    //     function: "lut_apply",
    //     icon: <LuFileImage />,
    //     inputs: [
    //         {
    //             name: "LUT fájl feltöltés",
    //             inputType: "file",
    //             onChange: (e: any) => {
    //                 console.log(e);
    //             },
    //             options: [".cube"]
    //         },
    //         {
    //             name: "LUT mentés",
    //             inputType: "submit",
    //         },
    //     ],
    // },
    {
      function: "Exportálás",
      icon: <LuImageDown />,
      inputs: [
        {
          name: "Fájlkiterjesztés",
          inputType: "radio",
          onChange: (e: any) => {
            setExportFileExtension(
              selectedImg,
              e.currentTarget.textContent.trim(),
            );
          },
          defaultValue: selectedExtension,
          options: ["jpg", "jpeg", "png", "webp", "avif", "tiff"],
        },
        {
          name: "Kép exportálása",
          inputType: "submit",
          onChange: () => {
            const data = exportAllDataForImage(selectedImg);
          },
        },
      ],
    },
  ].filter(Boolean) as EditItemProp[];
};

export default function SideBar() {
  //#region contextek
  const [editItems, setEditItems] = useState<EditItemProp[]>([]);

  const { spriteRef, selectedImg, addFunction, selectedScale } =
    useWorkSession();

  const {
    sessionData,
    setExportFileExtension,
    exportAllDataForImage,
    editFilters,
    getFilterValue,
    setExpandMode,
    setBorderSize,
  } = useSessionStore();
  //#endregion

  useMemo(() => {
    editItems.map((item) => {
      if (item.inputs) {
        addFunction(item.function, item.inputs);
      }
    });
  }, []);

  //#region sidebar funkciók
  const selectedExtension =
    useSessionStore(
      (s) =>
        s.sessionData.find((si) => si.id === selectedImg)?.exportFileExtension,
    ) || "";

  useMemo(() => {
    setEditItems(
      sidebarElements(
        exportAllDataForImage,
        setExportFileExtension,
        selectedImg,
        selectedExtension,
        editFilters,
        getFilterValue,
        spriteRef,
        setExpandMode,
        setBorderSize,
        selectedScale,
      ),
    );
  }, [sessionData, selectedImg]);
  //#endregion
  return editItems.map((item, index) => {
    return <EditItem key={index} items={item} />;
  });
}
