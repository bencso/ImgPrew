import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box, Flex } from "@chakra-ui/react";
import { shaderMaterial } from "@react-three/drei";
import { Canvas, extend, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";

const ImageMaterial = shaderMaterial(
    {
        uTexture: null,
        uBrightness: 0,
        uContrast: 0,
        uSaturation: 0,
        uExposure: 0
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
`
);

extend({ ImageMaterial });

function ImagePlane({
    src,
    brightness,
    contrast,
    saturation,
    exposure
}: {
    src: string;
    brightness: number;
    contrast: number;
    saturation: number;
    exposure: number;
}) {
    const texture = useLoader(THREE.TextureLoader, src);
    const { viewport } = useThree();

    const imgW = texture.image?.width ?? 1;
    const imgH = texture.image?.height ?? 1;

    // Kiszámoljuk a képnél hogy melyik az ami belefér, majd kiválasszuk belőle a legkissebbet
    const scale = Math.min(
        viewport.width / imgW,
        viewport.height / imgH
    );

    const width = imgW * scale;
    const height = imgH * scale;

    return (
        <mesh scale={[width, height, 1]}>
            <planeGeometry args={[1, 1]} />
            <imageMaterial uTexture={texture} uBrightness={brightness} uContrast={contrast} uSaturation={saturation} uExposure={exposure} />
        </mesh>
    )
}

export default function WebGL() {
    const { imgs, selectedImg } = useWorkSession();

    const brightness = useSessionStore(s => {
        return Number(s.sessionData
            .find(img => img.id === selectedImg)
            ?.filters?.find(f => f.name === "brightness")
            ?.value) || 0;
    })

    const contrast =
        useSessionStore(s => {
            return Number(s.sessionData
                .find(img => img.id === selectedImg)
                ?.filters?.find(f => f.name === "contrast")
                ?.value) || 0
        }
        );

    const saturation =
        useSessionStore(s => {
            return Number(s.sessionData
                .find(img => img.id === selectedImg)
                ?.filters?.find(f => f.name === "saturation")
                ?.value) || 0
        }
        );

    const exposure =
        useSessionStore(s => {
            return Number(s.sessionData
                .find(img => img.id === selectedImg)
                ?.filters?.find(f => f.name === "exposure")
                ?.value) || 0
        }
        );


    return (
        <Flex
            w="full"
            h="full"
            boxSizing={"border-box"}
            overflow="hidden"
            p={4}
        >
            <Canvas
                orthographic
                style={{
                    width: "100%",
                    height: "100%"
                }}
            >
                <ImagePlane
                    src={imgs[selectedImg]}
                    brightness={brightness}
                    contrast={contrast}
                    exposure={exposure}
                    saturation={saturation}
                />
            </Canvas>
        </Flex>
    );
}