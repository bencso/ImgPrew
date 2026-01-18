from PIL import Image, ExifTags, ImageFile
from fractions import Fraction

# TODO: Ezt lehet majd változtatni GUI-n belül, hogy mit szeretne a user
image_datas = [
    "Model",
    "LensModel",
    "FNumber",
    "Make",
    "ExposureTime",
    "ISOSpeedRatings",
    "FocalLength",
    "DateTimeOriginal",
    "Flash",
    "GPSInfo",
]

image_infos = {}


def get_exif_datas(img: ImageFile):
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


def get_info(image_path: str):
    try:
        with Image.open(image_path) as img:
            exif_datas = get_exif_datas(img=img)
            if exif_datas is None:
                pass
            for i in exif_datas:
                if i.lower() in list(map(str.lower, image_datas)):
                    value = exif_datas[i]["value"]
                    match i:
                        case "FNumber":
                            if isinstance(value, (tuple, list)):
                                f_value = value[0] / value[1]
                            else:
                                f_value = float(value)
                            image_infos[i] = f"f/{f_value}"

                        case "ExposureTime":
                            if isinstance(value, (tuple, list)):
                                exposure = value[0] / value[1]
                            else:
                                exposure = float(value)

                            if exposure >= 1:
                                image_infos[i] = f"{int(exposure)}s"
                            else:
                                image_infos[i] = f"1/{round(1 / exposure)}s"

                        case "ISOSpeedRatings":
                            image_infos[i] = f"ISO {int(value)}"
                        case _:
                            image_infos[i] = f"{value}"
            return image_infos
    except Exception as e:
        print(f"HIBA adatok lekérdezése közben: {e}")
        exit(1)
