from PIL import Image, ImageFile
import os
from dependencies import EXIF_TAG_NAMES_LIST, IMAGE_EXTENSIONS
from functions.get_exif_data import GetExifData


class ConvertExtensionImage:
    def __init__(
        self,
        image_path: str,
        image: Image.Image,
        output_extension: IMAGE_EXTENSIONS,  # pyright: ignore[reportInvalidTypeForm]
        allowed_infos: list[
            EXIF_TAG_NAMES_LIST  # pyright: ignore[reportInvalidTypeForm]
        ],
    ) -> str:
        f_name, f_ext = os.path.splitext(image_path)

        self.image = image
        self.image_path = image_path
        self.allowed_info = allowed_infos

        self.f_name = f_name
        self.f_ext = f_ext

        self.output_extension = output_extension

        if output_extension is None:
            self.output_extension = f_ext

    def convert_image(self) -> dict | None:

        try:
            exif = GetExifData(image=self.image).get_exif_datas(self.image)
            exif_data = None

            if exif:
                allowed_set = set(self.allowed_info)
                exif_data = Image.Exif()
                for tag_name, value in exif.items():
                    key = value["key"]
                    if tag_name in allowed_set:
                        exif_data[key] = value["value"]

            if self.output_extension.lower() in ["jpg", "jpeg"]:
                if self.image.mode in ("RGBA", "LA", "P"):
                    self.image = self.image.convert("RGB")
            elif self.output_extension.lower() == "png":
                if self.image.mode not in ("RGB", "RGBA"):
                    self.image = self.image.convert("RGBA")

            ext = self.output_extension or self.f_ext
            ext = ext.lstrip(".")

            return {
                "img": self.image,
                "filename": f"{self.f_name}.{ext}",
                "exif": exif_data,
            }
        except Exception as e:
            print(f"HIBA: {e}")
            return None
