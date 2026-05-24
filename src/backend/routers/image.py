import json

from fastapi import UploadFile, APIRouter, Form
from fastapi.responses import JSONResponse
from functions.caption_generator import CaptionGenerator
from classes.uploadedimage import UploadedImage
from dependencies import IMAGE_EXTENSIONS
from models.exportimage import ExportImage

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
                    item for _, item in caption_helper.getExifInfos().items()
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
async def exportImages(image: UploadFile, lut: UploadFile = None, data: ExportImage = None):
    try:
        file_bytes = await image.read()
        lut_file_bytes = await lut.read()
        uploaded_image = UploadedImage(file_bytes)
        lut_image = UploadedImage(lut_file_bytes)
        lut_image = lut_image.get_img()
        
        return JSONResponse(
            status_code=200,
            content={
                "message": f"Sikeres exportálás",
            },
            )
    except Exception as ex:
        return JSONResponse(
            status_code=400,
            content={
                "message": f"{ex}",
            },
        )