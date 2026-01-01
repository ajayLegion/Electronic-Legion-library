"""Minimal demo: build a circuit of two resistors in series and print the graph."""
import json
import os
import sys

# Ensure project root is on sys.path so `core` package is importable when
# running `python3 scripts/demo_build.py` from the repo root.
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from core.loaders import load_component
from core.models import Circuit, Component, Pin
from core.builder import connect
from core.validators import validate_circuit


def main():
    c = Circuit()
    # load two instances of the resistor class
    class_yaml = "components/resistors/resistor-class.yaml"
    c.components["R1"] = load_component(class_yaml, "R1")
    c.components["R2"] = load_component(class_yaml, "R2")

    # add terminal components so end nets have >=2 pins (satisfies strict validator)
    c.components["P1"] = Component(
        id="P1",
        type="terminal",
        value=None,
        pins={
            "1": Pin(id="P1.1", name="1", parent="P1", direction="passive")
        },
    )
    c.components["P2"] = Component(
        id="P2",
        type="terminal",
        value=None,
        pins={
            "1": Pin(id="P2.1", name="1", parent="P2", direction="passive")
        },
    )

    # connect in series: N_in - R1.1 - R1.2/R2.1 - R2.2 - N_out
    connect(c, "N_in", "R1.1")
    connect(c, "N_in", "P1.1")
    connect(c, "N_mid", "R1.2")
    connect(c, "N_mid", "R2.1")
    connect(c, "N_out", "R2.2")
    connect(c, "N_out", "P2.1")

    # Validate and print
    try:
        validate_circuit(c)
        print("Circuit is valid")
    except Exception as e:
        print("Validation error:", e)

    print(json.dumps(c.to_dict(), indent=2))


if __name__ == "__main__":
    main()
