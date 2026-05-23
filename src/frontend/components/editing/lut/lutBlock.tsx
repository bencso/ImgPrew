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
import { LuFileUp } from "react-icons/lu";
import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { convertCubeToFilter } from "@/handlers/lutFunctions";
import { ColorMapFilter } from "pixi-filters";
//@ts-ignore
import parseCubeLUT from "parse-cube-lut";

export default function LutBlock() {
  const { selectedImg } = useWorkSession();
  const { setLut } = useSessionStore();

  const lutFile = useSessionStore(
    (state) => state.sessionData.find((img) => img.id === selectedImg)?.lutFile,
  );

  const fileUpload = useFileUpload({
    maxFiles: 1,
    accept: {
      "text/plain": [".cube"],
      "application/octet-stream": [".cube"],
    },
    acceptedFiles: lutFile ? [lutFile] : [],
    async onFileAccept(details) {
      const lutFile = details.files[0];
      if (details.files.length > 0) {
        const fileContent = await lutFile.text();
        var lut = parseCubeLUT(fileContent);

        const lutFilter = convertCubeToFilter(lut) as ColorMapFilter;
        setLut(selectedImg, lutFilter, lutFile);
      }
    },
  });

  const accepted = fileUpload.acceptedFiles;

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
                onClick={() => {
                  setLut(selectedImg, null, null);
                }}
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
    </Flex>
  );
}
