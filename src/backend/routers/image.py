from fastapi import UploadFile, APIRouter
from fastapi.responses import JSONResponse
from classes.uploadedimage import UploadedImage
from dependencies import IMAGE_EXTENSIONS

router = APIRouter(prefix="/images", tags=["images"])


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

        return JSONResponse(
            status_code=200,
            content={"message": "Sikeres feltöltés", "data": img.encode_bytes()},
        )
    except Exception as ex:
        return JSONResponse(
            status_code=400, content={"message": f"{ex}", "status": 400}
        )
