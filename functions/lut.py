import re
from PIL import ImageFilter, Image
from dependencies import LUT_SIZE_REGEX, LUT_DATA_REGEX
import io
import imageio.v3 as iio
import numpy as np

class Lut:
    def __init__(self, lut_path: str, image=Image.Image):
        self.lut_path = lut_path
        self.image = image

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.buffer = io.BytesIO()
        self.image.save(self.buffer, format="PNG")
        self.buffer.seek(0)
    
    def png_to_lut(self):
        img_datas = iio.imread(self.lut_path)
        
        lut_size = len(img_datas)
        lut_table = []
        
        
        for b in range(lut_size):
            for g in range(lut_size):
                for r in range(lut_size):
                    x = b*lut_size+r
                    y = g                    
                    colors = np.array(img_datas[y][x][:3])
                    lut_row = tuple(colors/255)
                    lut_table.append(lut_row)
        lut = ImageFilter.Color3DLUT(lut_size, lut_table)
        return self.image.filter(lut)    

    def apply(self):
        with open(self.lut_path) as f:
            native_lut = f.read()

            lut_size_match = re.search(LUT_SIZE_REGEX, native_lut, re.MULTILINE)
            lut_size = int(lut_size_match.group(1)) if lut_size_match else None
            lut_data_match = re.search(LUT_DATA_REGEX, native_lut, re.MULTILINE)

            if lut_data_match:
                lut_data_index = lut_data_match.start()
                lut_lines = native_lut[lut_data_index:].splitlines()
                if lut_size is not None:
                    lut_table = []
                    for line in lut_lines:
                        line = line.strip()
                        if not line:
                            continue
                        if len(lut_table) < lut_size**3:
                            parts = line.strip().split()
                            if len(parts) == 3:
                                r, g, b = map(float, parts)
                                lut_table.append((r, g, b))
                else:
                    pass

            lut = ImageFilter.Color3DLUT(lut_size, lut_table)
            return self.image.filter(lut)
