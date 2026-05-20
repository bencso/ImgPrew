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
import { useWorkSession } from "@/providers/sessionprovider";
import { ColorMapFilter } from "pixi-filters";
import { Texture } from "pixi.js";

export default function LutBlock() {
  const { webglFilterRef, spriteRef, lutFilterRef } = useWorkSession();
  const fileUpload = useFileUpload({
    maxFiles: 1,
    accept: {
      "text/plain": [".cube"],
      "application/octet-stream": [".cube"],
    },
  });

  const accepted = fileUpload.acceptedFiles;

  // 1. "Kilapítjuk" a sorokat -> flat()
  // 2. Mivel a LUT egy 3D-s kocka, ezért ki kell terítenünk lapokra
  // (A PixiJS ColorMapFilter-e egyetlen hosszú vízszintes lapot vár)

  function convertCubeToFilter(lut: any): ColorMapFilter | null {
    if (!spriteRef.current || !webglFilterRef.current) return null;

    const flatData = lut.data.flat();
    const size = lut.size || 32;

    const colorMap = document.createElement("canvas");
    colorMap.width = Math.pow(size, 2);
    colorMap.height = size;
    const ctx = colorMap.getContext("2d")!;
    const imageData = ctx.createImageData(colorMap.width, colorMap.height);

    // Végig megyünk az adatokon, hármasával (ugye kilapítottuk a sorokat a flat()-tel és igy RGBRGBRGBRGB), hogy RGB-ket kivegyük mint adat
    for (let index = 0; index < flatData.length; index += 3) {
      // Elosztjuk hárommal, hogy tudjuk hanyadik pixelnél tartunk a 3D-ben
      const startIndex = index / 3;
      //  Megkeressük a pirosnak a helyét
      const r = Math.floor(startIndex % size);
      // A zöld pozíciója
      const g = Math.floor((startIndex / size) % size);
      // Egy teljes lap területével (size * size) osztunk, így megkapjuk, hogy hanyadik kék lapnál tartunk
      const b = Math.floor(startIndex / Math.pow(size, 2));

      //  A Kék érték határozza meg, hogy melyik lapon vagyunk az R pedig megmondja mennyit kell eltolni
      //  Ha a harmadik lapon vagyunk (lutB = 2), akkor annak a lapnak a kezdő X pontja a vásznon 2 * 32 = 64 pixelnél lesz
      const xCoord = b * size + r;
      const yCoord = g;
      // 4 byte miatt szorozzuk az egészet
      const indexCoord = (yCoord * colorMap.width + xCoord) * 4;

      let rColor = flatData[index];
      let gColor = flatData[index + 1];
      let bColor = flatData[index + 2];

      imageData.data[indexCoord] = rColor * 255;
      imageData.data[indexCoord + 1] = gColor * 255;
      imageData.data[indexCoord + 2] = bColor * 255;
      imageData.data[indexCoord + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);

    if (colorMap instanceof HTMLCanvasElement !== true) return null;
    const colorMapTexture = Texture.from(colorMap);
    const colorMapFilter = new ColorMapFilter({
      colorMap: colorMapTexture,
    });
    colorMapFilter.updateColorMap();
    return colorMapFilter;
  }

  useEffect(() => {
    (async () => {
      if (!spriteRef.current || !webglFilterRef.current) return;

      if (accepted.length <= 0) {
        spriteRef.current.filters = [webglFilterRef.current];
      } else {
        const fileContent = await accepted[0].text();
        var lut = parseCubeLUT(fileContent);

        lutFilterRef.current = convertCubeToFilter(lut);
        if (lutFilterRef.current)
          spriteRef.current.filters = [
            lutFilterRef.current,
            webglFilterRef.current,
          ];
      }
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
