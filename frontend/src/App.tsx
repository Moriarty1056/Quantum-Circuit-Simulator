import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import GatePalette from './components/GatePalette';
import CircuitCanvas from './components/CircuitCanvas';
import BlochSphere from './components/BlochSphere';


export interface GatePlacement {
  gate: string;
  wires: number[];
  time: number;
}

function App() {
  // Circuit = list of placed gates
  const [circuit, setCircuit] = useState<GatePlacement[]>([]);
  const [simResult, setSimResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);


  // Called whenever a <Cell> is dropped on
  const handlePlaceGate = (gate: string, wire: number, time: number) => {
    setCircuit((prev) => {
      // Optionally: prevent double-placing in the same cell
      const exists = prev.some(
        (g) => g.wires[0] === wire && g.time === time
      );
      if (exists) return prev;

      return [...prev, { gate, wires: [wire], time }];
    });
  };

  /** Compute (x,y,z) for qubit `q` in an n-qubit state vector */
function getBlochCoords(
  state: {real:number,imag:number}[],
  q: number,
  nQubits: number
) {
  const N = 1 << nQubits;
  const bitPos = nQubits - q - 1;

  let rho00 = 0, rho11 = 0;
  let rho01 = { real: 0, imag: 0 };

  for (let k = 0; k < N; k++) {
    const ampK = state[k];
    const probK = ampK.real**2 + ampK.imag**2;
    const bit = (k >> bitPos) & 1;

    // populations
    if (bit === 0) rho00 += probK;
    else           rho11 += probK;

    // off‐diagonal term only when this bit=0
    if (bit === 0) {
      const j = k | (1 << bitPos);
      const ampJ = state[j];
      // conj(ψ_k) * ψ_j
      const cr =  ampK.real;
      const ci = -ampK.imag;
      rho01.real += cr * ampJ.real + ci * ampJ.imag;
      rho01.imag += cr * ampJ.imag - ci * ampJ.real;
    }
  }

  return {
    x:  2 * rho01.real,
    y: -2 * rho01.imag,  // note the minus sign convention
    z:   rho00 - rho11
  };
}



  async function runSimulation() {
  setLoading(true);
  setError(null);
  try {
    const resp = await fetch('http://127.0.0.1:8000/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        n_qubits: 3,
        circuit,
      }),
    });
    if (!resp.ok) throw new Error(await resp.text());
    const data = await resp.json();
    setSimResult(data);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}


  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', gap: 20, marginTop: 40 }}>
        {/* Left palette + canvas */}
        <div>
          <h2 style={{ color: 'white' }}>Gates</h2>
          <GatePalette />

          <h2 style={{ color: 'white', marginTop: 20 }}>Circuit</h2>
          <CircuitCanvas
            nQubits={3}
            nSteps={5}
            circuit={circuit}
            onPlaceGate={handlePlaceGate}
          />
        </div>

        {/* Right panel: show JSON & debug */}
        <div style={{ color: 'white', fontFamily: 'monospace' }}>
          <h3>Current Circuit JSON</h3>
          <pre
            style={{
              background: '#222',
              padding: 10,
              borderRadius: 4,
              maxHeight: '60vh',
              overflow: 'auto',
            }}
          >
            {JSON.stringify(circuit, null, 2)}
          </pre>
        </div>
        <div style={{ marginTop: 20 }}>
  <button
    onClick={runSimulation}
    disabled={loading}
    style={{ padding: '8px 16px', cursor: 'pointer' }}
  >
    {loading ? 'Running…' : 'Run Simulation'}
  </button>

  {error && (
    <div style={{ color: 'salmon', marginTop: 8 }}>
      Error: {error}
    </div>
  )}

  {simResult && (
    <div style={{ marginTop: 16 }}>
      <h3>Raw Simulation Output</h3>
      <pre
        style={{
          background: '#222',
          padding: 10,
          borderRadius: 4,
          maxHeight: '40vh',
          overflow: 'auto',
        }}
      >
        {JSON.stringify(simResult, null, 2)}
      </pre>
    </div>
  )}
  {simResult && (
  <div style={{ display: 'flex', gap: 20, marginTop: 24 }}>
    {Array.from({ length: 3 }).map((_, q) => {
      const { x, y, z } = getBlochCoords(simResult.state, q, 3);
      return (
        <div key={q}>
          <h4 style={{ color: 'white', textAlign: 'center' }}>
            Qubit {q}
          </h4>
          <BlochSphere x={x} y={y} z={z} />
        </div>
      );
    })}
  </div>
)}

</div>

      </div>
    </DndProvider>
  );
}

export default App;
