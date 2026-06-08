import io
import logging
from typing import Optional

from dependencies import SOCIAL_IMAGES_SIZES
from PIL import Image, ImageOps
from functions.valid_colors import validColors


class ResizeImg:
    def __init__(
        self,
        image: Image.Image,
        sample_size_id: Optional[int] = None,
        height: Optional[float] = None,
        width: Optional[float] = None,
        expand: Optional[bool] = None,
        expand_bg: Optional[str] = None,
        crop_box: Optional[tuple[float, float]] = None,
        padding: Optional[float] = 0
    ):
        size_config = SOCIAL_IMAGES_SIZES.get(sample_size_id)
        if size_config is not None:
            self.height = size_config.get("height")
            self.width = size_config.get("width")
        else:
            self.height = height
            self.width = width
        self.img = image.copy()
        self.expand = expand if expand else False
        self.expand_bg = validColors(expand_bg)
        self.padding = padding
        self.crop_box=crop_box

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.buffer = io.BytesIO()
        self.img.save(self.buffer, format="PNG")
        self.buffer.seek(0)

    def expandImg(self) -> Image:
        padding = int(self.padding)
        inner_width = self.width - (padding*2)
        inner_height = self.height - (padding*2)
        self.img = ImageOps.pad(
                image=self.img,
                size=(inner_width, inner_height),
                method=1,
                color=self.expand_bg
            )
        self.img = ImageOps.pad(image=self.img,size=(self.width,self.height), method=1,color=self.expand_bg)
        return self.img

    def apply(self) -> Image:
        try:
            if not self.expand:
                resized_img = self.img.crop(self.crop_box)
                return resized_img
            else:
                return self.expandImg()
        except Exception as ex:
            logging.error(f"Resize: {ex}")
            return self.img
