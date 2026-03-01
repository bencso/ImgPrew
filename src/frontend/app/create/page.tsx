"use client";

import CaptionBlock from "@/components/editing/caption/captionBlock";
import { EditItem } from "@/components/editing/edititem";
import { ImageDropZone } from "@/components/upload/dropzone";
import { EditItemProp } from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useWebsocket } from "@/providers/websocketprovider";
import { useSessionStore } from "@/stores/sessionData";
import { handleMessage } from "@/websocket/handlers/handleMessage";
import { Box, Button, Grid, GridItem, Stack, useBreakpointValue } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { LuCaptions, LuImageDown, LuPlus } from "react-icons/lu";

export default function Page() {
    //#region contextek
    const { step, imgs, setStep, setImgs, setSelectedImg, selectedImg, addFunction } = useWorkSession();
    const [selectedImage, setSelectedImage] = useState<string>();
    const [editItems, setEditItems] = useState<EditItemProp[]>([]);
    const { ws, sendMessage } = useWebsocket();
    const { sessionData, setExifDataForImage, setCaptionSamplesForImage, addImage, setExportFileExtension, exportAllDataForImage } = useSessionStore();
    //#endregion

    //#region breakPoint beállíátoks (isMd)
    const isMd = useBreakpointValue(
        { base: false, sm: false, md: false, lg: true, xl: true },
        { ssr: false, fallback: "md" }
    );
    //#endregion

    useMemo(() => {
        editItems.map((item) => {
            if (item.inputs) {
                addFunction(item.function, item.inputs);
            }
        });
    }, []);

    //#region sidebar funkciók
    useMemo(() => {
        setEditItems(
            [
                {
                    function: "create_caption",
                    icon: <LuCaptions />,
                    inputs: [
                        {
                            name: "",
                            inputType: "customElement",
                            options: <CaptionBlock />,
                        },
                    ],
                },
                {
                    function: "export",
                    icon: <LuImageDown />,
                    inputs: [
                        {
                            name: "Fájlkiterjesztés",
                            inputType: "radio",
                            onChange: (e: any) => {
                                setExportFileExtension(selectedImg, e.currentTarget.textContent.trim());
                            },
                            options: [
                                "jpg",
                                "jpeg",
                                "png",
                                "webp",
                                "avif",
                                "tiff",
                            ],
                        },
                        {
                            name: "exportImage",
                            inputType: "submit",
                            onChange: () => {
                                const data = exportAllDataForImage(selectedImg);
                                sendMessage({
                                    message: "export",
                                    data: JSON.stringify(data)
                                })
                            },
                        },
                    ],
                },
            ].filter(Boolean) as EditItemProp[]
        );
    }, [sessionData, selectedImg]);
    //#endregion


    useMemo(() => {
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
                >
                    <Grid
                        w="full"
                        h={"full"}

                        templateColumns={isMd ? "1fr 60px" : "1fr"}
                        templateRows={isMd ? "1fr" : "1fr 60px"}
                        gap={4}
                    >
                        <GridItem
                            h={"full"}
                            p={12}
                            display="flex"
                            flexDirection="column"
                            gap={8}
                            w="full"
                            alignItems={"center"}
                            justifyContent={"center"}
                            mx={"auto"}
                            maxW="4xl" >
                            <Button variant={"subtle"} colorPalette={"teal"} onClick={() => {
                                sendMessage({ message: "newSession" });
                                setImgs([]);
                                setSelectedImage(undefined);
                                setSelectedImg(0);
                                setStep(0);
                            }}>
                                <LuPlus />
                                Újrakezdés
                            </Button>
                            {selectedImage && (
                                <Box alignSelf="center">
                                    <Image
                                        src={selectedImage}
                                        alt={`selected-${selectedImg}`}
                                        rounded="md"
                                        maxH="600px"
                                        objectFit="contain"
                                    />
                                </Box>
                            )}

                            {imgs.length > 1 && (
                                <Grid
                                    templateColumns={`repeat(${imgs.length}, minmax(60px, 1fr))`}
                                    gap={4}
                                >
                                    {imgs.map((img, index) => {
                                        const isActive = selectedImg === index;

                                        return (
                                            <GridItem
                                                key={img}
                                                cursor="pointer"
                                                maxH={"200px"}
                                                onClick={() => setSelectedImg(index)}
                                            >
                                                <Box
                                                    borderRadius="md"
                                                    overflow="hidden"
                                                    h={"full"}
                                                    opacity={isActive ? 1 : 0.4}
                                                    transition="opacity 0.2s ease"
                                                    _hover={{ opacity: 0.8 }}
                                                >
                                                    <Image
                                                        src={img}
                                                        alt={`thumbnail-${index}`}
                                                        w="full"
                                                        h="full"
                                                        objectFit="cover"
                                                    />
                                                </Box>
                                            </GridItem>
                                        );
                                    })}
                                </Grid>
                            )}
                        </GridItem>
                        {
                            //#region Sidebar
                        }
                        <GridItem minH={isMd ? "100vh" : "full"} h={"full"} borderStart={"2px solid"} borderColor={"bg.muted"} display={"flex"} flexDirection={isMd ? "column" : "row"}>
                            {
                                editItems.map((item, index) => {
                                    return (
                                        <EditItem key={index} items={item} />
                                    )
                                })
                            }
                        </GridItem>
                    </Grid>
                </Stack>
            )}
        </Box>
    )
}