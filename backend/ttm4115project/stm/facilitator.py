from ttm4115project.stm.base import State, Transition, MachineBase
from ttm4115project.mqtt_handle import MQTTHandle, MQTTMessage
from ttm4115project.utils.logging import create_logger
from typing import Tuple, List

LOGGER = create_logger(__name__)


class Facilitator(MachineBase):
    def __init__(self, name: str, handle: MQTTHandle) -> None:
        super().__init__(name, handle)
        self.busy = False

    def get_definiton(self) -> Tuple[List[State], List[Transition]]:
        s_initial = State(
            name="s_initial",
            entry="start",
            events={
                "system_new_request_received": "notify_new_request(*)",
                "system_request_accepted": "notify_request_accepted(*)",
                "system_request_completed": "notify_request_completed(*)",
                "message_request_status": "send_status",
            },
        )
        s_helping = State(
            name="s_helping",
            events={
                "system_new_request_received": "notify_new_request(*)",
                "system_request_accepted": "notify_request_accepted(*)",
                "system_request_completed": "notify_request_completed(*)",
                "message_request_status": "send_status",
            },
        )
        s_editing = State(
            name="s_editing",
            events={
                "message_question_edit": "rat_update_or_create_question",
                "message_question_delete": "rat_delete_question",
            },
        )

        t0 = Transition("initial", "s_initial")
        t1 = Transition(
            "s_initial",
            "s_helping",
            trigger="message_request_accept",
            action="request_accept(*)",
        )
        t2 = Transition(
            "s_helping",
            "s_initial",
            trigger="message_request_completed",
            action="request_complete(*)",
        )
        t3 = Transition(
            "s_initial",
            "s_editing",
            trigger="message_create_rat",
            action="create_new_rat",
        )
        t4 = Transition(
            "s_initial",
            "s_editing",
            trigger="message_edit_rat",
            action="start_editing_rat",
        )
        t5 = Transition(
            "s_editing", "s_initial", trigger="message_rat_complete", action="save_rat"
        )

        states = [s_initial, s_helping, s_editing]
        transitions = [t0, t1, t2, t3, t4, t5]

        return states, transitions

    def start(self) -> None:
        self.send_status()
        self.machine.start_timer("t_timeout", 600000)

    def send_status(self) -> None:
        self.handle.publish(
            MQTTMessage(event="message_status", data={"busy": self.busy})
        )

    def request_accept(self, *args, **kwargs) -> None:
        if not "group" in kwargs:
            LOGGER.error("No group in help request")
            return

        self.send_global_event("system_request_accepted", group=kwargs["group"])
        self.busy = True
        LOGGER.debug("Accepted help request from group: %s", kwargs["group"])

    def request_complete(self, *args, **kwargs) -> None:
        if not "group" in kwargs:
            LOGGER.error("No group in help request")
            return

        self.send_global_event("system_request_completed", group=kwargs["group"])
        self.busy = False
        LOGGER.debug("Completed help request from group: %s", kwargs["group"])

    def notify_new_request(self, *args, **kwargs) -> None:
        if not "group" in kwargs:
            LOGGER.error("No group in help request")
            return

        group = kwargs["group"]
        self.handle.publish(
            MQTTMessage(event="message_new_request", data={"group": group})
        )

    def notify_request_accepted(self, *args, **kwargs) -> None:
        if not "group" in kwargs:
            LOGGER.error("No group in help request")
            return

        group = kwargs["group"]
        self.handle.publish(
            MQTTMessage(event="message_request_accepted", data={"group": group})
        )

    def notify_request_completed(self, *args, **kwargs) -> None:
        if not "group" in kwargs:
            LOGGER.error("No group in help request")
            return

        group = kwargs["group"]
        self.handle.publish(
            MQTTMessage(event="message_request_completed", data={"group": group})
        )

    def create_new_rat(self) -> None:
        print("create_new_rat")

    def start_editing_rat(self) -> None:
        print("start_editing_rat")

    def save_rat(self) -> None:
        print("save_rat")

    def rat_update_or_create_question(self) -> None:
        print("rat_update_or_create_question")

    def rat_delete_question(self) -> None:
        print("rat_delete_question")
