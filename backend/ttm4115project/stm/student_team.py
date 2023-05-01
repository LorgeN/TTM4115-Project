from ttm4115project.stm.base import State, Transition, MachineBase
from ttm4115project.rat import RAT, RATQuestion
from ttm4115project.mqtt_handle import MQTTHandle, MQTTMessage
from ttm4115project.utils.logging import create_logger
from typing import List, Tuple

LOGGER = create_logger(__name__)


class StudentTeamStm(MachineBase):
    def __init__(self, name: str, handle: MQTTHandle, rat: RAT, members: List[str]):
        super().__init__(name, handle)
        self.rat = rat
        self.current_question = 0
        self.previous_answers = []
        self.current_answer = None
        self.members = members

    def send_member_event(self, id: str, *args, **kwargs):
        for member in self.members:
            self.send_event(member, id, *args, **kwargs)

    def get_definiton(self) -> Tuple[List[State], List[Transition]]:
        states = [
            State(
                name="s_rat_team",
                entry="start_rat_question()",
                events={
                    "message_question_answer": "process_answer(*)",
                    "message_answer_confirmed": "confirm_answer()",
                },
            ),
        ]

        transitions = [
            Transition(
                source="initial",
                target="s_rat_team",
                action="send_member_event('system_team_rat_start')"
            ),
            Transition(
                source="s_rat_team",
                target="final",
                trigger="system_rat_complete",
                action="send_member_event('system_team_rat_complete')",
            ),
        ]

        return states, transitions

    def start_rat_question(self):
        self.current_question = 0
        self.previous_answers = []

        question = self.rat.questions[self.current_question]

        self.handle.publish(
            MQTTMessage(
                event="new_question",
                data={
                    "question": question.question,
                    "answers": question.answers,
                    "previous_answers": self.previous_answers,
                },
            )
        )

    def next_question(self):
        self.current_question += 1
        self.previous_answers = []
        if self.current_question >= len(self.rat.questions):
            self.send_self_event("system_rat_complete")
            return

        question: RATQuestion = self.rat.questions[self.current_question]

        self.handle.publish(
            MQTTMessage(
                event="new_question",
                data={
                    "question": question.question,
                    "answers": question.answers,
                    "previous_answers": self.previous_answers,
                },
            )
        )

    def process_answer(self, answer: int):
        self.current_answer = answer

        self.handle.publish(
            MQTTMessage(
                event="question_answer_select",
                data={
                    "answer": answer,
                },
            )
        )

    def confirm_answer(self):
        correct = (
            self.current_answer
            == self.rat.questions[self.current_question].correct_answer
        )
        self.handle.publish(
            MQTTMessage(event="question_answer_confirm", data={"is_correct": correct})
        )

        self.previous_answers.append(self.current_answer)

        if correct:
            self.next_question()
        else:
            self.current_answer = None
            question: RATQuestion = self.rat.questions[self.current_question]

            self.handle.publish(
                MQTTMessage(
                    event="new_question",
                    data={
                        "question": question.question,
                        "answers": question.answers,
                        "previous_answers": self.previous_answers,
                    },
                )
            )
