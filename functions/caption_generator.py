from dependencies import CAPTION_REGEX
import re


class CaptionGenerator:
    def __init__(self, exif_info, instagram_caption: str):
        self.exif_info = exif_info
        self.instagram_caption = instagram_caption

    def generate(self) -> str:
        keys = list(self.exif_info.keys())
        caption = self.instagram_caption
        keys_check_pattern = re.compile(CAPTION_REGEX, re.IGNORECASE)
        for x in keys_check_pattern.findall(caption):
            key_pattern = x[1:][:-1]
            if key_pattern in keys:
                caption = caption.replace(x, self.exif_info[key_pattern])
        return caption
