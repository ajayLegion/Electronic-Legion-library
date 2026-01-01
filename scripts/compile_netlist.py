"""Script to compile a YAML netlist into a Phase-1 Circuit and print JSON."""
import os
import sys
import json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from core.netlist_compiler import compile_netlist


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/compile_netlist.py <netlist.yaml>")
        sys.exit(1)

    netlist_path = sys.argv[1]

    # Explicit component library map (no filesystem guessing)
    component_library = {
        "resistor": "components/resistors/resistor-class.yaml",
        "terminal": "components/terminal/terminal-class.yaml",
        "opamp": "components/opamp/opamp-class.yaml",
        "capacitor": "components/capacitor/capacitor-class.yaml",
        "ground": "components/ground/ground-class.yaml",
    }

    try:
        circuit = compile_netlist(netlist_path, component_library)
    except Exception as e:
        print("Compile failed:", e)
        sys.exit(2)

    print(json.dumps(circuit.to_dict(), indent=2))


if __name__ == "__main__":
    main()
