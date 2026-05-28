import { toaster } from "@/components/ui/toaster";
import { minMaxValidation } from "@/helper/errorHelper";
import { generateHald } from "@/handlers/lutFunctions";
import {
  CalculationReFixPositionProps,
  calculationTypeEnum,
  CropBox,
  CustomImage,
  DraggableImageEvent,
  SessionStore,
  XPositions,
  YPositions,
} from "@/interfaces/interface";
import { ColorMapFilter } from "pixi-filters";
import { Application, Renderer, Sprite, Texture } from "pixi.js";
import { RefObject, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

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
          },
          haldSprite: haldSprite,
        } as CustomImage;

        if (exifData) sessionData.exifDatas = exifData;
        if (captionSamples) sessionData.captionSamples = captionSamples;
        state.sessionData.push(sessionData);
      }),
    //#endregion

    //#region Segédfüggvények
    calculationReFixPosition: (props: CalculationReFixPositionProps) => {
      const image = get().sessionData.find((s) => s.id === props.id);

      let positions = null;

      if (props.type === calculationTypeEnum.TEXT)
        positions = image?.texts?.find(
          (it) => it.id === props.textId,
        )?.position;
      if (props.type === calculationTypeEnum.COPYRIGHT)
        positions = image?.copyrightImage?.position;

      if (!props.textAndImagePlaceRef.current) return;

      const height =
        props.textAndImagePlaceRef.current.offsetHeight;
      const width =
        props.textAndImagePlaceRef.current.offsetWidth ;

      const imageHalf =
        width / 2 -
        props.elementRef.offsetWidth /
          2;

      const imageWCP = width - props.elementRef.offsetWidth;
      const imageHCP = height - props.elementRef.offsetHeight;

      const bX = (image?.borderSize?.x ?? 0) * (props.imageScale ?? 0) + 30 * (props.imageScale ?? 0);
      const bY = (image?.borderSize?.y ?? 0) * (props.imageScale ?? 0) + 30 * (props.imageScale ?? 0);

      const defaultPosition = props.textId
        ? ((positions as {
            x: number;
            y: number;
          }) ?? {
            x: typeof positions?.x === "number" ? positions?.x : bX,
            y: typeof positions?.y === "number" ? positions?.y : bY,
          })
        : {
            x: typeof positions?.x === "number" ? positions?.x : bX,
            y: typeof positions?.y === "number" ? positions?.y : bY,
          };

      if (positions && positions.x && positions.y) {
        let x, y;

        x = Number(positions.x);
        if (Number.isNaN(x)) {
          x = positions.x.toString().toLowerCase();
        }

        y = Number(positions.y);
        if (Number.isNaN(y)) {
          y = positions.y.toString().toLowerCase();
        }

        if (typeof x === "number") {
          return {
            x: x,
            y:
              typeof y === "number"
                ? y
                : y === "top"
                  ? bY
                  : y === "center"
                    ? imageHCP / 2
                    : imageHCP - bY,
          };
        }

        if (typeof y === "number") {
          return {
            x:
              typeof x === "number"
                ? x
                : x === "left"
                  ? bX
                  : x === "center"
                    ? imageHalf
                    : imageWCP - bX,
            y: y,
          };
        }

        const map: any = {
          left: {
            top: { x: bX, y: bY },
            center: { x: bX, y: imageHCP / 2 },
            bottom: { x: bX, y: imageHCP - bY },
          },
          center: {
            top: { x: imageHalf, y: bY },
            center: { x: imageHalf, y: imageHCP / 2 },
            bottom: { x: imageHalf, y: imageHCP - bY },
          },
          right: {
            top: { x: imageWCP - bX, y: bY },
            center: { x: imageWCP - bX, y: imageHCP / 2 },
            bottom: { x: imageWCP - bX, y: imageHCP - bY },
          },
        };

        return map[x][y] || defaultPosition;
      }
      return defaultPosition;
    },
    //#endregion

    //#region "Copyright" kép
    uploadCopyrightImage: (id: number, blob: ArrayBuffer) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === id);
        const blobConvert = new Blob([blob], { type: "image/png" });
        const url = URL.createObjectURL(blobConvert);

        if (image && url)
          image.copyrightImage = {
            ...image.copyrightImage,
            blob: url,
            size: 150,
            opacity: 100,
          };
      }),
    clearCopyrightImage: (id: number) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === id);

        if (image) image.copyrightImage = {};
      }),
    setCopyrightImagePosition: (
      id: number,
      position: { x: XPositions | number; y: YPositions | number },
    ) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === id);
        if (image)
          image.copyrightImage = {
            ...image.copyrightImage,
            position: position,
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
    setCopyrightImageSize: (id: number, size: number) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === id);

        if (image)
          image.copyrightImage = {
            ...image.copyrightImage,
            size: size,
          };
      }),
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
          const scaleX = box.currentWidth
            ? box.currentWidth / (image.dimesions?.width ?? 1)
            : 1;
          const scaleY = box.currentHeight
            ? box.currentHeight / (image.dimesions?.height ?? 1)
            : 1;

          if (!box.x || !box.y || !box.width || !box.height) return;

          let finalX = box.x !== undefined ? box.x / scaleX : image.box.x;
          let finalY = box.y !== undefined ? box.y / scaleY : image.box.y;

          let finalW =
            box.width !== undefined ? box.width / scaleX : image.box.width;
          let finalH =
            box.height !== undefined ? box.height / scaleY : image.box.height;

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
    addTexts: (imageId: number, text: string) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === imageId);
        if (image) {
          if (!image.texts) image.texts = [];

          const textId = uuidv4();

          const element: DraggableImageEvent = {
            id: textId,
            text,
            position: { x: XPositions.LEFT, y: YPositions.TOP },
            enabled: true,
            fontSize: 20,
            fontFamily: "Roboto",
            fontWeight: 500,
            color: "#ffff",
          };

          image.texts.push(element);
        }
      }),
    deleteText: (imageId: number, textId: string) => {
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === imageId);
        if (!image?.texts) return;

        const removedText = image.texts.filter(
          (text: any) => text.id != textId,
        );
        image.texts = removedText.length > 0 ? [...removedText] : [];
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
    setTextFontSize: (imageId: number, textId: string, fontSize: number) =>
      set((state) => {
        const image = state.sessionData.find((img: any) => img.id === imageId);
        if (!image || !image.texts) return;

        const textIndex = image.texts.findIndex(
          (text: any) => text.id === textId,
        );
        if (textIndex === -1) return;

        image.texts = [
          ...image.texts.slice(0, textIndex),
          { ...image.texts[textIndex], fontSize },
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
    getTextPosition: (selectedImage: number, textId: string) => {
      return get()
        .sessionData.find((si) => si.id === selectedImage)
        ?.texts?.find((st) => st.id === textId)?.position;
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

        if (position && typeof position.x === "number" && position.x < 0) {
          toaster.create({
            type: "error",
            title: "Hibás érték",
            description: "Az X értéke nem lehet negatív szám",
          });
          let resetPosition = {
            ...position,
            x: 0,
          };
          image.texts = [
            ...image.texts.slice(0, textIndex),
            { ...image.texts[textIndex], position: resetPosition },
            ...image.texts.slice(textIndex + 1),
          ];
          return;
        }

        if (position && typeof position.y === "number" && position.y < 0) {
          toaster.create({
            type: "error",
            title: "Hibás érték",
            description: "Az X értéke nem lehet negatív szám",
          });
          let resetPosition = {
            ...position,
            y: 0,
          };
          image.texts = [
            ...image.texts.slice(0, textIndex),
            { ...image.texts[textIndex], position: resetPosition },
            ...image.texts.slice(textIndex + 1),
          ];
          return;
        }

        if (
          position &&
          typeof position.x === "number" &&
          typeof position.x === "number"
        ) {
          const endPos = {
            x: Number(position.x) / scale,
            y: Number(position.y) / scale,
          };

          image.texts = [
            ...image.texts.slice(0, textIndex),
            { ...image.texts[textIndex], position: endPos },
            ...image.texts.slice(textIndex + 1),
          ];
        } else {
          const endPos = {
            x: position.x,
            y: position.y,
          };

          image.texts = [
            ...image.texts.slice(0, textIndex),
            { ...image.texts[textIndex], position: endPos },
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
    exportImageSettings: async (
      id: number,
      appRef: RefObject<Application<Renderer> | null>,
    ) => {
      const image = get().sessionData.find((img) => img.id === id);
      if (image && appRef.current) {
        let returnData = {} as any;
        let haldImage;

        if (image && appRef.current) {
          haldImage = await appRef.current.renderer.extract.base64({
            target: image.haldSprite,
            format: "png",
          });
        }

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
    exportAllImageSettings: async (
      appRef: RefObject<Application<Renderer> | null>,
    ) => {
      const returnDatas = await Promise.all(
        get().sessionData.map(async (image) => {
          let returnData = {} as any;
          let haldImage;

          if (image && appRef.current) {
            haldImage = await appRef.current.renderer.extract.image({
              target: image.haldSprite,
              format: "png",
              resolution: 2,
            });
            returnData.hald = haldImage?.src;
          }

          returnData.id = image.id;
          if (image.exportSettings)
            returnData.exportSettings = image.exportSettings;
          if (image.box) returnData.cropBox = image.box;
          if (image.expandSize)
            returnData.expand = {
              size: image.expandSize,
              background: image.expandBackground,
            };
          if (image.borderSize) returnData.borderSize = image.borderSize;
          return returnData;
        }),
      );
      return returnDatas;
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

      set((state) => ({
        sessionData: state.sessionData.map((img: any) =>
          img.id === id ? { ...img, borderSize: borderSize } : img,
        ),
      }));
    },
    //#endregion
    //#region LUT
    setLut: (
      id: number,
      lutFilter: ColorMapFilter | null,
      lutFile: File | null,
    ) => {
      set((state) => ({
        sessionData: state.sessionData.map((img: any) =>
          img.id === id
            ? { ...img, lutFilter: lutFilter, lutFile: lutFile }
            : img,
        ),
      }));
    },
    //#endregion
  })),
);
