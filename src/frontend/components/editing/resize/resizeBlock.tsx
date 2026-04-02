import {
  Box,
  Button,
  ColorPicker,
  Grid,
  GridItem,
  HStack,
  Portal,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { LuExpand, LuInstagram, LuMaximize2 } from "react-icons/lu";

const sizesDatas = [
  {
    name: "Instagram",
    icon: <LuInstagram size={20} />,
    sizes: {
      width: 300,
      height: 300,
    },
  },
];

export default function ResizeBlock() {
  return (
    <Box>
      {
        //
      }
      <Grid gridTemplateColumns={"repeat(2,1fr)"} gap={6} mb={3}>
        {sizesDatas.map((size, index) => {
          return (
            <GridItem
              gap={2}
              bg={"bg.muted"}
              border={"1px solid"}
              borderColor={"bg.emphasized"}
              colorPalette={"teal"}
              display={"flex"}
              p={4}
              flexDirection={"column"}
              alignItems={"center"}
              borderRadius={"lg"}
              key={index}
            >
              <HStack flexDirection={"column"}>
                {size.icon}
                <Text>{size.name}</Text>
              </HStack>
              <Text fontSize={10}>
                ({size.sizes.height} x {size.sizes.width})
              </Text>
            </GridItem>
          );
        })}
      </Grid>
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
