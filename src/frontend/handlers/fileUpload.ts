import { UseFileUploadReturn } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

interface uploadFileProps {
  fileUpload: UseFileUploadReturn;
  addImage: (blob: string) => any;
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
    files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
      })
        .then(async (e) => {
          return await e.json();
        })
        .catch(() => {
          return null;
        });

      const responseByte = response.data;
      const byteCharacters = atob(responseByte);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });
      addImage(URL.createObjectURL(blob));
    });
    setSelectedImg(0);
    setStep(1);
    setIsLoading(false);
  } catch {
    return null;
  }
};
