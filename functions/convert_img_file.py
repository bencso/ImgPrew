from PIL import Image
import os

def convert_to_jpg(image_path: str):
    # TODO: Mikor convertelünk minden dict adat maradjon benne a képen (vagy akár ezt is lehet megmondani hogy mit szeretne a user)
    f_file, f_extension = image_path.split(".")
    if f_extension != "jpg":
        outfile = f_file + ".jpg"
        try:
            with Image.open(image_path) as im:
                os.remove(image_path)
                im.save(outfile)
                return outfile
        except Exception as e:
            print(f"HIBA konvertálás közben: {e}")
    else:
        return image_path