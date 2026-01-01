import json
from dataclasses import asdict

def circuit_to_json(circuit):
    return json.dumps(asdict(circuit), indent=2)
