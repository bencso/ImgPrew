"use client";

import { toaster } from "@/components/ui/toaster";
import { FileUploadList } from "@/components/upload/fileuploadList";
import { uploadFile } from "@/handlers/fileUpload";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  Box,
  Button,
  FileUpload,
  Icon,
  Stack,
  useFileUpload,
} from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";
import { BeatLoader } from "react-spinners";

const MAX_FILES = 5;
export const ACCEPTED_FILES = [
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/webp",
];

export const ImageDropZone = () => {
  const fileUpload = useFileUpload({
    maxFiles: MAX_FILES,
    accept: ACCEPTED_FILES.join(","),
    onFileReject(details) {
      if (details.files.length > 0) {
        toaster.create({
          title: "Hiba történt feltöltés közben!",
          description: `Maximum ${MAX_FILES} fájlt tölthetsz fel.`,
          type: "error",
        });
      }
      return (details.files = []);
    },
  });

  const { isLoading, setIsLoading, setStep, setSelectedImg } = useWorkSession();
  const { addImage } = useSessionStore();

  return (
    <Stack
      maxW={{ base: "md", sm: "xl", lgTo2xl: "2xl" }}
      w={"full"}
      h={"100vh"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      mx={"auto"}
      p={4}
      alignItems={"center"}
    >
      <FileUpload.RootProvider value={fileUpload} w="full">
        <FileUpload.HiddenInput />
        <FileUpload.Dropzone
          w={"full"}
          backgroundColor={"teal.subtle/30"}
          transition={"all 0.2s ease-in-out"}
          cursor={"pointer"}
          _hover={{ backgroundColor: "teal.subtle/40" }}
        >
          <Icon size="2xl" color="teal.fg">
            <LuUpload />
          </Icon>
          <FileUpload.DropzoneContent>
            <Box>Húzza be a feltölteni kívánt fájlokat</Box>
            <Box color="fg.muted">
              {ACCEPTED_FILES.map((file) => {
                return file.replaceAll("image/", "");
              }).join(", ")}
            </Box>
          </FileUpload.DropzoneContent>
        </FileUpload.Dropzone>
        {fileUpload.acceptedFiles.length > 1 && (
          <Button
            as="div"
            smDown={{ w: "full" }}
            gap={3}
            onClick={() => fileUpload.clearFiles()}
            colorPalette="blackAlpha"
            variant="outline"
          >
            Minden törlés
          </Button>
        )}
        <Box overflowY={"scroll"} scrollbar={"hidden"} maxH={350} w={"full"}>
          <FileUploadList />
        </Box>
      </FileUpload.RootProvider>
      {fileUpload.acceptedFiles.length > 0 && (
        <Button
          w={"full"}
          as="div"
          onClick={() => {
            setIsLoading(true);
            if (!isLoading)
              uploadFile({
                fileUpload,
                addImage,
                setStep,
                setSelectedImg,
                setIsLoading,
              });
          }}
          colorPalette="teal"
          variant="surface"
          loading={isLoading}
          disabled={isLoading}
          spinner={<BeatLoader size={12} color={"#004d40"} />}
        >
          Tovább
        </Button>
      )}
    </Stack>
  );
};
