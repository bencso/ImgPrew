from ..dependencies import CAPTION_REGEX, CAPTIONS_SAMPLES
import re
from typing import Optional


class CaptionGenerator:
    def __init__(self, exif_info: list, instagram_caption: Optional[str] = None):
        self.exif_info = exif_info
        self.instagram_caption = instagram_caption

    def generate(self) -> str:
        caption = self.instagram_caption
        if self.exif_info is not None:
            keys = list(self.exif_info.keys())
            keys_check_pattern = re.compile(CAPTION_REGEX, re.IGNORECASE)
            for x in keys_check_pattern.findall(caption):
                key_pattern = x[1:][:-1]
                if key_pattern in keys:
                    caption = caption.replace(x, self.exif_info[key_pattern])
        return caption

    def getKeys(self):
        keys = []
        caption = self.instagram_caption
        keys_check_pattern = re.compile(CAPTION_REGEX, re.IGNORECASE)
        for x in keys_check_pattern.findall(caption):
            key_pattern = x[1:][:-1]
            keys.append(key_pattern)
        return keys

    def getSampleForPhoto(self):
        samples = []
        exif_infos = self.exif_info
        keys_check_pattern = re.compile(CAPTION_REGEX, re.IGNORECASE)
        print(exif_infos)
        print("-----------")
        for keys in CAPTIONS_SAMPLES.keys():
            sample =  CAPTIONS_SAMPLES[keys]
            exif_keys = keys_check_pattern.findall(sample)
            exif_keys = list(map(lambda x: x[1:][:-1], exif_keys))
            if all(x in exif_infos for x in exif_keys):
                samples.append({"key": keys, "item": sample})
        return samples
