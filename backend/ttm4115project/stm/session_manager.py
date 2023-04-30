from stmpy import Machine, Driver
from ttm4115project.stm.base import State, Transition, MachineBase
from ttm4115project.stm.student import StudentStm
from ttm4115project.mqtt_handle import MQTTWrapperClient, MQTTMessage
from ttm4115project.stm.facilitator import Facilitator
from ttm4115project.utils.logging import create_logger
from ttm4115project.rat import RAT
from typing import Tuple, List, Dict

LOGGER = create_logger(__name__)


class HelpRequest:
    def __init__(self, student: str, team: str) -> None:
        self.student = student
        self.team = team


class SessionManager(MachineBase):
    def __init__(self, client: MQTTWrapperClient, rat: RAT) -> None:
        super().__init__("stm_session_manager", client.create_handle("sessions"))

        self.rat = rat

        self.client = client

        self.student_sessions: Dict[str, StudentStm] = {}
        self.facilitator_sessions: Dict[str, Facilitator] = {}
        self.teams: Dict[str, List[str]] = {}

        self.team_rat_sessions = {}
        self.help_requests: List[HelpRequest] = []

    def get_definiton(self) -> Tuple[List[State], List[Transition]]:
        s_initial = State(
            name="s_initial",
            events={
                "message_auth": "check_auth(*)",
                "system_request_help": "process_help_request(*)",
                "system_request_processed": "processed_help_request(*)",
                "system_request_cancel": "remove_help_request(*)",
            },
        )

        t0 = Transition("initial", "s_initial")

        states = [s_initial]
        transitions = [t0]

        return states, transitions

    def process_help_request(self, student: str, team: str):
        self.help_requests.append(HelpRequest(student, team))

        # Send queue update
        stm = self.student_sessions[student]
        stm.send_self_event("system_queue_update", position=len(self.help_requests))

    def processed_help_request(self, student: str, team: str):
        stm = self.student_sessions[student]
        stm.send_self_event("system_request_completed")

        self.remove_help_request(student, team)

    def remove_help_request(self, student: str, team: str):
        # Will raise error if not present
        removed = False
        target = None
        for i, request in enumerate(self.help_requests):
            if request.student == student and request.team == team:
                target = i
                removed = True
                continue

            # Send queue update for students after the removed one
            if removed:
                stm = self.student_sessions[request.student]
                # Use i since the position will be reduced by one
                stm.send_self_event("system_queue_update", position=i)

        if not removed:
            LOGGER.error("Could not find help request to remove")
            return

        del self.help_requests[target]

    def check_auth(self, *args, **kwargs) -> None:
        if "scope" not in kwargs:
            LOGGER.error("No scope in auth message")
            return

        if "id" not in kwargs:
            LOGGER.error("No id in auth message")
            return

        if kwargs["scope"] == "student":
            if "group" not in kwargs:
                LOGGER.error("No group in auth message with student scope")
                return

            self._make_new_student_session(kwargs["group"], kwargs["id"])
        elif kwargs["scope"] == "facilitator":
            self._make_new_facilitator_session(kwargs["id"])
        else:
            LOGGER.error("Unknown scope in auth message: %s", kwargs["scope"])
            return

    def _make_new_student_session(self, team_id: str, student_id: str) -> None:
        if student_id in self.student_sessions:
            LOGGER.error(f"Student {student_id} already has a session")
            return

        LOGGER.info(f"Creating session for student {student_id} in team {team_id}")
        topic = f"student/{team_id}/{student_id}"
        handle = self.client.create_handle(topic)
        stm = StudentStm(student_id, team_id, handle, self.rat)
        stm.install(self.driver)

        self.student_sessions[student_id] = stm

        if team_id not in self.teams:
            self.teams[team_id] = [student_id]
        else:
            self.teams[team_id].append(student_id)

        LOGGER.info(f"Created session for student {student_id} in team {team_id}")
        self.handle.publish(
            MQTTMessage(
                event="session_created",
                data={
                    "student_id": student_id,
                    "team_id": team_id,
                    "topic_inbound": f"{topic}/inbound",
                    "topic_outbound": f"{topic}/outbound",
                },
            )
        )

    def _make_new_facilitator_session(self, facilitator_id: str) -> None:
        print("Making new facilitator session")
        handle = self.client.create_handle(f"facilitator/{facilitator_id}")
        stm = Facilitator(facilitator_id, handle)
        stm.install(self.driver)

        self.facilitator_sessions[facilitator_id] = stm

        print(f"Created session for facilitator {facilitator_id}")
