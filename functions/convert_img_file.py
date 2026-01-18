from PIL import Image
import os
from dependencies import EXIF_TAG_NAMES_LIST, IMAGE_EXTENSIONS
from functions.get_exif_data import GetExifData


class ConvertExtensionImage:

    image_path: str
    output_extension: str
    allowed_info: list[EXIF_TAG_NAMES_LIST]

    def __init__(
        self,
        image_path: str,
        output_extension: IMAGE_EXTENSIONS,
        allowed_infos: list[EXIF_TAG_NAMES_LIST],
    ) -> str:
        self.image_path = image_path
        self.output_extension = output_extension
        self.allowed_info = allowed_infos

    def convert_image(self) -> str:
        f_name, f_extension = os.path.splitext(self.image_path)
        outfile = f"{f_name}.{self.output_extension}"
        if f_extension != self.output_extension:
            try:
                with Image.open(self.image_path) as img:
                    exif = GetExifData(image=img).get_exif_datas(img)
                    if exif:
                        allowed_set = set(self.allowed_info)
                        exif_data = Image.Exif()
                        for tag_name, value in exif.items():
                            key = value["key"]                            
                            if tag_name in allowed_set:
                                exif_data[key] = value["value"]
                        img.save(outfile, exif=exif_data)
                    else:
                        img.save(outfile)
                return outfile
            except Exception as e:
                print(f"HIBA: {e}")
                return self.image_path
        else:
            return outfile
