from PIL import ImageDraw, Image, ImageFont, ImageStat
from typing import Optional
from dependencies import X_AXIS, Y_AXIS

# TODO: text: Ez legyen majd egy Class vagy dict..., itt meg lehessen adni szöveget, font familyt, font size-t és weight-et
# TODO: Pozició lehessen középre is majd
class WaterMarking:
    def __init__(
        self,
        image_path: str,
        text: str,
        position: Optional[tuple[X_AXIS, Y_AXIS] | tuple[int, int]],  # type: ignore
    ) -> None:
        self.image_path = image_path
        self.text = text
        self.position = position
        self.font_path = "/Users/bence/Documents/Munka/Fejlesztes/ImgPrew/fonts/Montserrat-VariableFont_wght.ttf"
        self.font_weight = 600

    def get_font_color(self, img):
        grayscale = img.convert("L")
        stat = ImageStat.Stat(grayscale)
        brightness = stat.mean[0]

        if brightness < 128:
            font_color = (255, 255, 255, 80)
        else:
            font_color = (0, 0, 0, 80)

        return font_color

    def calculate_font_size(self, img):
        min_dimension = min(img.width, img.height)

        font_size = int(min_dimension * 0.030)
        font_size = max(18, min(font_size, 60))

        return font_size

    def create_watermark(self):
        img = Image.open(self.image_path)

        if img.mode != "RGBA":
            img = img.convert("RGBA")

        txt_layer = Image.new("RGBA", img.size, (255, 255, 255, 0))
        draw = ImageDraw.Draw(txt_layer)

        text = self.text
        font_size = self.calculate_font_size(img)
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
                x = img.width - text_width - 40
            if y == "TOP":
                y = 20
            elif y == "BOTTOM":
                y = img.height - text_height - 40

        text_position = (x, y)
        font_color = self.get_font_color(img)
        draw.text(text_position, text, font=font, fill=font_color)

        watermarked = Image.alpha_composite(img, txt_layer)

        if self.image_path.lower().endswith((".jpg", ".jpeg")):
            watermarked = watermarked.convert("RGB")

        watermarked.save(self.image_path)
        return self.image_path
