from typing import Optional
from functions.valid_colors import validColors
from dependencies import FONT_SIZES, FONT_WEIGHTS
from PIL import ImageDraw, Image, ImageFont, ImageStat, ImageColor

class Text:
    def __init__(
        self,
        text: str,
        color: Optional[str],
        size: Optional[str | int],
        weight: Optional[str],
        opacity: Optional[int],
        image: Image.Image,
    ):
        self.img = image
        self.text = text
        self.opacity = int(opacity)
        self.color = self.get_font_color(color=color)
        self.fontfamily = "fonts/Montserrat-VariableFont_wght.ttf"
        self.fontsize = (
            size
            if type(size) == int
            else (
                FONT_SIZES.get(size)
                if FONT_SIZES.get(size)
                else self.calculate_font_size()
            )
        )
        self.fontweight = (
            weight
            if type(weight) == int
            else (
                FONT_WEIGHTS.get(weight)
                if FONT_WEIGHTS.get(weight)
                else int(FONT_WEIGHTS.get("normal"))
            )
        )
        # TODO: Bármilyen font_family késöbb ez majd csak a végén!
        # req = requests.get(self.fontfamily)
        # self.font = ImageFont.truetype(BytesIO(req.content), self.fontsize)
        self.font = ImageFont.truetype(self.fontfamily, self.fontsize)
        self.font.set_variation_by_axes([self.fontweight])

    def calculate_font_size(self):
        min_dimension = min(self.img.width, self.img.height)
        font_size = int(min_dimension * 0.030)

        small = int(FONT_SIZES.get("small", 12))
        large = int(FONT_SIZES.get("heading_large", 48))

        font_size = max(small, min(font_size, large))
        return font_size

    def get_font_color(self, color):
        grayscale = self.img.convert("L")
        stat = ImageStat.Stat(grayscale)
        brightness = stat.mean[0]

        if not color:
            (R, G, B) = (255, 255, 255) if brightness < 128 else (0, 0, 0)
        else:
            hex_color = validColors(color)
            (R, G, B) = ImageColor.getrgb(hex_color)

        alpha = int(self.opacity * 255 / 100)

        return (R, G, B, alpha)

    def generate_text_box(self, txt_layer):
        draw = ImageDraw.Draw(txt_layer)
        bbox = draw.textbbox((0, 0), self.text, font=self.font)
        return bbox

    def get_position(self, position, bbox):
        x, y = position

        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        # TODO: Késöbb itt is bármilyen érték lehessen!
        if type(x) == str and type(y) == str:
            if x == "LEFT":
                x = 20
            elif x == "RIGHT":
                x = self.img.width - text_width - 40
            elif x == "CENTER":
                x = (self.img.width / 2) - (text_width / 2)
            if y == "TOP":
                y = 20
            elif y == "BOTTOM":
                y = self.img.height - text_height - 40
            elif y == "CENTER":
                y = (self.img.height / 2) - (text_height / 2)

        text_position = (x, y)
        return text_position

    def generate_text(self, position):
        txt_layer = Image.new("RGBA", self.img.size, (255, 255, 255, 0))
        bbox = self.generate_text_box(txt_layer)
        draw = ImageDraw.Draw(txt_layer)

        position = self.get_position(position=position, bbox=bbox)
        draw.text(position, self.text, font=self.font, fill=self.color)
        return txt_layer
