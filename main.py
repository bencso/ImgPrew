from PIL import Image, ExifTags
from pillow_heif import register_heif_opener
import os
from tqdm import tqdm
from queue import Queue
from functions.convert_img_file import convert_to_jpg
from functions.get_exif_data import get_info
from functions.resize_img import resize_img
from models.queueitem import QueueItem

register_heif_opener()

image_error = []


def main():
    image_queue = Queue(maxsize=15)
    image_queue.put(
        QueueItem(
            path="imgs/IMG_1827.jpg",
            resize_sizes={"height": 250, "width": 150},
            options={
                "convert_img": True,
                "get_exif": True,
                "resize_img": True,
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
                continue
            # IDE JÖN A TÖBBI MÜVELET
            if item.convert_img is True:
                image_src = convert_to_jpg(image_src)
            if item.get_exif is True:
                exif_info = get_info(image_src)
                print(exif_info)
            if item.resize_img is True:
                resize_img(
                    image_src,
                    item.resize_img_sizes["height"],
                    item.resize_img_sizes["width"],
                )
            # --
            pbar.update(1)
    if len(image_error) > 0:
        print(f"Hiba történt: {str.join(",",image_error)}")


if __name__ == "__main__":
    main()
