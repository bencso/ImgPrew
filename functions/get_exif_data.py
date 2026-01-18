from PIL import Image, ExifTags, ImageFile
from dependencies import EXIF_TAG_NAMES_LIST
from typing import List, Optional


class GetExifData:
    image_infos = {}

    def __init__(
        self,
        image_path: Optional[str] = None,
        image: Optional[ImageFile] = None,  # pyright: ignore[reportInvalidTypeForm]
        image_data: Optional[
            List[EXIF_TAG_NAMES_LIST]  # pyright: ignore[reportInvalidTypeForm]
        ] = None,
    ) -> None:
        self.image_path = image_path

        if self.image_path:
            img = Image.open(self.image_path)
        else:
            img = image
        self.img = img

        self.image_datas = image_data if image_data is not None else EXIF_TAG_NAMES_LIST
        self.exif_data = self.get_exif_datas(img)

    def get_exif_datas(self, img: ImageFile) -> dict | None:
        exif_datas = {}
        try:
            exif_data = img.getexif()
            for key, value in exif_data.items():
                if key in ExifTags.TAGS:
                    tag_name = ExifTags.TAGS[key]
                    exif_datas[tag_name] = {"key": key, "value": value}
            # További exif adatok lekérdezése
            exif_ifd = exif_data.get_ifd(ExifTags.IFD.Exif)
            for tag, value in exif_ifd.items():
                exif_datas[ExifTags.TAGS.get(tag)] = {"key": tag, "value": value}
            return exif_datas
        except:
            return None

    def get_info(self) -> dict:
        try:
            exif_datas = self.exif_data
            if exif_datas is None:
                pass
            for i in exif_datas:
                if i.lower() in list(map(str.lower, self.image_datas)):
                    value = exif_datas[i]["value"]
                    match i:
                        case "FNumber":
                            if isinstance(value, (tuple, list)):
                                f_value = value[0] / value[1]
                            else:
                                f_value = float(value)
                            self.image_infos[i] = f"f/{f_value}"
                        case "ExposureTime":
                            if isinstance(value, (tuple, list)):
                                exposure = value[0] / value[1]
                            else:
                                exposure = float(value)
                            if exposure >= 1:
                                self.image_infos[i] = f"{int(exposure)}s"
                            else:
                                self.image_infos[i] = f"1/{round(1 / exposure)}s"
                        case "ISOSpeedRatings":
                            self.image_infos[i] = f"ISO {int(value)}"
                        case _:
                            self.image_infos[i] = f"{value}"
            return self.image_infos
        except Exception as e:
            print(f"HIBA történt exif adat kinyerés közben: {e}")
            return self.image_infos
