from typing import Optional
from functions.valid_colors import validColors
from dependencies import FONT_SIZES, FONT_WEIGHTS
from PIL import ImageDraw, Image, ImageFont, ImageStat, ImageColor

class TextProps:
    text: str
    size: Optional[str | int]
    weight: Optional[str]
    opacity: Optional[int]
    color: Optional[str]
    font: Optional[str]
    position: Optional[tuple[int,int | str, str]]
    
    def __init__(self, text, size, weight, opacity, color, font, position):
        self.text = text
        self.size = size
        self.weight = weight
        self.opacity = opacity
        self.color = color
        self.font = font
        self.position = position
        
class Text:
    def __init__(
        self,
        text: list[TextProps] = list(),
        image: Image.Image = Image.Image,
    ):
        self.img = image
        self.text = []
        for t in text:
            self.text.append(TextProps(
                text=t.get("text", ""),
                size=t.get("fontSize"),
                weight=t.get("fontWeight"),
                opacity=100,
                color=t.get("color"),
                font=t.get("fontFamily"),
                position=(t.get("position", {}).get("x", 0), t.get("position", {}).get("y", 0))
            ))

    def get_font_color(self, color, opacity):
        grayscale = self.img.convert("L")
        stat = ImageStat.Stat(grayscale)
        brightness = stat.mean[0]

        if not color:
            (R, G, B) = (255, 255, 255) if brightness < 128 else (0, 0, 0)
        else:
            hex_color = validColors(color)
            (R, G, B) = ImageColor.getrgb(hex_color)

        alpha = int(opacity * 255 / 100)

        return (R, G, B, alpha)

    def generate_text_box(self, position, text, font, txt_layer):
        draw = ImageDraw.Draw(txt_layer)
        bbox = draw.textbbox(position, text, font=font)
        return bbox

    def get_position(self, position, bbox):
        x, y = position

        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        print(text_height)

        if isinstance(x, str):
            x = str.upper(x)
            if x == "LEFT":
                x = 30
            elif x == "RIGHT":
                x = self.img.width - text_width - 30
            elif x == "CENTER":
                x = (self.img.width / 2) - (text_width / 2)
        
        if isinstance(y, str):
            y = str.upper(y)
            if y == "TOP":
                y = 30
            elif y == "BOTTOM":
                y = self.img.height - text_height
            elif y == "CENTER":
                y = (self.img.height / 2) - (text_height / 2)

        text_position = (x, y)
        return text_position

    def generate_text(self):
        txt_layer = Image.new("RGBA", self.img.size, (255, 255, 255, 0))
        draw = ImageDraw.Draw(txt_layer)
        for t in self.text:
            fontsize = (
                t.size
                if isinstance(float(t.size), float)
                else 20
            )
            
            print(isinstance(t.size, float))
            
            fontweight = (
                t.weight
                if isinstance(t.weight, int)
                else int(FONT_WEIGHTS.get(t.weight, FONT_WEIGHTS.get("normal", 400)))
            )
            
            # TODO: A font typeokat ki lehessen választani majd
            font = ImageFont.truetype("fonts/Roboto.ttf", fontsize)
            try:
                font.set_variation_by_axes([fontweight])
            except AttributeError:
                pass
            
            bbox = self.generate_text_box((0,0), t.text, font, txt_layer)
            position = self.get_position(position=t.position, bbox=bbox)
            color = self.get_font_color(t.color, t.opacity)
            draw.text(position, t.text, font=font, fill=color)
        self.img.paste(txt_layer, (0,0),txt_layer)
        return self.img
