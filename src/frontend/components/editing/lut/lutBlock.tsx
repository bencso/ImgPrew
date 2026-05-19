import {
  Box,
  Button,
  CloseButton,
  FileUpload,
  Flex,
  Input,
  InputGroup,
  Span,
  Text,
  useFileUpload,
} from "@chakra-ui/react";
import { HiUpload } from "react-icons/hi";
import { LuFileUp } from "react-icons/lu";

export default function LutBlock() {
  const fileUpload = useFileUpload({
    maxFiles: 1,
    accept: {
      "text/plain": [".cube"],
      "application/octet-stream": [".cube"],
    },
  });

  const accepted = fileUpload.acceptedFiles.map((file) => file.name);
  console.log(accepted);

  return (
    <Flex
      display="flex"
      w={"full"}
      h="full"
      gap="3"
      maxWidth={"300px"}
      flexDir={"column"}
    >
      <FileUpload.RootProvider maxWidth={"300px"} gap="3" value={fileUpload}>
        <FileUpload.HiddenInput placeholder="Töltsd fel a lutot" />
        <InputGroup
          startElement={<LuFileUp />}
          endElement={
            <FileUpload.ClearTrigger asChild>
              <CloseButton
                me="-1"
                size="xs"
                variant="plain"
                focusVisibleRing="inside"
                focusRingWidth="2px"
                pointerEvents="auto"
              />
            </FileUpload.ClearTrigger>
          }
        >
          <Input asChild placeholder="Töltsd fel a LUT-ot">
            <FileUpload.Trigger>
              {accepted.length === 1 && <FileUpload.FileText lineClamp={1} />}
              {accepted.length === 0 && (
                <Text alignItems={"center"} color={"fg.muted"}>
                  Fájl feltöltése{" "}
                  <Span fontSize={"xx-small"} color={"fg.muted"}>
                    (.cube)
                  </Span>
                </Text>
              )}
            </FileUpload.Trigger>
          </Input>
        </InputGroup>
      </FileUpload.RootProvider>
      {accepted.length === 1 && (
        <Button variant={"surface"} colorPalette={"teal"}>
          Alkalmaz
        </Button>
      )}
    </Flex>
  );
}
