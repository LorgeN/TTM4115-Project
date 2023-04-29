from typing import Dict, Callable, Optional
from ttm4115project.utils.logging import create_logger
import os
import paho.mqtt.client as mqtt
import json

LOGGER = create_logger(__name__)


class MQTTMessage:
    def __init__(self, event: str, data: Dict[str, str] = {}) -> None:
        self.event = event
        self.data = data

    @classmethod
    def from_str(cls, data: str) -> "MQTTMessage":
        return cls.from_dict(json.loads(data))

    @classmethod
    def from_dict(cls, data: Dict[str, str]) -> "MQTTMessage":
        return cls(data["event"], data.get("data", {}))

    def to_dict(self) -> Dict[str, str]:
        return {"event": self.event, "data": self.data}

    def __repr__(self) -> str:
        return f"MQTTMessage(event={self.event}, options={self.data})"


class MQTTHandle:
    def __init__(
        self,
        client: "MQTTWrapperClient",
        topic: str,
        on_message: Callable[[MQTTMessage], Optional[MQTTMessage]] = None,
    ) -> None:
        self.client = client
        self.topic = topic
        self.on_message = on_message

    @property
    def inbound_topic(self) -> str:
        return f"{self.topic}/inbound"

    @property
    def outbound_topic(self) -> str:
        return f"{self.topic}/outbound"

    def subscribe(self) -> None:
        if self.on_message is None:
            raise ValueError("on_message cannot be None")

        LOGGER.info(f"Subscribing to {self.inbound_topic}")
        self.client.handles[self.inbound_topic] = self
        self.client.client.subscribe(self.inbound_topic)

    def unsubscribe(self) -> None:
        LOGGER.info(f"Unsubscribing from {self.inbound_topic}")
        self.client.handles.pop(self.inbound_topic)
        self.client.client.unsubscribe(self.inbound_topic)

    def publish(self, message: MQTTMessage) -> None:
        self.client.publish_message(self.outbound_topic, message)

    def _on_message(self, message: MQTTMessage) -> None:
        response = self.on_message(message)
        if response is not None:
            self.publish(response)

    def __repr__(self) -> str:
        return f"MQTTHandle(topic={self.topic}, on_message={self.on_message})"


class MQTTWrapperClient:
    def __init__(self) -> None:
        mqtt_broker = os.getenv("MQTT_BROKER")
        mqtt_port = int(os.getenv("MQTT_PORT", "1883"))
        mqtt_username = os.getenv("MQTT_USERNAME", None)
        mqtt_password = os.getenv("MQTT_PASSWORD", None)

        # Allows us to specify a "namespace" for our application to easily avoid
        # topic collisions
        self.base_topic = os.getenv("MQTT_BASE_TOPIC", "ttm4115project")

        self.client = mqtt.Client(
            client_id="ttm4115project-backend", reconnect_on_failure=True
        )
        if mqtt_username is not None and mqtt_password is not None:
            self.client.username_pw_set(mqtt_username, mqtt_password)

        self.client.on_connect = self.__on_connect
        self.client.on_disconnect = self.__on_disconnect
        self.client.on_message = self.__on_message

        self.client.will_set(
            f"{self.base_topic}/status",
            json.dumps(MQTTMessage(event="offline").to_dict()),
            qos=1,
        )
        self.client.connect(mqtt_broker, mqtt_port)
        self.client.loop_start()

        self.handles = {}

    def create_handle(
        self,
        topic: str,
        on_message: Callable[[MQTTMessage], Optional[MQTTMessage]] = None,
    ) -> MQTTHandle:
        return MQTTHandle(self, f"{self.base_topic}/{topic}", on_message)

    def publish_message(self, topic: str, message: MQTTMessage) -> None:
        self.client.publish(topic, json.dumps(message.to_dict()), qos=2)

    def __on_connect(self, client: mqtt.Client, userdata, flags, rc) -> None:
        LOGGER.info("Connected to MQTT broker")

    def __on_disconnect(self, client: mqtt.Client, userdata, rc) -> None:
        LOGGER.info("Disconnected from MQTT broker")

    def __on_message(
        self, client: mqtt.Client, userdata, message: mqtt.MQTTMessage
    ) -> None:
        LOGGER.info(
            f"Received message from MQTT broker on topic {message.topic}: {message.payload}"
        )

        if message.topic in self.handles:
            handle = self.handles[message.topic]

            try:
                message = MQTTMessage.from_str(message.payload)
                handle._on_message(message)
            except Exception as e:
                LOGGER.exception(f"Error while handling message")
        else:
            LOGGER.warn(f"Received message on unknown topic {message.topic}")
