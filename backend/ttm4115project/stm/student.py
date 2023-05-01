from ttm4115project.stm.base import State, Transition, MachineBase, make_mqtt_callback
from ttm4115project.stm.student_individual import StudentIndividualStm
from ttm4115project.rat import RAT, RATQuestion
from ttm4115project.mqtt_handle import MQTTHandle, MQTTMessage
from typing import List, Tuple
from ttm4115project.utils.logging import create_logger
from enum import Enum

LOGGER = create_logger(__name__)


class CompletionStage:
    NONE = 0, "s_student_idle"
    INDIVIDUAL_RAT = 1, "s_student_rat"
    TEAM_RAT = 2, "s_team_rat"
    BOTH = 3, "s_student_complete"


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
        self.stage: CompletionStage = CompletionStage.NONE

    @property
    def individual_rat_complete(self):
        return self.stage.value[0] > CompletionStage.INDIVIDUAL_RAT.value[0]

    def get_definiton(self) -> Tuple[List[State], List[Transition]]:
        states = [
            State(
                name="s_student_idle",
            ),
            State(
                name="s_student_rat",
                events={
                    "system_queue_update": "defer",
                },
            ),
            State(
                name="s_student_waiting_team",
            ),
            State(
                name="s_team_rat",
                events={
                    "system_queue_update": "defer",
                },
            ),
            State(name="s_student_complete"),
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
                action="start_individual_rat()",
            ),
            Transition(
                source="s_student_rat",
                targets="s_student_rat s_student_waiting_team",
                trigger="system_student_rat_completed",
                function=self.check_individual_complete,
            ),
            Transition(
                source="s_student_waiting_team",
                target="s_team_rat",
                trigger="system_team_rat_start",
                action="start_team_rat()",
            ),
            Transition(
                source="s_team_rat",
                target="s_student_complete",
                trigger="system_team_rat_complete",
                action="notify_rat_complete(); mark_complete()",
            ),
            # Help transitions
            Transition(
                source="s_student_rat",
                target="s_student_require_help",
                trigger="message_request_help",
            ),
            Transition(
                source="s_team_rat",
                target="s_student_require_help",
                trigger="message_request_help",
            ),
            Transition(
                source="s_student_require_help",
                trigger="system_request_completed",
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
        stm = StudentIndividualStm(
            f"{self.name}_individual", self.name, self.handle, self.rat
        )
        self.handle.on_message = make_mqtt_callback(self.driver, [self.name, stm.name])
        stm.install(self.driver, subscribe=False)
        self.stage = CompletionStage.INDIVIDUAL_RAT

    def start_team_rat(self):
        self.stage = CompletionStage.TEAM_RAT

    def mark_complete(self):
        self.stage = CompletionStage.BOTH

    def request_help(self):
        LOGGER.info(f"Requesting help for {self.name}")
        self.send_event(
            "stm_session_manager",
            "system_request_help",
            student=self.name,
            team=self.team,
        )

    def check_individual_complete(self, *args, **kwargs):
        if kwargs.get("name", None) != f"{self.name}_individual":
            return "s_rat_individual"

        # Redirect events back to this stm
        self.handle.on_message = make_mqtt_callback(self.driver, [self.name])

        self.send_event(
            "stm_session_manager", "system_student_rat_completed", team=self.team
        )

        return "s_student_waiting_team"

    def notify_queue_update(self, position: int):
        LOGGER.info(f"Queue update: {position}")
        self.handle.publish(
            MQTTMessage(
                event="queue_update",
                data={
                    "position": position,
                },
            )
        )

    def cancel_help_request(self) -> str:
        self.send_event(
            "stm_session_manager",
            "system_request_cancel",
            student=self.name,
            team=self.team,
        )
        return self.return_to_rat_state()

    def request_completed(self) -> str:
        return self.return_to_rat_state()

    def return_to_rat_state(self) -> str:
        return self.stage.value[1]

    def notify_rat_complete(self):
        self.handle.publish(MQTTMessage(event="rat_complete"))
