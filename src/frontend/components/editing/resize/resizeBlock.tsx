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
} from "@chakra-ui/react";
import {
  LuBotOff,
  LuExpand,
  LuFacebook,
  LuInstagram,
  LuMaximize2,
  LuTwitter,
} from "react-icons/lu";
import { shallow } from "zustand/shallow";

// TODO: EGY NAGYON NAGY BUG VAN // NAGYON CSUNYA MÁR A KÓD -> JAVITANI RAJTA, a képek méretezése nem jó

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
  const { setCropBox, setExpandMode, setExpandBackground, setExpandSize } =
    useSessionStore();
  const {
    appRef,
    spriteRef,
    textureRef,
    workPlaceRef,
    selectedImg,
    selectedScale,
    setSelectedScale,
  } = useWorkSession();

  const imageSize = useSessionStore(
    (state) => state.sessionData.find((si) => si.id === selectedImg)?.dimesions,
    shallow,
  );

  const expandSize = useSessionStore(
    (state) =>
      state.sessionData.find((si) => si.id === selectedImg)?.expandSize,
  );

  const expandBackground =
    useSessionStore(
      (state) =>
        state.sessionData.find((si) => si.id === selectedImg)?.expandBackground,
      shallow,
    ) ?? "rgba(255,255,255,1)";

  const expandMode =
    useSessionStore(
      (state) =>
        state.sessionData.find((si) => si.id === selectedImg)?.expandMode,
    ) ?? false;

  const box = useSessionStore(
    (state) => state.sessionData.find((si) => si.id === selectedImg)?.box,
    shallow,
  );

  return (
    <Box>
      {expandMode !== "no" && (
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

            if (expandMode === "expand") {
              if (
                appRef.current &&
                spriteRef.current &&
                textureRef.current &&
                workPlaceRef.current
              ) {
                const workPlaceSize = workPlaceRef.current;
                const areaW = workPlaceSize.offsetWidth;
                const areaH = workPlaceSize.offsetHeight;

                if (!areaW || !areaH || !w || !h) return;

                const canvasScale = Math.min(areaW / w, areaH / h);

                const canvasW = Math.round(w * canvasScale);
                const canvasH = Math.round(h * canvasScale);

                appRef.current.renderer.resize(canvasW, canvasH);

                const canvas = appRef.current.canvas;
                canvas.style.width = `${canvasW}px`;
                canvas.style.height = `${canvasH}px`;

                appRef.current.renderer.background.color = expandBackground;

                const imgW = textureRef.current.width;
                const imgH = textureRef.current.height;

                const imageScale = Math.min(canvasW / imgW, canvasH / imgH);

                spriteRef.current.anchor.set(0.5);

                let spW = Math.round(imgW * imageScale);
                let spH = Math.round(imgH * imageScale);

                spriteRef.current.width = spW;
                spriteRef.current.height = spH;

                spriteRef.current.x = canvasW / 2;
                spriteRef.current.y = canvasH / 2;

                setSelectedScale({
                  image: {
                    width: spW,
                    height: spH,
                  },
                  scale: imageScale,
                  position: {
                    x: canvasW / 2,
                    y: canvasH / 2,
                  },
                });
              }
            } else if (expandMode === "crop") {
              const cropSizeRelative = {
                height: h * (selectedScale?.scale ?? 1),
                width: w * (selectedScale?.scale ?? 1),
              };

              if (
                box &&
                imageSize &&
                spriteRef.current &&
                box.height === cropSizeRelative.height &&
                box.width === cropSizeRelative.width &&
                appRef.current
              ) {
                appRef.current.canvas.style.backgroundColor = "transparent";
                setCropBox({
                  id: selectedImg,
                  width: imageSize.width,
                  height: imageSize.height,
                  x: appRef.current.canvas.width / 2,
                  y: appRef.current.canvas.height / 2,
                });
                spriteRef.current.x = appRef.current.canvas.width / 2;
                spriteRef.current.y = appRef.current.canvas.height / 2;
              } else {
                if (appRef.current)
                  setCropBox({
                    id: selectedImg,
                    width: cropSizeRelative.width,
                    height: cropSizeRelative.height,
                  });
              }
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
        defaultValue="crop"
        variant="plain"
        onValueChange={(e) => {
          setExpandMode(selectedImg, e.value);
          if (e.value === "no") {
            if (
              workPlaceRef.current &&
              spriteRef.current &&
              appRef.current &&
              imageSize
            ) {
              console.log(imageSize);
              const imgW = imageSize.width;
              const imgH = imageSize.height;

              const scale = Math.min(
                workPlaceRef.current.offsetWidth / imgW,
                workPlaceRef.current.offsetHeight / imgH,
              );

              const width = imgW * scale;
              const height = imgH * scale;

              spriteRef.current.width = width;
              spriteRef.current.height = height;

              if (appRef.current.renderer)
                appRef.current.renderer.resize(width, height);

              const canvas = appRef.current.canvas;
              canvas.style.width = `${width}px`;
              canvas.style.height = `${height}px`;
              appRef.current.renderer.background.color = "transparent";

              spriteRef.current.x = appRef.current.canvas.width / 2;
              spriteRef.current.y = appRef.current.canvas.height / 2;

              setSelectedScale({
                image: {
                  width: width,
                  height: height,
                },
                scale: scale,
                position: {
                  x: appRef.current.canvas.width / 2,
                  y: appRef.current.canvas.height / 2,
                },
              });
            }
          }
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
          >
            <LuBotOff />
            No
          </Tabs.Trigger>
          <Tabs.Trigger
            value="crop"
            w={"full"}
            display={"flex"}
            justifyContent={"center"}
          >
            <LuMaximize2 />
            Crop
          </Tabs.Trigger>
          <Tabs.Trigger
            value="expand"
            w={"full"}
            display={"flex"}
            justifyContent={"center"}
          >
            <LuExpand />
            Expand
          </Tabs.Trigger>
          <Tabs.Indicator rounded="l2" />
        </Tabs.List>
        <Tabs.Content value="crop">
          <Button w={"full"} variant={"surface"} colorPalette={"teal"}>
            Crop
          </Button>
        </Tabs.Content>
        <Tabs.Content value="expand">
          <ColorPicker.Root
            defaultValue={parseColor(expandBackground)}
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
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
