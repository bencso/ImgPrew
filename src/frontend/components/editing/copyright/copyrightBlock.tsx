import { UPLOAD_ACCEPTED_FILES } from "@/interfaces/upload.interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box, FileUpload, Flex, Icon, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuCopyright } from "react-icons/lu";
import { shallow } from "zustand/shallow";
import { CopyrightImageSettingBlock } from "./copyrightSettingBlock";
import { uploadCopyrightImage } from "@/helper/copyrightImage/uploadCopyrightImage";

export default function CopyrightBlock() {
  const { selectedImg, setCopyrightImageRef } = useWorkSession();
  const { saveCopyrightImage, clearCopyrightImage } = useSessionStore();
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

  const uploadImage = uploadCopyrightImage(saveCopyrightImage, selectedImg);

  return (
    <Box>
      <Flex gap={2}>
        <FileUpload.RootProvider value={uploadImage} w="full">
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
