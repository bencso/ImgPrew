import { toaster } from "@/components/ui/toaster";
import { UPLOAD_ACCEPTED_FILES } from "@/interfaces/upload.interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  Box,
  FileUpload,
  Flex,
  Icon,
  Stack,
  useFileUpload,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuCopyright } from "react-icons/lu";
import { shallow } from "zustand/shallow";
import { CopyrightImageSettingBlock } from "./copyrightSettingBlock";

export default function CopyrightBlock() {
  const { selectedImg, setCopyrightImageRef,canvasRef } = useWorkSession();
  const { uploadCopyrightImage, clearCopyrightImage } = useSessionStore();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const copyrightImage =
    useSessionStore(
      (s) =>
        s.sessionData.find((img) => img.id === selectedImg)?.copyrightImage
          ?.blob,
      shallow,
    ) ?? null;

  useEffect(() => {
    (async () => {
      if (copyrightImage) {
        const blob = await fetch(copyrightImage).then((r) => r.blob());
        const file = new File([blob], "uploadedCopyright");
        setUploadedFile(file);
      }
    })();
  }, [copyrightImage]);

  const fileUpload = useFileUpload({
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
          .then((buffer) => uploadCopyrightImage(selectedImg, buffer));
    },
  });

  return (
    <Box>
      <Flex gap={2}>
        <FileUpload.RootProvider value={fileUpload} w="full">
          <FileUpload.HiddenInput />
          {!copyrightImage ? (
            <FileUpload.Dropzone
              w={"full"}
              backgroundColor={"teal.subtle"}
              transition={"all 0.2s ease-in-out"}
              cursor={"pointer"}
              _hover={{ backgroundColor: "teal.subtle/30" }}
            >
              <Icon size="2xl" color="teal.fg">
                <LuCopyright />
              </Icon>
              <FileUpload.DropzoneContent>
                <Box>Húzza be a feltölteni kívánt fájlokat</Box>
                <Box color="fg.muted" fontSize={"xs"} fontWeight={"light"}>
                  {UPLOAD_ACCEPTED_FILES.map((file) => {
                    return file.replaceAll("image/", "");
                  }).join(", ")}
                </Box>
              </FileUpload.DropzoneContent>
            </FileUpload.Dropzone>
          ) : (
            <Box overflowY={"scroll"} scrollbar={"hidden"} w={"full"}>
              <FileUpload.ItemGroup>
                {uploadedFile && (
                  <FileUpload.Item
                    key={uploadedFile.name}
                    file={uploadedFile}
                    justifyContent={"space-between"}
                  >
                    <FileUpload.ItemName />
                    <FileUpload.ItemDeleteTrigger
                      onClick={() => {
                        clearCopyrightImage(selectedImg);
                        setCopyrightImageRef(null);
                      }}
                    />
                  </FileUpload.Item>
                )}
              </FileUpload.ItemGroup>
              <Stack gap="2" mt={4}>
                <CopyrightImageSettingBlock />
              </Stack>
            </Box>
          )}
        </FileUpload.RootProvider>
      </Flex>
    </Box>
  );
}
