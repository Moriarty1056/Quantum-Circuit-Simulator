# from fastapi import FastAPI
# from pydantic import BaseModel
# from typing import List
# from simulator.engine import simulate

# class GateOp(BaseModel):
#     gate: str
#     wires: List[int]
#     time: int

# class CircuitRequest(BaseModel):
#     circuit: List[GateOp]
#     n_qubits: int

# app = FastAPI()

# @app.post("/simulate")
# async def run_sim(circ_req: CircuitRequest):
#     # 1) run the simulation
#     state = simulate(
#         circuit=[op.dict() for op in circ_req.circuit],
#         n_qubits=circ_req.n_qubits
#     )

#     # 2) convert to a JSON-serializable list of {real, imag} dicts
#     serializable = [
#         {"real": float(ampl.real), "imag": float(ampl.imag)}
#         for ampl in state
#     ]

#     return {"state": serializable}
# from fastapi.middleware.cors import CORSMiddleware
# # ... your other imports ...

# app = FastAPI()

# # === add this block immediately after creating `app` ===
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],   # your React app's address
#     allow_credentials=True,
#     allow_methods=["*"],                       # GET, POST, etc.
#     allow_headers=["*"],                       # Content-Type, Authorization, …
# )
# # ========================================================

# # ... your existing /simulate endpoint and other code ...
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from simulator.engine import simulate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GateOp(BaseModel):
    gate: str
    wires: List[int]
    time: int

class CircuitRequest(BaseModel):
    circuit: List[GateOp]
    n_qubits: int

@app.post("/simulate")
async def run_sim(circ_req: CircuitRequest):
    state = simulate(
        circuit=[op.dict() for op in circ_req.circuit],
        n_qubits=circ_req.n_qubits
    )
    return {"state": [
        {"real": float(z.real), "imag": float(z.imag)} for z in state
    ]}
