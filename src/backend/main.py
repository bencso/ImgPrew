from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import base64
from .classes.wsmessage import WebSocketMessage

app = FastAPI()


@app.websocket("/ws/")
async def ws_check(websocket: WebSocket):
    await websocket.accept()
    imgs = []
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
                imgs.clear()
                file_bytes = server_message["bytes"]
                #! Memoryview: nem készít másolatot a bájtokról, csak egy ablakot nyit az eredeti bájtok fölött
                file_view = memoryview(file_bytes)
                #! Külön szeletekben küldjük, mert igy gyorsabb
                for slice_part in slices:
                    part_view = file_view[slice_part["start"] : slice_part["end"]]
                    part = base64.b64encode(part_view).decode("ascii")
                    sender.message = "filesuccess"
                    sender.data = part
                    await websocket.send_text(sender.send())
            if "text" in server_message:
                wsmess = WebSocketMessage.message_from_server(server_message["text"])

                if wsmess.message == "connect":
                    await websocket.send_text(sender.send())
                if wsmess.message == "error":
                    sender.message = wsmess.message
                    sender.data = wsmess.data if wsmess.data else "Ismeretlen hiba"
                    await websocket.send_text(sender.send())
                if wsmess.message == "fileUpload":
                    slices = wsmess.data["slices"]
                if wsmess.message == "close":
                    break
    except WebSocketDisconnect:
        print("A kliens bontotta a kapcsolatot")
