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
import piexif
import re

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
        "image_path": "imgs/IMG_1840.jpg",
        "sample_size_id": 2,
        "border_size": 20,
        "allowed_infos": [],
        "get_exif_datas": [
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
                        # TODO: Ezeket áttenni külön funkcióba, és megcsinálni egy térképes megjelenítésre alkalmas teszt felületet
                        #? piexif.GPSIFD.GPSLongitude = ((degrees, 1), (minutes, 1), (seconds, 10000)).
                        #? piexif.GPSIFD.GPSLongitudeRef = 'E' (east) / 'W' (west)
                        #!   40/1   → 40 fok
                        #!   95/1   → 95 perc => 60 perc = 1 fok
                        #!   940/1000 → 0.94 másodperc => 3600 másodperc = 1 fok
                        #!   S / W -> negatív előjel
                        gpslong = exif_info["GPSLongitude"][1:-1]
                        gpslong_r = (
                            str(exif_info["GPSLongitudeRef"]).strip("b'").strip("")
                        )
                        gpslong_parts = []
                        for part in re.split(r"\),\s*\(", gpslong):
                            gpslong_parts.append(
                                [
                                    item.strip()
                                    for item in part.strip("()").strip().split(",")
                                ]
                            )
                        [d, m, s] = gpslong_parts
                        d_val = float(d[0]) / float(d[1])
                        m_val = float(m[0]) / float(m[1])
                        s_val = float(s[0]) / float(s[1])
                        long = d_val + m_val + s_val
                        if gpslong_r == "S" or gpslong_r == "W":
                            long = -long

                        gpslat = exif_info["GPSLatitude"][1:-1]
                        gpslat_r = (
                            str(exif_info["GPSLatitudeRef"]).strip("b'").strip("")
                        )
                        gpslat_parts = []
                        for part in re.split(r"\),\s*\(", gpslat):
                            gpslat_parts.append(
                                [
                                    item.strip()
                                    for item in part.strip("()").strip().split(",")
                                ]
                            )
                        [d, m, s] = gpslat_parts
                        d_val = float(d[0]) / float(d[1])
                        m_val = float(m[0]) / float(m[1])
                        s_val = float(s[0]) / float(s[1])
                        lat = d_val + m_val + s_val
                        if gpslat_r == "S" or gpslat_r == "W":
                            lat = -lat

                        print(
                            f"{int(float(d[0])/float(d[1]))}° {int(float(m[0])/float(m[1]))}' {float(s[0])/float(s[1]):.2f}\" {gpslat_r}"
                        )
                        print(
                            f"{int(float(gpslong_parts[0][0])/float(gpslong_parts[0][1]))}° {int(float(gpslong_parts[1][0])/float(gpslong_parts[1][1]))}' {float(gpslong_parts[2][0])/float(gpslong_parts[2][1]):.2f}\" {gpslong_r}"
                        )

                        print(f"lat:{lat} long: {long}")

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
