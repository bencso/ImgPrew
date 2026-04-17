import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box } from "@chakra-ui/react";
import "pixi-filters";
import { AdjustmentFilter } from "pixi-filters";
import {
  Application,
  ColorMatrixFilter,
  Container,
  ImageSource,
  NoiseFilter,
  Sprite,
  Texture,
} from "pixi.js";
import { useEffect, useRef } from "react";
import { shallow } from "zustand/shallow";

//TODO: Ha változik az app mérete akkor igazolodjon, ezt a kódot debug miatt kivettem majd visszatenni
export default function WebGlComponent({
  setImageSize,
}: {
  setImageSize: (width: number, height: number) => void;
}) {
  const {
    selectedImg,
    setSelectedScale,
    textureRef,
    spriteRef,
    appRef,
    workPlaceRef,
  } = useWorkSession();
  const { sessionData } = useSessionStore();

  const canvasRef = useRef<HTMLElement | null>(null);
  const filtersRef = useRef<Container | null>(null);

  //! shallow: nem generál le újra az objektumot hanem mintha cachelte volna mindig az adott objektumot irja felül / ÖSSZEHASONLÍT
  const filters = useSessionStore((s) => s.getFilters(selectedImg), shallow);

  useEffect(() => {
    async function initApp() {
      const app = new Application();
      appRef.current = app;
      await appRef.current.init({
        backgroundAlpha: 0,
        webgl: {
          antialias: true,
        },
        webgpu: {
          antialias: false,
        },
        textureGCActive: true,
        textureGCMaxIdle: 7200,
        textureGCCheckCountMax: 1200,
      });
      if (canvasRef.current) {
        canvasRef.current.appendChild(appRef.current.canvas);
      }

      // window.__PIXI_DEVTOOLS__ = {
      //   app,
      // };

      // globalThis.__PIXI_APP__ = app;
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

      appRef.current.stage.addChild(sprite);
      spriteRef.current = sprite;

      applyFilters();
      resizeSprite();
    };

    img.src = sessionData[selectedImg].blob;
  }

  let mounted = false;
  useEffect(() => {
    if (!canvasRef.current) return;
    if (mounted) return;

    const container = new Container();
    filtersRef.current = container;
    console.log(selectedImg);

    loadImage();
    mounted = true;

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

  const resizeSprite = () => {
    if (
      !spriteRef.current ||
      !textureRef.current ||
      !canvasRef.current ||
      !appRef.current ||
      !workPlaceRef.current
    )
      return;

    const imgW = textureRef.current.width;
    const imgH = textureRef.current.height;

    // Kiszámoljuk a képnél hogy melyik az ami belefér, majd kiválasszuk belőle a legkissebbet
    const scale = Math.min(
      workPlaceRef.current.offsetWidth / imgW,
      workPlaceRef.current.offsetHeight / imgH,
    );

    const width = imgW * scale;
    const height = imgH * scale;

    spriteRef.current.width = width;
    spriteRef.current.height = height;

    if (appRef.current.renderer)
      appRef.current.renderer.resize(
        workPlaceRef.current.clientWidth,
        workPlaceRef.current.clientHeight,
      );

    if (appRef.current) {
      spriteRef.current.x = appRef.current.canvas.width / 2;
      spriteRef.current.y = appRef.current.canvas.height / 2;
    }

    setSelectedScale({
      image: {
        height: imgH,
        width: imgW,
      },
      scale: scale,
      position: {
        x: spriteRef.current.x,
        y: spriteRef.current.y,
      },
    });

    setImageSize(width, height);
  };

  const applyFilters = () => {
    if (!spriteRef.current || !appRef.current) return;

    const colorMatrix = new ColorMatrixFilter();
    const adjustmentFilter = new AdjustmentFilter();
    const noiseFilter = new NoiseFilter();

    colorMatrix.brightness(filters.brightness, true);
    colorMatrix.saturate(filters.saturation, true);
    colorMatrix.contrast(filters.contrast, true);
    colorMatrix.hue(0, true);

    const gamma =
      filters.gamma < 0 ? 1 + filters.gamma * 0.5 : 1 + filters.gamma * 1;

    adjustmentFilter.gamma = gamma;

    // TEMPERATURE
    const t = filters.temperature;

    adjustmentFilter.red = t;
    adjustmentFilter.green = 1;
    adjustmentFilter.blue = 2 - t;

    noiseFilter.noise = filters.noise;

    // const sharpenFilter = new ConvolutionFilter([
    //   0,
    //   -1,
    //   0,
    //   -1,
    //   1 + sharpness * 4,
    //   -1,
    //   0,
    //   -1,
    //   0,
    // ]);

    spriteRef.current.filters = [noiseFilter, adjustmentFilter, colorMatrix];
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const expandMode =
    useSessionStore(
      (state) =>
        state.sessionData.find((si) => si.id === selectedImg)?.expandMode,
    ) ?? "no";

  const expandSize = useSessionStore(
    (state) =>
      state.sessionData.find((si) => si.id === selectedImg)?.expandSize,
  );

  const expandBackground =
    useSessionStore(
      (state) =>
        state.sessionData.find((si) => si.id === selectedImg)?.expandBackground,
    ) ?? "#fffff";

  const imageSize = useSessionStore(
    (state) => state.sessionData.find((si) => si.id === selectedImg)?.dimesions,
    shallow,
  );

  const box = useSessionStore(
    (state) => state.sessionData.find((si) => si.id === selectedImg)?.cropSize,
    shallow,
  );

  function calculateExpandMode() {
    const type = expandMode;
    if (
      appRef.current &&
      textureRef.current &&
      spriteRef.current &&
      workPlaceRef.current &&
      imageSize
    )
      if (type !== "expand") {
        const areaW = workPlaceRef.current.offsetWidth;
        const areaH = workPlaceRef.current.offsetHeight;

        const scale = Math.min(
          areaH / imageSize.height,
          areaW / imageSize.width,
        );
        appRef.current.renderer.resize(areaW, areaH);
        appRef.current.renderer.background.color = "transparent";

        spriteRef.current.width = imageSize.width * scale;
        spriteRef.current.height = imageSize.height * scale;

        spriteRef.current.x = appRef.current.canvas.width / 2;
        spriteRef.current.y = appRef.current.canvas.height / 2;
      } else {
        const workPlaceSize = workPlaceRef.current;
        const areaW = workPlaceSize.offsetWidth;
        const areaH = workPlaceSize.offsetHeight;
        const h = expandSize?.height ?? imageSize.height;
        const w = expandSize?.width ?? imageSize.width;

        if (!areaW || !areaH || !w || !h) return;

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

        spriteRef.current.x = appRef.current.canvas.width / 2;
        spriteRef.current.y = appRef.current.canvas.height / 2;
      }
  }

  useEffect(() => {
    calculateExpandMode();
  }, [expandMode]);

  async function calculateExpandSize() {
    if (
      !workPlaceRef.current ||
      !appRef.current ||
      !textureRef.current ||
      !spriteRef.current
    )
      return;

    const workPlaceSize = workPlaceRef.current;
    const areaW = workPlaceSize.offsetWidth;
    const areaH = workPlaceSize.offsetHeight;
    if (!areaW || !areaH || !expandSize) return;
    const h = expandSize.height;
    const w = expandSize.width;

    const canvasScale = Math.min(areaW / w, areaH / h);

    const canvasW = w * canvasScale;
    const canvasH = h * canvasScale;

    appRef.current.renderer.resize(canvasW, canvasH);
    appRef.current.renderer.background.color = expandBackground;

    const imgW = textureRef.current.width;
    const imgH = textureRef.current.height;

    const imageScale = Math.min(canvasW / imgW, canvasH / imgH);

    let spW = imgW * imageScale;
    let spH = imgH * imageScale;

    spriteRef.current.width = spW;
    spriteRef.current.height = spH;

    spriteRef.current.x = appRef.current.renderer.width / 2;
    spriteRef.current.y = appRef.current.renderer.height / 2;
  }

  useEffect(() => {
    calculateExpandSize();
  }, [expandSize, expandBackground]);

  return (
    <Box
      alignItems={expandMode === "expand" ? "center" : undefined}
      justifyContent={expandMode === "expand" ? "center" : undefined}
      display={expandMode === "expand" ? "flex" : undefined}
      ref={canvasRef}
    />
  );
}
