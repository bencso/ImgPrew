"use client";

import { ImageDropZone } from "@/components/upload/dropzone";
import { useWorkSession } from "@/providers/sessionprovider";
import { useWebsocket } from "@/providers/websocketprovider";
import { handleMessage } from "@/websocket/handlers/handleMessage";
import { Box, Grid, GridItem, Stack } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { LuCrop } from "react-icons/lu";

{
    //TODO: Majd megoldani a 100svh-s dolgokat! :D 
}

export default function Page() {
    const { step, imgs, setStep, setImgs, setSelectedImg, selectedImg } = useWorkSession();
    const { ws, sendMessage } = useWebsocket();
    const [selectedImage, setSelectedImage] = useState<string>();

    useEffect(() => {
        setSelectedImage(imgs[selectedImg]);
        console.log(selectedImage);
    }, [selectedImg, imgs]);

    useEffect(() => {
        const wscurr = ws.current;
        if (!wscurr) return;

        wscurr.addEventListener("message", (event) => {
            handleMessage(event, setStep, setImgs)
        });

        return () => {
            wscurr.removeEventListener("message", (event) => {
                handleMessage(event, setStep, setImgs)
            });
        };
    }, [ws]);

    {
        /*TODO: Megcsinálni a betöltödést meg a skeletonokat stb.*/
    }
    return (
        <Box h={"full"} minH={"full"}>
            {step === 0 && (
                <ImageDropZone ws={ws} sendMessage={sendMessage} />
            )}

            {step === 1 && (
                <Stack
                    maxW={"full"}
                    w={"full"}
                    display={"flex"}
                    flexDirection={"column"}
                    mx={"auto"}
                >
                    <Grid w={"full"} h={"100dvh"} templateColumns="1fr 60px" gap={4}>
                        <GridItem
                            h="full"
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
                                                onClick={() => setSelectedImg(index)}
                                            >
                                                <Box
                                                    borderRadius="md"
                                                    overflow="hidden"
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
                        <GridItem borderStart={"2px solid"} borderColor={"bg.muted"} display={"flex"}>
                            <Box
                                p="4"
                                display={"flex"}
                                borderBottomWidth={"1px"}
                                borderColor="border.disabled"
                                textDecoration={"none"}
                                alignItems={"center"}
                                gap={4}
                                borderRightWidth="2px"
                                borderLeftColor={"border.disabled"}
                                borderRadius={0}
                                color="fg.muted"
                                _hover={{ bg: "bg.muted" }}
                                _currentPage={{
                                    borderLeftColor: "teal.fg",
                                    bg: "bg.emphasized",
                                    color: "fg.default",
                                    "& svg": { color: "teal.fg" },
                                }}
                            >
                                <LuCrop />
                            </Box>
                        </GridItem>
                    </Grid>
                </Stack>
            )}
        </Box>

    )
}