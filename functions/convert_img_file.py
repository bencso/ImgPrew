from PIL import Image
import os
from dependencies import EXIF_TAG_NAMES_LIST, IMAGE_EXTENSIONS
from functions.get_exif_data import GetExifData
import piexif
import logging
import io


class ConvertExtensionImage:
    def __init__(
        self,
        image_path: str,
        image: Image.Image,
        output_extension: IMAGE_EXTENSIONS,  # pyright: ignore[reportInvalidTypeForm]
        exif_data: any,
        allowed_infos: list[
            EXIF_TAG_NAMES_LIST  # pyright: ignore[reportInvalidTypeForm]
        ],
    ) -> str:
        f_name, f_ext = os.path.splitext(image_path)

        self.image = image
        self.image_path = image_path
        self.allowed_info = (
            allowed_infos
            if allowed_infos and len(allowed_infos.count) > 0
            else EXIF_TAG_NAMES_LIST
        )

        self.f_name = f_name
        self.f_ext = f_ext

        self.output_extension = f_ext if output_extension is None else output_extension
        self.exif_data = exif_data
    
    def __enter__(self):
        return self
    
    def __exit__(self, *args):
        self.buffer = io.BytesIO()
        self.image.save(self.buffer, format="PNG")
        self.buffer.seek(0)


    def apply(self) -> dict | None:
        try:
            exif_bytes = None
            if self.exif_data:
                allowed_set = set(self.allowed_info)
                filtered_exif = {}
                for ifd in ("0th", "Exif", "GPS", "1st"):
                    filtered_exif[ifd] = {}
                    for tag in self.exif_data.get(ifd, {}):
                        tag_name = piexif.TAGS[ifd][tag]["name"]
                        if tag_name in allowed_set:
                            filtered_exif[ifd][tag] = self.exif_data[ifd][tag]
                for ifd in ("thumbnail",):
                    filtered_exif[ifd] = self.exif_data.get(ifd, None)
                exif_bytes = piexif.dump(filtered_exif)

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
                "exif": exif_bytes,
            }
        except Exception as e:
            logging.error(f"HIBA: {e}")
            return None
