import { UseFileUploadReturn } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

interface uploadFileProps {
  fileUpload: UseFileUploadReturn;
  addImage: (
    blob: string,
    exifData?: string[] | undefined,
    captionSamples?: string[] | undefined,
  ) => void;
  setStep: Dispatch<SetStateAction<number>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setSelectedImg: Dispatch<SetStateAction<number>>;
}

export const uploadFile = async ({
  fileUpload,
  addImage,
  setStep,
  setSelectedImg,
  setIsLoading,
}: uploadFileProps) => {
  var files = fileUpload.acceptedFiles;

  try {
    await Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/images/upload", {
          method: "POST",
          body: formData,
        }).catch(() => null);

        if (!res || !res.ok) return;

        const response = await res.json();
        const responseData = JSON.parse(response.data);

        if (!responseData["byte"]) return;

        const byteArray = Uint8Array.from(atob(responseData["byte"]), (c) =>
          c.charCodeAt(0),
        );
        const blob = new Blob([byteArray], { type: "image/jpeg" });

        const exifData = responseData["exif_data"];
        const captionSamples = responseData["caption_samples"];

        addImage(URL.createObjectURL(blob), exifData, captionSamples);
      }),
    );
    setIsLoading(false);
    setSelectedImg(0);
    setStep(1);
  } catch (err: any) {
    console.error("Hiba fájlfeltöltés közben! Error: " + err);
  }
};
