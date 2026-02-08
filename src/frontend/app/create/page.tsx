"use client";

import { ImageDropZone } from "@/components/upload/dropzone";
import { useWorkSession } from "@/providers/sessionprovider";
import { useWebsocket, WebsocketProvider } from "@/providers/websocketprovider";
import { handleMessage } from "@/websocket/handlers/handleMessage";
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react"
import { useEffect } from "react";

export default function Page() {
    const { step, imgs, setStep, setImgs } = useWorkSession();
    const { ws, sendMessage } = useWebsocket();

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
        <>
            {
                step === 0 && <ImageDropZone ws={ws} sendMessage={sendMessage} />
            }
            {
                step === 1 && <Box>
                    <Grid templateColumns={`repeat(${imgs.length}, 1fr)`} justifyContent={"center"} gap="6">
                        {
                            imgs.map((img, index) => {
                                return (
                                    <GridItem key={index}>
                                        <Image maxH={100} maxW={150} h={"full"} w={"full"} rounded="md" src={img} alt={index.toString()} />
                                    </GridItem>
                                )
                            })
                        }
                    </Grid>

                </Box>
            }
        </>
    )
}