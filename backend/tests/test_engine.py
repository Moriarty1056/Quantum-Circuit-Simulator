# backend/tests/test_engine.py

import numpy as np
import pytest
from simulator.engine import simulate

def close(a, b, tol=1e-6):
    return np.allclose(a, b, atol=tol)

def test_h_on_zero():
    # 1-qubit, H|0> = (|0> + |1>)/√2
    circuit = [{"gate":"H", "wires":[0], "time":0}]
    out = simulate(circuit, n_qubits=1)
    expected = np.array([1/np.sqrt(2), 1/np.sqrt(2)], dtype=complex)
    assert close(out, expected)

def test_x_on_one():
    # 1-qubit, X|1> = |0>⟶|1>; but we start in |0>, so to test X|1>:
    #  apply X twice → back to |0>
    circuit = [
        {"gate":"X", "wires":[0], "time":0},
        {"gate":"X", "wires":[0], "time":1},
    ]
    out = simulate(circuit, n_qubits=1)
    expected = np.array([1, 0], dtype=complex)
    assert close(out, expected)

def test_cnot_entangles():
    # 2-qubit Bell prep: H on wire 0, then CNOT(0→1) → (|00>+|11>)/√2
    circuit = [
        {"gate":"H",    "wires":[0],      "time":0},
        {"gate":"CNOT", "wires":[0, 1],   "time":1},
    ]
    out = simulate(circuit, n_qubits=2)
    expected = np.zeros(4, dtype=complex)
    expected[0] = 1/np.sqrt(2)
    expected[3] = 1/np.sqrt(2)
    assert close(out, expected)

def test_qubit_limit():
    with pytest.raises(ValueError):
        simulate([], n_qubits=11)
