from PIL import Image, ImageFile, ImageOps
from typing import Optional
from dependencies import SOCIAL_IMAGES_SIZES
import os

# TODO: Azt megcsinálni, hogy majd be lehessen állítani hogy mi legyen középen (centering-gel kell majd játszadozni)
# TODO: Ha mondjuk egy álló kép van és extendeődik vizszintesre akkor lehessen ugy is hogy a két oldalán "border" jelenik meg, illetve
# több ilyen variácót is lehessen hogy ne menjen tönkre a kép, hanem igy is lehessen optimalizálni a méretét a képnek
class ResizeImg:
    def __init__(
        self,
        image: Image.Image,
        sample_size_id: Optional[int] = None,
        height: Optional[int] = None,
        width: Optional[int] = None,
    ):
        size_config = SOCIAL_IMAGES_SIZES.get(sample_size_id)
        if size_config is not None:
            self.height = size_config.get("height")
            self.width = size_config.get("width")
        else:
            self.height = height
            self.width = width
        self.img = image

    def resize_img(self):
        try:
            SIZE = (self.width, self.height)
            resized_img = ImageOps.fit(
                self.img, SIZE, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5)
            )
            return resized_img
        except Exception as ex:
            print(f"HIBA resize közben: {ex}")
            return self.img
