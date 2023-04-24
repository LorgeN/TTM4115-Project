from ttm4115project.stm.base import State, Transition, MachineBase
from ttm4115project.mqtt_handle import MQTTHandle
from typing import Tuple, List


class Facilitator(MachineBase):
    def __init__(self, handle: MQTTHandle) -> None:
        super().__init__("stm_facilitator", handle)

    def get_definiton(self) -> Tuple[List[State], List[Transition]]:
        s_initial = State(name="s_initial", entry="start", events={
            "system_new_request_received": "notify_new_request",
            "message_request_status": "send_status"
        })
        s_helping = State(name="s_helping", entry="notify_request_accepted")
        s_editing = State(name="s_editing", events={
            "message_question_edit": "rat_update_or_create_question",
            "message_question_delete": "rat_delete_question",
        })

        t0 = Transition("initial", "s_initial")
        t1 = Transition("s_initial", "s_helping",
                        trigger="message_request_accept")
        t2 = Transition("s_helping", "s_initial",
                        trigger="message_request_completed", action="notify_request_complete")
        t3 = Transition("s_initial", "s_editing",
                        trigger="message_create_rat", action="create_new_rat")
        t4 = Transition("s_initial", "s_editing",
                        trigger="message_edit_rat", action="start_editing_rat")
        t5 = Transition("s_editing", "s_initial",
                        trigger="message_rat_complete", action="save_rat")

        states = [s_initial, s_helping, s_editing]
        transitions = [t0, t1, t2, t3, t4, t5]

        return states, transitions

    def start(self) -> None:
        self.send_status()
        self.machine.start_timer("t_timeout", 600000)

    def send_status(self) -> None:
        print("send_status")

    def notify_new_request(self) -> None:
        print("notify_new_request")

    def notify_request_accepted(self) -> None:
        print("notify_request_accepted")

    def notify_request_complete(self) -> None:
        print("notify_request_complete")

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
