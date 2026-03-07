import { useWorkSession } from "@/providers/sessionprovider";
import { shaderMaterial, OrbitControls } from "@react-three/drei";
import { Canvas, extend, useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function WebGL() {
    const { imgs, selectedImg } = useWorkSession();
    //#region shader material definiálás
    const ImageMaterial = shaderMaterial(
        { uTexture: null },
        `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `,
        `
          precision highp float;
          uniform sampler2D uTexture;
          varying vec2 vUv;
          void main() {
            gl_FragColor = texture2D(uTexture, vUv);
          }
        `
    );

    extend({ ImageMaterial });

    function ImagePlane({ src }: { src: string }) {
        const materialRef = useRef<any>(null);
        const texture = useLoader(THREE.TextureLoader, src);

        const [planeSize, setPlaneSize] = useState<[number, number]>([1, 1]);

        useEffect(() => {
            if (!texture.image) return;

            const width = texture.image.width;
            const height = texture.image.height;

            const maxDimension = Math.max(width, height);
            const scale = 4 / maxDimension;

            setPlaneSize([width * scale, height * scale]);
        }, [texture]);

        return (
            <mesh>
                <planeGeometry args={planeSize} />
                <imageMaterial ref={materialRef} uTexture={texture} />
            </mesh>
        );
    }
    //#endregion

    return (
        <Canvas orthographic camera={{ zoom: 150, position: [0, 0, 5] }}>
            <ambientLight />
            <ImagePlane src={imgs[selectedImg]} />
            <OrbitControls enableZoom={false} enablePan={false} enableDamping={false} enableRotate={false} />
        </Canvas>
    )
}