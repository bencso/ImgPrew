class QueueItem:
    ALLOWED_FEATURES = {"convert_img", "get_exif", "resize_img","watermark", "border"}

    image_src: str

    def __init__(self, path: str, options: dict):
        self.image_src = path
        for key, value in options.items():
            if key in self.ALLOWED_FEATURES:
                setattr(self, key, value)