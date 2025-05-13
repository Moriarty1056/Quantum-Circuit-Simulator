// src/components/Cell.tsx
import React from 'react';
import { useDrop } from 'react-dnd';

export interface CellProps {
  row: number;
  col: number;
  onDrop: (gate: string, wire: number, time: number) => void;
  placedGate?: string;
}

export default function Cell({ row, col, onDrop, placedGate }: CellProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: 'GATE',
      drop: (item: any) => {
        console.log(`🔥 dropped ${item.gate} on (${row},${col})`);
        onDrop(item.gate, row, col);
      },
      collect: (mon) => ({
        isOver: mon.isOver(),
        canDrop: mon.canDrop(),
      }),
    }),
    [row, col]
  );

  drop(ref); // attach the drop target

  return (
    <div
      ref={ref}
      style={{
        width: 60,
        height: 60,
        margin: 2,
        background: isOver && canDrop ? 'limegreen' : 'darkslategray',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
      }}
    >
      {placedGate || (isOver && canDrop ? '🟢' : null)}
    </div>
  );
}
