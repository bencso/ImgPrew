import { useWorkSession } from "@/providers/sessionprovider";
import { shaderMaterial, OrbitControls } from "@react-three/drei";
import { Canvas, extend, useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { LUTCubeLoader } from 'three/addons/loaders/LUTCubeLoader.js';

export default function WebGL() {
    const { imgs, selectedImg } = useWorkSession();
    const [lut, setLut] = useState<any>(null);

    // LUT TESZTER:
    const loader = new LUTCubeLoader();
    loader.loadAsync("", (result) => {
        console.log(result);
    });

    // varying -> egy átmenő változó => változó
    // uniform -> változó ami állandó marad mindig
    // uv -> textura koordináták

    //TODO: Belenézni mélyebben a webgl shader müködésébe, ChatGPT-vel akár
    const ImageMaterial = shaderMaterial(
        {
            uTexture: null,
        },

        // Vertex shader - pontokkal dolgozik -> lefut minden csúcspontra
        // "hol legyen az objektum"
        `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            
            /* 
            * gl_Position -> vertex shader kimenet -> megmondja, hol legyen a vertex a képernyőn
            * position -> az objektum csúcspontja a modell koordinátarendszerben
            * vec4(position, 1.0) -> 4D vektorra alakítás, 4x4-es mátrixhoz
            * modelViewMatrix ->  a modellt a világ koordinátából a kamera koordinátába konvertálja
            * projectionMatrix -> vetíti a perspektivikus / ortografikus kamera koordinátákat ("Matrix projektor")
            */

            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); 
        }
        `,
        // Fragment shader - pixelekkel dolgozik -> left minden pixelnél
        // "milyen színű legyen" - ezt kell mindig manipulálni majd igazából képszerkesztéshez
        `
        uniform sampler2D uTexture;

        varying vec2 vUv;

        void main() {
            vec4 color = texture2D(uTexture, vUv);
            gl_FragColor = color;
        }
        `
    );

    //! Osztályt örökítjük a parent osztály 
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
        <Canvas orthographic camera={{ zoom: 150, position: [0, 0, 5] }} gl={{ antialias: true }}>
            <ambientLight />
            <ImagePlane src={imgs[selectedImg]} />
            <OrbitControls enableZoom={false} enablePan={false} enableDamping={false} enableRotate={false} />
        </Canvas>
    )
}