from PIL import Image
from dependencies import EXIF_TAG_NAMES_LIST
from typing import List, Optional
import piexif
import reverse_geocoder
import re


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
        self.exif_data = self.get_exif_datas()
        self.exif_datas = self.exif_data if self.exif_data is not None else {}

    def get_exif_datas(self) -> dict | None:
        exif_datas = {}
        try:
            exif_bytes = self.img.info.get("exif")
            if exif_bytes:
                exif_dict = piexif.load(exif_bytes)
            else:
                pass
            for ifd in ("0th", "Exif", "GPS", "1st"):
                for tag in exif_dict[ifd]:
                    tag_name = piexif.TAGS[ifd][tag]["name"]
                    exif_datas[tag_name] = {"key": tag, "value": exif_dict[ifd][tag]}
            return exif_datas
        except:
            return None

    def get_info(self) -> dict:
        try:
            exif_datas = self.exif_data
            if exif_datas is None:
                pass
            image_list = list(map(str.lower, self.image_datas))
            for i in exif_datas:
                if i.lower() in image_list:
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
            if "GPS".lower() in image_list:
                self.image_infos["GPS"] = self.get_location() or "Ismeretlen"
            return self.image_infos
        except Exception as e:
            print(f"HIBA történt exif adat kinyerés közben: {e}")
            return self.image_infos

    def get_location(self) -> str:
        # ? piexif.GPSIFD.GPSLongitude = ((degrees, 1), (minutes, 1), (seconds, 10000)).
        # ? piexif.GPSIFD.GPSLongitudeRef = 'E' (east) / 'W' (west)
        #!   40/1   → 40 fok
        #!   95/1   → 95 perc => 60 perc = 1 fok
        #!   940/1000 → 0.94 másodperc => 3600 másodperc = 1 fok
        #!   S / W -> negatív előjel
        exif_datas = self.get_exif_datas()
        if (
            not exif_datas
            or "GPSLongitude" not in exif_datas
            or "GPSLatitude" not in exif_datas
        ):
            return "Nincs GPS adat tárolva a fotón!"

        gpslong = exif_datas["GPSLongitude"]["value"]
        gpslong_r = exif_datas["GPSLongitudeRef"]["value"]
        d_long = gpslong[0][0] / gpslong[0][1]
        m_long = gpslong[1][0] / gpslong[1][1]
        s_long = gpslong[2][0] / gpslong[2][1]
        longitude = d_long + m_long / 60 + s_long / 3600
        if gpslong_r in [b"S", b"W", "S", "W"]:
            longitude = -longitude

        gpslat = exif_datas["GPSLatitude"]["value"]
        gpslat_r = exif_datas["GPSLatitudeRef"]["value"]
        d_lat = gpslat[0][0] / gpslat[0][1]
        m_lat = gpslat[1][0] / gpslat[1][1]
        s_lat = gpslat[2][0] / gpslat[2][1]
        latitude = d_lat + m_lat / 60 + s_lat / 3600
        if gpslat_r in [b"S", b"W", "S", "W"]:
            latitude = -latitude

        geocoding = reverse_geocoder.search((latitude, longitude))
        return (
            f"{geocoding[0]['name']} - {geocoding[0]['admin1']} - {geocoding[0]['cc']}"
        )
