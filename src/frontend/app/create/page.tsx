"use client";

import keyboardShortcuts from "@/components/editing/keyboardShortCuts";
import { ImageDropZone } from "@/components/upload/dropzone";
import { useWorkSession } from "@/providers/sessionprovider";
import { useWebsocket } from "@/providers/websocketprovider";
import { useSessionStore } from "@/stores/sessionData";
import { handleMessage } from "@/websocket/handlers/handleMessage";
import { Box, Flex, Grid, GridItem, Stack, useBreakpointValue } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import WebGL from "@/components/editing/webglComponents";
import SideBar from "@/components/editing/sidebar";
import BottomBar from "@/components/editing/moreImagesBottomBar";
import TopBar from "@/components/editing/topBar";


export default function Page() {
    //#region contextek
    const { step, imgs, setStep, setImgs, setSelectedImg, selectedImg } = useWorkSession();
    const [selectedImage, setSelectedImage] = useState<string>();

    const { ws, sendMessage } = useWebsocket();
    const { setExifDataForImage, setCaptionSamplesForImage, addImage } = useSessionStore();
    //#endregion

    //#region breakPoint beállíátoks (isMd)
    const isMd = useBreakpointValue(
        { base: false, sm: false, md: false, lg: true, xl: true },
        { ssr: false, fallback: "md" }
    );
    //#endregion

    useEffect(() => {
        setSelectedImage(imgs[selectedImg]);
    }, [selectedImg, imgs]);


    //#region WebSocket kezelés
    useEffect(() => {
        const wscurr = ws.current;
        if (!wscurr) return;

        const messageHandler = (event: MessageEvent) => {
            handleMessage(event, setStep, setImgs, setExifDataForImage, setCaptionSamplesForImage, addImage);
        };

        wscurr.addEventListener("message", messageHandler);

        return () => {
            wscurr.removeEventListener("message", messageHandler);
        };
    }, [ws]);
    //#endregion

    keyboardShortcuts({
        selectedImg,
        sendMessage,
        setImgs,
        setSelectedImage,
        setSelectedImg,
        setStep,
        step,
        imgs
    });

    //TODO: Layout átdolgozása

    return (
        <Box h={"full"} w={"full"} minH={isMd ? "100vh" : "full"} >
            {
                //#region Image feltöltés
            }
            {step === 0 && (
                <ImageDropZone ws={ws} sendMessage={sendMessage} />
            )}
            {
                //#region Második lépés (kép manipulálás)
            }
            {step === 1 && (
                <Flex
                    maxW={"full"}
                    w={"full"}
                    h={isMd ? "100vh" : "full"}
                    display={"flex"}
                    flexDirection={"column"}
                    mx={"auto"}
                >
                    <Flex h={"full"} flexDir={isMd ? "row" : "column"}>
                        <Flex flexDir={"column"} gap={12} w={"full"} h={"full"}>
                            <TopBar setSelectedImage={setSelectedImage} />
                            {selectedImage && (
                                <WebGL />
                            )}
                            <BottomBar />
                        </Flex>
                        <SideBar />
                    </Flex>
                </Flex>

            )}
        </Box>
    )

}