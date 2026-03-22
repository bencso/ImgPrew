import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box, Flex, Image, Span } from "@chakra-ui/react";
import { shaderMaterial } from "@react-three/drei";
import { Canvas, extend, useLoader, useThree } from "@react-three/fiber";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import Moveable from "react-moveable";
import { shallow } from "zustand/shallow";
import {
  calculationTypeEnum,
  DraggableImageEvent,
} from "@/interfaces/interface";

const ImageMaterial = shaderMaterial(
  {
    uTexture: null as THREE.Texture | null,
    uBrightness: 0,
    uContrast: 0,
    uSaturation: 0,
    uExposure: 0,
  },

  `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
  `,

  `
  uniform sampler2D uTexture;
  uniform float uBrightness;
  uniform float uContrast;
  uniform float uSaturation;
  uniform float uExposure;

  varying vec2 vUv;

vec3 adjustBrightness(vec3 color, float value) {
    return clamp(color + value / 255.0, 0.0, 1.0);
}

vec3 adjustContrast(vec3 color, float value) {

    return clamp(0.5 + (1.0 + value) * (color - 0.5), 0.0, 1.0);

}

vec3 adjustExposure(vec3 color, float value) {
	return color * (1.0 + value);
}

vec3 adjustSaturation(vec3 color, float value) {
	const vec3 luminosityFactor = vec3(0.2126, 0.7152, 0.0722);
	vec3 grayscale = vec3(dot(color, luminosityFactor));
	return mix(grayscale, color, 1.0 + value);
}

void main() {
    vec4 color = texture2D(uTexture, vUv);
    color.rgb = adjustBrightness(color.rgb, uBrightness);
    color.rgb = adjustContrast(color.rgb, uContrast);
    color.rgb = adjustSaturation(color.rgb, uSaturation);
    color.rgb = adjustExposure(color.rgb, uExposure);
    gl_FragColor = color;
}
`,
);

extend({ ImageMaterial });

