"use client";

import {
  CustomImage,
  WorkSessionContextProps,
  WorkSessionProviderProps,
} from "@/interfaces/interface";
import { useFunctionsStore } from "@/stores/functionsStore";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";
import { useWebsocket } from "./websocketprovider";

export const WorkSessionContext = createContext<WorkSessionContextProps | null>(
  null,
);

export function WorkSessionProvider({ children }: WorkSessionProviderProps) {
  const [imgs, setImgs] = useState<string[]>([]);
  const [step, setStep] = useState<number>(0);
  const [selectedImg, setSelectedImg] = useState<number>(0);
  const [sessionData, setSessionData] = useState<CustomImage[]>([]);
  const [textElements, setTextElements] = useState<Record<string, HTMLElement>>(
    {},
  );
  const [copyrightImageRef, setCopyrightImageRef] =
    useState<HTMLImageElement | null>(null);

  const { sendMessage } = useWebsocket();

  const { functions, addFunction, editFunction } = useFunctionsStore();

  useEffect(() => {
    if (imgs.length > 0) {
      sendMessage({
        message: "initImage",
        data: selectedImg.toString(),
      });
    }
  }, [selectedImg, imgs]);

  const contextValue = useMemo<WorkSessionContextProps>(
    () => ({
      imgs,
      setImgs,
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
    }),
    [
      imgs,
      step,
      selectedImg,
      functions,
      sessionData,
      textElements,
      copyrightImageRef,
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
