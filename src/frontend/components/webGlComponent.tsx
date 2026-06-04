//TODO: Refaktorálás
import { allFiltersFragment } from "@/handlers/filters/allFiltersFragment";
import { calculationTypeEnum, ParamProps } from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box, parseColor } from "@chakra-ui/react";
import "pixi-filters";
import {
  Application,
  Container,
  defaultFilterVert,
  Filter,
  ImageSource,
  Rectangle,
  Sprite,
  Texture,
  UniformGroup,
} from "pixi.js";
import { useEffect, useRef } from "react";
import { shallow } from "zustand/shallow";

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
    textAndImagePlaceRef,
    webglFilterRef,
    selectedScale,
    setCpPosition,
    copyrightImageRef,
    setImageScale,
    setTextPositions,
    textElements,
    imageScale,
  } = useWorkSession();
  const {
    sessionData,
    setImageSize,
    calculationReFixPosition,
    setCopyrightImageSize,
  } = useSessionStore();

  const canvasRef = useRef<HTMLElement | null>(null);
  const filtersRef = useRef<Container | null>(null);

  const lutFilter = useSessionStore(
    (state) =>
      state.sessionData.find((img) => img.id === selectedImg)?.lutFilter,
  );

  //! shallow: nem generál le újra az objektumot hanem mintha cachelte volna mindig az adott objektumot irja felül / ÖSSZEHASONLÍT
  const filters = useSessionStore((s) => s.getFilters(selectedImg), shallow);

  const expandMode =
    useSessionStore(
      (state) =>
        state.sessionData.find((si) => si.id === selectedImg)?.expandMode,
    ) ?? "no";

  const expandSize = useSessionStore(
    (state) =>
      state.sessionData.find((si) => si.id === selectedImg)?.expandSize,
  );

  const borderSize = useSessionStore(
    (state) =>
      state.sessionData.find((si) => si.id === selectedImg)?.borderSize,
  );

  const expandBackground =
    useSessionStore(
      (state) =>
        state.sessionData.find((si) => si.id === selectedImg)?.expandBackground,
    ) ?? "#fffff";

  const imageSize = useSessionStore(
    (state) => state.sessionData.find((si) => si.id === selectedImg)?.dimesions,
  );

  const box = useSessionStore(
    (state) => state.sessionData.find((si) => si.id === selectedImg)?.box,
  );

  const cropSaved = useSessionStore(
    (state) => state.sessionData.find((si) => si.id === selectedImg)?.cropSave,
    shallow,
  );

  const expandPadding = useSessionStore(
    (state) =>
      state.sessionData.find((si) => si.id === selectedImg)?.expandSize
        ?.padding,
    shallow,
  );

  const haldSprite = useSessionStore(
    (state) =>
      state.sessionData.find((si) => si.id === selectedImg)?.haldSprite,
    shallow,
  );

  const copyrightImage = useSessionStore(
    (state) =>
      state.sessionData.find((si) => si.id === selectedImg)?.copyrightImage,
    shallow,
  );

  const texts = useSessionStore(
    (s) => s.sessionData.find((si) => si.id === selectedImg)?.texts || [],
    shallow,
  );

  useEffect(() => {
    async function initApp() {
      const app = new Application();
      appRef.current = app;
      await appRef.current.init({
        backgroundAlpha: 0,
        antialias: true,
      });

      // @ts-ignore
      window.__PIXI_DEVTOOLS__ = {
        app,
      };

      // @ts-ignore
      globalThis.__PIXI_APP__ = app;
    }

    initApp();
  }, []);

  async function loadImage() {
    if (!appRef.current) return;

    const img = new Image();

    img.onload = async () => {
      if (!appRef.current) return;

      await appRef.current.init();

      const source = new ImageSource({ resource: img });
      const texture = new Texture({ source });

      textureRef.current = texture;
      const sprite = new Sprite(texture);

      sprite.anchor.set(0.5);

      const prevStage = appRef.current.stage.children.filter(
        (fs) => fs !== sprite,
      )[0];

      if (prevStage) appRef.current.stage.removeChild(prevStage);
      appRef.current.stage.addChild(sprite);
      spriteRef.current = sprite;

      if (canvasRef.current) {
        canvasRef.current.replaceChildren(appRef.current.canvas);
      }

      updateLayout();
      applyFilters();
    };

    if (sessionData.length > 0 && sessionData[selectedImg].blob)
      img.src = sessionData[selectedImg].blob;
  }

  useEffect(() => {
    if (!canvasRef.current) return;

    const container = new Container();
    filtersRef.current = container;

    loadImage();

    return () => {
      if (spriteRef.current) {
        spriteRef.current.destroy();
        spriteRef.current = null;
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

      spriteRef.current.roundPixels = false;

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

    const areaW = workPlaceRef.current.offsetWidth;
    const areaH = workPlaceRef.current.offsetHeight;

    if (expandMode === "expand" && expandSize) {
      if (!textAndImagePlaceRef.current || !textureRef.current || !imageSize)
        return;

      const h = expandSize.height;
      const w = expandSize.width;

      const padding = (expandPadding ?? 0) * (imageScale ?? 1);
      const maxTargetWidth = workPlaceRef.current.clientWidth - padding;
      const maxTargetHeight = workPlaceRef.current.clientHeight - padding;
      const canvasScale = Math.min(maxTargetWidth / w, maxTargetHeight / h);

      const canvasW = w * canvasScale;
      const canvasH = h * canvasScale;

      const areaW = canvasW + padding;
      const areaH = canvasH + padding;

      appRef.current.renderer.background.color =
        parseColor(expandBackground).toString("rgba");
      appRef.current.renderer.resize(areaW, areaH);

      const imgW = textureRef.current.width;
      const imgH = textureRef.current.height;
      const scale = Math.min(canvasW / imgW, canvasH / imgH);

      const spW = Math.round(imgW * scale);
      const spH = Math.round(imgH * scale);

      spriteRef.current.width = spW;
      spriteRef.current.height = spH;

      spriteRef.current.x = appRef.current.canvas.width / 2;
      spriteRef.current.y = appRef.current.canvas.height / 2;

      setSelectedScale({
        image: { height: imgH, width: imgW },
        scale: scale,
        position: {
          x: appRef.current.canvas.width / 2,
          y: appRef.current.canvas.height / 2,
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

      appRef.current.renderer.background.color = "transparent";

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
          !textAndImagePlaceRef.current
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

        const spriteCopy = new Sprite(textureRef.current);
        appRef.current.stage.removeChildren();
        appRef.current.stage.addChild(spriteCopy);
        spriteRef.current = spriteCopy;

        const scale = Math.min(
          workPlaceRef.current.clientHeight / (canvasH ?? 0),
          workPlaceRef.current.clientWidth / (canvasW ?? 0),
        );

        const targetH = canvasH + (borderSize?.y ?? 0);
        const targetW = canvasW + (borderSize?.x ?? 0);

        appRef.current.renderer.resize(targetW * scale, targetH * scale);

        appRef.current.renderer.background.color =
          parseColor(expandBackground).toString("rgba");

        spriteRef.current.height = canvasH * scale - (borderSize?.y ?? 0);
        spriteRef.current.width = canvasW * scale - (borderSize?.x ?? 0);
        spriteRef.current.anchor = 0.5;
        spriteRef.current.x = appRef.current.canvas.width / 2;
        spriteRef.current.y = appRef.current.canvas.height / 2;

        setSelectedScale({
          image: {
            height: canvasH,
            width: canvasW,
          },
          scale: scale,
          position: {
            x: appRef.current.canvas.width / 2,
            y: appRef.current.canvas.height / 2,
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
            height: imageSize?.height ?? spH,
            width: imageSize?.width ?? spW,
          },
          scale: scale,
          position: { x: spX, y: spY },
        });
      }

      if (expandMode === "border") {
        const targetH = canvasH;
        const targetW = canvasW;

        const finalScaleH = workPlaceRef.current.clientHeight / targetH;
        const finalScaleW = workPlaceRef.current.clientWidth / targetW;
        const finalScale = Math.min(finalScaleH, finalScaleW);

        appRef.current.renderer.resize(
          targetW * finalScale,
          targetH * finalScale,
        );
        appRef.current.renderer.background.color =
          parseColor(expandBackground).toString("rgba");

        spriteRef.current.height = canvasH * finalScale - (borderSize?.y ?? 0);
        spriteRef.current.width = canvasW * finalScale - (borderSize?.x ?? 0);
        spriteRef.current.anchor = 0.5;
        spriteRef.current.x = appRef.current.canvas.width / 2;
        spriteRef.current.y = appRef.current.canvas.height / 2;

        setSelectedScale({
          image: {
             height: imageSize?.height ?? spH,
            width: imageSize?.width ?? spW,
          },
          scale: scale,
          position: { x: spX, y: spY },
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
    lutFilter,
    borderSize,
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

  const expandScale =
    expandMode === "expand"
      ? Math.min(
          (expandSize?.width ?? 1) / (imageSize?.width ?? 1),
          (expandSize?.height ?? 1) / (imageSize?.height ?? 1),
        )
      : 1;

  useEffect(() => {
    if (!copyrightImageRef) return;

    const position = calculationReFixPosition({
      id: selectedImg,
      type: calculationTypeEnum.COPYRIGHT,
      elementRef: copyrightImageRef,
      textAndImagePlaceRef,
      imageScale: imageScale / expandScale,
    });

    setCpPosition({
      x: position.x,
      y: position.y,
    });
  }, [copyrightImageRef, copyrightImage, selectedScale, imageScale, borderSize]);

  useEffect(() => {
    const newPositions: Record<string, { x: number; y: number }> = {};

    texts.forEach((element) => {
      if (!textElements[element.id]) return;
      const textPosition = calculationReFixPosition({
        id: selectedImg,
        type: calculationTypeEnum.TEXT,
        elementRef: textElements[element.id],
        textAndImagePlaceRef: textAndImagePlaceRef,
        textId: element.id,
        imageScale: imageScale / expandScale,
      });

      newPositions[element.id] = {
        x: textPosition.x,
        y: textPosition.y,
      };
    });

    setTextPositions(newPositions);
  }, [texts, textElements, selectedScale, imageScale, borderSize]);

useEffect(() => {
  if (!appRef.current || !imageSize) return;

  const maxH = Math.max(0, (textAndImagePlaceRef.current?.clientHeight ?? 0));
  const maxW = Math.max(0, (textAndImagePlaceRef.current?.clientWidth ?? 0));

  let imageScale = Math.min(
    maxH / (selectedScale?.image.height ?? 1),
    maxW / (selectedScale?.image.width ?? 1)
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
