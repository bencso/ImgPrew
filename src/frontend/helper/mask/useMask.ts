import {
  Application,
  FillGradient,
  Filter,
  Graphics,
  Renderer,
  RenderTexture,
  Sprite,
  Texture,
  TextureSource,
} from "pixi.js";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { drawLine } from "./drawLine";
import { CustomImage } from "@/interfaces/interface";
import { applyFilters } from "./applyFilters";

interface createMaskProps {
  appRef: RefObject<Application<Renderer> | null>;
  isDrawing: boolean;
  setIsDrawing: Dispatch<SetStateAction<boolean>>;
  lastY: RefObject<number | null>;
  lastX: RefObject<number | null>;
  brushSize: number;
  hoverMaskGraphRef: RefObject<Graphics>;
  selectedImg: number;
  maskErase: boolean;
  brushRef: RefObject<Graphics | null>;
  maskTextureRef: RefObject<RenderTexture | null>;
  sharpness: number;
  selectedLayer: number | null;
  scale: number;
  spriteRef: RefObject<Sprite | null>;
  webglFilterRef: RefObject<Filter | null>;
  textureRef: RefObject<Texture<TextureSource<any>> | null>;
  image: CustomImage | undefined;
  renderSpriteRef: RefObject<Sprite | null>;
  appIsReady: boolean;
}

export const useMask = (props: createMaskProps) => {
  const appRef = props.appRef;
  const hoverMaskGraphRef = props.hoverMaskGraphRef;
  const image = props.image;

  const selectedImg = props.selectedImg;
  const maskErase = props.maskErase;
  const brushRef = props.brushRef.current;
  const renderTexture = props.maskTextureRef.current;
  const sharpness = props.sharpness ?? 0;
  const selectedLayer = props.selectedLayer ?? null;
  const scale = props.scale ?? 1;
  const brushSize = props.brushSize;
  const appIsReady = props.appIsReady;
  const renderSpriteRef = props.renderSpriteRef;

  const renderTextures = image?.renderTextures;
  const layer = renderTextures?.find((rt) => rt.id === selectedLayer);

  const isDrawedRef = useRef(false);
  const commitRef = useRef<number | null>(null);

  const gradient = useMemo(
    () =>
      new FillGradient({
        type: "radial",
        center: { x: 0.5, y: 0.5 },
        innerRadius: 0,
        outerCenter: { x: 0.5, y: 0.5 },
        outerRadius: 0.5,
        colorStops: [
          { offset: 0, color: "rgba(255,255,255,1)" },
          { offset: sharpness, color: "#fff" },
          { offset: 1, color: "rgba(255,255,255,0)" },
        ],
        textureSpace: "local",
      }),
    [sharpness],
  );

  const latestRef = useRef({
    selectedLayer,
    brushSize,
    maskErase,
    scale,
    image,
    layer,
    gradient,
    brushRef,
    renderTexture,
    renderTextures,
    renderSpriteRef,
    isDrawing: props.isDrawing,
  });

  latestRef.current = {
    selectedLayer,
    brushSize,
    maskErase,
    scale,
    image,
    layer,
    gradient,
    brushRef,
    renderTexture,
    renderTextures,
    renderSpriteRef,
    isDrawing: props.isDrawing,
  };

  function paint(x: number, y: number) {
    const cur = latestRef.current;
    if (!cur.brushRef || cur.selectedLayer === null || !cur.renderTextures)
      return;

    cur.brushRef.clear();

    if (cur.maskErase === false) {
      cur.brushRef.blendMode = "normal";
      cur.brushRef.circle(
        x / cur.scale,
        y / cur.scale,
        cur.brushSize / cur.scale,
      );
      cur.brushRef.fill(cur.gradient);
    } else {
      cur.brushRef.blendMode = "erase";
      cur.brushRef.circle(
        x / cur.scale,
        y / cur.scale,
        cur.brushSize / cur.scale,
      );
      cur.brushRef.fill(cur.gradient);
    }

    if (appRef.current) {
      const maskTex = cur.renderTextures[cur.selectedLayer]?.maskTexture;
      if (!maskTex) return;

      appRef.current.renderer.render({
        container: cur.brushRef,
        target: maskTex,
        clear: false,
      });

      if (cur.layer?.filter) {
        cur.layer.filter.resources.layer_mask = maskTex.source;
      }

      appRef.current.renderer.render(appRef.current.stage);
    }
  }

  function pushPaint() {
    isDrawedRef.current = true;

    if (commitRef.current !== null) return;

    commitRef.current = requestAnimationFrame(() => {
      commitRef.current = null;
      if (isDrawedRef.current) {
        isDrawedRef.current = false;
        commitPaint();
      }
    });
  }

  function commitPaint() {
    const cur = latestRef.current;
    if (!appRef.current || cur.selectedLayer === null) return;

    applyFilters({
      renderSpriteRef: cur.renderSpriteRef,
      spriteRef: props.spriteRef,
      startIndex: cur.selectedLayer,
      image: cur.image,
      appRef,
      textureRef: props.textureRef,
    });

    appRef.current.renderer.render(appRef.current.stage);
  }

  const onPointerMove = (e: any) => {
    const localPos = e.global;

    if (!localPos) return;

    const x = localPos.x;
    const y = localPos.y;

    hoverMaskGraphRef.current.x = x;
    hoverMaskGraphRef.current.y = y;

    appRef.current?.renderer.render(appRef.current.stage);

    const cur = latestRef.current;

    if (cur.isDrawing === false || cur.selectedLayer === null) return;

    if (props.lastX.current && props.lastY.current) {
      drawLine(
        props.lastX.current,
        props.lastY.current,
        x,
        y,
        cur.brushSize,
        paint,
      );
    }

    props.lastX.current = x;
    props.lastY.current = y;

    if (cur.layer?.filter)
      cur.layer.filter.resources.layer_mask =
        props.maskTextureRef.current?.source;

    pushPaint();
  };

  const onPointerUp = () => {
    const cur = latestRef.current;
    if (!cur.brushRef || cur.selectedLayer === null) return;
    props.setIsDrawing(false);
  };

  const onPointerDown = (e: any) => {
    props.setIsDrawing(true);
    const localPos = e.global;

    if (!localPos) return;

    props.lastX.current = localPos.x;
    props.lastY.current = localPos.y;

    const cur = latestRef.current;
    if (cur.selectedLayer !== null) {
      paint(localPos.x, localPos.y);
      pushPaint();
    }
  };

  useEffect(() => {
    const stage = appRef.current?.stage;
    if (!stage) return;

    stage.on("pointermove", onPointerMove);
    stage.on("pointerup", onPointerUp);
    stage.on("pointerdown", onPointerDown);

    return () => {
      stage.off("pointermove", onPointerMove);
      stage.off("pointerup", onPointerUp);
      stage.off("pointerdown", onPointerDown);

      if (commitRef.current !== null) {
        cancelAnimationFrame(commitRef.current);
        commitRef.current = null;
      }
    };
  }, [appIsReady]);

  useEffect(() => {
    if (!hoverMaskGraphRef.current) return;

    hoverMaskGraphRef.current.clear();

    if (selectedLayer !== null) {
      hoverMaskGraphRef.current.circle(0, 0, brushSize);
      hoverMaskGraphRef.current.fill(gradient);
    }
  }, [selectedImg, brushSize, sharpness, selectedLayer, gradient]);
};
