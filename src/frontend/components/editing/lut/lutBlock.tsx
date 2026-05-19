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
import { useEffect, useState } from "react";
import parseCubeLUT from "parse-cube-lut";
import { LuFileUp } from "react-icons/lu";
import { useSessionStore } from "@/stores/sessionData";
import { useWorkSession } from "@/providers/sessionprovider";

export default function LutBlock() {
  const { editFilters } = useSessionStore();
  const { selectedImg, webglFilterRef } = useWorkSession();
  const fileUpload = useFileUpload({
    maxFiles: 1,
    accept: {
      "text/plain": [".cube"],
      "application/octet-stream": [".cube"],
    },
  });

  const accepted = fileUpload.acceptedFiles;

  useEffect(() => {
    //TODO: Ezt úgy kéne átlakítani hogy ebből csinálunk ténylegesen egy képet, de úgy kell hogy egy HTMLCanvas legyen a kép, majd ezt a HTMLCanvast tudjuk a ColorMapFilter-rel alkalmazni
    //! és filterként hozzáaadni
    //Link a colorMap-hez: https://pixijs.io/filters/docs/ColorMapFilter.html
    (async () => {
      if (accepted.length <= 0) return;
      const fileContent = await accepted[0].text();
      var lut = parseCubeLUT(fileContent);
      console.log(lut);
      editFilters(selectedImg, "lut", lut.data);

      // "Kilapítjuk" a sorokat, és mindegyik végére odatesszük az alpha-t (1.0), ez azért kell hogy a kép megfelelő legyen...
      const flatData = new Float32Array(
        lut.data.flatMap((rgb: any) => [...rgb, 1.0]),
      );
    })();
  }, [accepted]);

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
                  const uniforms = webglFilterRef.current
                    ? webglFilterRef.current.resources.filterUniforms.uniforms
                    : null;
                  uniforms.has_input_lut = 0.0;
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
