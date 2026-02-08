from typing import Optional
import json

class WebSocketMessage:
    def __init__(self, message: str, data: Optional[any | None]):
        self.message = message
        self.data = data

    def __enter__(self):
        return self

    def __exit__(self, *args):
        return {"message": self.message, "data": self.data}

    @classmethod
    def message_from_server(cls, server_message):
        print(json.loads(server_message))