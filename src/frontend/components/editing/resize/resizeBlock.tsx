//TODO: Számítási logikák kitevése
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  Box,
  Button,
  ColorPicker,
  Flex,
  HStack,
  Icon,
  parseColor,
  Portal,
  RadioCard,
  ScrollArea,
  Tabs,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Rectangle, Sprite, Texture } from "pixi.js";
import { useEffect } from "react";
import {
  LuBotOff,
  LuExpand,
  LuFacebook,
  LuInstagram,
  LuMaximize2,
  LuTwitter,
} from "react-icons/lu";
import { shallow } from "zustand/shallow";

const sizesDatas = [
  {
    name: "Instagram",
    icon: <LuInstagram size={20} />,
    sizes: { width: 1080, height: 1080 },
  },
  {
    name: "Instagram",
    icon: <LuInstagram size={20} />,
    sizes: { width: 1080, height: 1350 },
  },
  {
    name: "Instagram",
    icon: <LuInstagram size={20} />,
    sizes: { width: 1080, height: 566 },
  },
  {
    name: "Facebook",
    icon: <LuFacebook size={20} />,
    sizes: { width: 1200, height: 630 },
  },
  {
    name: "Facebook",
    icon: <LuFacebook size={20} />,
    sizes: { width: 1200, height: 1200 },
  },
  {
    name: "Twitter",
    icon: <LuTwitter size={20} />,
    sizes: { width: 1200, height: 675 },
  },
  {
    name: "Twitter",
    icon: <LuTwitter size={20} />,
    sizes: { width: 1080, height: 1080 },
  },
];

export default function ResizeBlock() {
  const {
    setExpandMode,
    setExpandBackground,
    setExpandSize,
    setCropSave,
  } = useSessionStore();
  const {
    appRef,
    spriteRef,
    textureRef,
    workPlaceRef,
    selectedImg,
  } = useWorkSession();

  //#region breakPoint beállíátoks (isMd)
  const isMd = useBreakpointValue(
    { base: false, sm: false, md: true, lg: true, xl: true },
    { fallback: "md" },
  );
  //#endregion

  const expandSize = useSessionStore(
    (state) =>
      state.sessionData.find((si) => si.id === selectedImg)?.expandSize,
  );

  const expandBackground =
    useSessionStore(
      (state) =>
        state.sessionData.find((si) => si.id === selectedImg)?.expandBackground,
    ) ?? "rgba(255,255,255,1)";

  const expandMode =
    useSessionStore(
      (state) =>
        state.sessionData.find((si) => si.id === selectedImg)?.expandMode,
    ) ?? "no";

  const box = useSessionStore(
    (state) => state.sessionData.find((si) => si.id === selectedImg)?.box,
  );

  const cropSaved = useSessionStore(
    (state) => state.sessionData.find((si) => si.id === selectedImg)?.cropSave,
    shallow,
  );


  return (
    <Box>
      {expandMode !== "no" && expandMode !== "border" && !cropSaved && (
        <RadioCard.Root
          orientation="horizontal"
          align="center"
          w={"full"}
          value={box ? box && box.width + "-" + box.height : ""}
          colorPalette={"teal"}
          defaultValue={expandSize?.width + "-" + expandSize?.height}
          onValueChange={(details) => {
            const value = details.value;
            if (!value) return;
            const [width, height] = value.split("-");
            if (!width || !height) return;
            let w = Number(width);
            let h = Number(height);
            if (
              workPlaceRef.current &&
              appRef.current &&
              textureRef.current &&
              spriteRef.current
            ) {
              setExpandSize(selectedImg, { width: w, height: h });
            }
          }}
        >
          <ScrollArea.Root width="full" size="xs" overflow={"hidden"}>
            <ScrollArea.Viewport>
              <ScrollArea.Content py="4">
                <Flex gap={3}>
                  {sizesDatas.map((item, index) => (
                    <RadioCard.Item
                      key={
                        item.sizes.width + "-" + item.sizes.height + "-" + index
                      }
                      value={item.sizes.width + "-" + item.sizes.height}
                    >
                      <RadioCard.ItemHiddenInput />
                      <RadioCard.ItemControl
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        alignContent={"center"}
                      >
                        <Icon fontSize="lg" color="teal.100">
                          {item.icon}
                        </Icon>
                        <RadioCard.ItemText>
                          {item.sizes.width + "x" + item.sizes.height}
                        </RadioCard.ItemText>
                      </RadioCard.ItemControl>
                    </RadioCard.Item>
                  ))}
                </Flex>
              </ScrollArea.Content>
            </ScrollArea.Viewport>
          </ScrollArea.Root>
        </RadioCard.Root>
      )}

      <Tabs.Root
        value={
          expandMode === "expand"
            ? "expand"
            : expandMode === "crop"
              ? "crop"
              : "no"
        }
        defaultValue="no"
        variant="plain"
        onValueChange={(e) => {
          const type = e.value;
          setExpandMode(selectedImg, type);
        }}
      >
        <Tabs.List
          bg="bg.muted"
          rounded="l3"
          p="1"
          w={"full"}
          display={"flex"}
          flexDir={"row"}
        >
          <Tabs.Trigger
            value="no"
            w={"full"}
            display={"flex"}
            justifyContent={"center"}
            disabled={expandMode === "no" || expandMode === "border"}
          >
            <LuBotOff />
            No
          </Tabs.Trigger>
          <Tabs.Trigger
            value="crop"
            w={"full"}
            display={"flex"}
            justifyContent={"center"}
            disabled={expandMode === "crop" || expandMode === "border" || !isMd}
          >
            <LuMaximize2 />
            Crop
          </Tabs.Trigger>
          <Tabs.Trigger
            value="expand"
            w={"full"}
            display={"flex"}
            justifyContent={"center"}
            disabled={
              expandMode === "expand" ||
              expandMode === "border" ||
              cropSaved === true
            }
          >
            <LuExpand />
            Expand
          </Tabs.Trigger>
          <Tabs.Indicator rounded="l2" />
        </Tabs.List>
        <Tabs.Content value="crop">
          <Button
            w={"full"}
            variant={"surface"}
            colorPalette={cropSaved === true ? "red" : "teal"}
            onClick={() => {
              setCropSave(selectedImg);
            }}
          >
            {cropSaved === true ? "Mégsem" : "Mentés"}
          </Button>
        </Tabs.Content>
        <Tabs.Content value="expand">
          <ColorPicker.Root
            defaultValue={
              expandBackground
                ? parseColor(expandBackground)
                : parseColor("#ffff")
            }
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
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
