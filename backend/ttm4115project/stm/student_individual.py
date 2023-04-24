from ttm4115project.stm.base import State, Transition, MachineBase
from ttm4115project.rat import RAT, RATQuestion
from ttm4115project.mqtt_handle import MQTTHandle, MQTTMessage
from typing import List, Tuple


class StudentIndividualStm(MachineBase):
    def __init__(self, name: str, handle: MQTTHandle, rat: RAT):
        super().__init__(name, handle)
        self.rat = rat
        self.current_question = 0
        self.answers = []

    def get_definiton(self) -> Tuple[List[State], List[Transition]]:
        states = [
            State(
                "s_rat_individual",
                entry="start_rat_question",
                events={
                    "message_question_answer": "process_answer(*); next_question()"
                },
            ),
            State(
                "s_individual_waiting_for_ta_question",
                events={
                    "system_queue_update": "notify_update(*)",
                },
            ),
        ]

        transitions = [
            Transition(
                source="initial",
                target="s_rat_individual",
            ),
            Transition(
                source="s_rat_individual",
                target="s_individual_waiting_for_ta_question",
                trigger="message_request_help",
                action="notify_ta_new_request()",
            ),
            Transition(
                source="s_individual_waiting_for_ta_question",
                target="s_rat_individual",
                trigger="system_request_complete",
            ),
            Transition(
                source="s_individual_waiting_for_ta_question",
                target="s_rat_individual",
                trigger="message_request_cancel",
                action="notify_ta_cancel_request()",
            ),
            Transition(
                source="s_rat_individual",
                target="final",
                trigger="system_rat_complete",
                action="notify_complete()",
            ),
        ]
        return states, transitions

    def start_rat_question(self):
        self.current_question = 0
        self.answers = []

        question = self.rat.questions[self.current_question]

        self.handle.publish(
            MQTTMessage(
                event="message_new_question",
                data={
                    "question": question.question,
                    "answers": question.answers,
                },
            )
        )

    def next_question(self):
        self.current_question += 1
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
                },
            )
        )

    def process_answer(self, answer: int):
        self.answers.append(answer)

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
