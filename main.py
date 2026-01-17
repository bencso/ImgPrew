from PIL import Image, ExifTags
from pillow_heif import register_heif_opener
import os

register_heif_opener()

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


def get_exif_datas(image_path: str):
    exif_datas = {}
    try:
        with Image.open(image_path) as img:
            exif_data = img.getexif()
            for key, value in exif_data.items():
                if key in ExifTags.TAGS:
                    tag_name = ExifTags.TAGS[key]
                    exif_datas[tag_name] = value
            exif_ifd = exif_data.get_ifd(ExifTags.IFD.Exif)
            for tag, value in exif_ifd.items():
                exif_datas[ExifTags.TAGS.get(tag)] = value
            return exif_datas
    except:
        return None


def get_info(image_path: str):
    try:
        exif_datas = get_exif_datas(image_path=image_path)
        if exif_datas is None:
            pass
        for i in exif_datas:
            if i.lower() in list(map(str.lower, image_datas)):
                if i == "FNumber":
                    value = exif_datas[i]
                    if isinstance(value, tuple):
                        image_infos[i] = f"f/{value[0] / value[1]}"
                    else:
                        image_infos[i] = f"f/{value}"
                elif i == "ExposureTime":
                    value = exif_datas[i]
                    if isinstance(value, tuple):
                        exposure = value[0] / value[1]
                    else:
                        exposure = float(value)
                        denominator = int(1 / exposure)
                        image_infos[i] = f"1/{denominator}s"
                elif i == "ISOSpeedRatings":
                    image_infos[i] = f"ISO {exif_datas[i]}"
                else:
                    image_infos[i] = exif_datas[i]
    except Exception as e:
        print(f"HIBA: {e}")
        exit(1)


def convert_heic_to_jpg(image_path: str):
    f_file, f_extension = image_path.split(".")
    if f_extension != "jpg":
        outfile = f_file + ".jpg"
        try:
            with Image.open(image_path) as im:
                im.save(outfile)
                return outfile
        except Exception as e:
            print(f"HIBA történt convertálás közben: {e}")
    else:
        return image_path


def main():
    image_path = "imgs/IMG_1827.heic"
    if not os.path.exists(image_path):
        print("HIBA: Nem található az alábbi fájl")
        exit(1)
    get_info(image_path=image_path)
    print(image_infos)


main()
