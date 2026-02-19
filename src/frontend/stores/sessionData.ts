import { create } from "zustand";
import { SessionStore } from "@/interfaces/interface";
import { immer } from "zustand/middleware/immer";

export const useSessionStore = create<SessionStore>()(
    immer((set, get) => ({
        sessionData: [],
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
        getSelectedImageExif: (id) => {
            const image = get().sessionData.find(image => image.id === id);
            return image?.exifDatas || [];
        },
        // ----- EXIF ADATOK -----
    }))
);
