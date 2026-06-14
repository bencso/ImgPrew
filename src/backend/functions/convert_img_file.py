from pathlib import Path
from PIL import Image
import os
from dependencies import EXIF_TAG_NAMES_LIST
import piexif
import logging
import io
from typing import Optional
import time
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
        optimized: Optional[bool],
    ) -> str:
        self.image = image
        print(allowed_infos)
        self.allowed_info = (
            allowed_infos
            if allowed_infos and len(allowed_infos) > 0
            else []
        )
        self.output_extension = output_extension
        self.exif_data = exif_data
        self.optimized = True if optimized else False
    
    def __enter__(self):
        return self
    
    def __exit__(self, *args):
        self.buffer = io.BytesIO()
        self.image.save(self.buffer, format="PNG")
        self.buffer.seek(0)

    def apply(self) -> dict | None:
        try:
            exif_bytes = None
            pixeif_tags = piexif.TAGS
            if self.exif_data:
                allowed_set = set(self.allowed_info)
                filtered_exif = {}
                for ifd in ("0th", "Exif", "GPS", "1st"):
                    filtered_exif[ifd] = {}
                    tags = self.exif_data[ifd]
                    piexif_tag_ifd = pixeif_tags[ifd]
                    for tag in tags:
                        pixief_tag = piexif_tag_ifd[tag]
                        if pixief_tag:
                            tag_name = pixief_tag["name"]
                            if tag_name in allowed_set:
                                filtered_exif[ifd][tag] = tags[tag]
                if "thumbnail" in allowed_set:
                    filtered_exif["thumbnail"] = self.exif_data.get("thumbnail", None)
                exif_bytes = piexif.dump(filtered_exif)
                
            ext = self.output_extension or self.f_ext
            ext = ext.lstrip(".")
            if ext == "jpg": ext = "jpeg"
            
            # BASE_DIR = Path(__file__).resolve().parent.parent
            # UPLOAD_DIR = BASE_DIR / "images"
            
            # if not os.path.exists(UPLOAD_DIR): os.mkdir(UPLOAD_DIR)
            # file_name = f"{uuid.uuid4().hex}.{ext}"
            
            if exif_bytes and self.optimized is not True:
                exif = exif_bytes
            else:
                exif=piexif.dump({})
            
            buffer = BytesIO()
            if self.optimized is True:
                self.image.save(buffer, exif=exif, format=ext, quality=40)
            else: 
                self.image.save(buffer, exif=exif, format=ext)
            return buffer.getvalue()
        except Exception as e:
            logging.error(f"HIBA: {e}")
            return None
