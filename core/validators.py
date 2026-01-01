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


def validate_electrical_reference(circuit: Circuit):
    """Enforce Phase-2 electrical reference rules:

    - Exactly one reference net named 'GND' must exist.
    - At least one pin with role=='ground' must be connected to 'GND'.
    """
    # Check for a single GND net
    gnd_net = circuit.nets.get("GND")
    if gnd_net is None:
        raise ValueError("Electrical rule: missing reference net 'GND'")

    # Ensure at least one pin on GND has role=ground
    found = False
    for pin_id in gnd_net.pins:
        if "." not in pin_id:
            continue
        comp_id, pin_name = pin_id.split(".", 1)
        comp = circuit.components.get(comp_id)
        if not comp:
            continue
        pin = comp.pins.get(pin_name)
        if pin and pin.role == "ground":
            found = True
            break

    if not found:
        raise ValueError("Electrical rule: no pin with role=ground connected to 'GND'")

    # No pin with role=ground may be connected to any other net
    for comp in circuit.components.values():
        for pin in comp.pins.values():
            if pin.role == "ground":
                if pin.net != "GND":
                    raise ValueError(f"Electrical rule: pin {pin.id} has role=ground but is connected to non-GND net '{pin.net}'")

