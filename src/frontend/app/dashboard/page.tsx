"use client";

import keyboardShortcuts from "@/components/editing/keyboardShortCuts";
import { ImageDropZone } from "@/components/upload/dropzone";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ImageWorkPlace = dynamic(
  () => import("@/components/editing/imageWorkPlace"),
  { ssr: false },
);

export default function Page() {
  //#region contextek
  const { step, setStep, setSelectedImg, selectedImg } = useWorkSession();
  const { sessionData } = useSessionStore();
  const [selectedImage, setSelectedImage] = useState<string>();

  keyboardShortcuts({
    selectedImg,
    setSelectedImage,
    setSelectedImg,
    sessionData,
    setStep,
    step,
  });

  useEffect(() => {
    if (sessionData.length > 0) setSelectedImage(sessionData[selectedImg].blob);
  }, [selectedImg, sessionData]);

  if (step === 0) return <ImageDropZone />;
  if (step === 1) return selectedImage && <ImageWorkPlace />;
}
