import { useWorkSession } from "@/providers/sessionprovider";
import { ColorMapFilter } from "pixi-filters";
import { Texture } from "pixi.js";

// 1. "Kilapítjuk" a sorokat -> flat()
// 2. Mivel a LUT egy 3D-s kocka, ezért ki kell terítenünk lapokra
// (A PixiJS ColorMapFilter-e egyetlen hosszú vízszintes lapot vár)

export const convertCubeToFilter = (lut: any): ColorMapFilter | null => {
  const flatData = lut.data.flat();
  const size = lut.size || 32;

  const colorMap = document.createElement("canvas");
  colorMap.width = Math.pow(size, 2);
  colorMap.height = size;
  const ctx = colorMap.getContext("2d")!;
  const imageData = ctx.createImageData(colorMap.width, colorMap.height);

  // Végig megyünk az adatokon, hármasával (ugye kilapítottuk a sorokat a flat()-tel és igy RGBRGBRGBRGB), hogy RGB-ket kivegyük mint adat
  for (let index = 0; index < flatData.length; index += 3) {
    // Elosztjuk hárommal, hogy tudjuk hanyadik pixelnél tartunk a 3D-ben
    const startIndex = index / 3;
    //  Megkeressük a pirosnak a helyét
    const r = Math.floor(startIndex % size);
    // A zöld pozíciója
    const g = Math.floor((startIndex / size) % size);
    // Egy teljes lap területével (size * size) osztunk, így megkapjuk, hogy hanyadik kék lapnál tartunk
    const b = Math.floor(startIndex / Math.pow(size, 2));

    //  A Kék érték határozza meg, hogy melyik lapon vagyunk az R pedig megmondja mennyit kell eltolni
    //  Ha a harmadik lapon vagyunk (lutB = 2), akkor annak a lapnak a kezdő X pontja a vásznon 2 * 32 = 64 pixelnél lesz
    const xCoord = b * size + r;
    const yCoord = g;
    // 4 byte miatt szorozzuk az egészet
    const indexCoord = (yCoord * colorMap.width + xCoord) * 4;

    let rColor = flatData[index];
    let gColor = flatData[index + 1];
    let bColor = flatData[index + 2];

    imageData.data[indexCoord] = rColor * 255;
    imageData.data[indexCoord + 1] = gColor * 255;
    imageData.data[indexCoord + 2] = bColor * 255;
    imageData.data[indexCoord + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);

  if (colorMap instanceof HTMLCanvasElement !== true) return null;
  const colorMapTexture = Texture.from(colorMap);
  const colorMapFilter = new ColorMapFilter({
    colorMap: colorMapTexture,
  });
  colorMapFilter.updateColorMap();
  return colorMapFilter;
};

export const generateHald = (haldSize?: number): HTMLCanvasElement | null => {
  const size = haldSize || 32;

  const hald = document.createElement("canvas");
  hald.width = Math.pow(size, 2);
  hald.height = size;
  const ctx = hald.getContext("2d")!;
  const imageData = ctx.createImageData(hald.width, hald.height);

  for (let blue = 0; blue < size; blue++) {
    for (let green = 0; green < size; green++) {
      for (let red = 0; red < size; red++) {
        const xCoord = blue * size + red;
        const yCoord = green;
        const index = (yCoord * hald.width + xCoord) * 4;

        imageData.data[index] = Math.round((red / (size - 1)) * 255);
        imageData.data[index + 1] = Math.round((green / (size - 1)) * 255);
        imageData.data[index + 2] = Math.round((blue / (size - 1)) * 255);
        imageData.data[index + 3] = 255;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return hald;
};
