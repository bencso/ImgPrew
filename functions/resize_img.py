
from PIL import Image

def resize_img(image_path: str, height: int, width: int):
    try:
        with Image.open(image_path) as img:
            img.thumbnail(tuple([height,width]))    
            f_f,f_ext = image_path.split(".")
            img.save(f"{f_f}_{height}_{width}.{f_ext}")    
    except Exception as ex:
        print(f"HIBA: {ex}")