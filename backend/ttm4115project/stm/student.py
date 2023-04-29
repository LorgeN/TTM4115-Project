from ttm4115project.stm.base import State, Transition, MachineBase, make_mqtt_callback
from ttm4115project.stm.student_individual import StudentIndividualStm
from ttm4115project.rat import RAT, RATQuestion
from ttm4115project.mqtt_handle import MQTTHandle, MQTTMessage
from typing import List, Tuple


class StudentStm(MachineBase):
    def __init__(self, name: str, handle: MQTTHandle, rat: RAT):
        super().__init__(name, handle)

        self.rat = rat

    def get_definiton(self) -> Tuple[List[State], List[Transition]]:
        states = [
            State(
                name="s_student_idle",
            ),
            State(
                name="s_student_rat",
                entry="start_individual_rat()",
                events={
                    "message_request_help": "request_help()",
                },
            ),
            State(
                name="s_student_waiting_team",
            ),
            State(
                name="s_team_rat",
                events={
                    "message_request_help": "request_help()",
                },
            ),
            State(
                name="s_student_require_help",
                events={
                    "system_queue_update": "notify_queue_update()",
                },
            ),
        ]

        transitions = [
            Transition(
                source="initial",
                target="s_student_idle",
            ),
            Transition(
                source="s_student_idle",
                target="s_student_rat",
                trigger="message_start_rat",
            ),
            Transition(
                source="s_student_rat",
                targets="s_student_rat s_student_waiting_team",
                trigger="system_student_rat_completed",
                function=self.check_individual_complete,
            ),
        ]

        return states, transitions

    def start_individual_rat(self):
        stm = StudentIndividualStm(f"{self.name}_individual", self.handle, self.rat)
        print("Updating callback")
        self.handle.on_message = make_mqtt_callback(self.driver, [self.name, stm.name])
        stm.install(self.driver, subscribe=False)

    def check_individual_complete(self, *args, **kwargs):
        if kwargs.get("name", None) != f"{self.name}_individual":
            return "s_rat_individual"
        
        return "s_student_waiting_team"
