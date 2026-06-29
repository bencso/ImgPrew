import {
  Button,
  Flex,
  Grid,
  GridItem,
  Popover,
  Portal,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuLayers, LuTrash } from "react-icons/lu";
import { Accordion, Avatar, HStack } from "@chakra-ui/react";

//#region SIDEBAR ITEM
export const MaskLayerBlock = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      positioning={{ placement: "bottom-start" }}
    >
      <Popover.Trigger
        asChild
        w="30px"
        h="40px"
        position={"relative"}
        left={0}
        top={0}
      >
        <Button
          w={"full"}
          h={"full"}
          variant={"surface"}
          rounded={"xl"}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          gap={3}
          border={"0"}
          bg={"bg"}
          _hover={{
            bg: "bg.muted",
          }}
        >
          <LuLayers />
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            maxWidth="300px"
            minW={"300px"}
            w={"300px"}
            rounded={"l3"}
            opacity={1}
          >
            <Popover.Body>
              <LayersAccordion />
            </Popover.Body>
            <Popover.CloseTrigger />
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

const LayersAccordion = () => {
  const isMd = useBreakpointValue(
    { base: false, sm: false, md: false, lg: true, xl: true },
    { ssr: false },
  );

  return (
    <Accordion.Root collapsible defaultValue={["b"]}>
      {items.map((item, index) => (
        <Accordion.Item key={index} value={item.name}>
          <Accordion.ItemTrigger>
            <Avatar.Root shape="rounded">
              <Avatar.Image src={item.image} />
              <Avatar.Fallback name={item.name} />
            </Avatar.Root>
            <HStack flex="1">{item.name}</HStack>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <Grid
                w={"full"}
                gap={2}
                gridTemplateColumns={isMd ? "repeat(2, 1fr)" : ""}
                gridTemplateRows={!isMd ? "repeat(2, 1fr)" : ""}
              >
                <GridItem>
                  <Button w={"full"} colorPalette="teal" variant="outline">
                    Kiválasztás
                  </Button>
                </GridItem>
                <GridItem>
                  <Button w={"full"} colorPalette="red" variant="solid">
                    <LuTrash /> Törlés
                  </Button>
                </GridItem>
              </Grid>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};

const items = [
  {
    name: "Layer 1",
    image: "https://i.pravatar.cc/150?u=a",
  },
  {
    name: "Layer 2",
    image: "https://i.pravatar.cc/150?u=b",
  },
  {
    name: "Layer 3",
    image: "https://i.pravatar.cc/150?u=c",
  },
];
