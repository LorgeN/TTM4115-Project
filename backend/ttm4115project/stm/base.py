from typing import Optional, Callable


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
