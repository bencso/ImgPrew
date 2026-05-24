import base64
from PIL import Image
import io

class UploadedImage:
    def __init__(self, image: str):
        self.original_image = image
        self.edited_image = image

    def __enter__(self):
        self.edited_image = self.encode_bytes()

    def encode_bytes(self):
        return base64.b64encode(self.edited_image).decode("ascii")

    def get_img(self):
        return Image.open(io.BytesIO(self.edited_image))

    def __exit__(self, **args):
        part = base64.b64encode(self.edited_image).decode("ascii")
        return part
