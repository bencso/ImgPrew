import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import {
  Box,
  Field,
  FileUpload,
  Flex,
  Grid,
  GridItem,
  Icon,
  IconButton,
  Input,
  InputGroup,
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
import { ACCEPTED_FILES } from "@/components/upload/dropzone";
import { toaster } from "@/components/ui/toaster";

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
            <Box
              overflowY={"scroll"}
              scrollbar={"hidden"}
              maxH={200}
              w={"full"}
            >
              <FileUpload.ItemGroup>
                {accepted.map((file) => (
                  <FileUpload.Item key={file.name} file={file}>
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
            </Box>
          )}
        </FileUpload.RootProvider>
      </Flex>
      <Stack gap="2" mt={4}>
        <ImageManipulationBlock />
      </Stack>
    </Box>
  );
}

const ImageManipulationBlock = () => {
  const { selectedImg, copyrightImageRef } = useWorkSession();
  const { setCopyrightImageSize, setCopyrightImagePosition } =
    useSessionStore();

  const imageSize = useSessionStore(
    (s) => s.getImageSize(selectedImg),
    shallow,
  );

  const copyrightImageSize = useSessionStore((s) =>
    s.sessionData.filter((sD) => sD.id === selectedImg),
  );

  if (copyrightImageRef) {
    const imagHeigtWithText = imageSize
      ? imageSize.height - copyrightImageRef.offsetHeight
      : null;

    const imagWidthWithText = imageSize
      ? imageSize.width - copyrightImageRef.offsetWidth
      : null;

    const imageHalfWithText = imageSize
      ? imageSize.width / 2 - copyrightImageRef.offsetWidth / 2
      : null;

    console.log(imageHalfWithText);
    return (
      <Stack gap={5}>
        <Field.Root>
          <Field.Label>Méret</Field.Label>
          <Input
            placeholder="Méret"
            value={
              copyrightImageSize
                ? copyrightImageSize[0].copyrightImage?.size
                : 20
            }
            onChange={(e) => {
              setCopyrightImageSize(selectedImg, Number(e.target.value));
            }}
            min={10}
            type="number"
          />
        </Field.Root>
        <Grid
          templateRows={"repeat(3, 1fr)"}
          gap={2}
          alignItems={"center"}
          justifyContent={"center"}
          w={"full"}
        >
          <GridItem display={"flex"} gap={2}>
            <IconButton
              colorPalette={"teal"}
              variant={"subtle"}
              onClick={() => {
                setCopyrightImagePosition(selectedImg, {
                  y: 5,
                  x: 5,
                });
              }}
            >
              <LuArrowUpLeft />
            </IconButton>
            <IconButton
              colorPalette={"teal"}
              variant={"subtle"}
              onClick={() => {
                if (imageSize && imageHalfWithText)
                  setCopyrightImagePosition(selectedImg, {
                    y: 5,
                    x: imageHalfWithText,
                  });
              }}
            >
              <LuArrowUp />
            </IconButton>
            <IconButton
              colorPalette={"teal"}
              variant={"subtle"}
              onClick={() => {
                if (imageSize && imagWidthWithText)
                  setCopyrightImagePosition(selectedImg, {
                    y: 5,
                    x: imagWidthWithText,
                  });
              }}
            >
              <LuArrowUpRight />
            </IconButton>
          </GridItem>
          <GridItem display={"flex"} gap={2}>
            <IconButton
              colorPalette={"teal"}
              variant={"subtle"}
              onClick={() => {
                if (imageSize && imagHeigtWithText)
                  setCopyrightImagePosition(selectedImg, {
                    y: imagHeigtWithText / 2,
                    x: 5,
                  });
              }}
            >
              <LuArrowLeft />
            </IconButton>
            <IconButton
              colorPalette={"teal"}
              variant={"subtle"}
              onClick={() => {
                if (imageSize && imagHeigtWithText && imageHalfWithText)
                  setCopyrightImagePosition(selectedImg, {
                    y: imagHeigtWithText / 2,
                    x: imageHalfWithText,
                  });
              }}
            >
              <LuDot />
            </IconButton>
            <IconButton
              colorPalette={"teal"}
              variant={"subtle"}
              onClick={() => {
                if (imageSize && imagHeigtWithText && imagWidthWithText)
                  setCopyrightImagePosition(selectedImg, {
                    y: imagHeigtWithText / 2,
                    x: imagWidthWithText,
                  });
              }}
            >
              <LuArrowRight />
            </IconButton>
          </GridItem>
          <GridItem display={"flex"} gap={2}>
            <IconButton
              colorPalette={"teal"}
              variant={"subtle"}
              onClick={() => {
                if (imageSize && imagHeigtWithText)
                  setCopyrightImagePosition(selectedImg, {
                    y: imagHeigtWithText,
                    x: 5,
                  });
              }}
            >
              <LuArrowDownLeft />
            </IconButton>
            <IconButton
              colorPalette={"teal"}
              variant={"subtle"}
              onClick={() => {
                if (imageSize && imagHeigtWithText && imageHalfWithText)
                  setCopyrightImagePosition(selectedImg, {
                    y: imagHeigtWithText,
                    x: imageHalfWithText,
                  });
              }}
            >
              <LuArrowDown />
            </IconButton>
            <IconButton
              colorPalette={"teal"}
              variant={"subtle"}
              onClick={() => {
                if (imageSize && imagHeigtWithText && imagWidthWithText)
                  setCopyrightImagePosition(selectedImg, {
                    y: imagHeigtWithText,
                    x: imagWidthWithText,
                  });
              }}
            >
              <LuArrowDownRight />
            </IconButton>
          </GridItem>
        </Grid>
      </Stack>
    );
  }
};
