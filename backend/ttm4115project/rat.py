from typing import List, Dict
import json


class RATQuestion:
    def __init__(self, question: str, answers: List[str], correct_answer: int) -> None:
        self.question = question
        self.answers = answers
        self.correct_answer = correct_answer

    def __repr__(self) -> str:
        return f"RATQuestion(question={self.question}, answers={self.answers}, correct_answer={self.correct_answer})"


class RAT:
    def __init__(self, questions: List[RATQuestion]) -> None:
        self.questions = questions

    def __repr__(self) -> str:
        return f"RAT(questions={self.questions})"

    @classmethod
    def from_dict(cls, data: Dict[str, str]) -> "RAT":
        return RAT([RATQuestion(**question) for question in data["questions"]])

    def to_dict(self) -> Dict[str, str]:
        return {"questions": [question.to_dict() for question in self.questions]}


def read_rat_from_json(filename: str) -> RAT:
    with open(filename, "r") as f:
        return RAT.from_dict(json.load(f))
