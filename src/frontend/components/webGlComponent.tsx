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
import { Dispatch, RefObject, SetStateAction, useEffect, useRef } from "react";
import { shallow } from "zustand/shallow";

export default function WebGlComponent({
  setSize,
  setImageSize,
  workPlaceRef,
  box,
}: {
  setSize: Dispatch<
    SetStateAction<{ width: number; height: number } | undefined>
  >;
  setImageSize: (width: number, height: number) => void;
  workPlaceRef: RefObject<HTMLDivElement | null>;
  box: {
    x: number | null;
    y: number | null;
    width: number;
    height: number;
  };
}) {
  const { selectedImg, setSelectedScale, textureRef, spriteRef, appRef } =
    useWorkSession();
  const { sessionData } = useSessionStore();

  const canvasRef = useRef<HTMLElement | null>(null);
  const filtersRef = useRef<Container | null>(null);

  //! shallow: nem generál le újra az objektumot hanem mintha cachelte volna mindig az adott objektumot irja felül / ÖSSZEHASONLÍT
  const filters = useSessionStore((s) => s.getFilters(selectedImg), shallow);

  useEffect(() => {
    if (!canvasRef.current) return;

    const app = new Application();
    const container = new Container();

    appRef.current = app;
    filtersRef.current = container;

    async function loadImage() {
      if (!appRef.current) return;

      await appRef.current.init({
        backgroundAlpha: 0,
      });

      if (canvasRef.current) {
        canvasRef.current.appendChild(appRef.current.canvas);
      }

      const img = new Image();

      img.onload = () => {
        if (!appRef.current) return;

        const source = new ImageSource({ resource: img });
        const texture = new Texture({ source });

        textureRef.current = texture;

        const sprite = new Sprite(texture);
        sprite.anchor.set(0.5);

        app.stage.addChild(sprite);
        spriteRef.current = sprite;

        applyFilters();
        resizeSprite();
      };

      img.src = sessionData[selectedImg].blob;
    }

    loadImage();

    return () => {
      if (spriteRef.current) spriteRef.current.destroy(false);
      if (textureRef.current) textureRef.current.destroy(false);
      spriteRef.current = null;
      textureRef.current?.source.unload();
      textureRef.current = null;
      if (canvasRef.current) canvasRef.current.innerHTML = "";
    };
  }, [selectedImg]);

  useEffect(() => {
    if (!workPlaceRef.current) return;

    const observer = new ResizeObserver(() => {
      resizeSprite();
    });

    observer.observe(workPlaceRef.current);

    return () => observer.disconnect();
  }, []);

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

    setSize({ width, height });
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
    resizeSprite();
  }, [filters]);

  return <Box ref={canvasRef} />;
}
