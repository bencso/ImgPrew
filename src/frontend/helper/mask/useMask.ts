import {
  Application,
  Container,
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
import { CustomImage } from "@/interfaces/interface";
import { applyFilters } from "./applyFilters";

interface createMaskProps {
  appRef: RefObject<Application<Renderer> | null>;
  isDrawing: boolean;
  setIsDrawing: Dispatch<SetStateAction<boolean>>;
  lastY: RefObject<number | null>;
  lastX: RefObject<number | null>;
  brushSize: number;
  temporarySpriteRef: RefObject<Sprite>;
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
  const temporarySpriteRef = props.temporarySpriteRef;
  const image = props.image;

  const maskErase = props.maskErase;
  const renderTexture = props.maskTextureRef.current;
  const sharpness = props.sharpness ?? 0;
  const selectedLayer = props.selectedLayer ?? null;
  const scale = props.scale ?? 1;
  const brushSize = props.brushSize;
  const appIsReady = props.appIsReady;
  const renderSpriteRef = props.renderSpriteRef;

  const renderTextures = image?.renderTextures;
  const layer = renderTextures?.find((rt) => rt.id === selectedLayer);

  const pending: { x: number; y: number }[] = [];
  const reqAnimFramId = useRef<null | number>(null);
  const frameSkip = useRef(0);
  const emptyContainerRef = useRef(new Container());

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

  const brushTexture = useMemo(() => {
    if (!appRef.current) return undefined;

    const graph = new Graphics();
    graph.circle(0, 0, 100);
    graph.fill(gradient);
    const texture = appRef.current.renderer.generateTexture(graph);
    graph.destroy();

    return texture;
  }, [gradient, appIsReady]);

  const brushSpriteRef = useRef(new Sprite(brushTexture));

  const latestRef = useRef({
    selectedLayer,
    brushSize,
    maskErase,
    scale,
    image,
    layer,
    gradient,
    renderTexture,
    renderTextures,
    renderSpriteRef,
    isDrawing: props.isDrawing,
    temporarySpriteRef,
    brushTexture,
    pending,
  });

  latestRef.current = {
    selectedLayer,
    brushSize,
    maskErase,
    scale,
    image,
    layer,
    gradient,
    renderTexture,
    renderTextures,
    renderSpriteRef,
    isDrawing: props.isDrawing,
    temporarySpriteRef,
    brushTexture,
    pending,
  };

  //TODO: Még annyit lehetne hogy a kép ne teljese res-be legyen és a performance egész jó lehet

  function pushPoint() {
    reqAnimFramId.current = null;

    const current = latestRef.current;

    const queue = current.pending.splice(0, current.pending.length);
    if (queue.length === 0 || !current.brushTexture) return;

    const batchContainer = new Container();
    const brushScale = current.brushSize / current.scale / 100;

    for (const point of queue) {
      const pointSprite = new Sprite(current.brushTexture);
      pointSprite.position.set(
        point.x / current.scale,
        point.y / current.scale,
      );
      pointSprite.scale.set(brushScale);
      pointSprite.blendMode = current.maskErase ? "erase" : "normal";
      batchContainer.addChild(pointSprite);
    }

    appRef.current?.renderer.render({
      container: batchContainer,
      target: current.temporarySpriteRef.current.texture,
      clear: false,
    });

    batchContainer.destroy({ children: true, texture: false });

    frameSkip.current++;

    if (frameSkip.current % 9 === 0)
      appRef.current?.renderer.render(appRef.current.stage);

    if (current.pending.length > 0 && reqAnimFramId.current === null)
      reqAnimFramId.current = requestAnimationFrame(pushPoint);
  }

  function commitPoint(x: number, y: number) {
    const current = latestRef.current;

    if (current.selectedLayer === null) return;

    current.pending.push({ x, y });

    if (current.layer?.filter)
      current.layer.filter.resources.layer_mask =
        props.maskTextureRef.current?.source;

    if (reqAnimFramId.current === null)
      reqAnimFramId.current = requestAnimationFrame(pushPoint);
  }

  const onPointerMove = (e: any) => {
    const localPos = e.global;

    if (!localPos) return;

    const x = localPos.x;
    const y = localPos.y;

    const current = latestRef.current;

    if (current.isDrawing === false || current.selectedLayer === null) return;
    if (props.lastX.current && props.lastY.current) commitPoint(x, y);

    props.lastX.current = x;
    props.lastY.current = y;
  };

  const onPointerUp = () => {
    const current = latestRef.current;
    props.setIsDrawing(false);

    if (
      !brushSpriteRef.current ||
      current.selectedLayer === null ||
      !current.renderTextures ||
      current.renderTextures.length <= 0 ||
      !appRef.current
    )
      return;

    const maskTex = current.renderTextures[current.selectedLayer]?.maskTexture;

    if (!maskTex) return;

    appRef.current?.renderer.render({
      container: current.temporarySpriteRef.current,
      target: maskTex,
      clear: false,
    });

    appRef.current.renderer.render({
      container: emptyContainerRef.current,
      target: current.temporarySpriteRef.current.texture,
      clear: true,
    });

    applyFilters({
      renderSpriteRef: current.renderSpriteRef,
      spriteRef: props.spriteRef,
      startIndex: current.selectedLayer,
      image: current.image,
      appRef,
      textureRef: props.textureRef,
    });

    appRef.current?.renderer.render(appRef.current.stage);
  };

  const onPointerDown = (e: any) => {
    props.setIsDrawing(true);

    const localPos = e.global;

    if (!localPos) return;

    const x = localPos.x;
    const y = localPos.y;

    props.lastX.current = x;
    props.lastY.current = y;

    const current = latestRef.current;

    if (current.selectedLayer !== null) commitPoint(x, y);
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
    };
  }, [appIsReady]);
};
