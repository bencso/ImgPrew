from pillow_heif import register_heif_opener
import os
from PIL import Image
from tqdm import tqdm
from queue import Queue
from functions.convert_img_file import ConvertExtensionImage
from functions.get_exif_data import GetExifData
from functions.resize_img import ResizeImg
from classes.queueitem import QueueItem

register_heif_opener()

image_error = []

user_requests = [
    {
        "convert_img": True,
        "get_exif": True,
        "resize_img": True,
        "image_path": "imgs/18528152692_cb8cf20949_o.png",
        "sample_size_id": 3,
        "allowed_infos": ["FNumber", "Model"],
        "get_exif_datas": ["FNumber", "Model"],
        "output_extension": "png",
    }
]


def main():
    image_queue = Queue(maxsize=15)
    for user_request in user_requests:
        image_queue.put(
            QueueItem(
                path=user_request["image_path"],
                options={
                    "convert_img": user_request["convert_img"],
                    "get_exif": user_request["get_exif"],
                    "resize_img": user_request["resize_img"],
                    "sample_size_id": user_request.get("sample_size_id"),
                    "allowed_infos": user_request.get("allowed_infos"),
                    "get_exif_datas": user_request.get("get_exif_datas"),
                    "output_extension": user_request.get("output_extension"),
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

                exif_info = None

                if item.convert_img is True:
                    convert_image_c = ConvertExtensionImage(
                        image_path=image_src,
                        output_extension=user_request["output_extension"],
                        allowed_infos=user_request["allowed_infos"],
                    )
                    result_convert = convert_image_c.convert_image()
                    print(result_convert)
                    image_src = result_convert
                
                if item.get_exif is True:
                    exif_info = GetExifData(
                        image_path=image_src, image_data=user_request["get_exif_datas"]
                    )
                    exif_info = exif_info.get_info()
                    print(exif_info)
                    
                if item.resize_img is True:
                    resize_img = ResizeImg(
                        image_path=image_src, sample_size_id=user_request["sample_size_id"]
                    )
                    image_src = resize_img.resize_img()
                    
                image_queue.task_done()
                pbar.update(1)
        if len(image_error) > 0:
            print(f"Hiba történt: {str.join(",",image_error)}")


if __name__ == "__main__":
    main()
