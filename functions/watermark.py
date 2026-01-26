from PIL import ImageDraw, Image, ImageFont, ImageStat
from typing import Optional
from dependencies import X_AXIS, Y_AXIS
from PIL import ImageOps


# TODO: text: Ez legyen majd egy Class vagy dict..., itt meg lehessen adni szöveget, font familyt, font size-t és weight-et
class WaterMarking:
    def __init__(
        self,
        image: Image.Image,
        text: str,
        text_opacity: Optional[str],
        watermark_image: Optional[str],
        position: Optional[tuple[X_AXIS, Y_AXIS] | tuple[int, int]],  # type: ignore
    ) -> None:
        self.img = image
        self.text = text
        self.text_opacity = text_opacity
        self.watermark_image = watermark_image
        self.position = position
        self.font_path = "/Users/bence/Documents/Munka/Fejlesztes/ImgPrew/fonts/Montserrat-VariableFont_wght.ttf"
        self.font_weight = 600

    def get_font_color(self):
        grayscale = self.img.convert("L")
        stat = ImageStat.Stat(grayscale)
        brightness = stat.mean[0]

        if brightness < 128:
            font_color = [255, 255, 255, 80]
        else:
            font_color = [0, 0, 0, 80]

        return font_color

    def calculate_font_size(self):
        min_dimension = min(self.img.width, self.img.height)

        font_size = int(min_dimension * 0.030)
        font_size = max(18, min(font_size, 60))

        return font_size

    def create_watermark(self):
        if self.img.mode != "RGBA":
            self.img = self.img.convert("RGBA")

        txt_layer = Image.new("RGBA", self.img.size, (255, 255, 255, 0))
        draw = ImageDraw.Draw(txt_layer)

        text = self.text
        font_size = self.calculate_font_size()
        font = ImageFont.truetype(self.font_path, font_size)
        font.set_variation_by_axes([self.font_weight])

        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        x, y = self.position
        if type(x) == str and type(y) == str:
            if x == "LEFT":
                x = 20
            elif x == "RIGHT":
                x = self.img.width - text_width - 40
            elif x == "CENTER":
                print(self.img.width)
                x = (self.img.width / 2) - (text_width / 2)
            if y == "TOP":
                y = 20
            elif y == "BOTTOM":
                y = self.img.height - text_height - 40
            elif y == "CENTER":
                y = (self.img.height / 2) - (text_height / 2)

        text_position = (x, y)
        [R, G, B, A] = self.get_font_color()
        font_color = (R, G, B, A)
        if self.text_opacity is not None:
            font_color = (R, G, B, self.text_opacity * 100)
        draw.text(text_position, text, font=font, fill=font_color)

        watermarked = Image.alpha_composite(self.img, txt_layer)
        watermarked = watermarked.convert("RGB")

        return watermarked

    def create_watermark_image(self):
        if self.img.mode != "RGBA":
            self.img = self.img.convert("RGBA")

        SIZE = (300, 300)
        watermark_image = Image.open(self.watermark_image)
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
                print(self.img.width)
                x = (self.img.width / 2) - (watermark_image_png.width / 2)
            if y == "TOP":
                y = 20
            elif y == "BOTTOM":
                y = self.img.height - watermark_image_png.height - 40
            elif y == "CENTER":
                y = (self.img.height / 2) - (watermark_image_png.height / 2)

        image_position = (int(x), int(y))
        
        self.img.paste(watermark_image_png, image_position, mask=watermark_image_png)

        return self.img
