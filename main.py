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
from PIL import Image
from dependencies import CAPTIONS_SAMPLES
from geopy.geocoders import Nominatim
from io import BytesIO
import piexif

register_heif_opener()

# TODO: Mai feladatok: Watermark: Saját logó feltöltés

image_error = []

user_requests = [
    {
        "get_exif": True,
        "resize_img": False,
        "watermark": False,
        "border": False,
        "caption_generate": False,
        "caption_generate_id": None,
        "instagram_caption": f"Ez nagyon komoly kép lesz!\n[Model]",
        "watermark_text": "LAJOSKÉRI",
        "watermark_opacity": 1,
        "watermark_image": "imgs/teszt.png",
        "watermark_position": ["RIGHT", "BOTTOM"],
        "image_path": "imgs/IMG_1839.HEIC",
        "sample_size_id": 2,
        "border_size": 20,
        "allowed_infos": [],
        "get_exif_datas": ["GPSLatitude", "GPSLongitude"],
        "output_extension": "jpeg",
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

                if not os.path.exists(image_src):
                    image_error.append(image_src)
                    image_queue.task_done()
                    pbar.update(1)
                    continue

                with Image.open(item.image_src) as img:
                    s = BytesIO()
                    img.save(s, format="JPEG", exif=img.info.get("exif"))
                    s.seek(0)

                    exif = piexif.load(s.getvalue())
                    exif_bytes_default = piexif.dump(exif)
                    image = img

                    # Exif adat kinyerés
                    if item.get_exif is True or item.caption_generate is True:
                        exif_info_class = GetExifData(
                            image=image, image_data=user_request["get_exif_datas"]
                        )
                        exif_info = exif_info_class.get_info()
                        # piexif.GPSIFD.GPSLongitude = ((degrees, 1), (minutes, 1), (seconds, 10000)).
                        # piexif.GPSIFD.GPSLongitudeRef = 'E' (east) / 'W' (west)
                        # TODO: Ezt kell majd átalakítani normális koordinátára utánanézni hogy lehet ezt
                        print(exif)

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

                    image.info["exif"] = exif_bytes_default

                    # Képkonvertálás
                    convert_image = ConvertExtensionImage(
                        image_path=image_src,
                        image=image,
                        output_extension=user_request["output_extension"],
                        allowed_infos=user_request["allowed_infos"],
                    )

                    result_convert = convert_image.convert_image()

                    if isinstance(result_convert, dict):
                        c_image = result_convert["img"]
                        c_exif = result_convert["exif"]
                        c_file = result_convert["filename"]
                        if c_exif is None:
                            c_image.save(image_src)
                        else:
                            c_image.save(c_file, exif=c_exif)
                    else:
                        if exif is None:
                            image.save(image_src)
                        else:
                            image.save(image_src, exif=exif_bytes_default)

                    image_queue.task_done()
                    pbar.update(1)
        if len(image_error) > 0:
            print(f"Hiba történt: {str.join(',',image_error)}")


if __name__ == "__main__":
    main()
