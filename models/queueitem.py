class QueueItem:
    ALLOWED_OPTIONS = {"convert_img", "get_exif","resize_img"}

    image_src: str
    resize_img_sizes: dict

    def __init__(self, path: str, options: dict, resize_sizes: dict):
        self.image_src = path
        self.resize_img_sizes=resize_sizes
        for key, value in options.items():
            if key in self.ALLOWED_OPTIONS:
                setattr(self, key, value)
