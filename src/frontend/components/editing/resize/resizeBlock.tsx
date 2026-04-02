import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  Box,
  Button,
  ColorPicker,
  Flex,
  HStack,
  Icon,
  Portal,
  RadioCard,
  ScrollArea,
  Tabs,
} from "@chakra-ui/react";
import {
  LuExpand,
  LuFacebook,
  LuInstagram,
  LuMaximize2,
  LuTwitter,
} from "react-icons/lu";

// TODO: Késöbb APIból kérjük le ezeket
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
  const { selectedImg } = useWorkSession();
  const { setCropSize } = useSessionStore();
  const cropSize = useSessionStore(
    (state) => state.sessionData[selectedImg].cropSize,
  );

  const cropSizeSaved = cropSize && cropSize.height && cropSize.width;

  return (
    <Box>
      {
        //
      }

      <RadioCard.Root
        orientation="horizontal"
        align="center"
        w={"full"}
        value={cropSizeSaved ? cropSize.width + "-" + cropSize.height : ""}
        onValueChange={(e) => {
          if (!e.value) return;
          const [width, height] = e.value?.split("-");
          setCropSize(selectedImg, Number(width), Number(height));
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
      <Tabs.Root defaultValue="crop" variant="plain">
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
          <ColorPicker.Root>
            <ColorPicker.HiddenInput />
            <ColorPicker.Control>
              <ColorPicker.Input />
              <ColorPicker.Trigger />
            </ColorPicker.Control>
            <Portal>
              <ColorPicker.Positioner>
                <ColorPicker.Content>
                  <ColorPicker.Area />
                  <HStack>
                    <ColorPicker.EyeDropper size="xs" variant="outline" />
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
