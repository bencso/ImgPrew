"use client"

import { Box, Button, FileUpload, Float, Icon, Stack, useFileUpload, useFileUploadContext } from "@chakra-ui/react"
import { LuEraser, LuTrash, LuUpload } from "react-icons/lu"
import { toaster } from "../ui/toaster";
import { useWebsocket } from "@/providers/websocketprovider";
import { useEffect, useState } from "react";
import { handleMessage } from "@/websocket/handlers/handleMessage";

const MAX_FILES = 5;
const ACCEPTED_FILES = [
    "image/avif",
    "image/jpeg",
    "image/png",
    "image/tiff",
    "image/webp"
];

const FileUploadList = () => {
    const fileUpload = useFileUploadContext();
    const files = fileUpload.acceptedFiles;

    if (files.length === 0) return null;

    return (
        <FileUpload.ItemGroup
            display="grid"
            p={0}
            gridTemplateColumns={{
                smDown: "repeat(1, minmax(0,1fr))",
                smToXl: "repeat(2, minmax(0, 1fr))",
                xl: "repeat(3, minmax(0, 1fr))",
            }}
            gap={3}
        >
            {files.map((file, index) => (
                <FileUpload.Item
                    key={`${file.name}-${index}`}
                    file={file}
                    p={3}
                    w={"full"}
                    borderWidth="1px"
                    borderRadius="md"
                    justifyContent={"center"}
                    position="relative"
                    _hover={{ bg: "bg.muted" }}
                >
                    <Box
                        display="flex"
                        flexDirection={"column"}
                        alignItems="center"
                        w={"100%"}
                        justifyContent={"center"}
                        gap={2}
                    >
                        <FileUpload.ItemPreviewImage
                            userSelect="none"
                            draggable={false}
                            maxH={"100px"}
                            w={"100%"}
                            minH={"100px"}
                            borderRadius={"sm"}
                            h={"full"}
                            objectFit={"cover"}
                        />
                        <FileUpload.ItemName fontSize={"xs"} />
                    </Box>

                    <Float placement="top-end" offset={{
                        mdDown: 4,
                        mdTo2xl: 3,
                    }}>
                        <FileUpload.ItemDeleteTrigger
                            boxSize={{
                                mdDown: "8",
                                mdTo2xl: "6"
                            }}
                            borderRadius="full"
                            bg="teal.border"
                            color="bg.muted"
                            _hover={{ bg: "teal.500", color: "bg.muted" }}
                        >
                            <LuTrash size={14} />
                        </FileUpload.ItemDeleteTrigger>
                    </Float>
                </FileUpload.Item>
            ))}
        </FileUpload.ItemGroup>

    )
}

export const ImageDropZone = () => {
    const { ws, sendMessage } = useWebsocket();

    const fileUpload = useFileUpload({
        maxFiles: MAX_FILES,
        accept: ACCEPTED_FILES.join(","),
        onFileReject(details) {
            console.log(details);
            if (details.files.length > 0) {
                console.log("HIBA");
                toaster.create({
                    title: "Hiba történt feltöltés közben!",
                    description: `Maximum ${MAX_FILES} fájlt tölthetsz fel.`,
                    type: "error",
                });
            }
            return details.files = [];
        },
    })


    useEffect(() => {
        const wscurr = ws.current;
        if (!wscurr) return;

        wscurr.addEventListener("message", handleMessage);

        return () => {
            wscurr.removeEventListener("message", handleMessage);
            if (wscurr.readyState === wscurr.OPEN) {
                wscurr.close();
            }
        };
    }, [ws]);

    const fileSend = async () => {
        var files = fileUpload.acceptedFiles;
        const readFile = (file: File): Promise<ArrayBuffer> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onloadend = () => { };

                reader.onload = () => {
                    if (reader.result instanceof ArrayBuffer) {
                        resolve(reader.result);
                    } else {
                        reject(new Error("Nem ArrayBuffer"));
                    }
                };

                reader.onerror = () => reject(reader.error);
                reader.readAsArrayBuffer(file);
            });
        };

        try {
            const bufferArrays: number[] = [];
            const buffers = await Promise.all(
                files.map(async file => {
                    bufferArrays.push(file.size);
                    return await readFile(file)
                })
            );

            /**EZ MAJD VISSZAADNI TUDJUK A HATÁROKAT */
            const array = bufferArrays.reduce(
                (acc: { start: number; end: number }[], curr) => {
                    const start = acc.length ? acc[acc.length - 1].end : 0;

                    acc.push({
                        start,
                        end: start + curr
                    });

                    return acc;
                },
                []
            );


            console.log(
                array
            );

            const totalLength = buffers.reduce(
                (sum, buf) => sum + buf.byteLength,
                0
            );

            const combined = new Uint8Array(totalLength);
            let offset = 0;

            for (const buffer of buffers) {
                combined.set(new Uint8Array(buffer), offset);
                offset += buffer.byteLength;
            }
            ws.current?.send(JSON.stringify({
                type: "files",
                count: buffers.length,
                totalBytes: totalLength
            }));
            ws.current?.send(combined);
        }
        catch {
            sendMessage({ message: 'error', data: `Hiba történt a fájlok feltöltése közben` });
        }

    }


    return (
        <Stack
            w="full"
            maxW={{ base: "md", sm: "xl", lgTo2xl: "2xl" }}
        >
            <FileUpload.RootProvider value={fileUpload} >
                <FileUpload.HiddenInput />
                <FileUpload.Dropzone w={"full"} backgroundColor={"teal.subtle/30"} transition={"all 0.2s ease-in-out"} cursor={"pointer"} _hover={{ backgroundColor: "teal.subtle/40" }}>
                    <Icon size="2xl" color="teal.fg">
                        <LuUpload />
                    </Icon>
                    <FileUpload.DropzoneContent>
                        <Box>Húzza be a feltölteni kívánt fájlokat</Box>
                        <Box color="fg.muted">{ACCEPTED_FILES.map((file) => {
                            return (file.includes("image/") && file.split("image/")[1]);
                        }).join(", ")}</Box>
                    </FileUpload.DropzoneContent>
                </FileUpload.Dropzone>
                {
                    fileUpload.acceptedFiles.length > 1 && <Button as="div" smDown={{ w: "full" }} gap={3} onClick={() => fileUpload.clearFiles()} colorPalette="blackAlpha" variant="outline">
                        Minden törlés
                    </Button>
                }
                <Box overflowY={"scroll"}
                    scrollbar={"hidden"}
                    maxH={350} w={"full"} >
                    <FileUploadList />
                </Box>
            </FileUpload.RootProvider>
            <Button as="div" onClick={fileSend} colorPalette="teal" variant="surface">
                Tovább
            </Button>
        </Stack>
    )
};
