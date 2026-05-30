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
        position: Optional[tuple[float, float]] = None,
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
        self.position=position

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.buffer = io.BytesIO()
        self.img.save(self.buffer, format="PNG")
        self.buffer.seek(0)

    def expandImg(self) -> Image:
        result = Image.new("RGB", (self.width, self.height), self.expand_bg)
        self.img.thumbnail((self.width-self.padding, self.height-self.padding), Image.Resampling.LANCZOS)
        x_offset = ((self.width - self.img.width) // 2)
        y_offset = ((self.height - self.img.height) // 2)
        result.paste(self.img, (x_offset, y_offset))
        return result

    # TODO: Pozició az X,Y-onnal mükdjön ne centeringgel
    def apply(self) -> Image:
        try:
            if not self.expand:
                SIZE = (int(self.width), int(self.height))
                resized_img = ImageOps.fit(
                    self.img,
                    SIZE,
                    method=Image.Resampling.LANCZOS,
                )
                return resized_img
            else:
                return self.expandImg()
        except Exception as ex:
            logging.error(f"Resize: {ex}")
            return self.img
