import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import "pixi-filters";
import { AdjustmentFilter, BevelFilter } from "pixi-filters";
import {
  Application,
  ColorMatrixFilter,
  Container,
  ImageSource,
  NoiseFilter,
  Sprite,
  Texture,
} from "pixi.js";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { shallow } from "zustand/shallow";

//todo: valamiért kétszer generálodik le a canvas... este van már debugolni :D:DD:

export default function WebGlComponent({
  size,
  setSize,
  setImageSize,
}: {
  size: { width: number; height: number } | undefined;
  setSize: Dispatch<
    SetStateAction<{ width: number; height: number } | undefined>
  >;
  setImageSize: (width: number, height: number) => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { selectedImg } = useWorkSession();
  const { sessionData } = useSessionStore();
  const appRef = useRef<Application | null>(null);
  const spriteRef = useRef<Sprite | null>(null);
  const textureRef = useRef<Texture | null>(null);
  const filtersRef = useRef<Container | null>(null);

  //! shallow: nem generál le újra az objektumot hanem mintha cachelte volna mindig az adott objektumot irja felül / ÖSSZEHASONLÍT
  const filters = useSessionStore((s) => s.getFilters(selectedImg), shallow);

  useEffect(() => {
    if (!canvasRef.current) return;

    const app = new Application();
    const container = new Container();
    appRef.current = app;
    filtersRef.current = container;

    (async () => {
      await app.init({
        width: 1200,
        height: 1200,
        antialias: true,
        resizeTo: canvasRef.current!,
      });

      if (canvasRef.current) canvasRef.current.appendChild(app.canvas);
      const img = new Image();
      img.onload = () => {
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
    })();

    return () => {
      appRef.current = null;
      spriteRef.current = null;
      textureRef.current = null;
      if (canvasRef.current) canvasRef.current.innerHTML = "";
    };
  }, [selectedImg]);

  useEffect(() => {
    if (!appRef.current) return;

    const handleResize = () => {
      resizeSprite();
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const resizeSprite = () => {
    if (!spriteRef.current || !textureRef.current || !canvasRef.current) return;

    const imgW = textureRef.current.width;
    const imgH = textureRef.current.height;

    // Kiszámoljuk a képnél hogy melyik az ami belefér, majd kiválasszuk belőle a legkissebbet
    const scale = Math.min(
      canvasRef.current.clientWidth / imgW,
      canvasRef.current.clientHeight / imgH,
    );
    const width = imgW * scale;
    const height = imgH * scale;

    spriteRef.current.width = width;
    spriteRef.current.height = height;

    if (appRef.current) {
      spriteRef.current.x = appRef.current.canvas.width / 2;
      spriteRef.current.y = appRef.current.canvas.height / 2;
    }

    setSize({ width, height });
    setImageSize(width, height);
  };
  const applyFilters = () => {
    if (!spriteRef.current || !appRef.current) return;

    const colorMatrix = new ColorMatrixFilter();
    const adjustmentFilter = new AdjustmentFilter();
    const bevelFilter = new BevelFilter();
    const noiseFilter = new NoiseFilter();

    // let sharpness = 0,
    //   temperature = 0,
    //   whites = 0,
    //   blacks = 0,
    //   highlights = 0;

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

    // // BLACKS/WHITE
    // adjustmentFilter.contrast = whites - blacks;

    // // HIGHLIGHTS
    // colorMatrix.brightness(1 + highlights, false);

    // noiseFilter.noise = 0;

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

    spriteRef.current.filters = [
      colorMatrix,
      adjustmentFilter,
      // bevelFilter,
      // // sharpenFilter,
      // noiseFilter,
    ];
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return <div ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}
