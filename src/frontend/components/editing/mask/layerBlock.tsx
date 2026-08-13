import {
  Button,
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
import {
  Container,
  defaultFilterVert,
  Filter,
  RenderTexture,
  Sprite,
  UniformGroup,
} from "pixi.js";
import { allFiltersFragment } from "@/handlers/filters/allFiltersFragment";
import { getChannelOffsets } from "@/helper/lut/getChannelOffset";
import { filters } from "@/interfaces/filters.interface";
import { maskFiltersFragment } from "@/handlers/filters/maskFiltersFragment";
import { previewScale } from "@/interfaces/workplaceHelper.interface";

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
        position={"absolute"}
        top={{
          md: 30,
          mdDown: 100,
        }}
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

  const { sessionData, addNewRenderTexture, deleteLayer } = useSessionStore();
  const {
    appRef,
    maskTextureRef,
    selectedImg,
    selectedLayer,
    setSelectLayer,
    textureRef,
    webglFilterRef,
    hoverMaskGraphRef,
  } = useWorkSession();

  const image = sessionData.find((i) => i.id == selectedImg);
  const renderTextures = image?.renderTextures;

  function createNew() {
    if (!textureRef.current) return;

    let index = renderTextures?.length ?? 0;
    const channelOffset = getChannelOffsets(filters);

    const layer = new Container();
    layer.label = `layer_${index}`;

    const size = image?.dimesions;
    const renderSprite = new Sprite();

    const maskTexture = RenderTexture.create({
      width: size?.width,
      height: size?.height,
    });
    maskTextureRef.current = maskTexture;

    const resultTexture = RenderTexture.create({
      width: size?.width,
      height: size?.height,
    });

    const filterUniforms = new UniformGroup({
      exposure_input: { value: filters.exposure / 5.0, type: "f32" },
      brightness_input: { value: filters.brightness / 100.0, type: "f32" },
      contrast_input: {
        value: (filters.contrast / 100.0) * 0.5 + 1.0,
        type: "f32",
      },
      temperature_input: {
        value: filters.temperature / 100.0,
        type: "f32",
      },
      tint_input: { value: filters.tint / 100.0, type: "f32" },
      saturation_input: { value: filters.saturation, type: "f32" },
      hue_input: { value: filters.hue / 180.0, type: "f32" },
      value_input: { value: filters.value, type: "f32" },
      black_input: { value: filters.black / 255.0, type: "f32" },
      white_input: { value: filters.white / 255.0, type: "f32" },
      outblack_input: { value: filters.outblack / 255.0, type: "f32" },
      outwhite_input: { value: filters.outwhite / 255.0, type: "f32" },
      gamma_input: { value: filters.gamma, type: "f32" },
      channel_colorMatrix_input: {
        value: channelOffset.channels,
        type: "mat3x3<f32>",
      },
      channel_offset_input: {
        value: channelOffset.offset,
        type: "vec3<f32>",
      },
      vibrance_input: { value: filters.vibrance / 100.0, type: "f32" },
    });

    const filter = Filter.from({
      gl: {
        fragment: allFiltersFragment,
        vertex: defaultFilterVert,
      },
      resources: {
        filterUniforms: filterUniforms,
        layer_mask: maskTexture.source,
      },
    });

    const filterMask = Filter.from({
      gl: {
        fragment: maskFiltersFragment,
        vertex: defaultFilterVert,
      },
      resources: {
        filterUniforms: filterUniforms,
      },
    });

    if (appRef.current) {
      const hover = appRef.current.stage.getChildByLabel(
        hoverMaskGraphRef.current.label,
      );

      if (hover) {
        appRef.current.stage.removeChild(hover);
        appRef.current.stage.addChild(hoverMaskGraphRef.current);
      }
    }

    webglFilterRef.current = filter;

    addNewRenderTexture(
      selectedImg,
      maskTexture,
      filter,
      resultTexture,
      renderSprite,
      filterMask,
    );

    setSelectLayer(index);
    index++;
  }

  const activeLayer = renderTextures?.find(
    (r) => r.maskTexture == maskTextureRef.current,
  );

  useEffect(() => {
    if (selectedLayer === null) {
      if (image && image.filter) webglFilterRef.current = image.filter;
    } else {
      const renderText =
        renderTextures && renderTextures?.find((i) => i.id === selectedLayer);
      if (renderText) {
        maskTextureRef.current = renderText.maskTexture;
        webglFilterRef.current = renderText.filter;
      }
    }
  }, [selectedLayer]);

  return (
    <>
      {" "}
      {renderTextures && renderTextures.length > 0 && (
        <Accordion.Root
          collapsible
          defaultValue={[activeLayer?.id.toString() ?? "0"]}
        >
          {renderTextures.map((layer, index) => (
            <Accordion.Item key={index} value={layer.id.toString()}>
              <Accordion.ItemTrigger>
                <Avatar.Root shape="rounded">
                  <Avatar.Fallback name={layer.id.toString()} />
                </Avatar.Root>
                <HStack flex="1">{layer.id > 0 ? layer.id : "Kép"}</HStack>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  <Grid
                    w={"full"}
                    gap={2}
                    gridTemplateColumns={
                      isMd
                        ? index > 0
                          ? "repeat(2, 1fr)"
                          : "repeat(1, 1fr)"
                        : ""
                    }
                    gridTemplateRows={
                      !isMd
                        ? index > 0
                          ? "repeat(2, 1fr)"
                          : "repeat(1, 1fr)"
                        : ""
                    }
                  >
                    <GridItem>
                      <Button
                        w={"full"}
                        colorPalette="teal"
                        variant="outline"
                        onClick={() => {
                          if (selectedLayer === layer.id) setSelectLayer(0);
                          else setSelectLayer(layer.id);
                        }}
                      >
                        {selectedLayer !== null && selectedLayer === layer.id
                          ? "Kiválasztva"
                          : "Kiválasztás"}
                      </Button>
                    </GridItem>
                    {index > 0 && (
                      <GridItem>
                        <Button
                          w={"full"}
                          colorPalette="red"
                          variant="solid"
                          onClick={() => {
                            if (index <= 0) return;

                            const layerId = layer.id;
                            deleteLayer(selectedImg, layerId);

                            const selectedLayer = renderTextures.find(
                              (ri) => ri.id === layer.id,
                            );

                            setSelectLayer(0);

                            if (!appRef.current) return;
                            {
                              appRef.current.stage.removeChild(
                                selectedLayer?.resultTexture,
                              );
                            }

                            setSelectLayer(0);
                          }}
                        >
                          <LuTrash /> Törlés
                        </Button>
                      </GridItem>
                    )}
                  </Grid>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      )}
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
    </>
  );
};
