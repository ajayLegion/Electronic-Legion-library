import json
import yaml
from jsonschema import validate, ValidationError

from core.models import Circuit
from core.loaders import load_component
from core.builder import connect
from core.validators import validate_circuit, validate_electrical_reference


def compile_netlist(netlist_path: str, component_library: dict, schema_path: str = "schemas/netlist.schema.json") -> Circuit:
    with open(schema_path, "r") as f:
        schema = json.load(f)

    with open(netlist_path, "r") as f:
        data = yaml.safe_load(f)

    # Schema validation first
    try:
        validate(instance=data, schema=schema)
    except ValidationError as e:
        raise ValueError(f"Netlist schema validation failed: {e.message}")

    circuit = Circuit()

    # Instantiate components from explicit library map
    for cid, cdata in data["components"].items():
        ref = cdata.get("ref")
        if ref not in component_library:
            raise KeyError(f"Component ref '{ref}' not found in component_library")

        comp = load_component(component_library[ref], cid)
        # assign instance-level value (overrides class value)
        if "value" in cdata:
            comp.value = cdata.get("value")

        circuit.components[cid] = comp

    # Connect nets exactly as listed
    for net_id, pins in data["nets"].items():
        for pin in pins:
            connect(circuit, net_id, pin)

    # Run Phase-1 validators
    validate_circuit(circuit)

    # Run Phase-2 electrical reference checks (strict)
    validate_electrical_reference(circuit)

    return circuit
