from PIL import Image, ExifTags, ImageFile
from dependencies import EXIF_TAG_NAMES_LIST
from typing import List, Optional
import piexif
from io import BytesIO


class GetExifData:
    image_infos = {}

    def __init__(
        self,
        image: Image.Image,
        image_data: Optional[
            List[EXIF_TAG_NAMES_LIST]  # pyright: ignore[reportInvalidTypeForm]
        ] = None,
    ) -> None:
        self.img = image
        self.image_datas = (
            image_data if image_data and len(image_data) > 0 else EXIF_TAG_NAMES_LIST
        )
        self.exif_data = self.get_exif_datas(self.img)

    def get_exif_datas(self, img: ImageFile) -> dict | None:
        exif_datas = {}
        try:
            s = BytesIO()
            self.img.save(s, format="JPEG", exif=img.info.get("exif"))
            s.seek(0)
            exif = piexif.load(s.getvalue())
            for ifd in ("0th", "Exif", "GPS", "1st"):
                for tag in exif[ifd]:
                    tag_name = piexif.TAGS[ifd][tag]["name"]
                    exif_datas[tag_name] = {"key": tag, "value": exif[ifd][tag]}
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
