import json
from typing import Annotated
from functions.resize_img import ResizeImg
from functions.convert_img_file import Export
from functions.lut import Lut
from fastapi import UploadFile, APIRouter, Form, File
from fastapi.responses import JSONResponse,Response
from functions.caption_generator import CaptionGenerator
from functions.border import Border
from classes.uploadedimage import UploadedImage
from PIL import ImageOps
from dependencies import IMAGE_EXTENSIONS
from functions.watermark import WaterMarking
import piexif
from functions.valid_colors import validColors
from functions.customtext import Text

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
async def exportImage(body: Annotated[str, Form(...)] = None, file: Annotated[UploadFile, File()] = None, lut: Annotated[UploadFile, File()] = None, copyright_image: Annotated[UploadFile, File()] = None):
    try:
        file_bytes = await file.read()
        image = UploadedImage(file_bytes)
        image = image.get_img()
        
        hald= None
        if lut:
            lut_file_bytes = await lut.read()
            hald = UploadedImage(lut_file_bytes)
            hald = hald.get_img()
        
        data = json.loads(body)
        file_extension = data.get("extension") or "jpg"
        
        allowed_infos = data.get("exif_data") or []        
        optimize = data.get("optimize") or False
        
        border_size = data.get("border_size") or 0
        
        border_size = int(border_size)
        border_color = validColors(data.get("border_color"))  or "#fff"
        
        texts = data.get("texts") or []
        print(texts)
        
        expand_mode = data.get("expand_mode") or "no"
        expand_size = data.get("expand_size") or None
        expand_color  = data.get("expand_color") or "#fff"
        expand_position = data.get("expand_position") or None
        
        exif_bytes = image.info.get("exif")
        exif_data = None
        
        if exif_bytes:
            try:
                exif_data = piexif.load(exif_bytes)
            except Exception as e:
                print("EXIF load error:", e)

        image = ImageOps.exif_transpose(image)
        
        if hald:
            lut_helper = Lut(hald, image)
            image = lut_helper.apply_hald()       
        
        if expand_mode != "no" and expand_mode != "border":
            crop_box = (float(expand_position["x"]), float(expand_position["y"]), float(expand_position["x"]) + expand_size["width"] , float(expand_position["y"])  + expand_size["height"])
            expand_helper = ResizeImg(image, height=expand_size["height"],width=expand_size["width"], expand=(True if expand_mode=="expand" else False),expand_bg=expand_color,padding=expand_size["padding"], crop_box=crop_box)
            image = expand_helper.apply()
            
        if border_size > 0:
            border_helper = Border(image,border_size, color=border_color)
            image = border_helper.apply()    
            
        if copyright_image is not None:
            cp_image = await copyright_image.read()
            cp = UploadedImage(cp_image)
            cp = cp.get_img()
            copyright_image_size = int(data.get("copyright_image_size")) or 0
            copyright_image_position = data.get("copyright_image_position")
            print(copyright_image_size)
            copyright_image_opacity = float(data.get("copyright_image_opacity")) or 100
            if isinstance(copyright_image_position["x"], str) and isinstance(copyright_image_position["y"], str):
                copyright_image_position = (str.upper(copyright_image_position["x"]),str.upper(copyright_image_position["y"]))
            else:
                copyright_image_position = (round(copyright_image_position["x"]),round(copyright_image_position["y"]))
            copyright_image_opacity = int((copyright_image_opacity / 100.0) * 255)
            image = WaterMarking(image, position=copyright_image_position,border_size=border_size).watermark_with_image(cp, copyright_image_size, copyright_image_opacity, border_size)
  
        if len(texts) > 0:
            texts_helper = Text(texts, image, border_size)
            image = texts_helper.generate_text()
    
        exporter = Export(image, output_extension=file_extension, exif_data=exif_data, allowed_infos=allowed_infos, optimized=optimize)
        exporter = exporter.apply()
        
        if(not isinstance(exporter,bytes)):
            raise Exception("Hiba történt az exportálás közben!")
                
        return Response(
            content=exporter,
            media_type="image/jpeg"
        )
    except Exception as ex:
        return JSONResponse(
            status_code=400,
            content={
                "message": f"{ex}",
            },
        )