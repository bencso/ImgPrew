"use client";

import CaptionBlock from "@/components/editing/caption/captionBlock";
import { EditItem } from "@/components/editing/edititem";
import { ImageDropZone } from "@/components/upload/dropzone";
import { EditItemProp } from "@/interfaces/interface";
import { useKeyboardShortcut } from "@/providers/keyboardShortcut";
import { useWorkSession } from "@/providers/sessionprovider";
import { useWebsocket } from "@/providers/websocketprovider";
import { useSessionStore } from "@/stores/sessionData";
import { handleMessage } from "@/websocket/handlers/handleMessage";
import { Box, Button, Flex, Grid, GridItem, Kbd, Separator, Stack, useBreakpointValue } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { LuCaptions, LuImageDown, LuPlus } from "react-icons/lu";

export default function Page() {
    //#region contextek
    const { step, imgs, setStep, setImgs, setSelectedImg, selectedImg, addFunction } = useWorkSession();
    const [selectedImage, setSelectedImage] = useState<string>();
    const [editItems, setEditItems] = useState<EditItemProp[]>([]);
    const { ws, sendMessage } = useWebsocket();
    const { sessionData, setExifDataForImage, setCaptionSamplesForImage, addImage, setExportFileExtension, exportAllDataForImage, getExportFileExtension } = useSessionStore();
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
        const selectedExtension = getExportFileExtension(selectedImg);
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
                            defaultValue: selectedExtension,
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

    //#region SHORTCUTS
    useKeyboardShortcut({
        key: "ArrowLeft",
        onKeyPressed: () => {
            if (step === 1) {
                if (selectedImg - 1 >= 0) {
                    setSelectedImg(selectedImg - 1);
                }
            }
        },
    });

    useKeyboardShortcut({
        key: "ArrowRight",
        onKeyPressed: () => {
            if (step === 1) {
                if (selectedImg + 1 < imgs.length) {
                    setSelectedImg(selectedImg + 1);
                }
            }
        },
    });
    //#endregion

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
                    >
                        <GridItem
                            h={"full"}
                            display="flex"
                            flexDirection="column"
                            gap={8}
                            w="full"
                        >
                            <Grid h={"full"} w={"full"}>
                                <GridItem p={12} gap={12} display="flex"
                                    flexDirection="column" justifyContent={"center"} alignItems={"center"}>
                                    <Button w={"fit"} variant={"subtle"} colorPalette={"teal"} onClick={() => {
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
                                        <Box alignSelf="center" minH={"400px"} maxH="600px">
                                            <Image
                                                src={selectedImage}
                                                alt={`selected-${selectedImg}`}
                                                rounded="md"
                                                h={"full"}
                                                objectFit="contain"
                                            />
                                        </Box>
                                    )}
                                </GridItem>
                                {imgs.length > 1 && <GridItem borderTop={"1px solid"} bg={"bg.subtle"} borderColor={"bg.muted"} w={"full"} h={"full"} alignItems={"center"} gap={4} display={"flex"} flexDir={"column"}>
                                    {
                                        //#region billentyűzet kbd nyilak
                                    }
                                    {
                                        isMd && imgs.length > 1 && (
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                gap={6}
                                                fontSize="sm"
                                                color="fg.muted"
                                                bg={"bg"}
                                                p={2}
                                                px={6}
                                                borderBottomEndRadius={"lg"}
                                                borderBottomStartRadius={"lg"}
                                            >
                                                <Box display="flex" justifyContent={"center"} alignItems="center" gap={4}>
                                                    <Kbd>←</Kbd>
                                                    <Box>Előző</Box>
                                                </Box>
                                                <Separator orientation={"vertical"} w={1} h={"full"} />
                                                <Box display="flex" justifyContent={"center"} alignItems="center" gap={4}>
                                                    <Box>Következő</Box>
                                                    <Kbd>→</Kbd>
                                                </Box>
                                            </Box>
                                        )
                                    }
                                    {
                                        //#endregion
                                    }
                                    {imgs.length > 1 && (
                                        <Flex
                                            gap={4}
                                            justifyContent={"center"}
                                        >
                                            {imgs.map((img, index) => {
                                                const isActive = selectedImg === index;

                                                return (
                                                    <Box
                                                        key={img}
                                                        cursor="pointer"
                                                        minH={"100px"}
                                                        minW={"100px"}
                                                        maxH={"100px"}
                                                        maxW={"100px"}
                                                        w={"full"}
                                                        h={"full"}
                                                        onClick={() => setSelectedImg(index)}
                                                    >
                                                        <Box
                                                            borderRadius="md"
                                                            overflow="hidden"
                                                            h={"full"}
                                                            w={"full"}
                                                            opacity={isActive ? 1 : 0.4}
                                                            transition="opacity 0.2s ease"
                                                            _hover={{ opacity: 0.8 }}
                                                        >
                                                            <Image
                                                                src={img}
                                                                alt={`thumbnail-${index}`}
                                                                w="full"
                                                                h="full"
                                                                bg={"bg.muted"}
                                                                objectFit="cover"
                                                            />
                                                        </Box>
                                                    </Box>
                                                );
                                            })}
                                        </Flex>
                                    )}
                                </GridItem>
                                }
                            </Grid>
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