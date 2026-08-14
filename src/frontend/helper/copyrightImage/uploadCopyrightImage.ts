import { UPLOAD_ACCEPTED_FILES } from "@/interfaces/upload.interface";
import { useFileUpload } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";

export const uploadCopyrightImage = (
  saveCopyrightImage: (id: number, blob: ArrayBuffer) => void,
  selectedImg: number,
) => {
  return useFileUpload({
    maxFiles: 1,
    accept: UPLOAD_ACCEPTED_FILES.join(","),
    onFileReject(details) {
      if (details.files.length > 0) {
        toaster.create({
          title: "Hiba történt feltöltés közben!",
          description: `Maximum 1 fájlt tölthetsz fel.`,
          type: "error",
        });
      }
      return (details.files = []);
    },
    onFileAccept(details) {
      if (details.files.length > 0)
        details.files[0]
          .arrayBuffer()
          .then((buffer) => saveCopyrightImage(selectedImg, buffer));
    },
  });
};
