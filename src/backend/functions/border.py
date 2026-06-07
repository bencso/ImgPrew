from PIL import ImageOps, Image, ImageColor
import io
from functions.valid_colors import validColors

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
        new_width = self.image.width - (self.border_size )
        new_height = self.image.height - (self.border_size )
        if new_width > 0 and new_height > 0:
            resized_img = self.image.resize((new_width, new_height))
            img_with_border = ImageOps.expand(
                image=resized_img,
                border=self.border_size,
                fill=self.color,
            )
        else:
            img_with_border = Image.new("RGB", (self.image.width, self.image.height), self.color)
        return img_with_border
