"use client";

import {
  CustomImage,
  WorkSessionContextProps,
  WorkSessionProviderProps,
} from "@/interfaces/interface";
import { useFunctionsStore } from "@/stores/functionsStore";
import { Application, Sprite, Texture } from "pixi.js";
import { createContext, useContext, useMemo, useRef, useState } from "react";

export const WorkSessionContext = createContext<WorkSessionContextProps | null>(
  null,
);

export function WorkSessionProvider({ children }: WorkSessionProviderProps) {
  const [step, setStep] = useState<number>(0);
  const [selectedImg, setSelectedImg] = useState<number>(0);
  const [selectedScale, setSelectedScale] = useState<{
    image: {
      height: number;
      width: number;
    };
    scale: number;
    position: {
      x: number;
      y: number;
    };
  }>();
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
  const { functions, addFunction, editFunction } = useFunctionsStore();

  const contextValue = useMemo<WorkSessionContextProps>(
    () => ({
      step,
      setStep,
      selectedImg,
      setSelectedImg,
      functions,
      addFunction,
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
      canvasRef,
      textAndImagePlaceRef,
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
