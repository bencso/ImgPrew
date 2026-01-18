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

SOCIAL_IMAGES_SIZES = {
    1: {"platform": "instagram", "type": "square", "width": 1080, "height": 1080},
    2: {"platform": "instagram", "type": "portrait", "width": 1080, "height": 1350},
    3: {"platform": "instagram", "type": "landscape", "width": 1080, "height": 566},
    4: {"platform": "facebook", "type": "feed", "width": 1200, "height": 630},
    5: {"platform": "facebook", "type": "square", "width": 1200, "height": 1200},
    6: {"platform": "twitter", "type": "landscape", "width": 1200, "height": 675},
    7: {"platform": "twitter", "type": "square", "width": 1080, "height": 1080},
}

X_AXIS = [
    "LEFT",
    "RIGHT"
]

Y_AXIS = [
    "TOP",
    "BOTTOM"
]