from PIL import Image, ImageFile, ImageOps
from typing import Optional
from dependencies import SOCIAL_IMAGES_SIZES
import os


class ResizeImg:
    def __init__(
        self,
        image_path: Optional[str] = None,
        sample_size_id: Optional[int] = None,
        height: Optional[int] = None,
        width: Optional[int] = None,
    ):
        self.image_path = image_path
        
        size_config = SOCIAL_IMAGES_SIZES.get(sample_size_id)
        if size_config is not None:
            self.height = size_config.get("height")
            self.width = size_config.get("width")
        else:
            self.height = height
            self.width = width

        self.img = Image.open(image_path)

    def resize_img(self):
        try:
            SIZE = (self.width, self.height)
            resized_img = ImageOps.fit(
                self.img, SIZE, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5)
            )
            filename, fileextension = os.path.splitext(self.image_path)
            path = f"{filename}_{self.width}x{self.height}{fileextension}"
            resized_img.save(path)
            return path
        except Exception as ex:
            print(f"HIBA resize közben: {ex}")
            return self.image_path
