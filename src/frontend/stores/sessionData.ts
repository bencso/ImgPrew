import { minMaxValidation } from "@/helper/errorHelper";
import { generateHald } from "@/handlers/lut/lutFunctions";
import {
  CropBox,
  CustomImage,
  DraggableImageEvent,
  SessionStore,
  XPositions,
  YPositions,
} from "@/interfaces/interface";
import { ColorMapFilter } from "pixi-filters";
import { Container, Sprite, Texture } from "pixi.js";
import { RefObject } from "react";
import { v4 as uuidv4 } from "uuid";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";
import { getImageSize } from "@/helper/sizes/getImageSize";
import { Points } from "@/interfaces/mask.interface";

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
    addImage: (blob: string, exifData?: string[], captionSamples?: string[]) =>
      set((state) => {
        const nextId = state.sessionData.length;

        const hald = generateHald(64);

        if (hald instanceof HTMLCanvasElement !== true) return null;
        const haldTexture = Texture.from(hald);
        const haldSprite = new Sprite(haldTexture);

        const contentContainer = new Container();

        const sessionData = {
          id: nextId,
          blob: blob,
          expandMode: "no",
          expandBackground: "#ffffff",
          box: {
            x: null,
            y: null,
            height: null,
            width: null,
          },
          cropSave: false,
          lut: null,
          exportSettings: {
            fileExtension: "jpg",
            haldImage: undefined,
          },
          haldSprite: haldSprite,
          masks: [],
          maskContainer: contentContainer,
        } as CustomImage;

        if (exifData) sessionData.exifDatas = exifData;
        if (captionSamples) sessionData.captionSamples = captionSamples;
        state.sessionData.push(sessionData);
      }),
    //#endregion

    //#region "Copyright" kép
    uploadCopyrightImage: async (id: number, blob: ArrayBuffer) => {
      const blobConvert = new Blob([blob], { type: "image/png" });
      const url = URL.createObjectURL(blobConvert);

      const size = await getImageSize(url);

      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === id);

        if (!image) return;

        image.copyrightImage = {
          ...image.copyrightImage,
          blob: url,
          size,
          defaultSize: size,
          opacity: 100,
          position: {
            x: XPositions.LEFT,
            y: YPositions.TOP,
          },
        };
      });
    },
    clearCopyrightImage: (id: number) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === id);

        if (image) image.copyrightImage = {};
      }),
    setCopyrightImagePosition: (
      id: number,
      position: { x: XPositions | number; y: YPositions | number },
      imageScale: number,
    ) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === id);

        if (!image) return;

        const currentPos = position;

        let newPos = { ...currentPos };

        if (typeof position.x === "number" && position.x !== currentPos.x) {
          newPos.x = Math.round(position.x / imageScale);
        }

        if (typeof position.y === "number" && position.y !== currentPos.y) {
          newPos.y = Math.round(position.y / imageScale);
        }

        image.copyrightImage = {
          ...image.copyrightImage,
          position: newPos,
        };
      }),
    setCopyrightImageRelativePosition: (
      id: number,
      position: { x: XPositions | number; y: YPositions | number },
    ) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === id);

        if (!image) return;

        image.copyrightImage = {
          ...image.copyrightImage,
          relativePosition: position,
        };
      }),
    setCopyrightImageOpacity: (id: number, opacity: number) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === id);

        if (image)
          image.copyrightImage = {
            ...image.copyrightImage,
            opacity: opacity,
          };
      }),
    setCopyrightImageSize: (id: number, size: number, imageScale?: number) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === id);

        const imgSize = state.calculateImageSize(id, size, imageScale);

        if (image)
          image.copyrightImage = {
            ...image.copyrightImage,
            size: imgSize,
          };
      }),
    calculateImageSize: (id: number, width: number, imageScale?: number) => {
      const image = get().sessionData.find(
        (si) => si.id === id,
      )?.copyrightImage;
      console.log(image?.defaultSize);
      if (!image?.defaultSize) {
        return { width: 0, height: 0 };
      }

      const scale = width / image.defaultSize.width;

      return {
        width: width / (imageScale ?? 1),
        height:
          Math.round(image.defaultSize.height * scale) / (imageScale ?? 1),
      };
    },
    //#region KÉP MÉRETEK
    setImageSize: (id, width, height) =>
      set((state) => ({
        sessionData: state.sessionData.map((img: any) =>
          img.id === id
            ? {
                ...img,
                dimesions: { width, height },
              }
            : img,
        ),
      })),
    //#region Frontend Crop Box
    setCropBox: ({ id, box }: { id: number; box: CropBox }) => {
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === id);

        if (image && image.box) {
          let finalX = box.x !== undefined ? (box.x ?? 0) : image.box.x;
          let finalY = box.y !== undefined ? (box.y ?? 0) : image.box.y;

          let finalW =
            box.width !== undefined ? (box.width ?? 0) : image.box.width;
          let finalH =
            box.height !== undefined ? (box.height ?? 0) : image.box.height;

          image.box = {
            ...image.box,
            x: finalX,
            y: finalY,
            width: finalW,
            height: finalH,
            currentHeight: box.currentHeight,
            currentWidth: box.currentWidth,
          };
        }
      });
    },
    setCropSave: (id: number) => {
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === id);
        if (image) image.cropSave = image.cropSave === true ? false : true;
      });
    },
    //#endregion

    //#region EXIF ADATOK
    setExifDataForImage: (id: number, exif: string[]) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === id);
        if (image) image.exifDatas = exif;
      }),
    //#endregion

    //#region CAPTION SAMPLES
    setCaptionSamplesForImage: (id: number, captionSamples: string[]) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === id);
        if (image) image.captionSamples = captionSamples;
      }),
    //#endregion

    //#region CAPTION
    getCaptionForImage: (id: number) => {
      return get().sessionData.find((img) => img.id === id)?.caption || "";
    },
    setCaptionForImage: (id: number, caption: string) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === id);
        if (image) image.caption = caption;
      }),
    //#endregion

    //#region TEXT
    addTexts: (
      imageId: number,
      text: string,
      referenceElement: RefObject<HTMLCanvasElement | null>,
    ) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === imageId);
        const imageScale = Math.min(
          (referenceElement.current?.clientHeight ?? 0) /
            (image?.dimesions?.height ?? 0),
          (referenceElement.current?.clientWidth ?? 0) /
            (image?.dimesions?.width ?? 0),
        );

        if (image) {
          if (!image.texts) image.texts = [];

          const textId = uuidv4();

          const newText: DraggableImageEvent = {
            id: textId,
            text,
            position: { x: 0, y: 0 },
            enabled: true,
            fontSize: 20 / imageScale,
            fontFamily: "Roboto",
            fontWeight: 500,
            color: "#ffff",
            opacity: 100,
          };

          image.texts = [...image.texts, newText];
        }
      }),
    deleteText: (imageId: number, textId: string) => {
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === imageId);
        if (!image?.texts) return;

        const textIndex = image.texts.findIndex(
          (text: any) => text.id === textId,
        );
        if (textIndex === -1) return;

        image.texts = [
          ...image.texts.slice(0, textIndex),
          ...image.texts.slice(textIndex + 1),
        ];
      });
    },
    editText: (imageId: number, textId: string, text: string) => {
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === imageId);
        if (!image?.texts) return;

        const textIndex = image.texts.findIndex(
          (text: any) => text.id === textId,
        );
        if (textIndex === -1) return;

        image.texts = [
          ...image.texts.slice(0, textIndex),
          { ...image.texts[textIndex], text },
          ...image.texts.slice(textIndex + 1),
        ];
      });
    },
    setTextFontSize: (
      imageId: number,
      textId: string,
      fontSize: number,
      imageScale: number,
    ) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === imageId);
        if (!image || !image.texts) return;

        const textIndex = image.texts.findIndex(
          (text: any) => text.id === textId,
        );
        if (textIndex === -1) return;

        image.texts = [
          ...image.texts.slice(0, textIndex),
          {
            ...image.texts[textIndex],
            fontSize: Math.round(fontSize / imageScale),
          },
          ...image.texts.slice(textIndex + 1),
        ];
      }),
    setTextFontFamily: (imageId: number, textId: string, fontFamily: string) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === imageId);
        if (!image || !image.texts) return;

        const textIndex = image.texts.findIndex(
          (text: any) => text.id === textId,
        );
        if (textIndex === -1) return;

        image.texts = [
          ...image.texts.slice(0, textIndex),
          { ...image.texts[textIndex], fontFamily },
          ...image.texts.slice(textIndex + 1),
        ];
      }),
    setTextFontWeight: (imageId: number, textId: string, fontWeight: number) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === imageId);
        if (!image || !image.texts) return;

        const textIndex = image.texts.findIndex(
          (text: any) => text.id === textId,
        );
        if (textIndex === -1) return;

        image.texts = [
          ...image.texts.slice(0, textIndex),
          { ...image.texts[textIndex], fontWeight },
          ...image.texts.slice(textIndex + 1),
        ];
      }),
    setTextColor: (imageId: number, textId: string, color: string) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === imageId);
        if (!image || !image.texts) return;

        const textIndex = image.texts.findIndex(
          (text: any) => text.id === textId,
        );
        if (textIndex === -1) return;

        image.texts = [
          ...image.texts.slice(0, textIndex),
          { ...image.texts[textIndex], color },
          ...image.texts.slice(textIndex + 1),
        ];
      }),
    setTextOpacity: (imageId: number, textId: string, opacity: number) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === imageId);
        if (!image || !image.texts) return;

        const textIndex = image.texts.findIndex(
          (text: any) => text.id === textId,
        );
        if (textIndex === -1) return;

        image.texts = [
          ...image.texts.slice(0, textIndex),
          { ...image.texts[textIndex], opacity: opacity },
          ...image.texts.slice(textIndex + 1),
        ];
      }),
    getTextPosition: (selectedImage: number, textId: string) => {
      const text = get()
        .sessionData.find((si) => si.id === selectedImage)
        ?.texts?.find((st) => st.id === textId)?.position;

      return {
        x:
          text?.x !== undefined && typeof text.x === "number"
            ? (text.x ?? 0)
            : 0,
        y:
          text?.y !== undefined && typeof text.y === "number"
            ? (text.y ?? 0)
            : 0,
      };
    },
    setTextPosition: (
      imageId: number,
      textId: string,
      position: { x: number | XPositions; y: number | YPositions },
      scale: number,
    ) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === imageId);
        if (!image || !image.texts || !image.dimesions) return;

        const textIndex = image.texts.findIndex(
          (text: any) => text.id === textId,
        );

        if (textIndex === -1) return;

        const currentPos = image.texts[textIndex].position;

        let newPos = { ...currentPos };

        if (typeof position.x === "number" && position.x !== currentPos.x) {
          newPos.x = Math.round(position.x / scale);
        }

        if (typeof position.y === "number" && position.y !== currentPos.y) {
          newPos.y = Math.round(position.y / scale);
        }

        image.texts = [
          ...image.texts.slice(0, textIndex),
          { ...image.texts[textIndex], position: newPos },
          ...image.texts.slice(textIndex + 1),
        ];
      }),
    setTextRelativePosition: (
      imageId: number,
      textId: string,
      position: { x: number | XPositions; y: number | YPositions },
    ) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === imageId);
        if (!image || !image.texts || !image.dimesions) return;

        const textIndex = image.texts.findIndex(
          (text: any) => text.id === textId,
        );

        if (textIndex === -1) return;

        if (position.x == null && position.y == null) {
          image.texts = [
            ...image.texts.slice(0, textIndex),
            { ...image.texts[textIndex] },
            ...image.texts.slice(textIndex + 1),
          ];
        } else {
          image.texts = [
            ...image.texts.slice(0, textIndex),
            { ...image.texts[textIndex], relativePosition: position },
            ...image.texts.slice(textIndex + 1),
          ];
        }
      }),
    //#endregion

    //#region EXPAND
    setExpandMode: (id: number, mode: string) => {
      if (
        mode !== "crop" &&
        mode !== "no" &&
        mode !== "expand" &&
        mode !== "border"
      )
        return;
      set((state) => ({
        sessionData: state.sessionData.map((img: any) =>
          img.id === id ? { ...img, expandMode: mode } : img,
        ),
      }));
    },
    setExpandSize: (
      id: number,
      size: { width: number; height: number },
      padding?: number,
    ) => {
      set((state) => ({
        sessionData: state.sessionData.map((img: any) =>
          img.id === id
            ? { ...img, expandSize: { ...size, padding: padding ?? 0 } }
            : img,
        ),
      }));
    },

    setExpandBackground: (id: number, color: string) => {
      set((state) => ({
        sessionData: state.sessionData.map((img: any) =>
          img.id === id ? { ...img, expandBackground: color } : img,
        ),
      }));
    },
    //#endregion
    //#region EXPORT
    setExportFileOptimize: (id: number, optimize: boolean) => {
      set((state) => ({
        sessionData: state.sessionData.map((img: any) =>
          img.id === id
            ? {
                ...img,
                exportSettings: {
                  ...img.exportSettings,
                  optimize: optimize,
                },
              }
            : img,
        ),
      }));
    },
    setExportAllFileOptimize: (optimize: boolean) => {
      set((state) => ({
        sessionData: state.sessionData.map((img: any) => {
          return {
            ...img,
            exportSettings: {
              ...img.exportSettings,
              optimize: optimize,
            },
          };
        }),
      }));
    },
    //#endregion
    //#region EXPORT
    setExportFileExtension: (id: number, extension: string) => {
      set((state) => ({
        sessionData: state.sessionData.map((img: any) =>
          img.id === id
            ? {
                ...img,
                exportSettings: {
                  ...img.exportSettings,
                  fileExtension: extension,
                },
              }
            : img,
        ),
      }));
    },
    setExportAllFileExtension: (extension: string) => {
      set((state) => ({
        sessionData: state.sessionData.map((img: any) => {
          return {
            ...img,
            exportSettings: {
              ...img.exportSettings,
              fileExtension: extension,
            },
          };
        }),
      }));
    },
    setExportExifs: (id: number, exifs: string[]) => {
      set((state) => ({
        sessionData: state.sessionData.map((img: any) =>
          img.id === id
            ? {
                ...img,
                exportSettings: {
                  ...img.exportSettings,
                  exifDatas: exifs,
                },
              }
            : img,
        ),
      }));
    },
    setHaldImage: (id: number, haldImage: string) => {
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === id);
        if (!image || !image.exportSettings) return;

        image.exportSettings.haldImage = haldImage;
      });
    },
    exportImageSettings: async (id: number) => {
      const image = get().sessionData.find((img) => img.id === id);

      if (image) {
        let returnData = {} as any;
        let haldImage = image.exportSettings?.haldImage;

        if (image.haldSprite) returnData.hald = haldImage;
        if (image.exportSettings)
          returnData.exportSettings = image.exportSettings;
        if (image.exifDatas) returnData.exifDatas = image.exifDatas;
        if (image.box) returnData.cropBox = image.box;
        if (image.expandSize)
          returnData.expand = {
            size: image.expandSize,
            background: image.expandBackground,
          };
        if (image.borderSize) returnData.borderSize = image.borderSize;

        return returnData;
      }
    },
    //#endregion

    //#region FILTERS
    editFilters: (id: number, filterName: string, value: string | number) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === id);
        if (!image) return;
        if (!image.filters) image.filters = [];
        const filter = image.filters.find((f: any) => f.name === filterName);
        if (filter) filter.value = Number(value);
        else image.filters.push({ name: filterName, value: Number(value) });
      }),
    getFilterValue: (id: number, filterName: string) => {
      return get()
        .sessionData.find((img) => img.id === id)
        ?.filters?.find((f) => f.name === filterName)?.value;
    },
    getFilters: (id: number) => {
      const img = get().sessionData.find((img) => img.id === id);

      const getValue = (val: any, fallback: number) => {
        const num = Number(val);
        return isNaN(num) ? fallback : num;
      };

      return {
        brightness: getValue(
          img?.filters?.find((f) => f.name === "brightness")?.value,
          0,
        ),
        contrast: getValue(
          img?.filters?.find((f) => f.name === "contrast")?.value,
          0,
        ),
        exposure: getValue(
          img?.filters?.find((f) => f.name === "exposure")?.value,
          0,
        ),
        temperature: getValue(
          img?.filters?.find((f) => f.name === "temperature")?.value,
          0,
        ),
        tint: getValue(img?.filters?.find((f) => f.name === "tint")?.value, 0),
        hue: getValue(img?.filters?.find((f) => f.name === "hue")?.value, 0),
        saturation: getValue(
          img?.filters?.find((f) => f.name === "saturation")?.value,
          0,
        ),
        value: getValue(
          img?.filters?.find((f) => f.name === "value")?.value,
          0,
        ),
        black: getValue(
          img?.filters?.find((f) => f.name === "black")?.value,
          1,
        ),
        white: getValue(
          img?.filters?.find((f) => f.name === "white")?.value,
          255,
        ),
        gamma: getValue(
          img?.filters?.find((f) => f.name === "gamma")?.value,
          1,
        ),
        outblack: getValue(
          img?.filters?.find((f) => f.name === "outblack")?.value,
          0,
        ),
        outwhite: getValue(
          img?.filters?.find((f) => f.name === "outwhite")?.value,
          255,
        ),
        red_red_channel: getValue(
          img?.filters?.find((f) => f.name === "red_red_channel")?.value,
          100,
        ),
        red_green_channel: getValue(
          img?.filters?.find((f) => f.name === "red_green_channel")?.value,
          0,
        ),
        red_blue_channel: getValue(
          img?.filters?.find((f) => f.name === "red_blue_channel")?.value,
          0,
        ),
        green_red_channel: getValue(
          img?.filters?.find((f) => f.name === "green_red_channel")?.value,
          0,
        ),
        green_green_channel: getValue(
          img?.filters?.find((f) => f.name === "green_green_channel")?.value,
          100,
        ),
        green_blue_channel: getValue(
          img?.filters?.find((f) => f.name === "green_blue_channel")?.value,
          0,
        ),
        blue_red_channel: getValue(
          img?.filters?.find((f) => f.name === "blue_red_channel")?.value,
          0,
        ),
        blue_green_channel: getValue(
          img?.filters?.find((f) => f.name === "blue_green_channel")?.value,
          0,
        ),
        blue_blue_channel: getValue(
          img?.filters?.find((f) => f.name === "blue_blue_channel")?.value,
          100,
        ),
        red_channel_offset: getValue(
          img?.filters?.find((f) => f.name === "red_channel_offset")?.value,
          0,
        ),
        green_channel_offset: getValue(
          img?.filters?.find((f) => f.name === "green_channel_offset")?.value,
          0,
        ),
        blue_channel_offset: getValue(
          img?.filters?.find((f) => f.name === "blue_channel_offset")?.value,
          0,
        ),
        vibrance: getValue(
          img?.filters?.find((f) => f.name === "vibrance")?.value,
          0,
        ),
      };
    },
    //#endregion

    //#region BORDER SIZE
    setBorderSize: (id: number, borderSize: { x: number; y: number }) => {
      borderSize.x = minMaxValidation(borderSize.x, 0);
      borderSize.y = minMaxValidation(borderSize.y, 0);

      set((state) => {
        const image = state.sessionData.find((img) => img.id === id);

        if (!image) return;

        image.borderSize = borderSize;
      });
    },
    //#endregion
    //#region LUT
    setLut: (
      id: number,
      lutFilter: ColorMapFilter | null,
      lutFile: File | null,
    ) => {
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === id);
        if (!image) return;

        image.lutFile = lutFile;
        image.lutFilter = lutFilter;
      });
    },
    //#endregion
    //#region Masks
    addMask: (id: number, type: string, brushSize: number, point: Points) => {
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === id);
        if (!image) return;

        const masks = image.masks;
        if (!masks) return;

        let currentMask = masks.find(
          (mask) => mask.type === type && mask.brushSize === brushSize,
        );

        if (currentMask) {
          currentMask.points.push(point);
        } else {
          masks.push({
            type,
            brushSize,
            points: [point],
          });
        }
      });
    },
    //#endregion
  })),
);
