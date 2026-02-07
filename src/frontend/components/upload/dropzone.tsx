"use client"

import { Box, FileUpload, Icon, useFileUploadContext } from "@chakra-ui/react"
import { LuUpload } from "react-icons/lu"

const MAX_FILES = 5

const ConditionalDropzone = () => {
    const fileUpload = useFileUploadContext()
    const acceptedFiles = fileUpload.acceptedFiles

    if (acceptedFiles.length >= MAX_FILES) {
        return null
    }

    return (
        <FileUpload.Dropzone backgroundColor={"teal.subtle/30"} transition={"all 0.2s ease-in-out"} cursor={"pointer"} _hover={{backgroundColor:"teal.subtle/40"}}>
            <Icon size="md" color="teal.fg">
                <LuUpload />
            </Icon>
            <FileUpload.DropzoneContent>
                <Box>Húzza ide a fájlokat a feltöltéshez</Box>
                <Box color="fg.muted">
                    Maximum {MAX_FILES - acceptedFiles.length} fájl feltöltése engedélyezett
                </Box>
            </FileUpload.DropzoneContent>
        </FileUpload.Dropzone>
    )
}


export const ImageDropZone = () => {
    return (
        <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={MAX_FILES}>
            <FileUpload.HiddenInput />
            <ConditionalDropzone />
            <FileUpload.List clearable />
        </FileUpload.Root>
    )
}
