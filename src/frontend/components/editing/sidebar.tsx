//TODO: Refaktorálni
import { EditItemProp, FilterProps } from "@/interfaces/interface";
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
import { RefObject, useEffect, useMemo, useState } from "react";
import {
  LuBetweenHorizontalEnd,
  LuBlend,
  LuCaptions,
  LuClipboardCheck,
  LuCloudMoonRain,
  LuContrast,
  LuCopyright,
  LuFilter,
  LuFrame,
  LuHam,
  LuImageDown,
  LuImageUpscale,
  LuRectangleVertical,
  LuSun,
  LuType,
} from "react-icons/lu";
import { shallow } from "zustand/shallow";
import CaptionBlock from "./caption/captionBlock";
import CopyrightBlock from "./copyright/copyrightBlock";
import { EditItem } from "./edititem";
import ResizeBlock from "./resize/resizeBlock";
import TextBlock from "./text/textBlock";
import ChannelMixerBlock from "./channelmixer/channelmixer";

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
  filters: FilterProps,
  selectedChannel: string | undefined,
  captionSamples: string[],
) => {
  return [
    captionSamples.length > 0 && {
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
          min: -100,
          max: 100,
          step: 0.001,
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
          min: -5,
          max: 5,
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
          min: -100,
          max: 100,
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
      ],
    },
    {
      function: "Levels",
      icon: <LuRectangleVertical />,
      inputs: [
        {
          name: "Shadows",
          icon: <LuClipboardCheck />,
          min: 0,
          max: filters.white ?? 0,
          step: 0.001,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "black") ?? 0,
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "black", e.value[0]);
          },
          clearFunc: () => {
            editFilters(selectedImg, "black", 0);
          },
        },
        {
          name: "Midtones - Gamma",
          icon: <LuClipboardCheck />,
          min: 0.1,
          max: 3,
          step: 0.01,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "gamma") ?? 1,
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "gamma", e.value[0]);
          },
          clearFunc: () => {
            editFilters(selectedImg, "gamma", 1);
          },
        },
        {
          name: "Highlights",
          icon: <LuClipboardCheck />,
          min: filters.black ?? 0,
          max: 255,
          step: 0.001,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "white") ?? 255,
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "white", e.value[0]);
          },
          clearFunc: () => {
            editFilters(selectedImg, "white", 255);
          },
        },
        {
          name: "Output Fekete",
          icon: <LuClipboardCheck />,
          min: 0,
          max: 255,
          step: 0.001,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "outblack") ?? 0,
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "outblack", e.value[0]);
          },
          clearFunc: () => {
            editFilters(selectedImg, "outblack", 0);
          },
        },
        {
          name: "Output Fehér",
          icon: <LuClipboardCheck />,
          min: 0,
          max: 255,
          step: 0.001,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "outwhite") ?? 255,
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "outwhite", e.value[0]);
          },
          clearFunc: () => {
            editFilters(selectedImg, "outwhite", 255);
          },
        },
      ],
    },
    {
      function: "HSV",
      icon: <LuHam />,
      inputs: [
        {
          name: "Hue",
          icon: <LuCloudMoonRain />,
          min: -180,
          max: 180,
          step: 1,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "hue") ?? 0,
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "hue", e.value[0]);
          },
          clearFunc: () => {
            editFilters(selectedImg, "hue", 0);
          },
        },
        {
          name: "Telítettség",
          icon: <LuCloudMoonRain />,
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
          name: "Érték",
          icon: <LuCloudMoonRain />,
          min: -1,
          max: 1,
          step: 0.001,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "value") ?? 0,
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "value", e.value[0]);
          },
          clearFunc: () => {
            editFilters(selectedImg, "value", 0);
          },
        },
      ],
    },
    {
      function: "Channel mixer",
      icon: <LuRectangleVertical />,
      inputs: [
        {
          name: "",
          inputType: "customElement",
          options: <ChannelMixerBlock />,
        },

        {
          name: `Piros`,
          icon: <LuBetweenHorizontalEnd />,
          min: -100,
          max: 100,
          step: 1,
          inputType: "slider",
          defaultValue:
            getFilterValue(
              selectedImg,
              `${selectedChannel?.toLowerCase()}_red_channel`,
            ) ?? (selectedChannel?.toLowerCase() === "red" ? 100 : 0),
          onChange: (e: SliderValueChangeDetails) => {
            console.log(`${selectedChannel?.toLocaleLowerCase()}_red_channel`);
            editFilters(
              selectedImg,
              `${selectedChannel?.toLocaleLowerCase()}_red_channel`,
              e.value[0],
            );
          },
          clearFunc: () => {
            editFilters(
              selectedImg,
              `${selectedChannel?.toLowerCase()}_red_channel`,
              selectedChannel?.toLowerCase() === "red" ? 100 : 0,
            );
          },
        },
        {
          name: `Zöld`,
          icon: <LuBetweenHorizontalEnd />,
          min: -100,
          max: 100,
          step: 1,
          inputType: "slider",
          defaultValue:
            getFilterValue(
              selectedImg,
              `${selectedChannel?.toLowerCase()}_green_channel`,
            ) ?? (selectedChannel?.toLowerCase() === "green" ? 100 : 0),
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(
              selectedImg,
              `${selectedChannel?.toLowerCase()}_green_channel`,
              e.value[0],
            );
          },
          clearFunc: () => {
            editFilters(
              selectedImg,
              `${selectedChannel?.toLowerCase()}_green_channel`,
              selectedChannel?.toLowerCase() === "green" ? 100 : 0,
            );
          },
        },
        {
          name: `Kék`,
          icon: <LuBetweenHorizontalEnd />,
          min: -100,
          max: 100,
          step: 1,
          inputType: "slider",
          defaultValue:
            getFilterValue(
              selectedImg,
              `${selectedChannel?.toLowerCase()}_blue_channel`,
            ) ?? (selectedChannel?.toLowerCase() === "blue" ? 100 : 0),
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(
              selectedImg,
              `${selectedChannel?.toLowerCase()}_blue_channel`,
              e.value[0],
            );
          },
          clearFunc: () => {
            editFilters(
              selectedImg,
              `${selectedChannel?.toLowerCase()}_blue_channel`,
              selectedChannel?.toLowerCase() === "blue" ? 100 : 0,
            );
          },
        },
        {
          name: `Offset`,
          icon: <LuBetweenHorizontalEnd />,
          min: -100,
          max: 100,
          step: 1,
          inputType: "slider",
          defaultValue:
            getFilterValue(
              selectedImg,
              `${selectedChannel?.toLowerCase()}_channel_offset`,
            ) ?? 0,
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(
              selectedImg,
              `${selectedChannel?.toLowerCase()}_channel_offset`,
              e.value[0],
            );
          },
          clearFunc: () => {
            editFilters(
              selectedImg,
              `${selectedChannel?.toLowerCase()}_channel_offset`,
              0,
            );
          },
        },
      ],
    },
    {
      function: "Egyéb",
      icon: <LuRectangleVertical />,
      inputs: [
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
          name: "Árnyalat",
          icon: <LuCloudMoonRain />,
          min: -100,
          max: 100,
          step: 1,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "tint") ?? 0,
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "tint", e.value[0]);
          },
          clearFunc: () => {
            editFilters(selectedImg, "tint", 0);
          },
        },
        {
          name: "Vibrance",
          icon: <LuCloudMoonRain />,
          min: -100,
          max: 100,
          step: 1,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "vibrance") ?? 0,
          onChange: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "vibrance", e.value[0]);
          },
          clearFunc: () => {
            editFilters(selectedImg, "vibrance", 0);
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
              zIndex={1000}
              value={parseColor(expandBackground)}
              onValueChange={(e: any) => {
                console.log(e);
                let value = e.valueAsString;
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
                  <ColorPicker.Content zIndex={"max"}>
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

  const {
    spriteRef,
    selectedImg,
    addFunction,
    selectedScale,
    selectedChannel,
  } = useWorkSession();

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

  useEffect(() => {
    editItems.map((item) => {
      if (item.inputs) {
        addFunction(item.function, item.inputs);
      }
    });
  }, [editItems, addFunction]);

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

  const captionSamples =
    useSessionStore(
      (s) => s.sessionData.find((si) => si.id === selectedImg)?.captionSamples,
    ) || [];

  const filters = useSessionStore((s) => s.getFilters(selectedImg), shallow);

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
        filters,
        selectedChannel,
        captionSamples,
      ),
    );
  }, [sessionData, selectedImg, selectedChannel]);
  //#endregion
  return editItems.map((item, index) => {
    return <EditItem key={index} items={item} />;
  });
}
