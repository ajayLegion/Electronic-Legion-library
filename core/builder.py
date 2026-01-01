from core.models import Circuit, Net


def connect(circuit: Circuit, net_id: str, pin_id: str):
    if net_id not in circuit.nets:
        circuit.nets[net_id] = Net(id=net_id)

    # avoid duplicate entries
    if pin_id not in circuit.nets[net_id].pins:
        circuit.nets[net_id].pins.append(pin_id)

    if "." not in pin_id:
        raise ValueError(f"Invalid pin id: {pin_id}")

    comp_id, pin_name = pin_id.split(".", 1)
    if comp_id not in circuit.components:
        raise KeyError(f"Component {comp_id} not found in circuit")

    comp = circuit.components[comp_id]
    if pin_name not in comp.pins:
        raise KeyError(f"Pin {pin_name} not found on component {comp_id}")

    # assign net to pin (single net per pin)
    comp.pins[pin_name].net = net_id
