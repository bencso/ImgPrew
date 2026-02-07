from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
from PIL import Image
import io

app = FastAPI()


@app.websocket("/ws/")
async def create_upload_files(
    websocket: WebSocket,
):
    await websocket.accept()
    while True:
        data = await websocket.receive_bytes()
        with Image.open(io.BytesIO(data)) as img:
            buffer = io.BytesIO()
            img.save(buffer, format="PNG")
            buffer.seek(0)
            await websocket.send_bytes(data=buffer)


@app.get("/")
async def main():
    content = """
    
<body>
<h1>Fájlok feltöltése</h1>
    <input type="file" id="filename" multiple />
    <input type="button" value="Upload" onclick="sendFile()" />
    Képek
    <div id='images'>
    </div>
<script>
    var ws = new WebSocket("ws://localhost:8000/ws/");
    ws.binaryType = "arraybuffer";
    

    ws.onmessage = function (event) {
        const images = document.getElementById('images');
        const div = document.createElement('div');
        const img = document.createElement('img');

        const bytes = new Uint8Array(event.data);
        const blob = new Blob([bytes], { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);

        img.src = url;

        div.appendChild(img);
        images.appendChild(div);
    };
    
    function sendFile() {
        var files = document.getElementById('filename').files;
        for (const file of files){
            
        var reader = new FileReader();
        var rawData = new ArrayBuffer();            
        reader.loadend = function() {
        }
        reader.onload = function(e) {
            rawData = e.target.result;
            ws.send(rawData);
        }
        reader.readAsArrayBuffer(file);
        }
    }
    </script>
</body>
    """
    return HTMLResponse(content=content)
