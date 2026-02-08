from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
from PIL import Image
import io
from .classes.wsmessage import WebSocketMessage

app = FastAPI()


@app.websocket("/ws/")
async def ws_check(
    websocket: WebSocket,
):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        wsmess = WebSocketMessage.message_from_server(data)
        await websocket.send_text(f"Websocket kapcsolat sikeres")
