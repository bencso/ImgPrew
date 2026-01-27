EXIF_TAG_NAMES_LIST = [
    "Make",
    "Model",
    "Orientation",
    "XResolution",
    "YResolution",
    "ResolutionUnit",
    "Software",
    "DateTime",
    "HostComputer",
    "TileWidth",
    "TileLength",
    "ExifTag",
    "ExposureTime",
    "FNumber",
    "ExposureProgram",
    "ISOSpeedRatings",
    "ExifVersion",
    "DateTimeOriginal",
    "DateTimeDigitized",
    "OffsetTime",
    "OffsetTimeOriginal",
    "OffsetTimeDigitized",
    "ShutterSpeedValue",
    "ApertureValue",
    "BrightnessValue",
    "ExposureBiasValue",
    "MeteringMode",
    "Flash",
    "FocalLength",
    "SubjectArea",
    "MakerNote",
    "SubSecTimeOriginal",
    "SubSecTimeDigitized",
    "ColorSpace",
    "PixelXDimension",
    "PixelYDimension",
    "SensingMethod",
    "SceneType",
    "ExposureMode",
    "WhiteBalance",
    "DigitalZoomRatio",
    "FocalLengthIn35mmFilm",
    "LensSpecification",
    "LensMake",
    "LensModel",
    "GPSLatitudeRef",
    "GPSLatitude",
    "GPSLongitudeRef",
    "GPSLongitude",
    "GPSTimeStamp",
    "GPSDateStamp",
    "GPSHPositioningError",
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
    "RIGHT",
    "CENTER"
]

Y_AXIS = [
    "TOP",
    "BOTTOM",
    "CENTER"
]

CAPTION_REGEX=r"\[.*?\]"

CAPTIONS_SAMPLES={
    "pro": "Camera: [model]\nFNumber: [FNumber]"
}