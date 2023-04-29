from ttm4115project.stm.base import State, Transition, MachineBase
from ttm4115project.rat import RAT, RATQuestion
from ttm4115project.mqtt_handle import MQTTHandle, MQTTMessage
from ttm4115project.utils.logging import create_logger
from typing import List, Tuple

LOGGER = create_logger(__name__)


class StudentIndividualStm(MachineBase):
    def __init__(self, name: str, handle: MQTTHandle, rat: RAT):
        super().__init__(name, handle)
        self.rat = rat
        self.current_question = 0
        self.answers = []

    def get_definiton(self) -> Tuple[List[State], List[Transition]]:
        states = [State("s_rat_individual", entry="start_rat_question")]

        transitions = [
            Transition(
                source="initial",
                target="s_rat_individual",
            ),
            Transition(
                source="s_rat_individual",
                targets="s_rat_individual final",
                trigger="message_question_answer",
                function=self.process_answer,
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

    def process_answer(self, answer: int):
        LOGGER.debug("Received answer: %s", answer)
        self.answers.append(answer)

        self.current_question += 1
        if self.current_question >= len(self.rat.questions):
            self.send_global_event("system_student_rat_completed", name=self.name)
            return "final"

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

        return "s_rat_individual"
