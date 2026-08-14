import {
  CustomImage,
  DraggableImageEventPosition,
  XPositions,
  YPositions,
} from "@/interfaces/interface";
import { Application, Renderer, Sprite, Texture, TextureSource } from "pixi.js";
import { Dispatch, RefObject, SetStateAction } from "react";
import { exportMasks } from "./exportMasks";
import { exportMaskHalds } from "./exportMaskHalds";
import { calcScale } from "../sizes/calcScale";
import { isXPositions, isYPositions } from "../positions/checkXYPositions";
import { calculatePosition } from "../positions/calculationPosition";
import { exportHald } from "./exportHalds";
import { getCopyrightImagePosition } from "./getCopyrightImagePosition";
import { ExportText } from "@/interfaces/exportTexts.interface";
import { returnTextsData } from "./returnTextsData";
import { createFormBody } from "./createFormBody";
import { SuccessfullyImagesProps } from "@/interfaces/export.interface";

export async function exportSelectedImage(
  id: number,
  appRef: RefObject<Application<Renderer> | null>,
  exportImageSettings: (id: number) => Promise<any>,
  images: CustomImage[],
  spriteRef: RefObject<Sprite | null>,
  textureRef: RefObject<Texture<TextureSource<any>> | null>,
  setSelectedImg: Dispatch<SetStateAction<number>>,
  workPlaceRef: RefObject<HTMLDivElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  selectedImg: number,
  setSuccessfulyImages: Dispatch<SetStateAction<SuccessfullyImagesProps[]>>,
  setSuccessfullyImageShow: Dispatch<SetStateAction<boolean>>,
) {
  const exportData = await exportImageSettings(id);

  let selectedImage = images.find((i) => i.id === id);
  if (!selectedImage) return;

  let haldImage = exportData.hald ?? "";
  let maskImages = await exportMasks(selectedImage, appRef);
  let masksImageHalds = await exportMaskHalds(selectedImage, appRef);

  if (exportData.hald === undefined && appRef.current) setSelectedImg(id);

  haldImage = exportHald(id, selectedImg, selectedImage, appRef);

  const scale = calcScale({
    workPlaceRef,
    appRef,
    textureRef,
    spriteRef,
    expandMode: selectedImage.expandMode,
    expandSize: selectedImage.expandSize,
    canvasRef,
    cropSaved: selectedImage.cropSave,
    box: selectedImage.box,
    borderSize: selectedImage.borderSize,
    imageSize: selectedImage.dimesions,
  });

  // Copyright kép átalakítása hogy formbodyba át lehessen adni
  let copyrightImage = null;

  if (selectedImage.copyrightImage?.blob) {
    let copyrightBlob = await fetch(selectedImage.copyrightImage.blob).then(
      (res) => res.blob(),
    );

    copyrightImage = new File([copyrightBlob], `copyright_${selectedImage.id}`);
  }

  // A copyright képnek a helyezetének lekérése
  const cpRelativePosition = selectedImage.copyrightImage?.relativePosition;
  let cpImagePostion = getCopyrightImagePosition(
    selectedImage,
    cpRelativePosition,
    scale,
    canvasRef,
  );

  const blob = await fetch(selectedImage.blob).then((res) => res.blob());
  const haldBlob = await fetch(haldImage).then((res) => res.blob());

  const imageBlobFile = new File([blob], `image_${selectedImage.id}`);
  const haldFile = new File([haldBlob], `hald_${selectedImage.id}`);

  let texts: (ExportText | undefined)[] = [];

  if (selectedImage.texts && selectedImage.texts.length > 0) {
    let curtexts = returnTextsData(
      selectedImage.texts,
      scale,
      canvasRef,
      selectedImage.borderSize,
    );

    if (curtexts) texts = curtexts;
  }

  let formBody = createFormBody(
    selectedImage,
    cpImagePostion,
    texts,
    imageBlobFile,
    haldFile,
    maskImages,
    masksImageHalds,
    copyrightImage,
  );

  await fetch("/api/images/export", {
    method: "POST",
    body: formBody,
  })
    .catch(() => null)
    .then(async (res) => {
      if (res) {
        const blob = await res?.blob();
        const imageUrl = URL.createObjectURL(blob);

        setSuccessfulyImages((prev) => [
          ...prev,
          {
            title: String(selectedImage.id),
            data: imageUrl,
            extension: selectedImage.exportSettings?.fileExtension ?? "jpg",
          } as SuccessfullyImagesProps,
        ]);
        setSuccessfullyImageShow(true);
      }
    });
}
