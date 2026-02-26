from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import json
from .classes.wsmessage import WebSocketMessage
from .classes.uploadedimage import UploadedImage
from .functions.get_exif_data import GetExifData
from .functions.caption_generator import CaptionGenerator
from .dependencies import CAPTIONS_SAMPLES

app = FastAPI()


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
                if wsmess.message == "initImage":
                    try:
                        print(wsmess.data)
                        img_index = int(wsmess.data)
                        img = imgs[img_index]
                        img = img.get_img()
                        test = GetExifData(img, ["FNumber"])
                        sender.message = "initSuccess"
                        exif_datas = test.get_exif_datas()
                        exif_keys = list(exif_datas.keys()) if isinstance(exif_datas, dict) else list(exif_datas or [])
                        caption_sample = CaptionGenerator(exif_info=exif_keys).getSampleForPhoto() or []
                        sender.data = json.dumps(
                            {"exifDatas": exif_keys, "id": img_index, "caption_samples": caption_sample}
                        )
                        await websocket.send_text(sender.send())
                    except (IndexError, KeyError, ValueError) as e:
                        print("Hiba a kép megnyitásakor:", e)
                if wsmess.message == "fileUpload":
                    slices = wsmess.data["slices"]
                if wsmess.message == "close":
                    break
    except WebSocketDisconnect:
        print("A kliens bontotta a kapcsolatot")
