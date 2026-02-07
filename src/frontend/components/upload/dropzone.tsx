"use client"

import { Box, Button, Code, FileUpload, FileUploadFileChangeDetails, Float, Icon, Stack, useFileUpload, useFileUploadContext, UseFileUploadReturn } from "@chakra-ui/react"
import { LuTrash, LuUpload } from "react-icons/lu"
import { FileChangeDetails } from "@zag-js/file-upload";
import { toaster } from "../ui/toaster";
import { useEffect } from "react";
import { HiUpload } from "react-icons/hi";

const MAX_FILES = 5;
const ACCEPTED_FILES = [
    "image/avif",
    "image/jpeg",
    "image/png",
    "image/tiff",
    "image/webp"
];

const ConditionalDropzone = () => {
    return (
        <FileUpload.Dropzone backgroundColor={"teal.subtle/30"} _hover={{ backgroundColor: "teal.subtle/40" }}>
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
    )
}

const FileUploadList = () => {
    const fileUpload = useFileUploadContext();
    const files = fileUpload.acceptedFiles;

    if (files.length === 0) return null;

    return (
        <FileUpload.ItemGroup
            display="grid"
            gridTemplateColumns="repeat(3, minmax(0, 1fr))"
            gap={3}
        >
            {files.map((file, index) => (
                <FileUpload.Item
                    key={`${file.name}-${index}`}
                    file={file}
                    p={3}
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

                    <Float placement="top-end">
                        <FileUpload.ItemDeleteTrigger
                            boxSize="6"
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
    const fileUpload = useFileUpload({
        maxFiles: MAX_FILES,
        onFileChange(details) {
            console.log(details);
            if (details.rejectedFiles.length > 0) {
                console.log("HIBA");
                toaster.create({
                    description: "Az engedett feltöltési méret: 5 darab",
                    type: "error",
                })
            }
        },
    })

    return (
        <Stack
            w="full"
            maxW={{ base: "md", sm: "xl", md: "50%" }}
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
                <FileUploadList />
            </FileUpload.RootProvider>
        </Stack>
    )
};
