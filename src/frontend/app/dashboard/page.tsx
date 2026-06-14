"use client";

import keyboardShortcuts from "@/handlers/shortcuts/keyboardShortcuts";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const UploadImageBlock = dynamic(
  () => import("@/components/upload/uploadImageBlock"),
  { ssr: false },
);

const ImageWorkPlace = dynamic(
  () => import("@/components/editing/imageWorkPlace"),
  { ssr: false },
);

export default function Page() {
  //#region contextek
  const { step, setStep, setSelectedImg, selectedImg, appRef } =
    useWorkSession();
  const { sessionData, setHaldImage } = useSessionStore();
  const [selectedImage, setSelectedImage] = useState<string>();

  keyboardShortcuts({
    selectedImg,
    setSelectedImage,
    setSelectedImg,
    setStep,
    step,
    setHaldImage,
    appRef,
  });

  useEffect(() => {
    if (sessionData.length > 0) setSelectedImage(sessionData[selectedImg].blob);
  }, [selectedImg, sessionData]);

  if (step === 0) return <UploadImageBlock />;
  if (step === 1) return selectedImage && <ImageWorkPlace />;
}
