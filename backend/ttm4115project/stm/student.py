from ttm4115project.stm.base import State, Transition, MachineBase, make_mqtt_callback
from ttm4115project.stm.student_individual import StudentIndividualStm
from ttm4115project.rat import RAT, RATQuestion
from ttm4115project.mqtt_handle import MQTTHandle, MQTTMessage
from typing import List, Tuple


class StudentStm(MachineBase):
    """
    State machine for a student session. This is kept somewhat separate as its main
    function is keeping track of student help requests
    """

    def __init__(self, name: str, team: str, handle: MQTTHandle, rat: RAT):
        super().__init__(name, handle)

        self.team = team
        self.rat = rat
        # Use this to keep track of return state for requesting help
        self.individual_rat = False

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
                entry="request_help()",
                events={
                    "system_queue_update": "notify_queue_update(*)",
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
            # Help transitions
            Transition(
                source="s_student_rat",
                target="s_student_require_help",
                trigger="message_request_help",
            ),
            Transition(
                source="s_student_require_help",
                trigger="system_request_complete",
                targets="s_student_rat s_team_rat",
                function=self.request_completed,
            ),
            Transition(
                source="s_student_require_help",
                trigger="message_request_cancel",
                targets="s_student_rat s_team_rat",
                function=self.cancel_help_request,
            ),
        ]

        return states, transitions

    def start_individual_rat(self):
        stm = StudentIndividualStm(f"{self.name}_individual", self.handle, self.rat)
        self.handle.on_message = make_mqtt_callback(self.driver, [self.name, stm.name])
        stm.install(self.driver, subscribe=False)
        self.individual_rat = True

    def request_help(self):
        self.send_global_event("system_request_help", student=self.name, team=self.team)

    def check_individual_complete(self, *args, **kwargs):
        if kwargs.get("name", None) != f"{self.name}_individual":
            return "s_rat_individual"

        # Redirect events back to this stm
        self.handle.on_message = make_mqtt_callback(self.driver, [self.name])
        self.individual_rat = False
        return "s_student_waiting_team"

    def notify_queue_update(self, position: int):
        self.handle.publish(
            MQTTMessage(
                event="queue_update",
                data={
                    "position": position,
                },
            )
        )

    def cancel_help_request(self) -> str:
        self.send_global_event("system_cancel_help", student=self.name, team=self.team)
        return self.return_to_rat_state()

    def request_completed(self) -> str:
        return self.return_to_rat_state()

    def return_to_rat_state(self) -> str:
        if self.individual_rat:
            return "s_student_rat"
        else:
            return "s_team_rat"
