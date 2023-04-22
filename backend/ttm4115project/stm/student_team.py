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

    def get_definiton(self) -> Tuple[List[State], List[Transition]]:
        states = [
        ]

        transitions = [
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
        self.current_answer = 

    def check_answer(self):
        

    def notify_update(self, position: int):
        self.handle.publish(
            MQTTMessage(
                event="message_queue_update",
                data={
                    "position": position,
                },
            )
        )

    def notify_ta_new_request(self):
        self.send_global_event(
            "system_new_ta_request", name=self.name, question=self.current_question
        )

    def notify_ta_cancel_request(self):
        self.send_global_event("system_cancel_ta_request", name=self.name)

    def notify_complete(self):
        self.send_global_event("system_student_rat_completed", name=self.name)
