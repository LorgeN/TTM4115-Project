from stmpy import Machine, Driver
from ttm4115project.stm.base import State, Transition, MachineBase
from ttm4115project.stm.student_individual import StudentIndividualStm
from ttm4115project.mqtt_handle import MQTTHandle
from typing import Tuple, List


class SessionManager(MachineBase):
    def __init__(self, handle: MQTTHandle, driver: Driver) -> None:
        super().__init__("stm_session_manager", handle)

    def get_definiton(self) -> Tuple[List[State], List[Transition]]:
        s_initial = State(name="s_initial", events={
            "auth": "check_auth",
        })

        t0 = Transition("initial", "s_initial")

        states = [s_initial]
        transitions = [t0]

        return states, transitions

    def check_auth(self, *args, **kwargs) -> None:
        # TODO: Check auth, create session
        print("check_auth:", args, kwargs)
