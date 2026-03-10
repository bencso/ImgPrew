import { EditItemProp } from "@/interfaces/interface";
import { useWorkSession } from "@/providers/sessionprovider";
import { useWebsocket } from "@/providers/websocketprovider";
import { useSessionStore } from "@/stores/sessionData";
import { SliderValueChangeDetails } from "@chakra-ui/react"
import { useMemo, useState } from "react";
import { EditItem } from "./edititem";
import { LuCaptions, LuContrast, LuFilter, LuImageDown, LuSun } from "react-icons/lu";
import CaptionBlock from "./caption/captionBlock";
import Histogram from "./histogram";


function isSliderValueChangeDetails(e: any): e is SliderValueChangeDetails {
    return e && typeof e.value === "number";
}

const sidebarElements = (exportAllDataForImage: any, setExportFileExtension: any, sendMessage: any, selectedImg: any, selectedExtension: any, editFilters: any, getFilterValue: any) => {
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
        // {
        //     function: "lut_apply",
        //     icon: <LuFileImage />,
        //     inputs: [
        //         {
        //             name: "LUT fájl feltöltés",
        //             inputType: "file",
        //             onChange: (e: any) => {
        //                 console.log(e);
        //             },
        //             options: [".cube"]
        //         },
        //         {
        //             name: "LUT mentés",
        //             inputType: "submit",
        //         },
        //     ],
        // },
        {
            function: "filters",
            icon: <LuFilter />,
            inputs: [
                {
                    name: "Histogram",
                    inputType: "customElement",
                    options: <Histogram />
                },
                {
                    name: "Fényerő",
                    icon: <LuSun />,
                    min: -50,
                    max: 50,
                    inputType: "slider",
                    defaultValue: getFilterValue(selectedImg, "brightness") || 0,
                    onChange: (e: SliderValueChangeDetails) => {
                        editFilters(selectedImg, "brightness", e.value[0]);
                    },
                    clearFunc: ()=>{
                        editFilters(selectedImg, "brightness", 0)
                    }
                },
                {
                    name: "Kontraszt",
                    icon: <LuContrast />,
                    min: -50,
                    max: 50,
                    inputType: "slider",
                    defaultValue: getFilterValue(selectedImg, "contrast") || 0,
                    onChange: (e: SliderValueChangeDetails) => {
                        editFilters(selectedImg, "contrast", e.value[0]);
                    },
                    clearFunc: ()=>{
                        editFilters(selectedImg, "contrast", 0)
                    }
                },
            ]
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
    const { editFilters, getFilterValue } = useSessionStore();

    const { sendMessage } = useWebsocket();
    const { sessionData, setExportFileExtension, exportAllDataForImage, getExportFileExtension } = useSessionStore();
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
            sidebarElements(exportAllDataForImage, setExportFileExtension, sendMessage, selectedImg, selectedExtension, editFilters, getFilterValue)
        );
    }, [sessionData, selectedImg]);
    //#endregion
    return (
        editItems.map((item, index) => {
            return (
                <EditItem key={index} items={item} />
            )
        })

    )
}