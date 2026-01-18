from PIL import Image, ExifTags
import os
from dependencies import ExifTagNames, ImageExtensions
from functions.get_exif_data import get_exif_datas


class ConvertExtensionImage:

    image_path: str
    output_extension: str
    allowed_info: list[ExifTagNames]

    def __init__(
        self,
        image_path: str,
        output_extension: ImageExtensions,
        allowed_infos: list[ExifTagNames],
    ) -> str:
        self.image_path = image_path
        self.output_extension = output_extension
        self.allowed_info = allowed_infos

    def convert_image(self) -> str:
        f_name, f_extension = os.path.splitext(self.image_path)
        if f_extension != self.output_extension:
            outfile = f"{f_name}.{self.output_extension}"
            try:
                with Image.open(self.image_path) as img:
                    exif = get_exif_datas(img=img)
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
                import traceback

                traceback.print_exc()
                return self.image_path
        else:
            return self.image_path
