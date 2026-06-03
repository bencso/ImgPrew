//TODO: Refaktorálni
import { EditItemProp, FilterProps } from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  TbColorFilter,
  TbColorSwatch,
  TbGradienter,
  TbShadow,
  TbTemperature,
} from "react-icons/tb";
import {
  ColorPicker,
  Flex,
  HStack,
  parseColor,
  Portal,
  ScrollArea,
  Slider,
  SliderValueChangeDetails,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Filter, Sprite } from "pixi.js";
import { RefObject, useMemo } from "react";
import {
  LuFrame,
  LuImages,
  LuImageUpscale,
  LuTag,
  LuType,
} from "react-icons/lu";
import { shallow } from "zustand/shallow";
import CaptionBlock from "../caption/captionBlock";
import CopyrightBlock from "../copyright/copyrightBlock";
import { EditItem } from "./edititem";
import ResizeBlock from "../resize/resizeBlock";
import TextBlock from "../text/textBlock";
import ChannelMixerBlock from "../channelmixer/channelmixer";
import { getChannelOffsets } from "../../webGlComponent";
import { HiAdjustments } from "react-icons/hi";
import LutBlock from "../lut/lutBlock";
import ExportDrawer from "./exportDrawer/exportDrawer";

const sidebarElements = (
  selectedImg: any,
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
  webglFilterRef: RefObject<Filter | null>,
  uniforms: any,
  imageScale: any
) => {
  return [
    {
      function: "Kép szöveg",
      hide: captionSamples.length <= 0,
      icon: <LuTag />,
      inputs: [
        {
          name: "",
          inputType: "customElement",
          options: <CaptionBlock />,
        },
      ],
    },
    {
      function: "LUT",
      icon: <TbColorSwatch />,
      inputs: [
        {
          name: "",
          inputType: "customElement",
          options: <LutBlock />,
        },
      ],
    },
    {
      function: "Szűrők",
      icon: <HiAdjustments />,
      inputs: [
        {
          name: "Fényerő",
          min: -100,
          max: 100,
          step: 0.001,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "brightness") ?? 0,
          resetValue: 0,
          onChangeEnd: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "brightness", e.value);
          },
          onChange: (e: SliderValueChangeDetails) => {
            if (webglFilterRef.current) {
              uniforms.brightness_input = Number(e.value) / 100.0;
            }
          },
          clearFunc: () => {
            if (webglFilterRef.current) {
              uniforms.brightness_input = 0;
              editFilters(selectedImg, "brightness", 0);
            }
          },
        },
        {
          name: "Expozíció",
          min: -5,
          max: 5,
          step: 0.01,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "exposure") ?? 0,
          resetValue: 0,
          onChangeEnd: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "exposure", e.value);
          },
          onChange: (e: SliderValueChangeDetails) => {
            if (webglFilterRef.current) {
              uniforms.exposure_input = Number(e.value) / 5.0;
            }
          },
          clearFunc: () => {
            if (webglFilterRef.current) {
              uniforms.exposure_input = 0 / 5.0;
              editFilters(selectedImg, "exposure", 0);
            }
          },
        },
        {
          name: "Kontraszt",
          min: -100,
          max: 100,
          step: 0.01,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "contrast") ?? 0,
          resetValue: 0,
          onChangeEnd: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "contrast", e.value);
          },
          onChange: (e: SliderValueChangeDetails) => {
            if (webglFilterRef.current) {
              uniforms.contrast_input = (Number(e.value) / 100.0) * 0.5 + 1.0;
            }
          },
          clearFunc: () => {
            if (webglFilterRef.current) {
              uniforms.contrast_input = (0 / 100.0) * 0.5 + 1.0;
              editFilters(selectedImg, "contrast", 0);
            }
          },
        },
      ],
    },
    {
      function: "Levels",
      icon: <TbShadow />,
      inputs: [
        {
          name: "Shadows",
          min: 0,
          max: filters.white ?? 0,
          step: 0.001,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "black") ?? 0,
          resetValue: 0,
          onChangeEnd: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "black", e.value);
          },
          onChange: (e: SliderValueChangeDetails) => {
            if (webglFilterRef.current) {
              uniforms.black_input = Number(e.value) / 255.0;
            }
          },
          clearFunc: () => {
            if (webglFilterRef.current) {
              uniforms.black_input = 0;
              editFilters(selectedImg, "black", 0);
            }
          },
        },
        {
          name: "Midtones - Gamma",
          min: 0.1,
          max: 3,
          step: 0.01,
          inputType: "slider",
          resetValue: 1,
          defaultValue: getFilterValue(selectedImg, "gamma") ?? 1,
          onChange: (e: SliderValueChangeDetails) => {
            if (webglFilterRef.current) {
              uniforms.gamma_input = Number(e.value);
            }
          },
          clearFunc: () => {
            if (webglFilterRef.current) {
              uniforms.gamma_input = 1;
              editFilters(selectedImg, "gamma", 1);
            }
          },
        },
        {
          name: "Highlights",
          min: filters.black ?? 0,
          max: 255,
          step: 0.001,
          inputType: "slider",
          resetValue: 255,
          defaultValue: getFilterValue(selectedImg, "white") ?? 255,
          onChange: (e: SliderValueChangeDetails) => {
            if (webglFilterRef.current) {
              uniforms.white_input = Number(e.value) / 255.0;
            }
          },
          clearFunc: () => {
            if (webglFilterRef.current) {
              uniforms.white_input = 1;
              editFilters(selectedImg, "white", 255);
            }
          },
        },
        {
          name: "Output",
          inputType: "customElement",
          options: (
            <div>
              <Slider.Root
                maxW="md"
                defaultValue={[
                  getFilterValue(selectedImg, "outblack") ?? 0,
                  getFilterValue(selectedImg, "outwhite") ?? 255,
                ]}
                max={255}
                step={0.001}
                min={0}
                onValueChange={(e) => {
                  const outBlackValue = e.value[0] ?? 0;
                  const outWhiteValue = e.value[1] ?? 255;

                  if (webglFilterRef.current) {
                    uniforms.outblack_input = outBlackValue / 255.0;
                    uniforms.outwhite_input = outWhiteValue / 255.0;
                  }
                }}
                onValueChangeEnd={(e) => {
                  const outBlackValue = e.value[0] ?? 0;
                  const outWhiteValue = e.value[1] ?? 255;

                  editFilters(selectedImg, "outblack", outBlackValue);
                  editFilters(selectedImg, "outwhite", outWhiteValue);
                }}
              >
                <Slider.Control>
                  <Slider.Track>
                    <Slider.Range bg={"transparent"} />
                  </Slider.Track>
                  <Slider.Thumbs
                    rounded={"l3"}
                    boxSize={6}
                    borderColor="teal.500"
                  />
                </Slider.Control>
              </Slider.Root>
            </div>
          ),
        },
      ],
    },
    {
      function: "HSV",
      icon: <TbGradienter />,
      inputs: [
        {
          name: "Hue",
          min: -180,
          max: 180,
          step: 1,
          style: {
            backgroundImage:
              "linear-gradient(to right, var(--chakra-colors-red-400), var(--chakra-colors-orange-400), var(--chakra-colors-yellow-400), var(--chakra-colors-green-400), var(--chakra-colors-blue-400), var(--chakra-colors-purple-400))",
          },
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, `hue`),
          onChangeEnd: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "hue", e.value);
          },
          onChange: (e: SliderValueChangeDetails) => {
            if (webglFilterRef.current) {
              uniforms.hue_input = Number(e.value) / 180.0;
            }
          },
          clearFunc: () => {
            if (webglFilterRef.current) {
              uniforms.hue_input = 0;
              editFilters(selectedImg, "hue", 0);
            }
          },
        },
        {
          name: "Telítettség",
          min: -1,
          max: 1,
          step: 0.01,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, `saturation`),
          onChangeEnd: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "saturation", e.value);
          },
          onChange: (e: SliderValueChangeDetails) => {
            if (webglFilterRef.current) {
              uniforms.saturation_input = Number(e.value);
            }
          },
          clearFunc: () => {
            if (webglFilterRef.current) {
              uniforms.saturation_input = 0;
              editFilters(selectedImg, "saturation", 0);
            }
          },
        },
        {
          name: "Érték",
          min: -1,
          max: 1,
          step: 0.001,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "value"),
          onChangeEnd: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "value", e.value);
          },
          onChange: (e: SliderValueChangeDetails) => {
            if (webglFilterRef.current) {
              uniforms.value_input = Number(e.value);
            }
          },
          clearFunc: () => {
            if (webglFilterRef.current) {
              uniforms.value_input = 0;
              editFilters(selectedImg, "value", 0);
            }
          },
        },
      ],
    },
    {
      function: "Channel mixer",
      icon: <TbColorFilter />,
      inputs: [
        {
          name: "",
          inputType: "customElement",
          options: <ChannelMixerBlock />,
        },

        {
          name: `Piros`,
          min: -100,
          max: 100,
          step: 1,
          style: {
            backgroundColor: " var(--chakra-colors-red-400)",
          },
          defaultValue:
            selectedChannel?.toLowerCase() === "red"
              ? (getFilterValue(
                  selectedImg,
                  `${selectedChannel?.toLowerCase()}_red_channel`,
                ) ?? 100)
              : (getFilterValue(
                  selectedImg,
                  `${selectedChannel?.toLowerCase()}_red_channel`,
                ) ?? 0),
          resetValue: selectedChannel?.toLowerCase() === "red" ? 100 : 0,
          inputType: "slider",
          onChangeEnd: (e: SliderValueChangeDetails) => {
            editFilters(
              selectedImg,
              `${selectedChannel?.toLowerCase()}_red_channel`,
              e.value,
            );
          },
          onChange: (e: SliderValueChangeDetails) => {
            const params = {
              ...filters,
              [`${selectedChannel?.toLowerCase()}_red_channel`]: e.value[0],
            };
            const channelOffset = getChannelOffsets(params);
            uniforms.channel_colorMatrix_input = channelOffset.channels;
          },
          clearFunc: () => {
            const params = {
              ...filters,
              [`${selectedChannel?.toLowerCase()}_red_channel`]:
                selectedChannel?.toLowerCase() === "red" ? 100 : 0,
            };
            const channelOffset = getChannelOffsets(params);
            uniforms.channel_colorMatrix_input = channelOffset.channels;

            editFilters(
              selectedImg,
              `${selectedChannel?.toLowerCase()}_red_channel`,
              selectedChannel?.toLowerCase() === "red" ? 100 : 0,
            );
          },
        },
        {
          name: `Zöld`,
          min: -100,
          max: 100,
          step: 1,
          inputType: "slider",
          style: {
            backgroundColor: " var(--chakra-colors-green-400)",
          },
          defaultValue:
            selectedChannel?.toLowerCase() === "green"
              ? (getFilterValue(
                  selectedImg,
                  `${selectedChannel?.toLowerCase()}_green_channel`,
                ) ?? 100)
              : (getFilterValue(
                  selectedImg,
                  `${selectedChannel?.toLowerCase()}_green_channel`,
                ) ?? 0),
          resetValue: selectedChannel?.toLowerCase() === "green" ? 100 : 0,
          onChangeEnd: (e: SliderValueChangeDetails) => {
            editFilters(
              selectedImg,
              `${selectedChannel?.toLowerCase()}_green_channel`,
              e.value,
            );
          },
          onChange: (e: SliderValueChangeDetails) => {
            const params = {
              ...filters,
              [`${selectedChannel?.toLowerCase()}_green_channel`]: e.value[0],
            };
            const channelOffset = getChannelOffsets(params);
            uniforms.channel_colorMatrix_input = channelOffset.channels;
          },
          clearFunc: () => {
            const params = {
              ...filters,
              [`${selectedChannel?.toLowerCase()}_green_channel`]:
                selectedChannel?.toLowerCase() === "green" ? 100 : 0,
            };
            const channelOffset = getChannelOffsets(params);
            uniforms.channel_colorMatrix_input = channelOffset.channels;

            editFilters(
              selectedImg,
              `${selectedChannel?.toLowerCase()}_green_channel`,
              selectedChannel?.toLowerCase() === "green" ? 100 : 0,
            );
          },
        },
        {
          name: `Kék`,
          min: -100,
          max: 100,
          step: 1,
          style: {
            backgroundColor: " var(--chakra-colors-blue-400)",
          },
          defaultValue:
            selectedChannel?.toLowerCase() === "blue"
              ? (getFilterValue(
                  selectedImg,
                  `${selectedChannel?.toLowerCase()}_blue_channel`,
                ) ?? 100)
              : (getFilterValue(
                  selectedImg,
                  `${selectedChannel?.toLowerCase()}_blue_channel`,
                ) ?? 0),
          resetValue: selectedChannel?.toLowerCase() === "blue" ? 100 : 0,
          inputType: "slider",
          onChangeEnd: (e: SliderValueChangeDetails) => {
            editFilters(
              selectedImg,
              `${selectedChannel?.toLowerCase()}_blue_channel`,
              e.value,
            );
          },
          onChange: (e: SliderValueChangeDetails) => {
            const params = {
              ...filters,
              [`${selectedChannel?.toLowerCase()}_blue_channel`]: e.value[0],
            };
            const channelOffset = getChannelOffsets(params);
            uniforms.channel_colorMatrix_input = channelOffset.channels;
          },
          clearFunc: () => {
            const params = {
              ...filters,
              [`${selectedChannel?.toLowerCase()}_blue_channel`]:
                selectedChannel?.toLowerCase() === "blue" ? 100 : 0,
            };
            const channelOffset = getChannelOffsets(params);
            uniforms.channel_colorMatrix_input = channelOffset.channels;

            editFilters(
              selectedImg,
              `${selectedChannel?.toLowerCase()}_blue_channel`,
              selectedChannel?.toLowerCase() === "blue" ? 100 : 0,
            );
          },
        },
        {
          name: `Offset`,
          min: -100,
          max: 100,
          step: 1,
          resetValue: 0,
          inputType: "slider",
          defaultValue: getFilterValue(
            selectedImg,
            `${selectedChannel?.toLowerCase()}_channel_offset`,
          ),
          onChangeEnd: (e: SliderValueChangeDetails) => {
            editFilters(
              selectedImg,
              `${selectedChannel?.toLowerCase()}_channel_offset`,
              e.value,
            );
          },
          onChange: (e: SliderValueChangeDetails) => {
            const params = {
              ...filters,
              [`${selectedChannel?.toLowerCase()}_channel_offset`]: e.value[0],
            };
            const channelOffset = getChannelOffsets(params);
            uniforms.channel_offset_input = channelOffset.offset;
          },
          clearFunc: () => {
            const params = {
              ...filters,
              [`${selectedChannel?.toLowerCase()}_channel_offset`]: 0,
            };
            const channelOffset = getChannelOffsets(params);
            uniforms.channel_offset_input = channelOffset.offset;
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
      icon: <TbTemperature />,
      inputs: [
        {
          name: "Színhőmérséklet",
          min: -100,
          max: 100,
          step: 1,
          resetValue: 0,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "temperature"),
          style: {
            backgroundImage:
              "linear-gradient(to right, var(--chakra-colors-blue-400), var(--chakra-colors-transparent), var(--chakra-colors-orange-400))",
          },
          onChangeEnd: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "temperature", e.value);
          },
          onChange: (e: SliderValueChangeDetails) => {
            if (webglFilterRef.current) {
              uniforms.temperature_input = Number(e.value) / 100.0;
            }
          },
          clearFunc: () => {
            if (webglFilterRef.current) {
              uniforms.temperature_input = 0;
              editFilters(selectedImg, "temperature", 0);
            }
          },
        },
        {
          name: "Árnyalat",
          min: -100,
          max: 100,
          step: 1,
          resetValue: 0,
          inputType: "slider",
          style: {
            backgroundImage:
              "linear-gradient(to right, var(--chakra-colors-green-400), var(--chakra-colors-transparent), var(--chakra-colors-purple-400))",
          },
          defaultValue: getFilterValue(selectedImg, "tint"),
          onChangeEnd: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "tint", e.value);
          },
          onChange: (e: SliderValueChangeDetails) => {
            if (webglFilterRef.current) {
              uniforms.tint_input = Number(e.value) / 100.0;
            }
          },
          clearFunc: () => {
            if (webglFilterRef.current) {
              uniforms.tint_input = 0;
              editFilters(selectedImg, "tint", 0);
            }
          },
        },
        {
          name: "Vibrance",
          min: -100,
          max: 100,
          step: 1,
          resetValue: 0,
          inputType: "slider",
          defaultValue: getFilterValue(selectedImg, "vibrance"),
          onChangeEnd: (e: SliderValueChangeDetails) => {
            editFilters(selectedImg, "vibrance", e.value);
          },
          onChange: (e: SliderValueChangeDetails) => {
            if (webglFilterRef.current) {
              uniforms.vibrance_input = Number(e.value) / 100.0;
            }
          },
          clearFunc: () => {
            if (webglFilterRef.current) {
              uniforms.vibrance_input = 0;
              editFilters(selectedImg, "vibrance", 0);
            }
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
      icon: <LuImages />,
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
                  x: number ,
                  y: number ,
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
            } else {
              if (expandMode !== "crop") {
                setExpandMode(selectedImg, "no");
              }
              setBorderSize(selectedImg, {
                x: 0,
                y: 0,
              });
            }
          },
        },
        {
          name: "",
          inputType: "customElement",
          options: (
            <ColorPicker.Root
              zIndex={1000}
              defaultValue={
                expandBackground
                  ? parseColor(expandBackground)
                  : parseColor("#ffff")
              }
              onValueChange={(e: any) => {
                let value = e.value;
                if (value !== "") {
                  setExpandBackground(selectedImg, value.toString("hex"));
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
  ].filter(Boolean) as EditItemProp[];
};

export default function SideBar() {
  //#region contextek

  const {
    spriteRef,
    selectedImg,
    selectedScale,
    selectedChannel,
    webglFilterRef,
    imageScale
  } = useWorkSession();

  const {
    editFilters,
    getFilterValue,
    setExpandMode,
    setBorderSize,
    setExpandBackground,
  } = useSessionStore();
  //#endregion

  //#region sidebar funkciók
  const selectedExtension =
    useSessionStore(
      (s) =>
        s.sessionData.find((si) => si.id === selectedImg)?.exportSettings
          ?.fileExtension,
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
  const uniforms = webglFilterRef.current
    ? webglFilterRef.current.resources.filterUniforms.uniforms
    : null;

  //#region breakPoint beállíátoks (isMd)
  const isMd = useBreakpointValue(
    { base: false, sm: false, md: false, lg: true, xl: true },
    { fallback: "md" },
  );
  //#endregion

  const editItems = useMemo(() => {
    return sidebarElements(
      selectedImg,
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
      webglFilterRef,
      uniforms,
      imageScale
    );
  }, [
    selectedImg,
    selectedExtension,
    expandBackground,
    expandMode,
    filters,
    captionSamples,
    webglFilterRef,
    selectedChannel,
    uniforms,
    imageScale
  ]);

  //#endregion
  return (
    <Flex
      maxH="80%"
      w={isMd ? "fit" : "full"}
      mb={isMd ? 0 : 2}
      direction={isMd ? "column" : "row"}
      gap={2}
      px={isMd ? 0 : 2}
      justifyContent={"center"}
    >
      <ScrollArea.Root maxH={isMd ? "80%" : "fit"} maxW={isMd ? "fit" : "100%"}>
        <ScrollArea.Viewport
          css={{
            "--scroll-shadow-size": "4rem",
            maskImage: "linear-gradient(#000, #000)",
            "&[data-overflow-y]": {
              maskImage:
                "linear-gradient(to bottom, transparent, #000 var(--scroll-shadow-size), #000 calc(100% - var(--scroll-shadow-size)), transparent)",
              "&[data-at-top]": {
                maskImage:
                  "linear-gradient(180deg, #000 calc(100% - var(--scroll-shadow-size)), transparent)",
              },
              "&[data-at-bottom]": {
                maskImage:
                  "linear-gradient(0deg, #000 calc(100% - var(--scroll-shadow-size)), transparent)",
              },
            },
            "&[data-overflow-x]": {
              maskImage:
                "linear-gradient(to right, transparent, #000 var(--scroll-shadow-size), #000 calc(100% - var(--scroll-shadow-size)), transparent)",
              "&[data-at-left]": {
                maskImage:
                  "linear-gradient(90deg, #000 calc(100% - var(--scroll-shadow-size)), transparent)",
              },
              "&[data-at-right]": {
                maskImage:
                  "linear-gradient(-90deg, #000 calc(100% - var(--scroll-shadow-size)), transparent)",
              },
            },
          }}
        >
          <ScrollArea.Content p={2} boxSizing={"border-box"} w={"fit"}>
            <Flex flexDir={isMd ? "column" : "row"} gap={2}>
              {editItems.map((item, index) => (
                <EditItem key={index} items={item} />
              ))}
            </Flex>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea.Root>
      <ExportDrawer />
    </Flex>
  );
}
