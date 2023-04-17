from dotenv import load_dotenv
from ttm4115project.mqtt_handle import MQTTWrapperClient, MQTTMessage, MQTTHandle
from typing import Optional

load_dotenv()  # take environment variables from .env.

client = MQTTWrapperClient()
def handle_message(message: MQTTMessage) -> Optional[MQTTMessage]:
    print(message.to_dict())
    return MQTTMessage(event="pong")

client.create_handle("ttm4115project/test", handle_message).subscribe()
client.publish_message("ttm4115project/test/inbound", MQTTMessage(event="ping"))

while True:
    pass