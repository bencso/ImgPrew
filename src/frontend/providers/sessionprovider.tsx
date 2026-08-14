"use client";

import {
  CustomImage,
  SelectedScale,
  WorkSessionContextProps,
  WorkSessionProviderProps,
} from "@/interfaces/interface";
import { useFunctionsStore } from "@/stores/functionsStore";
import { ColorMapFilter } from "pixi-filters";
import {
  Application,
  Container,
  Filter,
  Graphics,
  RenderTexture,
  Sprite,
  Texture,
} from "pixi.js";
import { createContext, useContext, useMemo, useRef, useState } from "react";

export const WorkSessionContext = createContext<WorkSessionContextProps | null>(
  null,
);

export function WorkSessionProvider({ children }: WorkSessionProviderProps) {
  const [step, setStep] = useState<number>(0);

  const [selectedImg, setSelectedImg] = useState<number>(0);

  const [selectedScale, setSelectedScale] = useState<SelectedScale>();
  const [sessionData, setSessionData] = useState<CustomImage[]>([]);

  const [textElements, setTextElements] = useState<Record<string, HTMLElement>>(
    {},
  );

  const [copyrightImageRef, setCopyrightImageRef] = useState<Sprite | null>(
    null,
  );

  const [appIsReady, setIsAppReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const spriteRef = useRef<Sprite | null>(null);
  const textureRef = useRef<Texture | null>(null);
  const appRef = useRef<Application | null>(null);
  const workPlaceRef = useRef<HTMLDivElement | null>(null);
  const textAndImagePlaceRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webglFilterRef = useRef<Filter | null>(null);
  const lutFilterRef = useRef<ColorMapFilter | null>(null);
  const overlayRef = useRef<Container | null>(null);
  const renderSpriteRef = useRef(new Sprite());

  const [selectedLayer, setSelectLayer] = useState<number | null>(0);
  const maskTextureRef = useRef<RenderTexture | null>(null);
  const brushRef = useRef<Graphics | null>(null);
  const selectedLayerRef = useRef<Sprite | null>(null);

  const [maskErase, setMaskEraseMode] = useState<boolean>(false);
  const [maskBrushSize, setMaskBrushSize] = useState<number>(20);
  const [maskSharpness, setMaskSharpness] = useState<number>(0);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const temporarySprite = new Sprite();
  const temporarySpriteRef = useRef<Sprite>(temporarySprite);

  const [selectedChannel, setSelectedChannel] = useState<string>("red");
  const { functions, editFunction } = useFunctionsStore();

  const [imageScale, setImageScale] = useState<number>(1);

  const [textPositions, setTextPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});

  const contextValue = useMemo<WorkSessionContextProps>(
    () => ({
      step,
      setStep,
      selectedImg,
      setSelectedImg,
      functions,
      editFunction,
      sessionData,
      setSessionData,
      textElements,
      setTextElements,
      copyrightImageRef,
      setCopyrightImageRef,
      isLoading,
      setIsLoading,
      selectedScale,
      setSelectedScale,
      spriteRef,
      textureRef,
      appRef,
      workPlaceRef,
      canvasRef,
      textAndImagePlaceRef,
      selectedChannel,
      setSelectedChannel,
      webglFilterRef,
      lutFilterRef,
      imageScale,
      setImageScale,
      textPositions,
      setTextPositions,
      overlayRef,
      temporarySpriteRef,
      maskErase,
      setMaskEraseMode,
      maskBrushSize,
      setMaskBrushSize,
      maskTextureRef,
      brushRef,
      maskSharpness,
      setMaskSharpness,
      selectedLayer,
      setSelectLayer,
      selectedLayerRef,
      renderSpriteRef,
      isDrawing,
      setIsDrawing,
      appIsReady,
      setIsAppReady,
    }),
    [
      step,
      selectedImg,
      functions,
      sessionData,
      textElements,
      copyrightImageRef,
      isLoading,
      selectedScale,
      spriteRef,
      textureRef,
      workPlaceRef,
      appRef,
      webglFilterRef,
      canvasRef,
      textAndImagePlaceRef,
      selectedChannel,
      lutFilterRef,
      imageScale,
      textPositions,
      overlayRef,
      temporarySpriteRef,
      maskErase,
      maskBrushSize,
      maskTextureRef,
      brushRef,
      maskSharpness,
      selectedLayer,
      selectedLayerRef,
      renderSpriteRef,
      isDrawing,
      appIsReady,
    ],
  );

  return (
    <WorkSessionContext.Provider value={contextValue}>
      {children}
    </WorkSessionContext.Provider>
  );
}

export function useWorkSession(): WorkSessionContextProps {
  const context = useContext(WorkSessionContext);
  if (!context) {
    throw new Error("useWorkSession must be used within a WorkSessionProvider");
  }
  return context;
}
