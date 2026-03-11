from ..dependencies import CAPTION_REGEX, CAPTIONS_SAMPLES
import re
from typing import Optional
from PIL import Image
from ..functions.get_exif_data import GetExifData


class CaptionGenerator:
    def __init__(self, img: Image, instagram_caption: Optional[str] = None):
        self.instagram_caption = instagram_caption
        self.exif_helper = GetExifData(img, [])
        exif_datas = self.exif_helper.get_exif_datas()
        self.exif_info = (
            list(exif_datas.keys())
            if isinstance(exif_datas, dict)
            else list(exif_datas or [])
        )

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
        for keys in CAPTIONS_SAMPLES.keys():
            sample = CAPTIONS_SAMPLES[keys]
            exif_keys = keys_check_pattern.findall(sample)
            exif_keys = list(map(lambda x: x[1:][:-1], exif_keys))
            if all(x in exif_infos for x in exif_keys):
                samples.append({"key": keys, "item": sample})
        return samples

    # Igazándiból már meg is van, csak a feldolgozáson kell dolgozni, fe oldalon is, de.. (mert itt a keys -> values :) -> bár erre majd még szüréseket csinálunk)
    # TODO: Megcsinálni, hogy ne az exif adat kulcsaival dolgozzunk hanem már rögtön az értékekkel
    def getExifInfos(self):
        return [x for x in self.exif_helper.get_info().keys()]
