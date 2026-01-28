from pillow_heif import register_heif_opener
import os
from tqdm import tqdm
from queue import Queue
from PIL import ImageOps, Image
from functions.convert_img_file import ConvertExtensionImage
from functions.get_exif_data import GetExifData
from functions.resize_img import ResizeImg
from functions.watermark import WaterMarking
from functions.caption_generator import CaptionGenerator
from classes.queueitem import QueueItem
from PIL import Image, ImageFilter
from dependencies import CAPTIONS_SAMPLES
import piexif
import re

register_heif_opener()

image_error = []


user_requests = [
    {
        "get_exif": False,
        "resize_img": False,
        "watermark": False,
        "border": False,
        "caption_generate": False,
        "lut": False,
        "caption_generate_id": None,
        "instagram_caption": f"Ez nagyon komoly kép lesz!\n[Model]",
        "watermark_text": "LAJOSKÉRI",
        "watermark_opacity": 1,
        "watermark_image": "imgs/teszt.png",
        "watermark_position": ["RIGHT", "BOTTOM"],
        "image_path": "imgs/IMG_1842.jpg",
        "sample_size_id": 2,
        "border_size": 20,
        "lut_path": "luts/PictureFX-Acros-100-II-RedFilter.cube",
        "allowed_infos": [],
        "get_exif_datas": [
            "GPS",
            "GPSLatitude",
            "GPSLongitude",
            "GPSLongitudeRef",
            "GPSLatitudeRef",
        ],
        "output_extension": "",
    }
]


def main():
    image_queue = Queue(maxsize=15)
    for user_request in user_requests:
        image_queue.put(
            QueueItem(
                path=user_request["image_path"],
                options={
                    "get_exif": user_request["get_exif"],
                    "resize_img": user_request["resize_img"],
                    "caption_generate": user_request["caption_generate"],
                    "caption_generate_id": user_request["caption_generate_id"],
                    "instagram_caption": user_request["instagram_caption"],
                    "lut": user_request["lut"],
                    "lut_path": user_request["lut_path"],
                    "watermark": user_request["watermark"],
                    "watermark_text": user_request["watermark_text"],
                    "watermark_image": user_request["watermark_image"],
                    "watermark_opacity": user_request["watermark_opacity"],
                    "watermark_position": user_request["watermark_position"],
                    "border": user_request["border"],
                    "border_size": user_request["border_size"],
                    "output_extension": user_request.get("output_extension"),
                    "sample_size_id": user_request.get("sample_size_id"),
                    "allowed_infos": user_request.get("allowed_infos"),
                    "get_exif_datas": user_request.get("get_exif_datas"),
                },
            )
        )

        total_images = image_queue.qsize()

        with tqdm(total=total_images, desc="Képek feldolgozása") as pbar:
            while not image_queue.empty():
                item = image_queue.get()
                image_src = item.image_src

                # TODO: Folytatni!
                # TODO: 3D LUT .cube fájlok beolvasása:
                #   -> ki kell szürni elsőnek a headert (TITLE, LUT_3D_SIZE, DOMAIN_MIN, DOMAIN_MAX, kommentek amik #-el kezdődnek)
                #   -> minden sor 3 float-ból áll RGB
                #   -> majd az ImageFilter.Color3DLUT konstruktornak átadni a LUT_3D_SIZE-t, illetve a RGB Táblázatot ami *flat*elve van / vagy tuple (alapból az)

                if not os.path.exists(image_src):
                    image_error.append(image_src)
                    image_queue.task_done()
                    pbar.update(1)
                    continue

                with Image.open(item.image_src) as img:
                    exif_bytes = img.info.get("exif")
                    if exif_bytes:
                        exif_dict = piexif.load(exif_bytes)
                        exif_bytes_default = piexif.dump(exif_dict)
                    else:
                        exif_dict = {}
                        exif_bytes_default = None
                    image = img.copy()

                    # Exif adat kinyerés
                    if item.get_exif is True or item.caption_generate is True:
                        exif_info_class = GetExifData(
                            image=image, image_data=user_request["get_exif_datas"]
                        )

                        exif_info = exif_info_class.get_info()
                        print(exif_info)

                    # Caption generálás
                    if item.caption_generate is True:
                        if user_request["caption_generate_id"] is None:
                            instagram_caption = user_request["instagram_caption"]
                        else:
                            instagram_caption = (
                                CAPTIONS_SAMPLES.get(
                                    user_request["caption_generate_id"]
                                )
                                or user_request["instagram_caption"]
                            )
                        caption = CaptionGenerator(
                            exif_info=exif_info,
                            instagram_caption=instagram_caption,
                        ).generate()
                        print(caption)

                    # LUT
                    if item.lut is True:
                        with open(user_request.get("lut_path")) as f:
                            native_lut = f.read()

                            LUT_SIZE_REGEX = r"^LUT_3D_SIZE\s+(\d+)"
                            LUT_DATA_REGEX = r"^#LUT data points\s"

                            lut_size_match = re.search(
                                LUT_SIZE_REGEX, native_lut, re.MULTILINE
                            )
                            lut_size = (
                                int(lut_size_match.group(1)) if lut_size_match else None
                            )
                            lut_data_match = re.search(
                                LUT_DATA_REGEX, native_lut, re.MULTILINE
                            )

                            if lut_data_match:
                                lut_data_index = lut_data_match.start()
                                lut_lines = native_lut[lut_data_index:].splitlines()
                                if lut_lines and lut_lines[0].startswith(
                                    "#LUT data points"
                                ):
                                    lut_lines = lut_lines[1:]
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
                            image = image.filter(lut)

                    # Kép átméretezés
                    if item.resize_img is True:
                        resize_img = ResizeImg(
                            image=image,
                            sample_size_id=user_request["sample_size_id"],
                        )
                        image = resize_img.resize_img()

                    # Képkeret hozzáadás
                    if item.border is True:
                        img_with_border = ImageOps.expand(
                            image=image,
                            border=user_request["border_size"],
                            fill="white",
                        )
                        image = img_with_border

                    # Vízjelezés
                    if item.watermark is True:
                        watermark_img = WaterMarking(
                            image=image,
                            text=str(user_request["watermark_text"]),
                            position=user_request["watermark_position"],
                            watermark_image=user_request["watermark_image"],
                            text_opacity=user_request["watermark_opacity"],
                        )

                        if len(user_request["watermark_image"]) > 0:
                            image = watermark_img.create_watermark_image()
                        else:
                            image = watermark_img.create_watermark()

                    # Képkonvertálás
                    convert_image = ConvertExtensionImage(
                        image_path=image_src,
                        image=image,
                        exif_data=exif_dict,
                        output_extension=user_request["output_extension"],
                        allowed_infos=user_request["allowed_infos"],
                    )

                    result_convert = convert_image.convert_image()

                    if isinstance(result_convert, dict):
                        c_image = result_convert["img"]
                        c_exif = result_convert["exif"]
                        c_file = result_convert["filename"]
                        if c_exif:
                            c_image.save(c_file, exif=c_exif)
                        else:
                            c_image.save(c_file)
                    else:
                        if exif_bytes_default is None:
                            image.save(image_src)
                        else:
                            image.save(image_src, exif=exif_bytes_default)

                    image_queue.task_done()
                    pbar.update(1)
        if len(image_error) > 0:
            print(f"Hiba történt: {str.join(',',image_error)}")


if __name__ == "__main__":
    main()
