import { ExportText } from "@/interfaces/exportTexts.interface";
import { CustomImage } from "@/interfaces/interface";

export function createFormBody(
  selectedImage: CustomImage,
  cpImagePostion: Promise<
    | {
        x: any;
        y: any;
      }
    | undefined
  >,
  texts: (ExportText | undefined)[],
  imageBlobFile: File,
  haldFile: File,
  masksImages: string[],
  masksImageHalds: string[],
  copyrightImage: File | null,
) {
  const expandSize =
    selectedImage.expandMode === "expand"
      ? {
          ...selectedImage.expandSize,
          padding: selectedImage.expandSize?.padding ?? 0,
        }
      : {
          width: selectedImage.box?.width ?? 0,
          height: selectedImage.box?.height ?? 0,
          padding: 0,
        };

  const expandPosition =
    selectedImage.expandMode === "crop"
      ? {
          x: selectedImage.box?.x ?? 0,
          y: selectedImage.box?.y ?? 0,
        }
      : { x: 0, y: 0 };

  const body = {
    extension: selectedImage.exportSettings?.fileExtension ?? "jpg",
    exif_data: selectedImage.exportSettings?.exifDatas ?? [],
    border_size: selectedImage.borderSize?.x ?? 0,
    border_color: selectedImage.expandBackground ?? "#fff",
    copyright_image_size: selectedImage.copyrightImage?.size?.width ?? 0,
    copyright_image_position: cpImagePostion,
    copyright_image_opacity: selectedImage.copyrightImage?.opacity,
    texts: texts,
    optimize: selectedImage.exportSettings?.optimize ?? false,
    expand_mode: selectedImage.expandMode ?? "no",
    expand_size: expandSize,
    expand_position: expandPosition,
    expand_color: selectedImage.expandBackground ?? "#fff",
    masks_number: masksImages.length,
  };

  const formData = new FormData();

  formData.append("file", imageBlobFile);
  formData.append("lut", haldFile, "hald.png");

  if (copyrightImage)
    formData.append("copyright_image", copyrightImage, "copyright.png");

  if (masksImages.length > 0) {
    for (let index = 0; index < masksImages.length; index++) {
      const mask = masksImages[index];

      const maskFile = new File([mask], `mask_${index}`);
      formData.append(`masks_files`, maskFile, `mask_${index}.png`);
    }
  }

  if (masksImageHalds.length > 0) {
    for (let index = 0; index < masksImageHalds.length; index++) {
      const haldImage = masksImageHalds[index];

      const haldImageFile = new File([haldImage], `mask_hald_${index}`);
      formData.append(
        `masks_hald_files`,
        haldImageFile,
        `mask_hald_${index}.png`,
      );
    }
  }

  formData.append("body", JSON.stringify(body));

  return formData;
}
