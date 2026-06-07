from PIL import ImageOps, Image, ImageColor
import io
from functions.valid_colors import validColors
import math

class Border:
    def __init__(self, image: Image, border_size: int, color: str):
        self.image = image
        self.border_size = border_size
        hex_color = validColors(color)
        color = ImageColor.getrgb(hex_color)
        self.color = color if color is not None else (255, 255, 255, 100)

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.buffer = io.BytesIO()
        self.image.save(self.buffer, format="PNG")
        self.buffer.seek(0)

    def apply(self) -> Image:
        print(self.image.size)
        border_size = int(round(self.border_size/2))
        img_with_border = ImageOps.expand(
        image=self.image,
        border=int(border_size),
        fill=self.color,
    )
        return img_with_border
