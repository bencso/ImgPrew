from PIL import Image
import os
from dependencies import ExifTagNames
from functions.get_exif_data import get_exif_datas
import piexif

class ConvertExtensionImage:

    image_path: str
    output_extension: str
    allowed_info: list[ExifTagNames]

    def __init__(
        self, image_path: str, output_extension: str, allowed_infos: list[ExifTagNames]
    ) -> None:
        self.image_path = image_path
        self.output_extension = output_extension
        self.allowed_info = allowed_infos

    def convert_image(self) -> str:
        f_name, f_extension = os.path.splitext(self.image_path)
        if f_extension != "jpg":
            outfile = f_name + ".jpg"
            try:
                with Image.open(self.image_path) as img:
                    exif_data = get_exif_datas(self.image_path)
                    return_exif = {}

                    allowed_set = set(self.allowed_info)

                    for data in exif_data:
                        tag_id = data["key"]
                        tag_name = data["value"]
                        if tag_name in allowed_set:
                            return_exif[tag_name] = exif_data.get(tag_id)
                    exif_bytes = piexif.dump(return_exif)
                    img.save(outfile, exif=exif_bytes)
                os.remove(self.image_path)
                return outfile
            except Exception as e:
                print(f"HIBA konvertálás közben: {e}")
        else:
            return self.image_path
