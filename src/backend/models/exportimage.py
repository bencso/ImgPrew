from pydantic import BaseModel
from fastapi import UploadFile
from dependencies import IMAGE_EXTENSIONS

class CropBox(BaseModel):
    x: int
    y: int
    width: int
    height: int
    
class Expand(BaseModel):
    size: tuple[int, int]
    background: str
    
class Border(BaseModel):
    size: tuple[int, int]
    color: str

class ExportImage(BaseModel):
    extension: str
    exifDatas: set[str] = set()
    crop: CropBox | None = None
    expand: Expand  | None = None
    border: Border  | None = None