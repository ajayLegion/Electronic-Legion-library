import yaml
from core.models import Component, Pin


def load_component(yaml_path: str, instance_id: str) -> Component:
    with open(yaml_path, "r") as f:
        data = yaml.safe_load(f)

    if "pins" not in data:
        raise ValueError(f"Component YAML {yaml_path} missing 'pins' section")

    pins = {}
    for pin_name, pin_data in data["pins"].items():
        pin_id = f"{instance_id}.{pin_name}"
        pins[str(pin_name)] = Pin(
            id=pin_id,
            name=str(pin_name),
            parent=instance_id,
            direction=pin_data.get("direction", "passive"),
            role=pin_data.get("role"),
            net=None,
        )

    return Component(
        id=instance_id,
        type=data.get("type"),
        value=data.get("value"),
        pins=pins,
    )
