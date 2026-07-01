import {
  Button,
  Flex,
  Grid,
  GridItem,
  Popover,
  Portal,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuLayers, LuTrash } from "react-icons/lu";
import { Accordion, Avatar, HStack } from "@chakra-ui/react";
import { useSessionStore } from "@/stores/sessionData";
import { useWorkSession } from "@/providers/sessionprovider";
import { Container, Graphics, RenderTexture } from "pixi.js";

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
  const [selectedLayer, setSelectLayer] = useState(0);

  const { sessionData, addNewRenderTexture } = useSessionStore();
  const { appRef, renderTextureRef, selectedImg, maskContainerRef } =
    useWorkSession();

  const image = sessionData.find((i) => i.id == selectedImg);
  const renderTextures = image?.renderTextures;

  function createNew() {
    const width = appRef.current?.canvas.width;
    const height = appRef.current?.canvas.height;
    let renderTexture = RenderTexture.create({ width, height });

    renderTextureRef.current = renderTexture;

    if (
      renderTextures &&
      !renderTextures.find((i) => i.mask === renderTexture)
    ) {
      addNewRenderTexture(selectedImg, renderTexture);
    }

    if (appRef.current && maskContainerRef.current)
      appRef.current.renderer.render({
        container: maskContainerRef.current,
        target: renderTexture,
        clear: false,
      });
  }

  const activeLayer = renderTextures?.find(
    (r) => r.mask == renderTextureRef.current,
  );

  useEffect(() => {
    if (activeLayer?.id) setSelectLayer(activeLayer.id);
  }, [activeLayer]);

  return (
    <Accordion.Root
      collapsible
      defaultValue={[activeLayer?.id.toString() ?? "0"]}
    >
      {renderTextures &&
        renderTextures.map((layer, index) => (
          <Accordion.Item key={index} value={layer.id.toString()}>
            <Accordion.ItemTrigger>
              <Avatar.Root shape="rounded">
                <Avatar.Fallback name={layer.id.toString()} />
              </Avatar.Root>
              <HStack flex="1">{layer.id}</HStack>
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
                    <Button
                      w={"full"}
                      colorPalette="teal"
                      variant="outline"
                      disabled={selectedLayer === layer.id}
                      onClick={() => {
                        setSelectLayer(layer.id);
                        renderTextureRef.current = layer.mask;
                      }}
                    >
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
      <Button
        w={"full"}
        colorPalette={"teal"}
        mt={3}
        onClick={() => {
          createNew();
        }}
      >
        Új layer
      </Button>
    </Accordion.Root>
  );
};
