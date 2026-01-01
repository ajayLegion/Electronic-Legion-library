from core.models import Circuit


def validate_circuit(circuit: Circuit):
    # Check for duplicate pin IDs and floating pins
    seen_pins = set()
    for comp in circuit.components.values():
        for pin in comp.pins.values():
            if pin.id in seen_pins:
                raise ValueError(f"Duplicate pin id: {pin.id}")
            seen_pins.add(pin.id)
            if pin.net is None:
                raise ValueError(f"Floating pin: {pin.id}")

    # Every net must connect >= 2 pins and reference existing pins
    for net in circuit.nets.values():
        if len(net.pins) < 2:
            raise ValueError(f"Net {net.id} has less than 2 pins")
        for pin_id in net.pins:
            if "." not in pin_id:
                raise ValueError(f"Invalid pin reference in net {net.id}: {pin_id}")
            comp_id, pin_name = pin_id.split(".", 1)
            if comp_id not in circuit.components:
                raise ValueError(f"Net {net.id} references unknown component {comp_id}")
            if pin_name not in circuit.components[comp_id].pins:
                raise ValueError(f"Net {net.id} references unknown pin {pin_name} on {comp_id}")
