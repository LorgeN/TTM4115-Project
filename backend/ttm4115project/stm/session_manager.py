from stmpy import Machine
from base import State, Transition


class SessionManager:
    def __init__(self) -> None:

        s_initial = State(name="s_initial").to_dict()
        s_accept = State(name="s_accept", entry="session_create").to_dict()
        s_reject = State(name="s_reject", entry="session_reject").to_dict()

        t0 = Transition("initial", "s_initial").to_dict()
        t1 = Transition("s_initial", trigger="auth",
                        function=self.check_auth, targets="s_accept s_reject").to_dict()
        t2 = Transition("s_accept", "s_initial",
                        trigger="session_created").to_dict()
        t3 = Transition("s_reject", "s_initial",
                        trigger="session_rejected").to_dict()

        states = [s_initial, s_accept, s_reject]
        transitions = [t0, t1, t2, t3]

        self.machine = Machine(name="stm_session_manager", obj=self,
                               transitions=transitions, states=states)

    def check_auth(self, args, kwargs):
        pass

    def session_create(self):
        pass

    def session_reject(self):
        pass
