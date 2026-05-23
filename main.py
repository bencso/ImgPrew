# DEFAULT DEPS
import os
import piexif
import logging
from tqdm import tqdm
from queue import Queue

# PILLOW
from PIL import ImageOps, Image, ImageFilter
from pillow_heif import register_heif_opener

# FUNCTIONS
from functions.convert_img_file import ConvertExtensionImage
from functions.get_exif_data import GetExifData
from functions.resize_img import ResizeImg
from functions.watermark import WaterMarking
from functions.caption_generator import CaptionGenerator
from functions.lut import Lut
from functions.border import Border

# DEPENDENCIES
from dependencies import CAPTIONS_SAMPLES

# CLASSES
from classes.queueitem import QueueItem
from classes.customtext import Text

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)

register_heif_opener()

image_error = []

user_requests = [
    {
        "image_path": "src/IMG_0817.jpeg",
        #############################################
        "get_exif": False,
        "resize_img": False,
        "watermark": False,
        "border": False,
        "caption_generate": False,
        "lut": True,
        #############################################
        "custom_caption": None,
        "caption_generate_id": "insta",
        #############################################
        "watermark_position": ["CENTER", "BOTTOM"],
        "watermark_text": "LAJOSKÉRI",
        "watermark_opacity": 100,
        "watermark_size": 45,
        "watermark_color": "red",
        "watermark_weight": 900,
        "watermark_image": "/lfaafa/gag.png",
        #############################################
        "sample_size_id": 1,
        "expand": True,
        "expand_bg": None,
        #############################################
        "border_size": 14,
        "border_color": "FFFFF",
        #############################################
        "lut_path": "src/lut.png",
        #############################################
        "allowed_infos": [],
        "get_exif_datas": [
            "Model",
            "FNumber",
            "ExposureTime",
            "GPS",
        ],
        #############################################
        "output_extension": "",
    }
]


