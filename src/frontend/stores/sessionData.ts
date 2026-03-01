import { create } from "zustand";
import { SessionStore } from "@/interfaces/interface";
import { immer } from "zustand/middleware/immer";

export const useSessionStore = create<SessionStore>()(
    immer((set, get) => ({
        //#region ADATOK
        sessionData: [],
        setSessionData: (data) => set({ sessionData: data }),
        addImage: () => {
            set((state) => {
                let nextId = 0;
                nextId = state.sessionData.length;
                state.sessionData.push({ id: nextId, exportFileExtension: "jpg" });
            });
        },
        //#endregion
        //#region ----- EXIF ADATOK -----
        setExifDataForImage: (id: number, exif: string[]) => {
            set((state) => {
                const image = state.sessionData.find(image => image.id === id);
                if (image) {
                    image.exifDatas = exif;
                }
            })
        },
        getSelectedImageExif: (id: number) => {
            const image = get().sessionData.find(image => image.id === id);
            return image?.exifDatas || [];
        },
        //#endregion ----- EXIF ADATOK -----
        //#region ----- CAPTION SAMPLES ADATOK -----
        setCaptionSamplesForImage: (id: number, captionSamples: string[]) => {
            set((state) => {
                const image = state.sessionData.find(image => image.id === id);
                if (image) {
                    image.captionSamples = captionSamples;
                }
            })
        },
        getCaptionSamples: (id: number) => {
            const image = get().sessionData.find(image => image.id === id);
            return image?.captionSamples || [];
        },
        //#endregion ----- CAPTION SAMPLES ADATOK -----
        //#region ----- CAPTION ADATOK -----
        setCaptionForImage: (id: number, caption: string) => {
            set((state) => {
                const image = state.sessionData.find(image => image.id === id);
                if (image) {
                    image.caption = caption;
                }
            })
        },
        getCaptionForImage: (id: number) => {
            const image = get().sessionData.find(image => image.id === id);
            return image?.caption ||"";
        },
        //#endregion ----- CAPTION ADATOK -----
        //#region ----- EXPORT FILE EXTENSION ADATOK -----
        setExportFileExtension: (id: number, extension: string) => {
            set((state) => {
                const image = state.sessionData.find(image => image.id === id);
                if (image) {
                    image.exportFileExtension = extension;
                }
            })
        },
        getExportFileExtension: (id: number) => {
            const image = get().sessionData.find(image => image.id === id);
            return image?.exportFileExtension || "";
        },
        //#endregion ----- EXPORT FILE EXTENSION ADATOK -----
        //#region ----- EXPORT -----
        exportAllDataForImage(id: number) {
            const image = get().sessionData.find(image => image.id === id);
            if (image) {
                return {
                    caption: image.caption,
                    fileExtension: image.exportFileExtension
                };
            }
        }
    }))
);
