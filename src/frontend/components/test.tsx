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
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { shallow } from "zustand/shallow";

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
  const [url, setUrl] = useState<string>();
  const appRef = useRef<Application | null>(null);
  const spriteRef = useRef<Sprite | null>(null);
  const textureRef = useRef<Texture | null>(null);
  const filtersRef = useRef<Container | null>(null);

  //! shallow: nem generál le újra az objektumot hanem mintha cachelte volna mindig az adott objektumot irja felül / ÖSSZEHASONLÍT
  const filters = useSessionStore((s) => s.getFilters(selectedImg), shallow);

  useEffect(() => {
    if (sessionData[selectedImg]?.blob) {
      setUrl(sessionData[selectedImg].blob);
    }
  }, [sessionData, selectedImg]);

  useEffect(() => {
    if (!canvasRef.current || !url) return;

    const app = new Application();
    const container = new Container();
    appRef.current = app;
    filtersRef.current = container;

    (async () => {
      await app.init({
        width: 1200,
        height: 1200,
        resolution: 1,
        antialias: true,
        resizeTo: canvasRef.current!,
      });

      canvasRef.current!.appendChild(app.canvas);

      const img = new Image();
      img.onload = () => {
        if (!appRef.current) return;

        URL.revokeObjectURL(img.src);

        const source = new ImageSource({ resource: img });
        const texture = new Texture({ source });
        textureRef.current = texture;

        const sprite = new Sprite(texture);
        sprite.anchor.set(0.5);

        app.stage.addChild(sprite);
        spriteRef.current = sprite;

        resizeSprite();
      };

      img.src = url;
    })();

    return () => {
      app.destroy(true, { children: true });
      appRef.current = null;
      spriteRef.current = null;
      textureRef.current = null;
      if (canvasRef.current) canvasRef.current.innerHTML = "";
    };
  }, [url]);

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
  }, [textureRef.current]);

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

  useEffect(() => {
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

    console.log(filters);
    colorMatrix.brightness(filters.brightness, true);
    colorMatrix.saturate(filters.saturation, true);
    colorMatrix.contrast(filters.contrast, true);
    colorMatrix.hue(0, true);

    // // GAMMA
    // adjustmentFilter.gamma = 0;

    // // TEMPERATURE
    // adjustmentFilter.red = temperature; // + melegítés
    // adjustmentFilter.blue = -temperature; // - hűtés

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
      // adjustmentFilter,
      // bevelFilter,
      // // sharpenFilter,
      // noiseFilter,
    ];
  }, [filters]);

  return <div ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}
