import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box, Flex, Span } from "@chakra-ui/react";
import { shaderMaterial } from "@react-three/drei";
import { Canvas, extend, useLoader, useThree } from "@react-three/fiber";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Draggable from "react-draggable";
import { shallow } from "zustand/shallow";
import { DraggableImageEvent } from "@/interfaces/interface";

const ImageMaterial = shaderMaterial(
  {
    uTexture: null,
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
}) {
  const texture = useLoader(THREE.TextureLoader, src);
  const { viewport } = useThree();

  const imgW = texture.image?.width ?? 1;
  const imgH = texture.image?.height ?? 1;

  // Kiszámoljuk a képnél hogy melyik az ami belefér, majd kiválasszuk belőle a legkissebbet
  const scale = Math.min(viewport.width / imgW, viewport.height / imgH);
  const width = imgW * scale;
  const height = imgH * scale;

  useEffect(() => {
    if (width && height) {
      setSize({ width, height });
    }
  }, [width, height]);

  return (
    <mesh scale={[width, height, 1]}>
      <planeGeometry args={[1, 1]} />
      <imageMaterial
        uTexture={texture}
        uBrightness={filters.brightness}
        uContrast={filters.contrast}
        uSaturation={filters.saturation}
        uExposure={filters.exposure}
      />
    </mesh>
  );
}

export default function ImageWorkPlace() {
  const { imgs, selectedImg } = useWorkSession();
  const { setTextPosition } = useSessionStore();
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );

  //? shallow: nem generál le újra az objektumot hanem mintha cachelte volna mindig az adott objektumot irja felül / ÖSSZEHASONLÍT
  const filters = useSessionStore((s) => s.getFilters(selectedImg), shallow);
  const nodeRef = useRef<HTMLDivElement>(null);
  const texts = useSessionStore((s) => s.getTexts(selectedImg), shallow);

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
        {texts.map((element: DraggableImageEvent, index) => {
          console.log(element);
          return (
            <Draggable
              key={element.id + "-" + index}
              disabled={!element.enabled}
              bounds="parent"
              position={element.position}
              nodeRef={nodeRef}
              onDrag={(_, d) => {
                const textId = element.id;
                const position = {
                  x: d.x,
                  y: d.y,
                };
                setTextPosition(selectedImg, textId, position);
              }}
              defaultClassNameDragging="draggable_element_drag"
              defaultClassName="draggable_element"
            >
              <Box ref={nodeRef} position={"relative"} h="fit" w={"fit"}>
                <Span
                  style={{
                    fontSize: element.fontSize || 20,
                    fontFamily: element.fontFamily || "Inter",
                    fontWeight: element.fontWeight || 500,
                  }}
                >
                  {element.text}
                </Span>
              </Box>
            </Draggable>
          );
        })}
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
        />
      </Canvas>
    </Flex>
  );
}