function ImagePlane({
  src,
  filters,
  setSize,
  setImageSize,
}: {
  src: string;
  filters: {
    brightness: number;
    contrast: number;
    saturation: number;
    exposure: number;
  };
  setSize: Dispatch<
    SetStateAction<{
      width: number;
      height: number;
    } | null>
  >;
  setImageSize: (width: number, height: number) => void;
}) {
  const { viewport } = useThree();
  const texture = useLoader(THREE.TextureLoader, src);
  if (!texture.image) return null;

  const imgW = texture.image?.width ?? 1;
  const imgH = texture.image?.height ?? 1;

  // Kiszámoljuk a képnél hogy melyik az ami belefér, majd kiválasszuk belőle a legkissebbet
  const scale = Math.min(viewport.width / imgW, viewport.height / imgH);
  const width = imgW * scale;
  const height = imgH * scale;

  useEffect(() => {
    if (width && height) {
      setSize({ width, height });
      setImageSize(width, height);
    }
  }, [width, height]);

  const mat = useMemo(() => {
    const m = new ImageMaterial();
    m.uTexture = texture;
    m.uBrightness = filters.brightness;
    m.uContrast = filters.contrast;
    m.uSaturation = filters.saturation;
    m.uExposure = filters.exposure;
    return m;
  }, [texture, filters]);

  return (
    <mesh scale={[width, height, 1]} material={mat}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

export default function ImageWorkPlace() {
  const {
    imgs,
    selectedImg,
    textElements,
    setTextElements,
    setCopyrightImageRef,
    copyrightImageRef,
  } = useWorkSession();
  const { setTextPosition, setImageSize, calculationReFixPosition } =
    useSessionStore();
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );

  const copyrightImage = useSessionStore(
    (s) => s.sessionData.find((sD) => sD.id === selectedImg)?.copyrightImage,
  );

  //
  function setImageDimension(width: number, height: number) {
    setImageSize(selectedImg, width, height);
  }

  //! shallow: nem generál le újra az objektumot hanem mintha cachelte volna mindig az adott objektumot irja felül / ÖSSZEHASONLÍT
  const filters = useSessionStore((s) => s.getFilters(selectedImg), shallow);
  const texts = useSessionStore(
    (s) => s.sessionData.find((si) => si.id === selectedImg)?.texts || [],
    shallow,
  );

  const setTextRef = (textId: string) => (el: any) => {
    if (el && textElements[textId] !== el) {
      setTextElements((prev) => ({
        ...prev,
        [textId]: el,
      }));
    }
  };

  //#region CP position manipuláció
  const [cpPosition, setCpPosition] = useState<{ x: number; y: number }>({
    x: 5,
    y: 5,
  });
  const [textPositions, setTextPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});

  const copyrightImageSize = useSessionStore((s) =>
    s.sessionData.find((sD) => sD.id === selectedImg),
  );

  useEffect(() => {
    if (!copyrightImageRef) return;
    const position = calculationReFixPosition(
      selectedImg,
      calculationTypeEnum.COPYRIGHT,
      copyrightImageRef,
    );
    setCpPosition({
      x: position.x,
      y: position.y,
    });
  }, [selectedImg, copyrightImageSize, copyrightImageRef]);

  const [draggableId, setDraggableId] = useState<string | null>(null);
  const textPosition = useSessionStore(
    (s) => s.sessionData.find((sD) => sD.id === selectedImg)?.texts,
    shallow,
  );
  useEffect(() => {
    const newPositions: Record<string, { x: number; y: number }> = {};

    texts.forEach((element) => {
      console.log("2:");
      console.log(element);
      if (!textElements[element.id]) return;

      const textPosition = calculationReFixPosition(
        selectedImg,
        calculationTypeEnum.TEXT,
        textElements[element.id],
        element.id,
      );

      newPositions[element.id] = textPosition;
    });
    setTextPositions(newPositions);
  }, [selectedImg, textPosition]);
  //#endregion

  useEffect(() => {
    console.log(draggableId);
  }, [draggableId]);

  return (
    <Flex
      w="full"
      h="full"
      boxSizing={"border-box"}
      overflow="hidden"
      p={4}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {
        //TODO: külön elszaparálni majd késöbbre
      }
      <Box
        zIndex={100}
        h={size?.height || 0}
        w={size?.width || 0}
        position={"absolute"}
        overflow={"hidden"}
      >
        {texts.map((element: DraggableImageEvent) => {
          return (
            <Span
              key={element.id}
              ref={setTextRef(element.id)}
              onMouseEnter={() => {
                setDraggableId(element.id);
              }}
              id={element.id}
              w={"fit"}
              h={"fit"}
              position={"absolute"}
              cursor={"pointer"}
              top={
                typeof textPositions[element.id]?.y === "number"
                  ? `${textPositions[element.id]!.y}px`
                  : "5px"
              }
              left={
                typeof textPositions[element.id]?.x === "number"
                  ? `${textPositions[element.id]!.x}px`
                  : "5px"
              }
              textWrap={"balance"}
              style={{
                fontSize: element.fontSize || 20,
                fontFamily: element.fontFamily || "Inter",
                fontWeight: element.fontWeight || 500,
                color: element.color || "#ffff",
                lineHeight: 1,
              }}
            >
              {element.text}
            </Span>
          );
        })}
        {draggableId && textElements[draggableId] && (
          <Moveable
            target={textElements[draggableId]}
            draggable={true}
            throttleDrag={0}
            hideDefaultLines
            hideChildMoveableDefaultLines
            hideThrottleDragRotateLine
            edgeDraggable={false}
            origin={false}
            startDragRotate={0}
            throttleDragRotate={0}
            onDrag={(e) => {
              const textId = draggableId;
              if (!textId) return;

              setDraggableId(textId);
              const position = {
                x: e.left,
                y: e.top,
              };
              setTextPosition(selectedImg, textId, position);
            }}
          />
        )}
        {copyrightImage && copyrightImage.blob && (
          <Image
            ref={(el) => {
              if (el) setCopyrightImageRef(el);
            }}
            src={copyrightImage.blob}
            alt="copyright"
            height={copyrightImage.size + "px"}
            position={"relative"}
            left={cpPosition.x}
            top={cpPosition.y}
            draggable={false}
            userSelect={"none"}
          />
        )}
      </Box>
      <Canvas
        orthographic
        style={{
          width: "100%",
          height: "100%",
        }}
        frameloop="demand"
      >
        <ImagePlane
          src={imgs[selectedImg]}
          filters={filters}
          setSize={setSize}
          setImageSize={setImageDimension}
        />
      </Canvas>
    </Flex>
  );
}
