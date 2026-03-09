"use client";

import keyboardShortcuts from "@/components/editing/keyboardShortCuts";
import { ImageDropZone } from "@/components/upload/dropzone";
import { useWorkSession } from "@/providers/sessionprovider";
import { useWebsocket } from "@/providers/websocketprovider";
import { useSessionStore } from "@/stores/sessionData";
import { handleMessage } from "@/websocket/handlers/handleMessage";
import { Box, Grid, GridItem, Stack, useBreakpointValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
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
                <Stack
                    maxW={"full"}
                    w={"full"}
                    minH={isMd ? "100vh" : "full"}
                    h="full"
                    display={"flex"}
                    flexDirection={"column"}
                    mx={"auto"}
                    boxSizing={"content-box"}
                >
                    <Grid
                        w="full"
                        h={"full"}
                        maxW={"full"}
                        templateColumns={isMd ? "1fr 60px" : "1fr"}
                        templateRows={isMd ? "1fr" : "1fr 60px"}
                    >
                        <GridItem
                            h={"full"}
                            maxW={"full"}
                            display="flex"
                            flexDirection="column"
                            gap={8}
                            w="full"
                        >
                            <Grid h="full" w="full">
                                <GridItem
                                    p={4}
                                    gap={12}
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    boxSizing="border-box"
                                    w="full"
                                    minH="0"
                                >
                                    <TopBar setSelectedImage={setSelectedImage} />

                                    {selectedImage && (
                                        <Box
                                            alignSelf="center"
                                            w="full"
                                            flex="1"
                                            minH="0"
                                        >
                                            <Box
                                                w="full"
                                                h="full"
                                                minH="0"
                                                position="relative"
                                                minW="0"
                                            >
                                                <WebGL />
                                            </Box>
                                        </Box>
                                    )}
                                </GridItem>

                                <BottomBar />
                            </Grid>
                        </GridItem>
                        {
                            //#region Sidebar
                        }
                        <SideBar />
                    </Grid>
                </Stack>
            )}
        </Box>
    )

}