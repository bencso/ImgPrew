//TODO: Refaktorálás
import { allFiltersFragment } from "@/handlers/filters/allFiltersFragment";
import { calcScale } from "@/helper/sizes/calcScale";
import { ParamProps } from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box, parseColor } from "@chakra-ui/react";
import "pixi-filters";
import {
  Application,
  Container,
  defaultFilterVert,
  Filter,
  Graphics,
  ImageSource,
  Rectangle,
  RenderTexture,
  Sprite,
  Texture,
  UniformGroup,
} from "pixi.js";
import { useEffect, useRef } from "react";

export function getChannelOffsets(params: ParamProps) {
  const channels = new Float32Array([
    params.red_red_channel / 100.0,
    params.green_red_channel / 100.0,
    params.blue_red_channel / 100.0,

    params.red_green_channel / 100.0,
    params.green_green_channel / 100.0,
    params.blue_green_channel / 100.0,

    params.red_blue_channel / 100.0,
    params.green_blue_channel / 100.0,
    params.blue_blue_channel / 100.0,
  ]);

  const offset = new Float32Array([
    params.red_channel_offset / 100.0,
    params.green_channel_offset / 100.0,
    params.blue_channel_offset / 100.0,
  ]);

  return { channels, offset };
}

export default function WebGlComponent() {
  const {
    selectedImg,
    setSelectedScale,
    textureRef,
    spriteRef,
    appRef,
    workPlaceRef,
    webglFilterRef,
    selectedScale,
    setImageScale,
    overlayRef,
    canvasRef,
    setMaskBrushSize,
    setMaskEraseMode,
    brushRef,
    renderTextureRef,
    hoverMaskGraphRef,
    maskContainerRef,
    selectedLayer,
  } = useWorkSession();
  const { sessionData, setImageSize, addNewRenderTexture } = useSessionStore();

  const filtersRef = useRef<Container | null>(null);

  const lutFilter = useSessionStore(
    (state) =>
      state.sessionData.find((img) => img.id === selectedImg)?.lutFilter,
  );

  //! shallow: nem generál le újra az objektumot hanem mintha cachelte volna mindig az adott objektumot irja felül / ÖSSZEHASONLÍT
  const filters = useSessionStore.getState().getFilters(selectedImg);
  let image = useSessionStore
    .getState()
    .sessionData.find((si) => si.id === selectedImg);

  const expandMode = image?.expandMode ?? "no";
  const expandSize = image?.expandSize;
  const borderSize = image?.borderSize;
  const expandBackground = image?.expandBackground ?? "#fff";
  const imageSize = image?.dimesions;
  const box = image?.box;
  const cropSaved = image?.cropSave;
  const expandPadding = image?.expandSize?.padding;
  const haldSprite = image?.haldSprite;
  let renderTexture = image?.renderTextures
    ? image.renderTextures[0] && image.renderTextures[0].mask
    : null;
  let outputSprite = image?.renderTextures
    ? image.renderTextures[0] && image.renderTextures[0].sprite
    : null;

  async function initApp() {
    const app = new Application();

    await app.init({
      resolution: window.devicePixelRatio,
      autoDensity: true,
      antialias: true,
      backgroundAlpha: 0,
    });

    appRef.current = app;

    // @ts-ignore
    window.__PIXI_DEVTOOLS__ = {
      app,
    };

    // @ts-ignore
    globalThis.__PIXI_APP__ = app;
  }

  useEffect(() => {
    (async () => {
      await initApp();
      await loadImage();
    })();
  }, []);

  async function loadImage() {
    if (!appRef.current) {
      return;
    }

    const img = new Image();

    img.onload = async () => {
      if (!appRef.current) return;

      const source = new ImageSource({ resource: img });
      const texture = new Texture({ source });
      const overlay = new Container();
      const hoverGraph = new Graphics();

      textureRef.current = texture;
      const sprite = new Sprite(texture);

      sprite.anchor.set(0.5);

      const prevStage = appRef.current.stage.children.filter(
        (fs) => fs !== sprite,
      )[0];

      if (prevStage) appRef.current.stage.removeChild(prevStage);
      appRef.current.stage.addChild(sprite);
      appRef.current.stage.addChild(overlay);

      if (!renderTexture) {
        const width = appRef.current?.canvas.width;
        const height = appRef.current?.canvas.height;
        renderTexture = RenderTexture.create({ width, height });
        outputSprite = new Sprite(renderTexture);
        addNewRenderTexture(selectedImg, renderTexture, outputSprite);
      }

      const maskContainer = new Container();

      image = useSessionStore
        .getState()
        .sessionData.find((si) => si.id === selectedImg);

      if (!image || !image.renderTextures || image.renderTextures.length <= 0)
        return;

      const layers = image?.renderTextures;
      renderTexture = layers[selectedLayer]
        ? layers[selectedLayer].mask
        : layers[0].mask;

      for (let index = 0; index < layers.length; index++) {
        const layer = layers[index];
        appRef.current.stage.addChild(layer.sprite);
      }

      renderTextureRef.current = renderTexture;

      appRef.current.stage.addChild(hoverGraph);

      const brush = new Graphics();
      maskContainer.addChild(brush);
      maskContainerRef.current = maskContainer;

      brushRef.current = brush;

      spriteRef.current = sprite;
      overlayRef.current = overlay;
      hoverMaskGraphRef.current = hoverGraph;

      if (canvasRef.current)
        canvasRef.current.replaceChildren(appRef.current.canvas);

      updateLayout();
      applyFilters();
    };

    if (sessionData.length > 0 && sessionData[selectedImg].blob)
      img.src = sessionData[selectedImg].blob;
  }

  useEffect(() => {
    if (!canvasRef.current && !appRef.current) return;

    const container = new Container();
    filtersRef.current = container;

    loadImage();

    return () => {
      if (spriteRef.current) {
        spriteRef.current.destroy();
        spriteRef.current = null;
      }

      if (overlayRef.current) {
        overlayRef.current.destroy();
        overlayRef.current = null;
      }

      if (textureRef.current) {
        textureRef.current.destroy(false);
        textureRef.current?.source.unload();
        textureRef.current = null;
      }

      if (canvasRef.current) canvasRef.current.innerHTML = "";
    };
  }, [selectedImg]);

  useEffect(() => {
    if (expandMode === "no" || (cropSaved === false && expandMode === "crop")) {
      if (appRef.current) appRef.current.stage.removeChildren();
      loadImage();
    }
  }, [expandMode, cropSaved]);

  function applyFilters() {
    if (!spriteRef.current || !appRef.current) return;

    const channelOffset = getChannelOffsets(filters);

    if (!webglFilterRef.current) {
      const filterUniforms = new UniformGroup({
        exposure_input: { value: filters.exposure / 5.0, type: "f32" },
        brightness_input: { value: filters.brightness / 100.0, type: "f32" },
        contrast_input: {
          value: (filters.contrast / 100.0) * 0.5 + 1.0,
          type: "f32",
        },
        temperature_input: { value: filters.temperature / 100.0, type: "f32" },
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

      webglFilterRef.current = Filter.from({
        gl: {
          fragment: allFiltersFragment,
          vertex: defaultFilterVert,
        },
        resources: {
          filterUniforms: filterUniforms,
        },
      });

      webglFilterRef.current.padding = 0;

      spriteRef.current.roundPixels = true;

      if (lutFilter) {
        if (spriteRef.current)
          spriteRef.current.filters = [lutFilter, webglFilterRef.current];
        if (haldSprite)
          haldSprite.filters = [lutFilter, webglFilterRef.current];
      } else {
        if (spriteRef.current)
          spriteRef.current.filters = [webglFilterRef.current];
        if (haldSprite) haldSprite.filters = [webglFilterRef.current];
      }
    } else {
      const uniforms = webglFilterRef.current.resources.filterUniforms.uniforms;

      uniforms.exposure_input = filters.exposure / 5.0;
      uniforms.brightness_input = filters.brightness / 100.0;
      uniforms.contrast_input = (filters.contrast / 100.0) * 0.5 + 1.0;
      uniforms.temperature_input = filters.temperature / 100.0;
      uniforms.tint_input = filters.tint / 100.0;
      uniforms.saturation_input = filters.saturation;
      uniforms.hue_input = filters.hue / 180.0;
      uniforms.value_input = filters.value;
      uniforms.black_input = filters.black / 255.0;
      uniforms.white_input = filters.white / 255.0;
      uniforms.outblack_input = filters.outblack / 255.0;
      uniforms.outwhite_input = filters.outwhite / 255.0;
      uniforms.gamma_input = filters.gamma;
      uniforms.channel_colorMatrix_input = channelOffset.channels;
      uniforms.channel_offset_input = channelOffset.offset;
      uniforms.vibrance_input = filters.vibrance / 100.0;

      if (lutFilter) {
        if (spriteRef.current)
          spriteRef.current.filters = [lutFilter, webglFilterRef.current];
        if (haldSprite)
          haldSprite.filters = [lutFilter, webglFilterRef.current];
      } else {
        if (spriteRef.current)
          spriteRef.current.filters = [webglFilterRef.current];
        if (haldSprite) haldSprite.filters = [webglFilterRef.current];
      }
    }
  }

  const updateLayout = () => {
    if (
      !workPlaceRef.current ||
      !appRef.current ||
      !textureRef.current ||
      !spriteRef.current
    )
      return;

    const imgW = textureRef.current.width;
    const imgH = textureRef.current.height;

    if (!imageSize) {
      setImageSize(selectedImg, imgW, imgH);
    }

    const returnScale = calcScale({
      workPlaceRef,
      appRef,
      textureRef,
      spriteRef,
      imageSize,
      expandMode,
      expandSize,
      canvasRef,
      cropSaved,
      box,
      borderSize,
    });

    const areaW = workPlaceRef.current.offsetWidth;
    const areaH = workPlaceRef.current.offsetHeight;

    if (expandMode === "expand" && expandSize) {
      if (!canvasRef.current || !textureRef.current || !imageSize) return;

      const h = expandSize.height;
      const w = expandSize.width;

      const canvasScale = returnScale;

      const canvasW = w * canvasScale;
      const canvasH = h * canvasScale;
      const padding = (expandPadding ?? 0) * canvasScale;

      appRef.current.renderer.background.color =
        parseColor(expandBackground).toString("rgba");
      appRef.current.renderer.resize(canvasW, canvasH);

      let scale = Math.min(w / imageSize.width, h / imageSize.height);

      const scaledImageW = imageSize.width * scale;
      const scaledImageH = imageSize.height * scale;
      scale = Math.min(
        (canvasW - padding) / scaledImageW,
        (canvasH - padding) / scaledImageH,
      );

      spriteRef.current.width = scaledImageW * scale;
      spriteRef.current.height = scaledImageH * scale;

      spriteRef.current.x =
        (Number(appRef.current.canvas.style.width.replace("px", "")) ?? 0) / 2;
      spriteRef.current.y =
        (Number(appRef.current.canvas.style.height.replace("px", "")) ?? 0) / 2;

      setSelectedScale({
        image: { height: h, width: w },
        scale: returnScale,
        position: {
          x:
            (Number(appRef.current.canvas.style.width.replace("px", "")) ?? 0) /
            2,
          y:
            (Number(appRef.current.canvas.style.height.replace("px", "")) ??
              0) / 2,
        },
      });

      applyFilters();

      return;
    } else {
      const scale = Math.min(areaH / imgH, areaW / imgW);
      let canvasW = imgW * scale;
      let canvasH = imgH * scale;

      let spW = canvasW;
      let spH = canvasH;
      let spX = canvasW / 2;
      let spY = canvasH / 2;

      spriteRef.current.anchor = 0.5;

      if (expandMode === "crop" && cropSaved === true) {
        if (
          !textureRef.current ||
          !workPlaceRef.current ||
          !appRef.current ||
          !box ||
          !spriteRef.current ||
          !selectedScale ||
          !imageSize ||
          !box.x ||
          !box.y ||
          !box.height ||
          !box.width ||
          !canvasRef.current
        )
          return;

        const imgW = textureRef.current.width;
        const imgH = textureRef.current.height;

        if (!imageSize) {
          setImageSize(selectedImg, imgW, imgH);
        }

        const scaleX = box?.currentWidth
          ? (workPlaceRef.current?.clientWidth ?? 0) / imageSize.width
          : 1;
        const scaleY = box?.currentHeight
          ? (workPlaceRef.current?.clientHeight ?? 0) / imageSize.height
          : 1;

        const h = box.height * scaleY;
        const w = box.width * scaleX;

        const defaultImageScaleH =
          imageSize.height / workPlaceRef.current?.clientHeight;
        const defaultImageScaleW =
          imageSize.width / workPlaceRef.current?.clientWidth;

        const canvasW = w * defaultImageScaleW;
        const canvasH = h * defaultImageScaleH;

        textureRef.current = new Texture({
          source: textureRef.current.source,
          orig: textureRef.current.orig,
          trim: textureRef.current.trim,
          frame: new Rectangle(box.x, box.y, canvasW, canvasH),
        });

        const overlay = new Container();

        const spriteCopy = new Sprite(textureRef.current);
        appRef.current.stage.removeChildren();
        appRef.current.stage.addChild(spriteCopy);
        spriteRef.current = spriteCopy;

        const targetH = Math.floor(canvasH + (borderSize?.y ?? 0));
        const targetW = Math.floor(canvasW + (borderSize?.x ?? 0));

        const scale = returnScale;

        const appW = Math.floor(targetW * scale);
        const appH = Math.floor(targetH * scale);

        appRef.current.renderer.resize(appW, appH);
        appRef.current.stage.addChild(overlay);
        overlayRef.current = overlay;

        appRef.current.renderer.background.color =
          parseColor(expandBackground).toString("rgba");

        spriteRef.current.height = canvasH * scale;
        spriteRef.current.width = canvasW * scale;
        spriteRef.current.anchor = 0.5;
        spriteRef.current.x =
          (Number(appRef.current.canvas.style.width.replace("px", "")) ?? 0) /
          2;
        spriteRef.current.y =
          (Number(appRef.current.canvas.style.height.replace("px", "")) ?? 0) /
          2;

        setSelectedScale({
          image: {
            height: targetH,
            width: targetW,
          },
          scale: scale,
          position: {
            x:
              (Number(appRef.current.canvas.style.width.replace("px", "")) ??
                0) / 2,
            y:
              (Number(appRef.current.canvas.style.height.replace("px", "")) ??
                0) / 2,
          },
        });
      }

      if (
        expandMode === "no" ||
        (expandMode === "crop" && cropSaved === false)
      ) {
        appRef.current.renderer.resize(canvasW, canvasH);

        spriteRef.current.width = spW;
        spriteRef.current.height = spH;
        spriteRef.current.x = spX;
        spriteRef.current.y = spY;

        setSelectedScale({
          image: {
            height: imageSize?.height ?? 0,
            width: imageSize?.width ?? 0,
          },
          scale: returnScale,
          position: { x: spX, y: spY },
        });
      }

      if (expandMode === "border") {
        const borderSizeX =
          typeof borderSize?.x === "number" ? borderSize?.x : 0;
        const borderSizeY =
          typeof borderSize?.y === "number" ? borderSize?.y : 0;

        const imgW = imageSize?.width ?? 0;
        const imgH = imageSize?.height ?? 0;

        const h = imgH + borderSizeX;
        const w = imgW + borderSizeY;

        const maxTargetWidth = workPlaceRef.current.clientWidth;
        const maxTargetHeight = workPlaceRef.current.clientHeight;
        const canvasScale = Math.min(maxTargetWidth / w, maxTargetHeight / h);

        const canvasW = w * canvasScale;
        const canvasH = h * canvasScale;

        appRef.current.renderer.background.color =
          parseColor(expandBackground).toString("rgba");
        appRef.current.renderer.resize(canvasW, canvasH);

        const spW = imgW * canvasScale;
        const spH = imgH * canvasScale;

        spriteRef.current.width = spW;
        spriteRef.current.height = spH;

        spriteRef.current.x =
          (Number(appRef.current.canvas.style.width.replace("px", "")) ?? 0) /
          2;
        spriteRef.current.y =
          (Number(appRef.current.canvas.style.height.replace("px", "")) ?? 0) /
          2;

        setSelectedScale({
          image: { height: imgH, width: imgW },
          scale: returnScale,
          position: {
            x:
              (Number(appRef.current.canvas.style.width.replace("px", "")) ??
                0) / 2,
            y:
              (Number(appRef.current.canvas.style.height.replace("px", "")) ??
                0) / 2,
          },
        });
      }
      applyFilters();
    }
  };

  useEffect(() => {
    updateLayout();
  }, [
    expandSize,
    expandMode,
    expandBackground,
    imageSize,
    selectedImg,
    box,
    cropSaved,
    borderSize,
    lutFilter,
  ]);

  useEffect(() => {
    const handleResize = () => {
      updateLayout();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!appRef.current || !imageSize) return;

    const maxH = Math.max(0, canvasRef.current?.clientHeight ?? 0);
    const maxW = Math.max(0, canvasRef.current?.clientWidth ?? 0);

    let imageScale = Math.min(
      maxH / (selectedScale?.image.height ?? 1),
      maxW / (selectedScale?.image.width ?? 1),
    );

    setImageScale(imageScale);
  }, [selectedScale, selectedImg, expandMode, imageSize, borderSize]);

  return (
    <Box
      alignItems={expandMode !== "crop" ? "center" : undefined}
      justifyContent={expandMode !== "crop" ? "center" : undefined}
      display={expandMode !== "crop" ? "flex" : undefined}
      ref={canvasRef}
      shadow={"2xl"}
    />
  );
}
