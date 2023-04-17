class Transition:
    def __init__(self, name, source, target, action=None):
        self.name = name
        self.source = source
        self.target = target
        self.action = action

class State:
