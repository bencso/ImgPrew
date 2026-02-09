from typing import Optional
import json


class WebSocketMessage:
    def __init__(self, message: str, data: Optional[any | None]):
        self.message = message
        self.data = data

    def to_dict(self):
        return {"message": self.message, "data": self.data}

    def send(self):
        return str(json.dumps({"message": self.message, "data": self.data}))

    @classmethod
    def message_from_server(cls, server_message) -> "WebSocketMessage":
        wsm = json.loads(server_message)
        message = wsm.get("message")
        data = wsm.get("data")
        return cls(message, data)
