import { create } from "zustand";
import { SessionStore } from "@/interfaces/interface";
import { immer } from "zustand/middleware/immer";
import { RefObject } from "react";
import { DraggableImageEvent } from "@/interfaces/draggableElement";

export const useSessionStore = create<SessionStore>()(
  immer((set, get) => ({
    //#region ADATOK
    sessionData: [],
    setSessionData: (data) => set({ sessionData: data }),
    clearSessionData: () => set({ sessionData: [] }),
    addImage: () => {
      set((state) => {
        let nextId = 0;
        nextId = state.sessionData.length;
        state.sessionData.push({ id: nextId, exportFileExtension: "jpg" });
        return state;
      });
    },
    //#endregion
    //#region ----- EXIF ADATOK -----
    setExifDataForImage: (id: number, exif: string[]) => {
      set((state) => {
        const image = state.sessionData.find((image) => image.id === id);
        if (image) {
          image.exifDatas = exif;
        }
      });
    },
    getSelectedImageExif: (id: number) => {
      const image = get().sessionData.find((image) => image.id === id);
      return image?.exifDatas || [];
    },
    //#endregion ----- EXIF ADATOK -----
    //#region ----- CAPTION SAMPLES ADATOK -----
    setCaptionSamplesForImage: (id: number, captionSamples: string[]) => {
      set((state) => {
        const image = state.sessionData.find((image) => image.id === id);
        if (image) {
          image.captionSamples = captionSamples;
        }
      });
    },
    getCaptionSamples: (id: number) => {
      const image = get().sessionData.find((image) => image.id === id);
      return image?.captionSamples || [];
    },
    //#endregion ----- CAPTION SAMPLES ADATOK -----
    //#region ----- CAPTION ADATOK -----
    setCaptionForImage: (id: number, caption: string) => {
      set((state) => {
        const image = state.sessionData.find((image) => image.id === id);
        if (image) {
          image.caption = caption;
        }
      });
    },
    getCaptionForImage: (id: number) => {
      const image = get().sessionData.find((image) => image.id === id);
      return image?.caption || "";
    },
    //#endregion ----- CAPTION ADATOK -----
    //#region ----- EXPORT FILE EXTENSION ADATOK -----
    setExportFileExtension: (id: number, extension: string) => {
      set((state) => {
        const image = state.sessionData.find((image) => image.id === id);
        if (image) {
          image.exportFileExtension = extension;
        }
      });
    },
    getExportFileExtension: (id: number) => {
      const image = get().sessionData.find((image) => image.id === id);
      return image?.exportFileExtension || "";
    },
    //#region ----- TEXT  ADATOK -----
    addTexts: (id: number, text: string) => {
      set((state) => {
        const image = state.sessionData.find((image) => image.id === id);
        if (image) {
          const element = new DraggableImageEvent(text, { x: 0, y: 0 });
          if (!image.texts) image.texts = [];
          image.texts?.push(element);
        }
      });
    },
    getTexts: (id: number) => {
      const image = get().sessionData.find((image) => image.id === id);
      return image?.texts || [];
    },
    //#endregion ----- TEXT  ADATOK -----
    //#region ----- EXPORT -----
    exportAllDataForImage(id: number) {
      const image = get().sessionData.find((image) => image.id === id);
      if (image) {
        return {
          caption: image.caption,
          fileExtension: image.exportFileExtension,
        };
      }
    },
    //#region ----- HISTOGRAM ADATOK -----
    convertHistogram(canvasRef: RefObject<HTMLCanvasElement | null>, img: any) {
      if (!canvasRef.current) {
        canvasRef.current = document.createElement("canvas");
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const size = 256;
      canvas.width = size;
      canvas.height = size;

      ctx.imageSmoothingEnabled = false;
      const image = new Image();
      image.src = img;

      image.onload = () => {
        ctx.drawImage(image, 0, 0, size, size);
      };

      const imageData = ctx.getImageData(0, 0, size, size).data;

      const histogram = new Array(256).fill(0);

      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];

        const lum = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);

        histogram[lum]++;
      }

      return histogram;
    },
    //#endregion
    //#region ----- FILTERS -----
    editFilters(id: number, filterName: string, value: string | number) {
      set((state) => {
        const image = state.sessionData.find((image) => image.id === id);

        if (!image) return;

        if (!image.filters) {
          image.filters = [];
        }

        const filter = image.filters.find((f) => f.name === filterName);

        if (filter) {
          filter.value = Number(value);
        } else {
          image.filters.push({
            name: filterName,
            value: Number(value),
          });
        }
      });
    },
    getFilterValue(id: number, filterName: string) {
      return (
        get()
          .sessionData.find((image) => image.id === id)
          ?.filters?.find((f) => f.name === filterName)?.value ?? null
      );
    },
    //#endregion
  })),
);
