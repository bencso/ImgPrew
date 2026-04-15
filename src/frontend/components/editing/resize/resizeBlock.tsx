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
import { useEffect } from "react";
import {
  LuExpand,
  LuFacebook,
  LuInstagram,
  LuMaximize2,
  LuTwitter,
} from "react-icons/lu";
import { shallow } from "zustand/shallow";

// TODO: Késöbb APIból kérjük le ezeket
// TODO: A selectedScalet kicserélni nem kell már felesleges, és megirni külön képekre,
//  a gépen jó már az expandelés de még mobilon és mozgatás közben nem, rájönni mit ronhottam el, és kijavitani
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
    shallow,
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
        state.sessionData.find((si) => si.id === selectedImg)?.isExpandMode,
    ) ?? false;

  const box = useSessionStore(
    (state) => state.sessionData.find((si) => si.id === selectedImg)?.box,
    shallow,
  );

  function resizeImage() {
    let w = Number(expandSize?.width);
    let h = Number(expandSize?.height);

    const cropSizeRelative = {
      height: h * (selectedScale?.scale ?? 1),
      width: w * (selectedScale?.scale ?? 1),
    };

    if (expandMode === true) {
      if (
        appRef.current &&
        spriteRef.current &&
        textureRef.current &&
        workPlaceRef.current
      ) {
        const workPlaceSize = workPlaceRef.current.getBoundingClientRect();
        const areaW = workPlaceSize.width;
        const areaH = workPlaceSize.height;
        const canvasScale = Math.min(areaW / w, areaH / h);

        const canvasW = w * canvasScale;
        const canvasH = h * canvasScale;

        appRef.current.renderer.resize(canvasW, canvasH);
        appRef.current.renderer.background.color = expandBackground;

        const imgW = textureRef.current.width;
        const imgH = textureRef.current.height;

        const imageScale = Math.min(canvasW / imgW, canvasH / imgH);

        spriteRef.current.anchor.set(0.5);

        spriteRef.current.width = imgW * imageScale;
        spriteRef.current.height = imgH * imageScale;

        spriteRef.current.x = canvasW / 2;
        spriteRef.current.y = canvasH / 2;

        setSelectedScale({
          image: {
            width: w,
            height: h,
          },
          scale: imageScale,
          position: {
            x: canvasW / 2,
            y: canvasH / 2,
          },
        });
      }
    } else if (expandMode === false) {
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
  }

  useEffect(() => {
    resizeImage();
  }, [expandSize, expandBackground]);

  return (
    <Box>
      <RadioCard.Root
        orientation="horizontal"
        align="center"
        w={"full"}
        value={box ? box && box.width + "-" + box.height : ""}
        colorPalette={"teal"}
        onValueChange={(details) => {
          const value = details.value;
          if (!value) return;
          const [width, height] = value.split("-");
          if (!width || !height) return;
          let w = Number(width);
          let h = Number(height);
          setExpandSize(selectedImg, { width: w, height: h });
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
      {
        //
      }
      <Tabs.Root
        value={expandMode ? "expand" : "crop"}
        defaultValue="crop"
        variant="plain"
        onValueChange={(e) => {
          setExpandMode(selectedImg, e.value === "expand");
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
