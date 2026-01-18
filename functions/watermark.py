from PIL import ImageDraw, Image,ImageFont
from typing import Optional
from dependencies import X_AXIS, Y_AXIS


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

    def create_watermark(self):
        img = Image.open(self.image_path)
        x, y = self.position
        is_string = type(x) == str and type(y) == str
        if is_string:
            # LEFT-RIGHT - X AXIS
            if x == "LEFT":
                x = 20
            else:
                x = img.width - 5000
            # TOP-BOTTOM - Y AXIS
            if y == "TOP":
                y = 20
            else:
                y = img.height - 5000
        text_position = (x, y)

        text = self.text
        font_color = "black"
        draw = ImageDraw.Draw(img)
        font_size=400
        font = ImageFont.truetype("/Users/bence/Documents/Munka/Fejlesztes/ImgPrew/fonts/Montserrat-VariableFont_wght.ttf", font_size) 
        draw.text(text_position, text, font=font, fill=font_color)

        print(self.image_path)
        img.save(self.image_path)
        return self.image_path
