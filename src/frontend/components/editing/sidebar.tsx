import { EditItemProp } from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useWebsocket } from "@/providers/websocketprovider";
import { useSessionStore } from "@/stores/sessionData";
import { GridItem, useBreakpointValue } from "@chakra-ui/react"
import { useMemo, useState } from "react";
import { EditItem } from "./edititem";
import { LuCaptions, LuFileImage, LuImageDown } from "react-icons/lu";
import CaptionBlock from "./caption/captionBlock";

const sidebarElements = (exportAllDataForImage: any, setExportFileExtension: any, sendMessage: any, selectedImg: any, selectedExtension: any) => {
    return ([
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
            function: "lut_apply",
            icon: <LuFileImage />,
            inputs: [
                {
                    name: "LUT fájl feltöltés",
                    inputType: "file",
                    onChange: (e: any) => {
                        console.log(e);
                    },
                    options: [".cube"]
                },
                {
                    name: "LUT mentés",
                    inputType: "submit",
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
                    name: "Kép exportálása",
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
    ].filter(Boolean) as EditItemProp[]);
}


export default function SideBar() {
    //#region contextek
    const { selectedImg, addFunction } = useWorkSession();
    const [editItems, setEditItems] = useState<EditItemProp[]>([]);

    const { sendMessage } = useWebsocket();
    const { sessionData, setExportFileExtension, exportAllDataForImage, getExportFileExtension } = useSessionStore();
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
            sidebarElements(exportAllDataForImage, setExportFileExtension, sendMessage, selectedImg, selectedExtension)
        );
    }, [sessionData, selectedImg]);
    //#endregion
    return (
        < GridItem minH={isMd ? "100vh" : "full"} h={"full"} borderStart={"2px solid"} borderColor={"bg.muted"} display={"flex"} flexDirection={isMd ? "column" : "row"} >
            {
                editItems.map((item, index) => {
                    return (
                        <EditItem key={index} items={item} />
                    )
                })
            }
        </GridItem >
    )
}