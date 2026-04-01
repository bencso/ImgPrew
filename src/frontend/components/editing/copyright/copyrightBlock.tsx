import { toaster } from "@/components/ui/toaster";
import { ACCEPTED_FILES } from "@/components/upload/dropzone";
import { XPositions, YPositions } from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  Box,
  Field,
  FileUpload,
  Flex,
  Grid,
  Icon,
  IconButton,
  Input,
  Stack,
  useFileUpload,
} from "@chakra-ui/react";
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

  const accepted = fileUpload.acceptedFiles;

  return (
    <Box>
      <Flex gap={2}>
        <FileUpload.RootProvider value={fileUpload} w="full">
          <FileUpload.HiddenInput />
          {accepted.length <= 0 ? (
            <FileUpload.Dropzone
              w={"full"}
              backgroundColor={"teal.subtle/30"}
              transition={"all 0.2s ease-in-out"}
              cursor={"pointer"}
              _hover={{ backgroundColor: "teal.subtle/40" }}
            >
              <Icon size="2xl" color="teal.fg">
                <LuCopyright />
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
          ) : (
            <Box overflowY={"scroll"} scrollbar={"hidden"} w={"full"}>
              <FileUpload.ItemGroup>
                {accepted.map((file) => (
                  <FileUpload.Item
                    key={file.name}
                    file={file}
                    justifyContent={"space-between"}
                  >
                    <FileUpload.ItemName />
                    <FileUpload.ItemDeleteTrigger
                      onClick={() => {
                        clearCopyrightImage(selectedImg);
                        setCopyrightImageRef(null);
                      }}
                      color={"red.400"}
                    />
                  </FileUpload.Item>
                ))}
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
  const { selectedImg, copyrightImageRef } = useWorkSession();
  const { setCopyrightImageSize, setCopyrightImagePosition } =
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

  const copyrightImageSize = useSessionStore((s) =>
    s.sessionData.find((sD) => sD.id === selectedImg),
  );

  if (copyrightImageRef) {
    return (
      <Stack gap={5}>
        <Field.Root>
          <Field.Label>Méret</Field.Label>
          <Input
            placeholder="Méret"
            value={
              copyrightImageSize ? copyrightImageSize.copyrightImage?.size : 20
            }
            onChange={(e) => {
              setCopyrightImageSize(selectedImg, Number(e.target.value));
            }}
            min={10}
            type="number"
          />
        </Field.Root>
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
