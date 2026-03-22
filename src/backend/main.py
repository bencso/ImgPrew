from fastapi import FastAPI
from fastapi.responses import JSONResponse
from routers import image

app = FastAPI()

app.include_router(image.router)


@app.get("/status")
def status():
    return JSONResponse(status_code=200, content={"status": "OK"})
