//TODO: Refaktorálni
import { EditItemProp } from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  ColorPicker,
  HStack,
  parseColor,
  Portal,
  SliderValueChangeDetails,
} from "@chakra-ui/react";
import { Sprite } from "pixi.js";
import { RefObject, useMemo, useState } from "react";
import {
  LuBetweenHorizontalEnd,
  LuBlend,
  LuCaptions,
  LuCloudMoonRain,
  LuContrast,
  LuCopyright,
  LuFilter,
  LuFrame,
  LuImageDown,
  LuImageUpscale,
  LuSun,
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
  setExpandBackground: (id: number, rgba: string) => void,
  expandBackground: string,
  expandMode: string,
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
          min: -1,
          max: 1,
          step: 0.01,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "brightness") ?? 0,
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "brightness", e.value[0]);
          },
          clearFunc: () => {
            editFilters(selectedImg, "brightness", 0);
          },
        },
        {
          name: "Expozíció",
          icon: <LuBlend />,
          min: -3,
          max: 3,
          step: 0.01,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "exposure") ?? 0,
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "exposure", e.value[0]);
          },
          clearFunc: () => {
            editFilters(selectedImg, "exposure", 0);
          },
        },
        {
          name: "Kontraszt",
          icon: <LuContrast />,
          min: 0,
          max: 2,
          step: 0.01,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "contrast") ?? 1,
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "contrast", e.value[0]);
          },
          clearFunc: () => {
            editFilters(selectedImg, "contrast", 1);
          },
        },
        {
          name: "Színhőmérséklet",
          icon: <LuBetweenHorizontalEnd />,
          min: -100,
          max: 100,
          step: 1,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "temperature") ?? 0,
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "temperature", e.value[0]);
          },
          clearFunc: () => {
            editFilters(selectedImg, "temperature", 0);
          },
        },
        {
          name: "Tint",
          icon: <LuCloudMoonRain />,
          min: -100,
          max: 100,
          step: 1,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "tint") ?? 50,
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "tint", e.value[0]);
          },
          clearFunc: () => {
            editFilters(selectedImg, "tint", 0);
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
                if (expandMode !== "crop") setExpandMode(selectedImg, "border");

                setBorderSize(selectedImg, {
                  x: number,
                  y: number,
                });
              } else {
                if (expandMode !== "crop") {
                  setExpandMode(selectedImg, "no");
                }
                setBorderSize(selectedImg, {
                  x: 0,
                  y: 0,
                });
              }
            }
          },
        },
        {
          name: "Szín",
          inputType: "customElement",
          options: (
            <ColorPicker.Root
              defaultValue={
                expandBackground
                  ? parseColor(expandBackground || "#ffff")
                  : parseColor("#ffff")
              }
              onChange={(e: any) => {
                let value = e.target.value;
                if (value !== "") {
                  setExpandBackground(selectedImg, value);
                }
              }}
            >
              <ColorPicker.HiddenInput />
              <ColorPicker.Control>
                <ColorPicker.Input />
                <ColorPicker.Trigger />
              </ColorPicker.Control>
              <Portal>
                <ColorPicker.Positioner zIndex={10000}>
                  <ColorPicker.Content>
                    <ColorPicker.Area />
                    <HStack>
                      <ColorPicker.Sliders />
                    </HStack>
                  </ColorPicker.Content>
                </ColorPicker.Positioner>
              </Portal>
            </ColorPicker.Root>
          ),
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
    setExpandBackground,
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

  const expandBackground =
    useSessionStore(
      (s) =>
        s.sessionData.find((si) => si.id === selectedImg)?.expandBackground,
    ) || "";

  const expandMode =
    useSessionStore(
      (s) => s.sessionData.find((si) => si.id === selectedImg)?.expandMode,
    ) || "no";

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
        setExpandBackground,
        expandBackground,
        expandMode,
      ),
    );
  }, [sessionData, selectedImg]);
  //#endregion
  return editItems.map((item, index) => {
    return <EditItem key={index} items={item} />;
  });
}
