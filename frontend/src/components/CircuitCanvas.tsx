// import React from 'react';
// import { useDrop } from 'react-dnd';

// interface CellProps {
//   row: number;
//   col: number;
//   onDrop: (gate: string, wire: number, time: number) => void;
//   placedGate?: string;
// }

// const Cell: React.FC<CellProps> = ({ row, col, onDrop, placedGate }) => {
//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: 'GATE',
//     drop: (item: { gate: string }) => onDrop(item.gate, row, col),
//     collect: (monitor) => ({ isOver: !!monitor.isOver() }),
//   }));

//  return (
//      <div
//    ref={(node: HTMLDivElement | null): void => {
//      drop(node);
//    }}
//         style={{
//         width: 60,
//         height: 60,
//         border: '1px solid black',
//         backgroundColor: isOver ? '#e0f7ff' : 'white',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}
//     >
//       {placedGate || null}
//     </div>
//   );
// };

// interface CanvasProps {
//   nQubits: number;
//   nSteps: number;
//   circuit: { gate: string; wires: number[]; time: number }[];
//   onPlaceGate: (gate: string, wire: number, time: number) => void;
// }

// export default function CircuitCanvas({
//   nQubits,
//   nSteps,
//   circuit,
//   onPlaceGate,
// }: CanvasProps) {
//   return (
//     <div
//       style={{
//         display: 'grid',
//         gridTemplateColumns: `repeat(${nSteps}, 60px)`,
//         gridGap: 4,
//       }}
//     >
//       {Array.from({ length: nQubits }).flatMap((_, row) =>
//         Array.from({ length: nSteps }).map((_, col) => {
//           const placed = circuit.find(
//             (c) => c.wires[0] === row && c.time === col
//           );
//           return (
//             <Cell
//               key={`${row}-${col}`}
//               row={row}
//               col={col}
//               onDrop={onPlaceGate}
//               placedGate={placed?.gate}
//             />
//           );
//         })
//       )}
//     </div>
//   );
// }
// src/components/CircuitCanvas.tsx
// src/components/CircuitCanvas.tsx
import React from 'react';
import Cell, { CellProps } from './Cell';
import { GatePlacement } from '../App';

export interface CircuitCanvasProps {
  nQubits: number;
  nSteps: number;
  circuit: GatePlacement[];
  onPlaceGate: (gate: string, wire: number, time: number) => void;
}

export default function CircuitCanvas({
  nQubits,
  nSteps,
  circuit,
  onPlaceGate,
}: CircuitCanvasProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${nSteps}, 60px)`,
        gap: 4,
      }}
    >
      {Array.from({ length: nQubits }).flatMap((_, wire) =>
        Array.from({ length: nSteps }).map((_, time) => {
          // find if we already placed a gate here
          const placed = circuit.find(
            (g) => g.wires[0] === wire && g.time === time
          );
          return (
            <Cell
              key={`${wire}-${time}`}
              row={wire}
              col={time}
              onDrop={onPlaceGate}
              placedGate={placed?.gate}
            />
          );
        })
      )}
    </div>
  );
}

