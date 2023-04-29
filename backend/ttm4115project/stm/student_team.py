from ttm4115project.stm.base import State, Transition, MachineBase
from ttm4115project.rat import RAT, RATQuestion
from ttm4115project.mqtt_handle import MQTTHandle, MQTTMessage
from typing import List, Tuple


class StudentTeamStm(MachineBase):
    def __init__(self, name: str, handle: MQTTHandle, rat: RAT):
        super().__init__(name, handle)
        self.rat = rat
        self.current_question = 0
        self.previous_answers = []
        self.current_answer = None

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
            ),
            Transition(
                source="s_rat_team",
                target="final",
                trigger="system_rat_complete",
                action="notify_complete()",
            ),
        ]

        return states, transitions

    def start_rat_question(self):
        self.current_question = 0
        self.previous_answers = []

        question = self.rat.questions[self.current_question]

        self.handle.publish(
            MQTTMessage(
                event="message_new_question",
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
                event="message_new_question",
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
                event="message_question_answer_select",
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
            MQTTMessage(
                event="message_question_answer_confirm", data={"is_correct": correct}
            )
        )

        self.previous_answers.append(self.current_answer)

        if correct:
            self.next_question()
        else:
            self.current_answer = None
            question: RATQuestion = self.rat.questions[self.current_question]

            self.handle.publish(
                MQTTMessage(
                    event="message_new_question",
                    data={
                        "question": question.question,
                        "answers": question.answers,
                        "previous_answers": self.previous_answers,
                    },
                )
            )

    def notify_update(self, position: int):
        self.handle.publish(
            MQTTMessage(
                event="message_queue_update",
                data={
                    "position": position,
                },
            )
        )
