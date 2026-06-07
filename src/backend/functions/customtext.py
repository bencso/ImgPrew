from typing import Optional
from functions.valid_colors import validColors
from dependencies import FONT_WEIGHTS
from PIL import ImageDraw, Image, ImageFont, ImageStat, ImageColor, ImageText
import math

class TextProps:
    text: str
    size: Optional[str | int]
    weight: Optional[str]
    opacity: Optional[int]
    color: Optional[str]
    font: Optional[str]
    position: Optional[tuple[float,float | str, str]]
    ui_width: Optional[float]
    ui_ascent: Optional[float]
    ui_descent: Optional[float]
    
    def __init__(self, text, size, weight, opacity, color, font, position, ui_width, ui_ascent, ui_descent):
        self.text = text
        self.size = size
        self.weight = weight
        self.opacity = opacity
        self.color = color
        self.font = font
        self.position = position
        self.ui_width = ui_width
        self.ui_ascent = ui_ascent
        self.ui_descent = ui_descent
        
class Text:
    def __init__(
        self,
        text: Optional[list[dict]] = None,
        image: Image.Image = Image.Image,
        border_size: Optional[int] = None
    ):
        self.img = image
        self.text = []
        self.border_size = border_size or 0
        if text:
            for t in text:
                self.text.append(TextProps(
                    text=t.get("text", ""),
                    size=t.get("fontSize"),
                    weight=t.get("fontWeight"),
                    opacity=t.get("opacity", 1),
                    color=t.get("color"),
                    font=t.get("fontFamily"),
                    position=(t.get("position", {}).get("x", 0), t.get("position", {}).get("y", 0)),
                    ui_width=t.get("uiWidth"),
                    ui_ascent=t.get("uiAscent"),
                    ui_descent=t.get("uiDescent"),
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

        alpha = int(opacity * 255)

        return (R, G, B, alpha)

    def generate_text_box(self, position, text, font, txt_layer):
        draw = ImageDraw.Draw(txt_layer)
        bbox = draw.textbbox(position, text, font=font)
        return bbox


    def generate_text(self):
        txt_layer = Image.new("RGBA", self.img.size, (255, 255, 255, 0))
        
        for t in self.text:
            fontsize = float(t.size) if t.size else 20
            fontweight = (
                t.weight
                if isinstance(t.weight, int)
                else int(FONT_WEIGHTS.get(t.weight, FONT_WEIGHTS.get("normal", 400)))
            )
            
            font = ImageFont.truetype("fonts/Roboto.ttf", fontsize)
            
            try:
                font.set_variation_by_axes([fontweight])
            except AttributeError:
                pass
            
            w = int(math.ceil(t.ui_width))
            h = int(math.ceil(t.ui_ascent + t.ui_descent))
            
            print("w,h")
            print(w,h)
            print("t.ui_ascent")
            print(t.ui_ascent)

            text_box_size = (w, h)
            text_box = Image.new("RGBA", text_box_size, (255, 255, 255, 0))
        
            draw = ImageDraw.Draw(text_box)
            
            color = self.get_font_color(t.color, t.opacity)

            draw.text((0, float(t.ui_ascent)), t.text, font=font, fill=color, anchor="ls", align="left")
            
            x = int(round(t.position[0]))
            y = int(round(t.position[1]))
            print(x,y)
            print("x,y")
            txt_layer.paste(text_box, (x,y), text_box)
        
        self.img.paste(txt_layer, (0,0), txt_layer)
        return self.img
