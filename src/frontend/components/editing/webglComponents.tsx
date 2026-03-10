import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { Box, Flex } from "@chakra-ui/react";
import { shaderMaterial } from "@react-three/drei";
import { Canvas, extend, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";

const ImageMaterial = shaderMaterial(
    {
        uTexture: null,
        uBrightness: 0
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

  varying vec2 vUv;

  vec3 adjustBrightness(vec3 color, float value) {
    return color + value / 255.0;
  }

  void main() {
    vec4 color = texture2D(uTexture, vUv);
    color.rgb = adjustBrightness(color.rgb, uBrightness);
    gl_FragColor = color;
  }
  `
);

extend({ ImageMaterial });

function ImagePlane({
    src,
    brightness,
}: {
    src: string;
    brightness: number;
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
            <imageMaterial uTexture={texture} uBrightness={brightness} />
        </mesh>
    )
}

export default function WebGL() {
    const { imgs, selectedImg } = useWorkSession();

    const brightness =
        useSessionStore(s =>
            s.sessionData
                .find(img => img.id === selectedImg)
                ?.filters?.find(f => f.name === "brightness")
                ?.value
        ) ?? 0;

    return (
        <Flex
            w="full"
            h="full"
            maxH="full"
            maxW="full"
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
                />
            </Canvas>
        </Flex>
    );
}