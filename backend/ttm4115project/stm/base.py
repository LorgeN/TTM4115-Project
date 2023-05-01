from typing import Optional, Dict, List, Tuple, Callable
from ttm4115project.mqtt_handle import MQTTHandle, MQTTMessage
from ttm4115project.utils.logging import create_logger
from stmpy import Driver, Machine

LOGGER = create_logger(__name__)


def make_mqtt_callback(
    driver: Driver, machines: List[str]
) -> Callable[[MQTTMessage], Optional[MQTTMessage]]:
    def callback(message: MQTTMessage) -> Optional[MQTTMessage]:
        event = f"message_{message.event}"
        data = message.data
        for machine in machines:
            # This is the wrong usage of kwargs, but its how the stmpy library works
            LOGGER.info(f"Sending {event} to {machine} with data {data}")
            driver.send(event, machine, kwargs=data)
        return None

    return callback


def _set_if_not_none(dict, key, value):
    if value is not None:
        dict[key] = value


class HelpRequest:
    def __init__(self, student: str, team: str) -> None:
        self.student = student
        self.team = team


class Transition:
    def __init__(
        self,
        source: str,
        target: Optional[str] = None,
        targets: Optional[str] = None,
        trigger: Optional[str] = None,
        action: Optional[str] = None,
        function: Optional[Callable] = None,
    ):
        self.source = source
        self.target = target
        self.targets = targets
        self.trigger = trigger
        self.action = action
        self.function = function

    def to_dict(self):
        result = {
            "source": self.source,
        }
        _set_if_not_none(result, "target", self.target)
        _set_if_not_none(result, "targets", self.targets)
        _set_if_not_none(result, "trigger", self.trigger)
        _set_if_not_none(result, "effect", self.action)
        _set_if_not_none(result, "function", self.function)
        return result


class State:
    def __init__(
        self,
        name: str,
        entry: Optional[str] = None,
        exit: Optional[str] = None,
        do: Optional[str] = None,
        events: Dict[str, str] = {},
    ):
        self.name = name
        self.entry = entry
        self.exit = exit
        self.do = do
        self.events = events

    def to_dict(self):
        result = {"name": self.name}
        _set_if_not_none(result, "entry", self.entry)
        _set_if_not_none(result, "exit", self.exit)
        _set_if_not_none(result, "do", self.do)

        for key, value in self.events.items():
            result[key] = value

        return result


class MachineBase:
    def __init__(self, name: str, handle: MQTTHandle) -> None:
        self.name = name
        self.handle = handle
        self.__machine = None
        self.__driver = None

    def make_mqtt_callback(self, driver: Driver):
        return make_mqtt_callback(driver, [self.name])

    def install(self, driver: Driver, subscribe: bool = True):
        self.__driver = driver
        driver.add_machine(self.machine)
        LOGGER.debug(f"Installed {self.name} with driver {driver}")

        if subscribe:
            if self.handle.on_message is None:
                self.handle.on_message = self.make_mqtt_callback(driver)

            self.handle.subscribe()

    def uninstall(self, unsubscribe: bool = True):
        self.machine.terminate()
        self.__driver = None

        if unsubscribe:
            self.handle.unsubscribe()

    @property
    def machine(self) -> Machine:
        if self.__machine is None:
            states, transitions = self.get_definiton()
            states = [state.to_dict() for state in states]
            transitions = [transition.to_dict() for transition in transitions]
            self.__machine = Machine(
                name=self.name, transitions=transitions, states=states, obj=self
            )
        return self.__machine

    @property
    def driver(self) -> Driver:
        if self.__driver is None:
            raise Exception("Driver not installed")

        return self.__driver

    def send_event(self, target_stm: str, id: str, *args, **kwargs):
        LOGGER.debug(f"{self.name}: Sending {id} to {target_stm}")
        self.__driver.send(id, target_stm, args=args, kwargs=kwargs)

    def send_global_event(self, id: str, *args, **kwargs):
        LOGGER.debug(f"{self.name}: Sending {id} to all machines")
        for stm in Driver._stms_by_id.keys():
            if stm == self.name:
                continue

            self.__driver.send(id, stm, args=args, kwargs=kwargs)

    def send_self_event(self, id: str, *args, **kwargs):
        LOGGER.debug(f"{self.name}: Sending {id} to {self.name}")
        self.machine.send(id, args=args, kwargs=kwargs)

    def get_definiton(self) -> Tuple[List[State], List[Transition]]:
        # Override this method to define the state machine
        raise NotImplementedError()
