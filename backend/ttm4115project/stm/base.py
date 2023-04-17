from typing import Optional, List, Tuple
from ttm4115project.mqtt_handle import MQTTHandle
from stmpy import Driver, Machine


def _set_if_not_none(dict, key, value):
    if value is not None:
        dict[key] = value


class Transition:
    def __init__(
        self,
        source: str,
        target: str,
        targets: Optional[str] = None,
        trigger: Optional[str] = None,
        action: Optional[str] = None,
        function: Optional[str] = None,
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
            "target": self.target,
        }
        _set_if_not_none(result, "targets", self.targets)
        _set_if_not_none(result, "trigger", self.trigger)
        _set_if_not_none(result, "action", self.action)
        _set_if_not_none(result, "function", self.function)
        return result


class State:
    def __init__(
        self,
        name: str,
        entry: Optional[str] = None,
        exit: Optional[str] = None,
        do: Optional[str] = None,
    ):
        self.name = name
        self.entry = entry
        self.exit = exit
        self.do = do

    def to_dict(self):
        result = {"name": self.name}
        _set_if_not_none(result, "entry", self.entry)
        _set_if_not_none(result, "exit", self.exit)
        _set_if_not_none(result, "do", self.do)
        return result


class MachineBase:
    def __init__(self, name: str, handle: MQTTHandle) -> None:
        self.name = name
        self.handle = handle
        self.__machine = None
        self.__driver = None

    def install(self, driver: Driver):
        self.__driver = driver
        driver.add_machine(self.machine)

    def uninstall(self):
        self.machine.terminate()
        self.__driver = None

    @property
    def machine(self) -> Machine:
        if self.__machine is None:
            states, transitions = self.get_definiton()
            self.__machine = Machine(
                name=self.name, transitions=transitions, states=states, obj=self
            )
        return self.__machine

    def send_global_event(self, id: str, *args, **kwargs):
        self.__driver.send(id, *args, **kwargs)

    def send_self_event(self, id: str, *args, **kwargs):
        self.machine.send(id, *args, **kwargs)

    def get_definiton(self) -> Tuple[List[State], List[Transition]]:
        raise NotImplementedError()
