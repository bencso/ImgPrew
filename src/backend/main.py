from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from PIL import Image
import base64
import json
import io
from .classes.wsmessage import WebSocketMessage

app = FastAPI()


@app.websocket("/ws/")
async def ws_check(websocket: WebSocket):
    await websocket.accept()
    try:
        imgs = []
        while True:
            server_message = await websocket.receive()
            if "bytes" in server_message:
                file_bytes = server_message["bytes"]
                img_stream = io.BytesIO(file_bytes)
                with Image.open(img_stream) as img:
                    imgs.append(img)
            if "text" in server_message:
                wsmess = WebSocketMessage.message_from_server(server_message["text"])
                sender = WebSocketMessage("success", f"Sikeres kapcsolat")

                print(wsmess.message)
                if wsmess.message == "connect":
                    await websocket.send_text(sender.send())
                if wsmess.message == "error":
                    sender.message = wsmess.message
                    sender.data = wsmess.data if wsmess.data else "Ismeretlen hiba"
                    await websocket.send_text(sender.send())
                if wsmess.message == "upload":
                    sender.message = "success"
                    sender.data = "Sikeres fájlfeltöltés"
                    await websocket.send_text(sender.send())
                if wsmess.message == "close":
                    pass
    except WebSocketDisconnect:
        print("A kliens bontotta a kapcsolatot")
