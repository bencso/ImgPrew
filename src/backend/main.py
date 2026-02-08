from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import json
import io
from .classes.wsmessage import WebSocketMessage

app = FastAPI()


@app.websocket("/ws/")
async def ws_check(websocket: WebSocket):
    await websocket.accept()
    imgs = []
    slices = None
    try:
        while True:
            try:
                server_message = await websocket.receive()
            except RuntimeError:
                print("A kliens bontotta a kapcsolatot")
                break

            if "bytes" in server_message:
                imgs.clear()
                file_bytes = server_message["bytes"]
                if slices:
                    for slice_part in slices:
                        start = slice_part["start"]
                        end = slice_part["end"]
                        byte = file_bytes[start:end]
                        img_stream = io.BytesIO(byte)
                        imgs.append(img_stream)
                        await websocket.send_text(
                            WebSocketMessage(
                                message="successUpload", data=str(byte)
                            ).send()
                        )
            if "text" in server_message:
                wsmess = WebSocketMessage.message_from_server(server_message["text"])
                sender = WebSocketMessage(
                    "success", f"Az új kapcsolat sikeresen létrejött"
                )

                if wsmess.message == "connect":
                    await websocket.send_text(sender.send())
                if wsmess.message == "error":
                    sender.message = wsmess.message
                    sender.data = wsmess.data if wsmess.data else "Ismeretlen hiba"
                    await websocket.send_text(sender.send())
                if wsmess.message == "fileUpload":
                    slices = wsmess.data["slices"]
                    sender.message = "success"
                    sender.data = "Sikeres fájlfeltöltés"
                    await websocket.send_text(sender.send())
                if wsmess.message == "close":
                    break
    except WebSocketDisconnect:
        print("A kliens bontotta a kapcsolatot")
