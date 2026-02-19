"use client";

import { EditItem } from "@/components/editing/edititem";
import { ImageDropZone } from "@/components/upload/dropzone";
import { EditItemProp } from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useWebsocket } from "@/providers/websocketprovider";
import { useSessionStore } from "@/stores/sessionData";
import { handleMessage } from "@/websocket/handlers/handleMessage";
import { Box, Grid, GridItem, Stack, useBreakpointValue } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { LuAArrowDown, LuTags } from "react-icons/lu";

export default function Page() {
    const { step, imgs, setStep, setImgs, setSelectedImg, selectedImg, addFunction } = useWorkSession();
    const [selectedImage, setSelectedImage] = useState<string>();
    const [editItems, setEditItems] = useState<EditItemProp[]>([]);
    const { ws, sendMessage } = useWebsocket();
    const { getSelectedImageExif, sessionData, setExifDataForImage, addImage } = useSessionStore();

    const isMd = useBreakpointValue(
        { base: false, sm: false, md: false, lg: true, xl: true },
        { ssr: false, fallback: "md" }
    );

    useEffect(() => {
        editItems.map((item) => {
            if (item.inputs) {
                addFunction(item.function, item.inputs);
            }
        });
    }, []);

    useEffect(() => {
        const exif = getSelectedImageExif(selectedImg);
        setEditItems(
            [
                exif.length > 0 && {
                    function: "get_exif",
                    icon: <LuTags />,
                    inputs: [
                        {
                            name: "Exif adatok",
                            inputType: "select",
                            options: exif,
                        },
                    ],
                },
            ].filter(Boolean) as EditItemProp[]
        );


    }, [sessionData, selectedImg]);

    useEffect(() => {
        setSelectedImage(imgs[selectedImg]);
    }, [selectedImg, imgs]);


    useEffect(() => {
        const wscurr = ws.current;
        if (!wscurr) return;

        const messageHandler = (event: MessageEvent) => {
            handleMessage(event, setStep, setImgs, setExifDataForImage, addImage);
        };

        wscurr.addEventListener("message", messageHandler);

        return () => {
            wscurr.removeEventListener("message", messageHandler);
        };
    }, [ws]);

    return (
        <Box h={"full"} w={"full"} minH={isMd ? "100vh" : "full"} >
            {step === 0 && (
                <ImageDropZone ws={ws} sendMessage={sendMessage} />
            )}

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