import { Dispatch, SetStateAction } from "react";
import { CustomImage } from "./interface";

export interface SuccessfullyImagesProps {
  title: string;
  data: string;
  extension: string;
}

export interface ExportFileExtensionProp {
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}

export interface ExportImageBlockProp {
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}

export interface ImageRadioProp {
  id: number;
  blob?: string;
  title?: string;
}

export interface SuccessfullDialogProps {
  successfullyImageShow: boolean;
  setSuccessfullyImageShow: Dispatch<SetStateAction<boolean>>;
  successfullyImages: SuccessfullyImagesProps[];
  selectedImage?: CustomImage | undefined;
}
