from PIL import Image, ImageFile
import os
from dependencies import EXIF_TAG_NAMES_LIST, IMAGE_EXTENSIONS
from functions.get_exif_data import GetExifData


class ConvertExtensionImage:
    def __init__(
        self,
        image_path: str,
        output_extension: IMAGE_EXTENSIONS,  # pyright: ignore[reportInvalidTypeForm]
        allowed_infos: list[
            EXIF_TAG_NAMES_LIST  # pyright: ignore[reportInvalidTypeForm]
        ],
    ) -> str:
        self.image_path = image_path
        self.output_extension = output_extension
        self.allowed_info = allowed_infos

    def convert_image(self) -> str:
        f_name, f_extension = os.path.splitext(self.image_path)
        outfile = f"{f_name}.{self.output_extension}"

        if f_extension.lower() == f".{self.output_extension.lower()}":
            return self.image_path

        try:
            with Image.open(self.image_path) as img:
                exif = GetExifData(image=img).get_exif_datas(img)
                exif_data = None
                if exif:
                    allowed_set = set(self.allowed_info)
                    exif_data = Image.Exif()
                    for tag_name, value in exif.items():
                        key = value["key"]
                        if tag_name in allowed_set:
                            exif_data[key] = value["value"]
                
                if self.output_extension.lower() in ["jpg", "jpeg"]:
                    if img.mode in ("RGBA", "LA", "P"):
                        img = img.convert("RGB")
                elif self.output_extension.lower() == "png":
                    if img.mode not in ("RGB", "RGBA"):
                        img = img.convert("RGBA")
                
                if exif_data:
                    img.save(outfile, exif=exif_data)
                else:
                    img.save(outfile)
                return outfile
        except Exception as e:
            print(f"HIBA: {e}")
            return Image.open(self.image_path)
        else:
            return outfile
