import json
from typing import Annotated
from functions.convert_img_file import Export
from functions.lut import Lut
from fastapi import UploadFile, APIRouter, Form, File
from fastapi.responses import JSONResponse
from functions.caption_generator import CaptionGenerator
from functions.border import Border
from classes.uploadedimage import UploadedImage
from dependencies import IMAGE_EXTENSIONS
from functions.watermark import WaterMarking
import piexif
from functions.valid_colors import validColors

router = APIRouter(prefix="/images", tags=["images"])

# TODO: Itt azt kell csinálni majd, hogy az adatbázisba fel küldjük rögtön a sessionok közé (amit elkezdtünk képeket szerkeszteni ott fogjuk tárolni "automatikus mentés dologgal")
@router.post("/upload")
async def uploadImage(file: UploadFile):
    try:
        accepted_files = ["image/" + x.lower() for x in IMAGE_EXTENSIONS]
        if file.content_type not in accepted_files:
            raise Exception(
                f"Hibás fájlformátum, az alábbi fájlokat fogadjuk el: {str.join(', ', IMAGE_EXTENSIONS)}"
            )
        file_bytes = await file.read()
        img = UploadedImage(file_bytes)

        caption_helper = CaptionGenerator(img=img.get_img())
        caption_sample = caption_helper.getSampleForPhoto() or []
        
        data = json.dumps(
            {
                "exif_data": [
                    {
                     "key": key,
                     "item": item
                     } for key, item in caption_helper.getExifInfos().items()
                ],
                "caption_samples": caption_sample,
                "byte": img.encode_bytes(),
            }
        )

        return JSONResponse(
            status_code=200,
            content={
                "message": "Sikeres feltöltés",
                "data": data,
            },
        )
    except Exception as ex:
        return JSONResponse(
            status_code=400,
            content={
                "message": f"{ex}",
            },
        )

@router.post("/export")
async def exportImages(body: Annotated[str, Form(...)] = None, file: Annotated[UploadFile, File()] = None, lut: Annotated[UploadFile, File()] = None, copyright_image: Annotated[UploadFile, File()] = None):
    try:
        file_bytes = await file.read()
        lut_file_bytes = await lut.read()
        image = UploadedImage(file_bytes)
        hald = UploadedImage(lut_file_bytes)
        image = image.get_img()
        hald = hald.get_img()
        
        data = json.loads(body)
        file_extension = data.get("extension") or "jpg"
        allowed_infos = data.get("exif_data") or []
        border_size = data.get("border_size") or 0
        border_color = validColors(data.get("border_color"))  or "#fff"
        
        exif_bytes = image.info.get("exif")
        if exif_bytes:
            exif_data = piexif.load(exif_bytes)
        
        lut_helper = Lut(hald, image)
        image = lut_helper.apply_hald()
            
        if copyright_image is not None:
            cp_image = await copyright_image.read()
            cp = UploadedImage(cp_image)
            cp = cp.get_img()
            copyright_image_size = int(data.get("copyright_image_size")) or 0
            copyright_image_position = data.get("copyright_image_position")
            copyright_image_opacity = float(data.get("copyright_image_opacity")) or 100
            
            copyright_image_position = (str.upper(copyright_image_position["x"]),str.upper(copyright_image_position["y"]))
            copyright_image_opacity = int((copyright_image_opacity / 100.0) * 255)
            image = WaterMarking(image, position=copyright_image_position).watermark_with_image(cp, copyright_image_size, copyright_image_opacity)
  
        border_helper = Border(image,border_size, color=border_color)
        image = border_helper.apply()
        
        exporter = Export(image, output_extension=file_extension, exif_data=exif_data, allowed_infos=allowed_infos)
        exporter = exporter.apply()
        
        if(exporter is not True):
            raise Exception("Hiba történt az exportálás közben!")
                
        return JSONResponse(
            status_code=200,
            content={
                "message": "Sikeres",
            },
        )
    except Exception as ex:
        return JSONResponse(
            status_code=400,
            content={
                "message": f"{ex}",
            },
        )