def main():
    image_queue = Queue(maxsize=15)
    logging.info("Feldolgozás indítása.")
    for user_request in user_requests:
        image_queue.put(
            QueueItem(
                path=user_request["image_path"],
                options={
                    "get_exif": user_request["get_exif"],
                    "resize_img": user_request["resize_img"],
                    "caption_generate": user_request["caption_generate"],
                    "caption_generate_id": user_request["caption_generate_id"],
                    "custom_caption": user_request["custom_caption"],
                    "lut": user_request["lut"],
                    "lut_path": user_request["lut_path"],
                    "watermark": user_request["watermark"],
                    "watermark_text": user_request["watermark_text"],
                    "watermark_image": user_request["watermark_image"],
                    "watermark_opacity": user_request["watermark_opacity"],
                    "watermark_weight": user_request["watermark_weight"],
                    "watermark_size": user_request["watermark_size"],
                    "watermark_color": user_request["watermark_color"],
                    "watermark_position": user_request["watermark_position"],
                    "border": user_request["border"],
                    "border_size": user_request["border_size"],
                    "border_color": user_request["border_color"],
                    "output_extension": user_request.get("output_extension"),
                    "sample_size_id": user_request.get("sample_size_id"),
                    "expand": user_request["expand"],
                    "expand_bg": user_request["expand_bg"],
                    "allowed_infos": user_request.get("allowed_infos"),
                    "get_exif_datas": user_request.get("get_exif_datas"),
                },
            )
        )

        total_images = image_queue.qsize()
        logging.info(f"{total_images} kép vár feldolgozásra.")

        with tqdm(total=total_images, desc="Képek feldolgozása") as pbar:
            while not image_queue.empty():
                item = image_queue.get()
                image_src = item.image_src

                if not os.path.exists(image_src):
                    logging.error(f"Nem található a kép: {image_src}")
                    image_error.append(image_src)
                    image_queue.task_done()
                    pbar.update(1)
                    continue

                try:
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
                            if item.caption_generate is True:
                                if user_request["custom_caption"] is not None:
                                    instagram_caption = user_request["custom_caption"]
                                else:
                                    instagram_caption = (
                                        CAPTIONS_SAMPLES.get(
                                            user_request["caption_generate_id"]
                                        )
                                        or user_request["custom_caption"]
                                    )
                                caption = CaptionGenerator(
                                    exif_info=None,
                                    instagram_caption=instagram_caption,
                                )
                                captions_keys = caption.getKeys()
                                for key in captions_keys:
                                    if key not in user_request["get_exif_datas"]:
                                        user_request["get_exif_datas"].extend(
                                            captions_keys
                                        )

                            exif_info_class = GetExifData(
                                image=image, image_data=user_request["get_exif_datas"]
                            )
                            exif_info = exif_info_class.get_info()
                            caption = CaptionGenerator(
                                exif_info=exif_info,
                                instagram_caption=instagram_caption,
                            )

                        # Caption generálás
                        if item.caption_generate is True:
                            caption = caption.generate()
                            logging.info(f"Generált caption: {caption}")

                        # LUT
                        if item.lut is True and user_request["lut_path"] is not None:
                            logging.info(f"LUT alkalmazása: {user_request["lut_path"]}")
                            with Lut(
                                image=image,
                                lut_path=user_request["lut_path"],
                            ) as lut:
                                image = lut.png_to_lut()

                        # Kép átméretezés
                        if item.resize_img is True:
                            logging.info("Kép átméretezése...")
                            with ResizeImg(
                                image=image,
                                sample_size_id=user_request["sample_size_id"],
                                expand=user_request["expand"],
                                expand_bg=user_request["expand_bg"],
                            ) as resize_img:
                                image = resize_img.apply()

                        # Képkeret hozzáadás
                        if item.border is True:
                            logging.info("Képkeret hozzáadása...")
                            with Border(
                                image=image,
                                border_size=user_request["border_size"],
                                color=user_request["border_color"],
                            ) as border:
                                image = border.apply()

                        # Vízjelezés
                        if item.watermark is True:
                            logging.info("Vízjel hozzáadása...")
                            with WaterMarking(
                                image=image,
                                text=Text(
                                    image=image,
                                    text=str(user_request["watermark_text"]),
                                    color=user_request["watermark_color"],
                                    size=user_request["watermark_size"],
                                    weight=user_request["watermark_weight"],
                                    opacity=int(user_request["watermark_opacity"]),
                                ),
                                position=user_request["watermark_position"],
                            ) as watermark_img:
                                image = watermark_img.apply(
                                    watermark_image=user_request["watermark_image"]
                                )

                        # Képkonvertálás
                        with ConvertExtensionImage(
                            image_path=image_src,
                            image=image,
                            exif_data=exif_dict,
                            output_extension=user_request["output_extension"],
                            allowed_infos=user_request["allowed_infos"],
                        ) as convert_image:
                            result_convert = convert_image.apply()

                            if isinstance(result_convert, dict):
                                c_image = result_convert["img"]
                                c_exif = result_convert["exif"]
                                c_file = result_convert["filename"]
                                if c_exif:
                                    c_image.save(c_file, exif=c_exif)
                                else:
                                    c_image.save(c_file)
                                logging.info(f"Sikeres kép feldolgozás. {c_file}")
                            else:
                                if exif_bytes_default is None:
                                    image.save(image_src)
                                else:
                                    image.save(image_src, exif=exif_bytes_default)
                                logging.info(f"Sikeres kép feldolgozás. {image_src}")
                except Exception as e:
                    logging.error(f"Hiba a kép feldolgozása közben: {image_src} - {e}")
                finally:
                    image_queue.task_done()
                    pbar.update(1)
        if len(image_error) > 0:
            logging.error(f"Hibás képek: {str.join(',',image_error)}")


if __name__ == "__main__":
    main()
