from dataclasses import dataclass, field, asdict
from typing import Dict, List, Optional


@dataclass
class Pin:
    id: str
    name: str
    parent: str
    direction: str
    role: Optional[str] = None
    net: Optional[str] = None

    def to_dict(self):
        return asdict(self)


@dataclass
class Component:
    id: str
    type: str
    value: Optional[str]
    pins: Dict[str, Pin] = field(default_factory=dict)

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "value": self.value,
            "pins": {k: v.to_dict() for k, v in self.pins.items()},
        }


@dataclass
class Net:
    id: str
    pins: List[str] = field(default_factory=list)

    def to_dict(self):
        return {"id": self.id, "pins": list(self.pins)}


@dataclass
class Circuit:
    components: Dict[str, Component] = field(default_factory=dict)
    nets: Dict[str, Net] = field(default_factory=dict)

    def to_dict(self):
        return {
            "components": {k: v.to_dict() for k, v in self.components.items()},
            "nets": {k: v.to_dict() for k, v in self.nets.items()},
        }
