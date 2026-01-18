from typing import Literal

EXIF_TAG_NAMES_LIST = [
    # Kamera adatok
    "Make",
    "Model",
    # Lencse
    "LensModel",
    # Beállítások
    "FNumber",
    "ExposureTime",
    "ISOSpeedRatings",
    "FocalLength",
    "ExposureProgram",
    "WhiteBalance",
    "MeteringMode",
    # Idő
    "DateTimeOriginal",
    # Olyanok amik jól jöhetnek infónak
    "Flash",
    "GPSInfo",
]

IMAGE_EXTENSIONS = [
    "avif",
    "jpg",
    "jpeg",
    "png",
    "tiff",
    "webp",
]
