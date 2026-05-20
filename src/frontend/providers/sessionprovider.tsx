"use client";

import {
  CustomImage,
  SelectedScale,
  WorkSessionContextProps,
  WorkSessionProviderProps,
} from "@/interfaces/interface";
import { useFunctionsStore } from "@/stores/functionsStore";
import { ColorMapFilter } from "pixi-filters";
import { Application, Filter, Sprite, Texture } from "pixi.js";
import { createContext, useContext, useMemo, useRef, useState } from "react";
import { Rnd } from "react-rnd";

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
  const [copyrightImageRef, setCopyrightImageRef] =
    useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const spriteRef = useRef<Sprite | null>(null);
  const textureRef = useRef<Texture | null>(null);
  const appRef = useRef<Application | null>(null);
  const workPlaceRef = useRef<HTMLDivElement | null>(null);
  const textAndImagePlaceRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string>("red");
  const { functions, editFunction } = useFunctionsStore();
  const webglFilterRef = useRef<Filter | null>(null);
  const lutFilterRef = useRef<ColorMapFilter | null>(null);

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
      lutFilterRef
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
      lutFilterRef
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
