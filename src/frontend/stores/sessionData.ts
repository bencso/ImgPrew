import { create } from "zustand";
import { SessionStore } from "@/interfaces/interface";
import { immer } from "zustand/middleware/immer";

export const useSessionStore = create<SessionStore>()(
    immer((set, get) => ({
        sessionData: [],
        caption: "",
        setSessionData: (data) => set({ sessionData: data }),
        addImage: () => {
            set((state) => {
                let nextId = 0;
                nextId = state.sessionData.length;
                state.sessionData.push({ id: nextId });
            });
        },
        // ----- EXIF ADATOK -----
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
        // ----- EXIF ADATOK -----
        // ----- CAPTION SAMPLES ADATOK -----
        setCaptionSamplesForImage: (id: number, exif: string[]) => {
            set((state) => {
                const image = state.sessionData.find(image => image.id === id);
                if (image) {
                    image.captionSamples = exif;
                }
            })
        },
        getCaptionSamples: (id: number) => {
            const image = get().sessionData.find(image => image.id === id);
            return image?.captionSamples || [];
        },
        // ----- CAPTION SAMPLES ADATOK -----
    }))
);
