import { v4 as uuidv4 } from "uuid";
import { immer } from "zustand/middleware/immer";
import { RefObject } from "react";
import { DraggableImageEvent, SessionStore } from "@/interfaces/interface";
import { createWithEqualityFn } from "zustand/traditional";
import { randomUUID, UUID } from "crypto";

//TODO: Get-es függvények kicserélése: useSessionStore((state)=> ....)-re sokkal és akkor akár shallow-wal
export const useSessionStore = createWithEqualityFn<SessionStore>()(
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

    //#region "Copyright" kép
    uploadCopyrightImage: (id: number, blob: ArrayBuffer) =>
      set((state) => {
        const image = state.sessionData.find((img) => img.id === id);

        if (image) image.copyrightImage = { blob };
      }),
    clearCopyrightImage: (id: number) =>
      set((state) => {
        const image = state.sessionData.find((img) => img.id === id);

        if (image) image.copyrightImage = {};
      }),
    setCopyrightImagePosition: (
      id: number,
      position: { x: number; y: number },
    ) =>
      set((state) => {
        const image = state.sessionData.find((img) => img.id === id);

        if (image)
          image.copyrightImage = {
            ...image.copyrightImage,
            position: position,
          };
      }),
    //#region KÉP MÉRETEK
    setImageSize: (id: number, width: number, height: number) =>
      set((state) => {
        const image = state.sessionData.find((img) => img.id === id);
        if (image) image.dimesions = { width, height };
      }),
    getImageSize: (id: number) => {
      return get().sessionData.find((img) => img.id === id)?.dimesions;
    },
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

          const textId = uuidv4();

          const element: DraggableImageEvent = {
            id: textId,
            text,
            position: { x: 0, y: 0 },
            enabled: true,
            fontSize: 20,
            fontFamily: "Inter",
            fontWeight: 500,
            color: "#ffff",
          };

          image.texts.push(element);
        }
      }),
    deleteText: (imageId: number, textId: string) => {
      set((state) => {
        const image = state.sessionData.find((img) => img.id === imageId);
        if (!image?.texts) return;

        const removedText = image.texts.filter((text) => text.id != textId);
        image.texts = removedText.length > 0 ? [...removedText] : [];
      });
    },
    getTexts: (imageId: number) => {
      return get().sessionData.find((img) => img.id === imageId)?.texts || [];
    },
    setTextFontSize: (imageId: number, textId: string, fontSize: number) =>
      set((state) => {
        const image = state.sessionData.find((img) => img.id === imageId);
        if (!image || !image.texts) return;

        const textIndex = image.texts.findIndex((text) => text.id === textId);
        if (textIndex === -1) return;

        image.texts = [
          ...image.texts.slice(0, textIndex),
          { ...image.texts[textIndex], fontSize },
          ...image.texts.slice(textIndex + 1),
        ];
      }),
    setTextFontWeight: (imageId: number, textId: string, fontWeight: number) =>
      set((state) => {
        const image = state.sessionData.find((img) => img.id === imageId);
        if (!image || !image.texts) return;

        const textIndex = image.texts.findIndex((text) => text.id === textId);
        if (textIndex === -1) return;

        image.texts = [
          ...image.texts.slice(0, textIndex),
          { ...image.texts[textIndex], fontWeight },
          ...image.texts.slice(textIndex + 1),
        ];
      }),
    setTextColor: (imageId: number, textId: string, color: string) =>
      set((state) => {
        const image = state.sessionData.find((img) => img.id === imageId);
        if (!image || !image.texts) return;

        const textIndex = image.texts.findIndex((text) => text.id === textId);
        if (textIndex === -1) return;

        image.texts = [
          ...image.texts.slice(0, textIndex),
          { ...image.texts[textIndex], color },
          ...image.texts.slice(textIndex + 1),
        ];
      }),
    setTextPosition: (
      imageId: number,
      textId: string,
      position: { x: number; y: number },
    ) =>
      set((state) => {
        const image = state.sessionData.find((img) => img.id === imageId);
        if (!image || !image.texts) return;

        const textIndex = image.texts.findIndex((text) => text.id === textId);
        if (textIndex === -1) return;

        image.texts = [
          ...image.texts.slice(0, textIndex),
          { ...image.texts[textIndex], position },
          ...image.texts.slice(textIndex + 1),
        ];
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
    getFilters: (id: number) => {
      const img = get().sessionData.find((img) => img.id === id);

      return {
        brightness:
          Number(img?.filters?.find((f) => f.name === "brightness")?.value) ||
          0,
        contrast:
          Number(img?.filters?.find((f) => f.name === "contrast")?.value) || 0,
        saturation:
          Number(img?.filters?.find((f) => f.name === "saturation")?.value) ||
          0,
        exposure:
          Number(img?.filters?.find((f) => f.name === "exposure")?.value) || 0,
      };
    },
    //#endregion
  })),
);
