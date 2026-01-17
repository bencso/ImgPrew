class QueueItem:
    ALLOWED_OPTIONS = {"convert_img", "get_exif"}

    image_src: str

    def __init__(self, path: str, options: dict):
        self.image_src = path
        for key, value in options.items():
            if key in self.ALLOWED_OPTIONS:
                setattr(self, key, bool(value))
