from ttm4115project.stm.base import State, Transition, MachineBase
from ttm4115project.rat import RAT, RATQuestion
from ttm4115project.mqtt_handle import MQTTHandle, MQTTMessage
from ttm4115project.utils.logging import create_logger
from typing import List, Tuple

LOGGER = create_logger(__name__)


class StudentIndividualStm(MachineBase):
    def __init__(self, name: str, parent: str, handle: MQTTHandle, rat: RAT):
        super().__init__(name, handle)
        self.rat = rat
        self.current_question = 0
        self.answers = None
        self.parent = parent

    def get_definiton(self) -> Tuple[List[State], List[Transition]]:
        states = [State("s_rat_individual", entry="start_rat_question")]

        transitions = [
            Transition(
                source="initial",
                target="s_rat_individual",
            ),
            Transition(
                source="s_rat_individual",
                target="final",
                trigger="message_question_answer",
                action="process_answer(*)",
            ),
        ]
        return states, transitions

    def start_rat_question(self):
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

    def process_answers(self, answers: List[int]):
        LOGGER.debug(f"Received answers {answers}")
        if len(answers) != len(self.rat.questions) or any(
            answer < 0 or answer >= len(self.rat.questions[i].answers)
            for i, answer in enumerate(answers)
        ):
            self.handle.publish(MQTTMessage(event="invalid_answers"))
            return

        # TODO: Do something with this? Save it?
        self.answers = answers
        self.send_event(self.parent, "system_student_rat_completed", name=self.name)
