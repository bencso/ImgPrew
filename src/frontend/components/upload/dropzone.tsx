"use client"

import { Box, Button, FileUpload, Float, Icon, Stack, useFileUpload, useFileUploadContext } from "@chakra-ui/react"
import { LuTrash, LuUpload } from "react-icons/lu"
import { toaster } from "../ui/toaster";
import { ServerMessage, useWebsocket } from "@/providers/websocketprovider";
import { RefObject, useEffect } from "react";
import { handleMessage } from "@/websocket/handlers/handleMessage";
import { useWorkSession } from "@/providers/sessionprovider";
import { uploadFile } from "@/websocket/handlers/fileUpload";

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

export const ImageDropZone = ({ ws, sendMessage }: {
    ws: RefObject<WebSocket | null>;
    sendMessage({ message, data }: ServerMessage): void
}) => {
    const { setStep } = useWorkSession();


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


    return (
        <Stack
            maxW={{ base: "md", sm: "xl", lgTo2xl: "2xl" }}
            w={"full"}
            h={"100vh"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            mx={"auto"}
            p={4}
            alignItems={"center"}
        >
            <FileUpload.RootProvider value={fileUpload} w="full" >
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
            <Button w={"full"} as="div" onClick={() => uploadFile({ fileUpload, ws, sendMessage })} colorPalette="teal" variant="surface">
                Tovább
            </Button>
        </Stack>
    )
};
