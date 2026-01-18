from typing import Literal

ExifTagNames = Literal[
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

ImageExtensions = Literal[
    "avif",
    "jpg",
    "jpeg",
    "png",
    "tiff",
    "webp",
]
