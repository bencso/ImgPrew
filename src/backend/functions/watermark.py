from PIL import Image
from typing import Optional
from dependencies import X_AXIS, Y_AXIS
from PIL import ImageOps
from classes.customtext import Text
import io

class WaterMarking:
    def __init__(
        self,
        image: Image.Image,
        text: Text,
        position: Optional[tuple[X_AXIS, Y_AXIS] | tuple[int, int]],  # type: ignore
    ) -> None:
        self.img = image
        self.position = position
        self.text = text

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.buffer = io.BytesIO()
        self.img.save(self.buffer, format="PNG")
        self.buffer.seek(0)

    def apply(self, watermark_image=str | None):
        if not watermark_image and watermark_image is not None:
            return self.watermark_with_image(watermark_image=watermark_image)
        else:
            return self.watermark()

    def watermark(self):
        if self.img.mode != "RGBA":
            self.img = self.img.convert("RGBA")

        txt_layer = Image.new("RGBA", self.img.size, (255, 255, 255, 0))

        bbox = self.text.generate_text_box(txt_layer=txt_layer)
        position = self.text.get_position(position=self.position, bbox=bbox)
        txt_layer = self.text.generate_text(position)

        watermarked = Image.alpha_composite(self.img, txt_layer)
        watermarked = watermarked.convert("RGB")

        return watermarked

    def watermark_with_image(self, watermark_image: str):
        if self.img.mode != "RGBA":
            self.img = self.img.convert("RGBA")

        SIZE = (300, 300)
        try:
            watermark_image = Image.open(watermark_image)
            watermark_image_png = watermark_image.convert("RGBA")
            watermark_image_png = ImageOps.fit(
                watermark_image_png,
                SIZE,
                method=Image.Resampling.LANCZOS,
                centering=(0.5, 0.5),
            )

            x, y = self.position
            if type(x) == str and type(y) == str:
                if x == "LEFT":
                    x = 20
                elif x == "RIGHT":
                    x = self.img.width - watermark_image_png.width - 40
                elif x == "CENTER":
                    x = (self.img.width / 2) - (watermark_image_png.width / 2)
                if y == "TOP":
                    y = 20
                elif y == "BOTTOM":
                    y = self.img.height - watermark_image_png.height - 40
                elif y == "CENTER":
                    y = (self.img.height / 2) - (watermark_image_png.height / 2)

            image_position = (int(x), int(y))

            self.img.paste(
                watermark_image_png, image_position, mask=watermark_image_png
            )

            return self.img
        except:
            return self.watermark()
