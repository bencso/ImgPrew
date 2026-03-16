import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { RefObject } from "react";
import { SessionStore } from "@/interfaces/interface";
import { DraggableImageEvent } from "@/interfaces/draggableElement";

export const useSessionStore = create<SessionStore>()(
  immer((set, get) => ({
    //#region ADATOK
    sessionData: [],
    setSessionData: (data) =>
      set((state) => {
        state.sessionData = data;
      }),
    clearSessionData: () =>
      set((state) => {
        state.sessionData = [];
      }),
    addImage: () =>
      set((state) => {
        const nextId = state.sessionData.length;
        state.sessionData.push({ id: nextId, exportFileExtension: "jpg" });
      }),
    //#endregion

    //#region EXIF ADATOK
    setExifDataForImage: (id: number, exif: string[]) =>
      set((state) => {
        const image = state.sessionData.find((img) => img.id === id);
        if (image) image.exifDatas = exif;
      }),
    getSelectedImageExif: (id: number) => {
      return get().sessionData.find((img) => img.id === id)?.exifDatas || [];
    },
    //#endregion

    //#region CAPTION SAMPLES
    setCaptionSamplesForImage: (id: number, captionSamples: string[]) =>
      set((state) => {
        const image = state.sessionData.find((img) => img.id === id);
        if (image) image.captionSamples = captionSamples;
      }),
    getCaptionSamples: (id: number) => {
      return (
        get().sessionData.find((img) => img.id === id)?.captionSamples || []
      );
    },
    //#endregion

    //#region CAPTION
    setCaptionForImage: (id: number, caption: string) =>
      set((state) => {
        const image = state.sessionData.find((img) => img.id === id);
        if (image) image.caption = caption;
      }),
    getCaptionForImage: (id: number) => {
      return get().sessionData.find((img) => img.id === id)?.caption || "";
    },
    //#endregion

    //#region EXPORT FILE EXTENSION
    setExportFileExtension: (id: number, extension: string) =>
      set((state) => {
        const image = state.sessionData.find((img) => img.id === id);
        if (image) image.exportFileExtension = extension;
      }),
    getExportFileExtension: (id: number) => {
      return (
        get().sessionData.find((img) => img.id === id)?.exportFileExtension ||
        ""
      );
    },
    //#endregion

    //#region TEXT
    addTexts: (imageId: number, text: string) =>
      set((state) => {
        const image = state.sessionData.find((img) => img.id === imageId);
        if (image) {
          if (!image.texts) image.texts = [];
          const textId = image.texts.length;
          const element = new DraggableImageEvent(textId, text, { x: 0, y: 0 });
          image.texts.push(element);
        }
      }),
    getTexts: (imageId: number) => {
      return get().sessionData.find((img) => img.id === imageId)?.texts || [];
    },
    setTextFontSize: (imageId: number, textId: number, fontSize: number) =>
      set((state) => {
        const image = state.sessionData.find((img) => img.id === imageId);
        if (image?.texts) {
          const text = image.texts.find((t) => t.id === textId);
          if (text) {
            text.textStyles.fontSize = fontSize;
          }
        }
      }),
    setTextFontWeight: (imageId: number, textId: number, fontWeight: number) =>
      set((state) => {
        const image = state.sessionData.find((img) => img.id === imageId);
        if (image?.texts) {
          const text = image.texts.find((t) => t.id === textId);
          if (text) {
            text.textStyles.fontWeight = fontWeight;
          }
        }
      }),
    //#endregion

    //#region EXPORT
    exportAllDataForImage: (id: number) => {
      const image = get().sessionData.find((img) => img.id === id);
      if (image) {
        return {
          caption: image.caption,
          fileExtension: image.exportFileExtension,
        };
      }
      return null;
    },
    //#endregion

    //#region HISTOGRAM
    convertHistogram: (
      canvasRef: RefObject<HTMLCanvasElement | null>,
      imgSrc: string,
    ) => {
      if (!canvasRef.current)
        canvasRef.current = document.createElement("canvas");
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return [];

      const size = 256;
      canvas.width = size;
      canvas.height = size;
      ctx.imageSmoothingEnabled = false;

      const image = new Image();
      image.src = imgSrc;

      return new Promise<number[]>((resolve) => {
        image.onload = () => {
          ctx.drawImage(image, 0, 0, size, size);
          const data = ctx.getImageData(0, 0, size, size).data;
          const histogram = new Array(256).fill(0);
          for (let i = 0; i < data.length; i += 4) {
            const lum = Math.round(
              0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2],
            );
            histogram[lum]++;
          }
          resolve(histogram);
        };
      });
    },
    //#endregion

    //#region FILTERS
    editFilters: (id: number, filterName: string, value: string | number) =>
      set((state) => {
        const image = state.sessionData.find((img) => img.id === id);
        if (!image) return;
        if (!image.filters) image.filters = [];
        const filter = image.filters.find((f) => f.name === filterName);
        if (filter) filter.value = Number(value);
        else image.filters.push({ name: filterName, value: Number(value) });
      }),
    getFilterValue: (id: number, filterName: string) => {
      return (
        get()
          .sessionData.find((img) => img.id === id)
          ?.filters?.find((f) => f.name === filterName)?.value ?? null
      );
    },
    //#endregion
  })),
);
