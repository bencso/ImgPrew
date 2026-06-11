import re
from PIL import ImageFilter, Image
from dependencies import LUT_SIZE_REGEX, LUT_DATA_REGEX
import io
import imageio.v3 as iio
import numpy as np

class Lut:
    def __init__(self, hald: Image.Image, image=Image.Image, cube: str = None):
        self.hald = hald
        self.image = image
        self.cube = cube

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.buffer = io.BytesIO()
        self.image.save(self.buffer, format="PNG")
        self.buffer.seek(0)
        
    def apply_hald(self):
        img_datas = np.array(self.hald.convert('RGB'))
        lut_size,_,_ = img_datas.shape
        print(lut_size)
        
        lut_table = img_datas.reshape((lut_size, lut_size, lut_size, 3))
        lut_table = lut_table.transpose((1, 0,2, 3)).reshape(-1, 3) / 255.0
        lut_table = list(map(tuple, lut_table))
        
        lut = ImageFilter.Color3DLUT(lut_size, lut_table)
        return self.image.convert('RGB').filter(lut)

    def apply(self):
        with open(self.cube) as f:
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
                        if lut_table and len(lut_table) < lut_size**3:
                            parts = line.strip().split()
                            if parts and len(parts) == 3:
                                r, g, b = map(float, parts)
                                lut_table.append((r, g, b))
                else:
                    pass

            lut = ImageFilter.Color3DLUT(lut_size, lut_table)
            return self.image.filter(lut)
