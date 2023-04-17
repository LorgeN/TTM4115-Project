from typing import List

class RATQuestion:
    def __init__(self, question: str, answers: List[str], correct_answer: int) -> None:
        self.question = question
        self.answers = answers
        self.correct_answer = correct_answer

    def __repr__(self) -> str:
        return f"RATQuestion(question={self.question}, answers={self.answers}, correct_answer={self.correct_answer})"
        