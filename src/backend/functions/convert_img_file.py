from pathlib import Path
from PIL import Image
import os
from dependencies import EXIF_TAG_NAMES_LIST
import piexif
import logging
import io
from typing import Optional
import uuid
from io import BytesIO

class Export:
    def __init__(
        self,
        image: Image.Image,
        output_extension: str,  # pyright: ignore[reportInvalidTypeForm]
        exif_data: Optional[any] ,
        allowed_infos: Optional[list[
            EXIF_TAG_NAMES_LIST  # pyright: ignore[reportInvalidTypeForm]
        ]],
    ) -> str:
        self.image = image
        self.allowed_info = (
            allowed_infos
            if allowed_infos and len(allowed_infos) > 0
            else EXIF_TAG_NAMES_LIST
        )
        self.output_extension = output_extension
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

            ext = self.output_extension or self.f_ext
            ext = ext.lstrip(".")
            if ext == "jpg": ext = "jpeg"
            
            # BASE_DIR = Path(__file__).resolve().parent.parent
            # UPLOAD_DIR = BASE_DIR / "images"
            
            # if not os.path.exists(UPLOAD_DIR): os.mkdir(UPLOAD_DIR)
            # file_name = f"{uuid.uuid4().hex}.{ext}"
            
            exif = exif_bytes
            
            buffer = BytesIO()
            self.image.save(buffer, exif=exif, quality=70, format=ext)
            return buffer.getvalue()
        except Exception as e:
            logging.error(f"HIBA: {e}")
            return None
