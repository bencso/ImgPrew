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
import { useEffect, useState } from "react";

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
  const {
    selectedImg,
    copyrightImageRef,
    calcImageHeightWithElement,
    calcImageWidthWithElement,
    calcImageHalfWithText,
  } = useWorkSession();
  const { setCopyrightImageSize, setCopyrightImagePosition } =
    useSessionStore();
  const [imageHeightWithCP, setImageHeightWithCP] = useState<number>(0);
  const [imageWidthWithCP, setImageWidthWithCP] = useState<number>(0);
  const [imageHalfWithCP, setImageHalfWithCP] = useState<number>(0);

  const imageSize = useSessionStore(
    (s) => s.getImageSize(selectedImg),
    shallow,
  );

  const copyrightImageSize = useSessionStore((s) =>
    s.sessionData.filter((sD) => sD.id === selectedImg),
  );

  //TODO: Azt kell csinálni hogy a gombokkal x/y: "LEFT|CENTER|RIGHT"-ot állítunk és mindig triggereljük majd az ujraszámolásra,
  // és elvileg akkor mindig tartja magát ha még window resizeolodik
  useEffect(() => {
    if (imageSize && copyrightImageRef) {
      const imageHalf = calcImageHalfWithText(imageSize, copyrightImageRef);
      if (imageHalf) setImageHalfWithCP(imageHalf);

      const imageWCP = calcImageWidthWithElement(imageSize, copyrightImageRef);
      if (imageWCP) setImageWidthWithCP(imageWCP);

      const imageHCP = calcImageHeightWithElement(imageSize, copyrightImageRef);
      if (imageHCP) setImageHeightWithCP(imageHCP);
    }
  }, [imageSize, copyrightImageRef]);

  if (copyrightImageRef) {
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
                if (imageSize && imageHalfWithCP)
                  setCopyrightImagePosition(selectedImg, {
                    y: 5,
                    x: imageHalfWithCP,
                  });
              }}
            >
              <LuArrowUp />
            </IconButton>
            <IconButton
              colorPalette={"teal"}
              variant={"subtle"}
              onClick={() => {
                if (imageSize && imageWidthWithCP)
                  setCopyrightImagePosition(selectedImg, {
                    y: 5,
                    x: imageWidthWithCP,
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
                if (imageSize && imageHeightWithCP)
                  setCopyrightImagePosition(selectedImg, {
                    y: imageHeightWithCP / 2,
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
                if (imageSize && imageHeightWithCP && imageHalfWithCP)
                  setCopyrightImagePosition(selectedImg, {
                    y: imageHeightWithCP / 2,
                    x: imageHalfWithCP,
                  });
              }}
            >
              <LuDot />
            </IconButton>
            <IconButton
              colorPalette={"teal"}
              variant={"subtle"}
              onClick={() => {
                if (imageSize && imageHeightWithCP && imageWidthWithCP)
                  setCopyrightImagePosition(selectedImg, {
                    y: imageHeightWithCP / 2,
                    x: imageWidthWithCP,
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
                if (imageSize && imageHeightWithCP)
                  setCopyrightImagePosition(selectedImg, {
                    y: imageHeightWithCP,
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
                if (imageSize && imageHeightWithCP && imageHalfWithCP)
                  setCopyrightImagePosition(selectedImg, {
                    y: imageHeightWithCP,
                    x: imageHalfWithCP,
                  });
              }}
            >
              <LuArrowDown />
            </IconButton>
            <IconButton
              colorPalette={"teal"}
              variant={"subtle"}
              onClick={() => {
                if (imageSize && imageHeightWithCP && imageWidthWithCP)
                  setCopyrightImagePosition(selectedImg, {
                    y: imageHeightWithCP,
                    x: imageWidthWithCP,
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
