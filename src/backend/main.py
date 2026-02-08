from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from PIL import Image
import io
from .classes.wsmessage import WebSocketMessage

app = FastAPI()


@app.websocket("/ws/")
async def ws_check(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            server_message = await websocket.receive_text()
            wsmess = WebSocketMessage.message_from_server(server_message)
            print(wsmess)
            if wsmess.message == "connect":
                await websocket.send_text("Sikeresen létrejött a kapcsolat! Pong!")
            if wsmess.message == "error":
                print(f"Hiba történt a ws-sel: {wsmess.message}")
            if wsmess.message == "upload":
                print(wsmess.data)
            if wsmess.message == "close":
                pass
    except WebSocketDisconnect:
        print("A kliens bontotta a kapcsolatot")
