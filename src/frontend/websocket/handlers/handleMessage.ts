"use client";

import { toaster } from "@/components/ui/toaster";
import { CustomImage } from "@/interfaces/interface";
import { Dispatch, SetStateAction } from "react";

const ERROR_MESSAGE = "Ismeretlen, kérjük próbálja újra";

export const handleMessage = (
  event: MessageEvent,
  setStep?: Dispatch<SetStateAction<number>>,
  setImgs?: Dispatch<SetStateAction<string[]>>,
  setExifDataForImage?: (id: number, exif: string[]) => CustomImage | undefined,
  setCaptionSamplesForImage?: (
    id: number,
    captionSamples: string[],
  ) => CustomImage | undefined,
  addImage?: () => void,
) => {
  let rawMessage = JSON.parse(event.data);
  const { message, data } = rawMessage;

  console.log(message);
  switch (message) {
    case "error":
      toaster.create({
        title: "Hiba történt feltöltés közben!",
        description: data ? data : ERROR_MESSAGE,
        type: "error",
      });
      break;
    case "success":
      toaster.create({
        title: data,
        type: "success",
      });
      break;
    case "initSuccess":
      const { exifDatas, id, caption_samples } = JSON.parse(data);
      if (setExifDataForImage) setExifDataForImage(id, exifDatas);
      if (setCaptionSamplesForImage)
        setCaptionSamplesForImage(id, caption_samples);
      break;
    case "functionSuccess":
      toaster.create({
        title: "Sikeres művelet",
        type: "success",
      });
      break;
    case "fileSuccess":
      if (setStep) setStep(1);
      addImage && addImage();
      if (setImgs)
        setImgs((prev) => {
          console.log("asda");
          const byteCharacters = atob(data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++)
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/png" });
          return [...prev, URL.createObjectURL(blob)];
        });
      break;
  }
};
0;
