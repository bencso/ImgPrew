from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import json
from .classes.wsmessage import WebSocketMessage
from .classes.uploadedimage import UploadedImage
from .functions.caption_generator import CaptionGenerator

app = FastAPI()

@app.get("/status")
def status():
    return {"status": "ok"}

@app.websocket("/ws/")
async def ws_check(websocket: WebSocket):
    await websocket.accept()
    imgs: list[UploadedImage] = []
    slices = None
    sender = WebSocketMessage("info", f"Az új kapcsolat sikeresen létrejött")
    try:
        while True:
            try:
                server_message = await websocket.receive()
            except RuntimeError:
                print("A kliens bontotta a kapcsolatot")
                break

            if "bytes" in server_message:
                if not slices:
                    continue
                imgs.clear()
                file_bytes = server_message["bytes"]
                #! Memoryview: nem készít másolatot a bájtokról, csak egy ablakot nyit az eredeti bájtok fölött
                file_view = memoryview(file_bytes)
                #! Külön szeletekben küldjük, mert igy gyorsabb
                for slice_part in slices:
                    part_view = file_view[slice_part["start"] : slice_part["end"]]
                    img = UploadedImage(part_view)
                    imgs.append(img)
                    sender.message = "fileSuccess"
                    sender.data = img.encode_bytes()
                    await websocket.send_text(sender.send())
            if "text" in server_message:
                wsmess = WebSocketMessage.message_from_server(server_message["text"])

                if wsmess.message == "connect":
                    await websocket.send_text(sender.send())
                if wsmess.message == "error":
                    sender.message = wsmess.message
                    sender.data = wsmess.data if wsmess.data else "Ismeretlen hiba"
                    await websocket.send_text(sender.send())
                if wsmess.message == "newSession":
                    sender.message = "successNewSession"
                    sender.data = None
                    if len(imgs) > 0:
                        imgs.clear()
                        if slices is not None:
                            slices = None
                    await websocket.send_text(sender.send())
                if wsmess.message == "initImage":
                    try:
                        img_index = int(wsmess.data)
                        img = imgs[img_index]
                        img = img.get_img()

                        sender.message = "initSuccess"
                        caption_helper = CaptionGenerator(img=img)
                        caption_sample = (
                            caption_helper.getSampleForPhoto()
                            or []
                        )
                        sender.data = json.dumps(
                            {
                                "exifDatas": [item for _, item in caption_helper.getExifInfos().items()],
                                "id": img_index,
                                "caption_samples": caption_sample,
                            }
                        )
                        await websocket.send_text(sender.send())
                    except (IndexError, KeyError, ValueError) as e:
                        print("Hiba a kép megnyitásakor:", e)
                if wsmess.message == "fileUpload":
                    slices = wsmess.data["slices"]
                if wsmess.message == "export":
                    sender.message = "exportSuccess"
                    sender.data = json.dumps({})
                    await websocket.send_text(sender.send())
                if wsmess.message == "close":
                    break
    except WebSocketDisconnect:
        print("A kliens bontotta a kapcsolatot")
