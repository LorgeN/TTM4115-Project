from ttm4115project.stm.base import State, Transition, MachineBase, HelpRequest
from ttm4115project.mqtt_handle import MQTTHandle, MQTTMessage
from ttm4115project.utils.logging import create_logger
from typing import Tuple, List

LOGGER = create_logger(__name__)


class Facilitator(MachineBase):
    def __init__(
        self, name: str, handle: MQTTHandle, help_requests: List[HelpRequest]
    ) -> None:
        super().__init__(name, handle)
        self.help_requests = help_requests
        self.busy = False

    def get_definiton(self) -> Tuple[List[State], List[Transition]]:
        s_initial = State(
            name="s_initial",
            entry="start",
            events={
                "system_any_help_request": "any_request(*)",
                "message_request_status": "send_status()",
            },
        )
        s_helping = State(
            name="s_helping",
            events={
                "system_any_help_request": "any_request(*)",
                "message_request_status": "send_status()",
            },
        )
        s_editing = State(
            name="s_editing",
            events={
                "message_question_edit": "rat_update_or_create_question",
                "message_question_delete": "rat_delete_question",
            },
        )

        t0 = Transition(source="initial", target="s_initial")
        t1 = Transition(
            source="s_initial",
            target="s_helping",
            trigger="message_request_accept",
            action="request_accept()",
        )
        t2 = Transition(
            source="s_helping",
            target="s_initial",
            trigger="message_request_completed",
            action="request_completed()",
        )
        t3 = Transition(
            source="s_initial",
            target="s_editing",
            trigger="message_create_rat",
            action="create_new_rat",
        )
        t4 = Transition(
            source="s_initial",
            target="s_editing",
            trigger="message_edit_rat",
            action="start_editing_rat",
        )
        t5 = Transition(
            source="s_editing",
            target="s_initial",
            trigger="message_rat_complete",
            action="save_rat",
        )

        states = [s_initial, s_helping, s_editing]
        transitions = [t0, t1, t2, t3, t4, t5]

        return states, transitions

    def start(self) -> None:
        self.send_status()
        self.machine.start_timer("t_timeout", 600000)

    def send_status(self) -> None:
        self.handle.publish(
            MQTTMessage(
                event="message_status",
                data={
                    "busy": self.busy,
                },
            )
        )

    def request_accept(self) -> None:
        if len(self.help_requests) > 0:
            request = self.help_requests[0]
            self.send_event(
                "stm_session_manager",
                "system_request_processed",
                student=request.student,
                team=request.team,
            )
            self.busy = True

    def request_completed(self) -> None:
        self.busy = False

    def any_request(self, is_any: bool) -> None:
        self.handle.publish(MQTTMessage(event="message_any_request", data=is_any))

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
