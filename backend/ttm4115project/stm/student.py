from ttm4115project.stm.base import State, Transition, MachineBase
from ttm4115project.rat import RAT
from ttm4115project.mqtt_handle import MQTTHandle, MQTTMessage
from typing import List, Tuple
from ttm4115project.utils.logging import create_logger
from enum import Enum

LOGGER = create_logger(__name__)


class CompletionStage(Enum):
    NONE = 0, "s_student_idle"
    INDIVIDUAL_RAT = 1, "s_student_rat"
    WAIT_TEAM_RAT = 2, "s_student_waiting_team"
    TEAM_RAT = 3, "s_team_rat"
    BOTH = 4, "s_student_complete"


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
                targets="s_student_waiting_team s_student_rat",
                trigger="message_question_answer",
                function=self.process_answers,
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
                source="s_student_complete",
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
        self.answers = []

        self.handle.publish(
            MQTTMessage(
                event="questions",
                data=[
                    {
                        "question": question.question,
                        "answers": question.answers,
                    }
                    for question in self.rat.questions
                ],
            )
        )
        self.stage = CompletionStage.INDIVIDUAL_RAT

    def process_answers(self, answers: List[int]):
        LOGGER.debug(f"Received answers {answers}")
        if len(answers) != len(self.rat.questions) or any(
            answer < 0 or answer >= len(self.rat.questions[i].answers)
            for i, answer in enumerate(answers)
        ):
            self.handle.publish(MQTTMessage(event="invalid_answers"))
            return "s_student_rat"

        # TODO: Do something with this? Save it?
        self.answers = answers
        self.send_event(
            "stm_session_manager", "system_student_rat_completed", team=self.team
        )
        self.stage = CompletionStage.WAIT_TEAM_RAT
        return "s_student_waiting_team"

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
