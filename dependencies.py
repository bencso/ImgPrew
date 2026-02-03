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
    "GPS",
    "GPSLatitude",
    "GPSLongitude",
    "GPSLongitudeRef",
    "GPSLatitudeRef",
]

LUT_SIZE_REGEX = r"^LUT_3D_SIZE\s+(\d+)"
LUT_DATA_REGEX = r"^\s*-?\d+\.\d+\s+-?\d+\.\d+\s+-?\d+\.\d+"

IMAGE_EXTENSIONS = [
    "avif",
    "jpg",
    "jpeg",
    "png",
    "tiff",
    "webp",
]

FONT_SIZES = {
    "small": 13,
    "body": 16,
    "medium": 16,
    "large": 18,
    "x-large": 24,
    "xx-large": 32,
    "xxx-large": 48,
    "heading_large": 64,
}

FONT_WEIGHTS = {
    "thin": 100,
    "extra_light": 200,
    "light": 300,
    "normal": 400,
    "medium": 500,
    "semi_bold": 600,
    "bold": 700,
    "extra_bold": 800,
    "black": 900,
    "hairline": 100,
    "regular": 400,
    "body": 400,
    "heading": 700,
}


SOCIAL_IMAGES_SIZES = {
    1: {"platform": "instagram", "type": "square", "width": 1080, "height": 1080},
    2: {"platform": "instagram", "type": "portrait", "width": 1080, "height": 1350},
    3: {"platform": "instagram", "type": "landscape", "width": 1080, "height": 566},
    4: {"platform": "facebook", "type": "feed", "width": 1200, "height": 630},
    5: {"platform": "facebook", "type": "square", "width": 1200, "height": 1200},
    6: {"platform": "twitter", "type": "landscape", "width": 1200, "height": 675},
    7: {"platform": "twitter", "type": "square", "width": 1080, "height": 1080},
}

X_AXIS = ["LEFT", "RIGHT", "CENTER"]

Y_AXIS = ["TOP", "BOTTOM", "CENTER"]

CAPTION_REGEX = r"\[.*?\]"

CAPTIONS_SAMPLES = {
    "insta": "📸 [Model] | [FNumber] | ⏱ [ExposureTime]s | 📍 [GPS]",
    "basic": "Shot on [Model] 📸",
    "detailed": "📷 [Make] [Model]\n🔍 [LensModel]\n[FNumber]",
    "exposure": "⏱ [ExposureTime]s | ISO [ISOSpeedRatings]",
    "full": "📷 [Make] [Model]\n🔍 [LensModel]\n[FNumber] | ⏱ [ExposureTime] | ISO [ISOSpeedRatings]",
    "date": "📅 [DateTimeOriginal]",
    "location": "📍 [GPS]",
    "fb": "📅 [DateTimeOriginal] | [Model]",
    "twitter": "🐦 [Model] | ISO [ISOSpeedRatings]",
    "lens": "🔍 [LensMake] [LensModel]",
    "all": "📷 [Make] [Model]\n🔍 [LensModel]\n[FNumber] | ⏱ [ExposureTime] | ISO [ISOSpeedRatings]\n📅 [DateTimeOriginal]\n📍 [GPS]",
}
