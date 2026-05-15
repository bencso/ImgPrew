//TODO: Refaktorálás
import { allFiltersFragment } from "@/handlers/filters/allFiltersFragment";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box } from "@chakra-ui/react";
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

interface ParamProps {
  red_red_channel: number;
  green_red_channel: number;
  blue_red_channel: number;
  red_green_channel: number;
  green_green_channel: number;
  blue_green_channel: number;
  red_blue_channel: number;
  green_blue_channel: number;
  blue_blue_channel: number;
  red_channel_offset: number;
  green_channel_offset: number;
  blue_channel_offset: number;
}

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
  } = useWorkSession();
  const { sessionData, setImageSize } = useSessionStore();

  const canvasRef = useRef<HTMLElement | null>(null);
  const filtersRef = useRef<Container | null>(null);

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
    (state) =>
      state.sessionData.find((si) => si.id === selectedImg)?.cropSave || false,
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

  const applyFilters = () => {
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
        hue_input: { value: filters.hue / 360.0, type: "f32" },
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
      spriteRef.current.filters = [webglFilterRef.current];
    } else {
      const uniforms = webglFilterRef.current.resources.filterUniforms.uniforms;

      uniforms.exposure_input = filters.exposure / 5.0;
      uniforms.brightness_input = filters.brightness / 100.0;
      uniforms.contrast_input = (filters.contrast / 100.0) * 0.5 + 1.0;
      uniforms.temperature_input = filters.temperature / 100.0;
      uniforms.tint_input = filters.tint / 100.0;
      uniforms.saturation_input = filters.saturation;
      uniforms.hue_input = filters.hue / 360.0;
      uniforms.value_input = filters.value;
      uniforms.black_input = filters.black / 255.0;
      uniforms.white_input = filters.white / 255.0;
      uniforms.outblack_input = filters.outblack / 255.0;
      uniforms.outwhite_input = filters.outwhite / 255.0;
      uniforms.gamma_input = filters.gamma;
      uniforms.channel_colorMatrix_input = channelOffset.channels;
      uniforms.channel_offset_input = channelOffset.offset;
      uniforms.vibrance_input = filters.vibrance / 100.0;

      spriteRef.current.filters = [webglFilterRef.current];
    }
  };

  useEffect(() => {
    if (cropSaved === true) {
      if (
        !textureRef.current ||
        !workPlaceRef.current ||
        !appRef.current ||
        !box ||
        !spriteRef.current ||
        !selectedScale ||
        !imageSize || !box.x || !box.y || !textAndImagePlaceRef.current
      )
        return;

      const imgW = textureRef.current.width;
      const imgH = textureRef.current.height;

      if (!imageSize) {
        setImageSize(selectedImg, imgW, imgH);
      }

      const areaW = workPlaceRef.current.offsetWidth;
      const areaH = workPlaceRef.current.offsetHeight;

      const h = Number(box.height);
      const w = Number(box.width);
      
      const canvasScale = Math.min(areaW / w, areaH / h);
      const defaultImageScale = Math.min(imageSize.height / textAndImagePlaceRef.current?.clientHeight, imageSize.width / textAndImagePlaceRef.current?.clientWidth);
      const canvasW = Math.round(w * canvasScale);
      const canvasH = Math.round(h * canvasScale);


// TODO: Mostmár jó ha pl egy 1:1es box de custom méretnél még nem
      textureRef.current = new Texture({
        source: textureRef.current.source,
        frame: new Rectangle(box.x * defaultImageScale , box.y * defaultImageScale , h * defaultImageScale, w * defaultImageScale),
      });
      const spriteCopy = new Sprite(textureRef.current);
      appRef.current.stage.removeChildren();
      appRef.current.stage.addChild(spriteCopy);
      spriteRef.current = spriteCopy;

      appRef.current.renderer.resize(canvasW, canvasH);
      appRef.current.renderer.background.color = expandBackground;

      spriteRef.current.width = canvasW;
      spriteRef.current.height = canvasH;

      textAndImagePlaceRef.current.style.height =
        (appRef.current.renderer.height ?? canvasH) + "px";
      textAndImagePlaceRef.current.style.width =
        (appRef.current.renderer.width ?? canvasW) + "px";
    } else {
      if (appRef.current) appRef.current.stage.removeChildren();
      loadImage();
    }
  }, [cropSaved]);

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

      const h = expandSize?.height ?? imageSize.height;
      const w = expandSize?.width ?? imageSize.width;

      if (!areaW || !areaH || !w || !h || !textAndImagePlaceRef.current) return;

      const canvasScale = Math.min(areaW / w, areaH / h);

      const canvasW = Math.round(w * canvasScale);
      const canvasH = Math.round(h * canvasScale);

      appRef.current.renderer.resize(canvasW, canvasH);
      appRef.current.renderer.background.color = expandBackground;

      const imgW = textureRef.current.width;
      const imgH = textureRef.current.height;

      const imageScale = Math.min(canvasW / imgW, canvasH / imgH);

      let spW = Math.round(imgW * imageScale);
      let spH = Math.round(imgH * imageScale);

      spriteRef.current.width = spW;
      spriteRef.current.height = spH;

      textAndImagePlaceRef.current.style.height =
        (appRef.current.renderer.height ?? spH) + "px";
      textAndImagePlaceRef.current.style.width =
        (appRef.current.renderer.width ?? spW) + "px";

      spriteRef.current.x = appRef.current.canvas.width / 2;
      spriteRef.current.y = appRef.current.canvas.height / 2;

      setSelectedScale({
        image: { height: imgH, width: imgW },
        scale: canvasScale,
        position: {
          x: canvasW / 2,
          y: canvasH / 2,
        },
      });
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

      if (
        (expandMode === "border" || (expandMode === "crop" && cropSaved)) &&
        borderSize
      ) {
        spW = canvasW - (borderSize.x || 0);
        spH = canvasH - (borderSize.y || 0);
        appRef.current.renderer.background.color = expandBackground;
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
      }

      if (textAndImagePlaceRef.current) {
        textAndImagePlaceRef.current.style.width = canvasW + "px";
        textAndImagePlaceRef.current.style.height = canvasH + "px";
      }

      setSelectedScale({
        image: { height: canvasH, width: canvasW },
        scale: scale,
        position: { x: spX, y: spY },
      });
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
    borderSize,
    box,
    cropSaved,
  ]);

  useEffect(() => {
    applyFilters();
  }, [selectedImg]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      updateLayout();
      applyFilters();
    });
    return () =>
      window.removeEventListener("resize", () => {
        updateLayout();
        applyFilters();
      });
  }, []);

  return (
    <Box
      alignItems={expandMode !== "crop" ? "center" : undefined}
      justifyContent={expandMode !== "crop" ? "center" : undefined}
      display={expandMode !== "crop" ? "flex" : undefined}
      ref={canvasRef}
    />
  );
}
