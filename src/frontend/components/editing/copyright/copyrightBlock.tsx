import { toaster } from "@/components/ui/toaster";
import { ACCEPTED_FILES } from "@/components/upload/dropzone";
import { minMaxValidation } from "@/helper/errorHelper";
import { XPositions, YPositions } from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  Box,
  Field,
  FileUpload,
  Flex,
  Grid,
  HStack,
  Icon,
  IconButton,
  Input,
  NumberInput,
  Stack,
  Text,
  useFileUpload,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  LuArrowDown,
  LuArrowDownLeft,
  LuArrowDownRight,
  LuArrowLeft,
  LuArrowRight,
  LuArrowUp,
  LuArrowUpLeft,
  LuArrowUpRight,
  LuCopyright,
  LuDot,
} from "react-icons/lu";
import { shallow } from "zustand/shallow";

export default function CopyrightBlock() {
  const { selectedImg, setCopyrightImageRef } = useWorkSession();
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
    accept: ACCEPTED_FILES.join(","),
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
                  {ACCEPTED_FILES.map((file) => {
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
                <ImageManipulationBlock />
              </Stack>
            </Box>
          )}
        </FileUpload.RootProvider>
      </Flex>
    </Box>
  );
}

const ImageManipulationBlock = () => {
  const { selectedImg, copyrightImageRef, textAndImagePlaceRef } =
    useWorkSession();
  const { setCopyrightImageSize, setCopyrightImagePosition, setCopyrightImageOpacity } =
    useSessionStore();

  const imageSize = useSessionStore(
    (s) => s.sessionData.find((img) => img.id === selectedImg)?.dimesions,
    shallow,
  );

  const imagePosition = useSessionStore(
    (s) =>
      s.sessionData.find((img) => img.id === selectedImg)?.copyrightImage
        ?.position,
    shallow,
  );

  const copyrightImage = useSessionStore((s) =>
    s.sessionData.find((sD) => sD.id === selectedImg),
  )?.copyrightImage;

  if (copyrightImageRef) {
    return (
      <Stack gap={5}>
        <Field.Root>
          <Field.Label>Méret</Field.Label>
          <Input
            placeholder="Méret"
            value={copyrightImage ? copyrightImage?.size : 20}
            onChange={(e) => {
              setCopyrightImageSize(selectedImg, Number(e.target.value));
            }}
            min={10}
            type="number"
          />
        </Field.Root>
                  <Box display={"flex"} flexDir={"row"} gap={2} alignItems={"center"}>
            <Text w="fit">Áttettszőség:</Text>

            <HStack flex="1">
              <NumberInput.Root
                value={copyrightImage?.opacity?.toString() ?? "0"}
                min={0}
                max={100}
                w={"full"}
                onValueChange={(e) => {
                  setCopyrightImageOpacity(selectedImg, 
                      minMaxValidation(Number(e.value),
                      0,
                     100)
                  )}}
              >
                <NumberInput.Control />
                <NumberInput.Input />
              </NumberInput.Root>
              <Text>%</Text>
            </HStack>
          </Box>
        <Flex gap={4} width="full" alignItems="center">
          <Box display={"flex"} flexDir={"row"} gap={2} alignItems={"center"}>
            <Text w="fit">X:</Text>

            <HStack flex="1">
              <NumberInput.Root
                value={imagePosition?.x.toString() ?? "0"}
                min={0}
                onValueChange={(e) => {
                  if (e.value === "-") return;
                  setCopyrightImagePosition(selectedImg, {
                    x: minMaxValidation(
                      Number(e.value),
                      0,
                      (textAndImagePlaceRef.current?.clientWidth ?? 0) -
                        (copyrightImageRef.clientWidth ?? 0) ,
                    ),
                    y: imagePosition?.y ?? 0,
                  });
                }}
              >
                <NumberInput.Control />
                <NumberInput.Input />
              </NumberInput.Root>
            </HStack>
          </Box>
          <Box display={"flex"} flexDir={"row"} gap={2} alignItems={"center"}>
            <Text w="fit">Y:</Text>

            <HStack flex="1">
              <NumberInput.Root
                value={imagePosition?.y.toString() ?? "0"}
                min={0}
                onValueChange={(e) => {
                  if (e.value === "-") return;
                  setCopyrightImagePosition(selectedImg, {
                    x: imagePosition?.x ?? 0,
                    y: minMaxValidation(
                      Number(e.value),
                      0,
                      (textAndImagePlaceRef.current?.clientHeight ?? 0) -
                        (copyrightImageRef.height ?? 0) ,
                    ),
                  });
                }}
              >
                <NumberInput.Control />
                <NumberInput.Input />
              </NumberInput.Root>
            </HStack>
          </Box>
        </Flex>
        <Grid
          display={"grid"}
          templateRows={"repeat(3, 1fr)"}
          templateColumns={"repeat(3,1fr)"}
          gap={2}
          w={"full"}
        >
          <IconButton
            colorPalette={"teal"}
            variant={"subtle"}
            w={"full"}
            h={"full"}
            disabled={
              imagePosition &&
              imagePosition.x === XPositions.LEFT &&
              imagePosition.y === YPositions.TOP
            }
            onClick={() => {
              setCopyrightImagePosition(selectedImg, {
                x: XPositions.LEFT,
                y: YPositions.TOP,
              });
            }}
          >
            <LuArrowUpLeft />
          </IconButton>
          <IconButton
            colorPalette={"teal"}
            w={"full"}
            variant={"subtle"}
            disabled={
              imagePosition &&
              imagePosition.x === XPositions.CENTER &&
              imagePosition.y === YPositions.TOP
            }
            onClick={() => {
              if (imageSize)
                setCopyrightImagePosition(selectedImg, {
                  x: XPositions.CENTER,
                  y: YPositions.TOP,
                });
            }}
          >
            <LuArrowUp />
          </IconButton>
          <IconButton
            colorPalette={"teal"}
            variant={"subtle"}
            w={"full"}
            disabled={
              imagePosition &&
              imagePosition.x === XPositions.RIGHT &&
              imagePosition.y === YPositions.TOP
            }
            onClick={() => {
              if (imageSize)
                setCopyrightImagePosition(selectedImg, {
                  x: XPositions.RIGHT,
                  y: YPositions.TOP,
                });
            }}
          >
            <LuArrowUpRight />
          </IconButton>

          <IconButton
            colorPalette={"teal"}
            variant={"subtle"}
            w={"full"}
            disabled={
              imagePosition &&
              imagePosition.x === XPositions.LEFT &&
              imagePosition.y === YPositions.CENTER
            }
            onClick={() => {
              if (imageSize)
                setCopyrightImagePosition(selectedImg, {
                  x: XPositions.LEFT,
                  y: YPositions.CENTER,
                });
            }}
          >
            <LuArrowLeft />
          </IconButton>
          <IconButton
            colorPalette={"teal"}
            variant={"subtle"}
            w={"full"}
            disabled={
              imagePosition &&
              imagePosition.x === XPositions.CENTER &&
              imagePosition.y === YPositions.CENTER
            }
            onClick={() => {
              if (imageSize)
                setCopyrightImagePosition(selectedImg, {
                  x: XPositions.CENTER,
                  y: YPositions.CENTER,
                });
            }}
          >
            <LuDot />
          </IconButton>
          <IconButton
            colorPalette={"teal"}
            variant={"subtle"}
            w={"full"}
            disabled={
              imagePosition &&
              imagePosition.x === XPositions.RIGHT &&
              imagePosition.y === YPositions.CENTER
            }
            onClick={() => {
              if (imageSize)
                setCopyrightImagePosition(selectedImg, {
                  x: XPositions.RIGHT,
                  y: YPositions.CENTER,
                });
            }}
          >
            <LuArrowRight />
          </IconButton>

          <IconButton
            colorPalette={"teal"}
            variant={"subtle"}
            w={"full"}
            disabled={
              imagePosition &&
              imagePosition.x === XPositions.LEFT &&
              imagePosition.y === YPositions.BOTTOM
            }
            onClick={() => {
              if (imageSize)
                setCopyrightImagePosition(selectedImg, {
                  x: XPositions.LEFT,
                  y: YPositions.BOTTOM,
                });
            }}
          >
            <LuArrowDownLeft />
          </IconButton>
          <IconButton
            colorPalette={"teal"}
            variant={"subtle"}
            w={"full"}
            disabled={
              imagePosition &&
              imagePosition.x === XPositions.CENTER &&
              imagePosition.y === YPositions.BOTTOM
            }
            onClick={() => {
              if (imageSize)
                setCopyrightImagePosition(selectedImg, {
                  x: XPositions.CENTER,
                  y: YPositions.BOTTOM,
                });
            }}
          >
            <LuArrowDown />
          </IconButton>
          <IconButton
            colorPalette={"teal"}
            variant={"subtle"}
            w={"full"}
            disabled={
              imagePosition &&
              imagePosition.x === XPositions.RIGHT &&
              imagePosition.y === YPositions.BOTTOM
            }
            onClick={() => {
              if (imageSize)
                setCopyrightImagePosition(selectedImg, {
                  x: XPositions.RIGHT,
                  y: YPositions.BOTTOM,
                });
            }}
          >
            <LuArrowDownRight />
          </IconButton>
        </Grid>
      </Stack>
    );
  }
};
