# backend/simulator/engine.py

import numpy as np
from typing import List, Dict

# --- Gate definitions -------------------------------------------------------

def H() -> np.ndarray:
    """Hadamard gate."""
    return (1 / np.sqrt(2)) * np.array([[1,  1],
                                        [1, -1]], dtype=complex)

def X() -> np.ndarray:
    """Pauli-X (NOT) gate."""
    return np.array([[0, 1],
                     [1, 0]], dtype=complex)

def CNOT() -> np.ndarray:
    """Controlled-NOT on two qubits."""
    return np.array([[1, 0, 0, 0],
                     [0, 1, 0, 0],
                     [0, 0, 0, 1],
                     [0, 0, 1, 0]], dtype=complex)

# Map names → matrices
GATE_MAP = {
    "H": H,
    "X": X,
    "CNOT": CNOT,
}

# --- Core engine ------------------------------------------------------------

def apply_single_qubit_gate(state: np.ndarray,
                            gate: np.ndarray,
                            wire: int,
                            n_qubits: int) -> np.ndarray:
    """
    Apply a 2×2 gate to `state` on the given `wire` (0-indexed).
    Returns the new state vector.
    """
    # Build the tensor product of identities and the gate
    ops = []
    for i in range(n_qubits):
        ops.append(gate if i == wire else np.eye(2, dtype=complex))
    full_op = ops[0]
    for op in ops[1:]:
        full_op = np.kron(full_op, op)

    return full_op @ state


def apply_two_qubit_gate(state: np.ndarray,
                         gate: np.ndarray,
                         wires: List[int],
                         n_qubits: int) -> np.ndarray:
    """
    Apply a 4×4 two-qubit gate (e.g. CNOT) on the given `wires` = [control, target].
    """
    # Build the tensor product, inserting the 4×4 gate on the joint wires
    ops: List[np.ndarray] = []
    for i in range(n_qubits):
        if i == wires[0]:
            # insert the 4×4 block covering wires[0] and wires[1]
            ops.append(gate)
        elif i == wires[1]:
            # skip the second wire (already consumed)
            continue
        else:
            ops.append(np.eye(2, dtype=complex))

    full_op = ops[0]
    for op in ops[1:]:
        full_op = np.kron(full_op, op)

    return full_op @ state


def simulate(circuit: List[Dict], n_qubits: int) -> np.ndarray:
    """
    Run through the list of placements:
      circuit = [
        {"gate":"H",    "wires":[0],    "time":0},
        {"gate":"CNOT", "wires":[0,1],  "time":1},
        ...
      ]
    Returns the final state vector of length 2**n_qubits.
    Caps n_qubits at 10.
    """
    if n_qubits > 10:
        raise ValueError("n_qubits > 10 not supported")

    # Start in |0...0>
    state = np.zeros(2**n_qubits, dtype=complex)
    state[0] = 1.0

    # Sort by time so we apply in the right order
    for op in sorted(circuit, key=lambda x: x["time"]):
        name = op["gate"]
        wires = op["wires"]
        mat = GATE_MAP[name]()  # instantiate the matrix

        if len(wires) == 1:
            state = apply_single_qubit_gate(state, mat, wires[0], n_qubits)
        elif len(wires) == 2:
            state = apply_two_qubit_gate(state, mat, wires, n_qubits)
        else:
            raise ValueError("Only 1- or 2-qubit gates supported")

    return state
