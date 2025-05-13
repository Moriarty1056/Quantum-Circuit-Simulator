// import { monitorEventLoopDelay } from "perf_hooks";
// import React from "react";
// import { useDrag } from "react-dnd";

// const gates = ['H','X','CNOT'] as const;                
// type GateType = typeof gates[number];

// interface GateItemProps {
//     gate: GateType;     
// }

// const GateItem: React.FC<GateItemProps> = ({gate})  => {
//     const [{ isDragging}, drag] = useDrag(() => ({
//         type: 'Gate',
//         item: { gate},
//         collect: (monitor) => ({ isDragging: ! !monitor.isDragging() }),

//     }));

//     return (
//  <div
//    ref={(node: HTMLDivElement | null): void => {
//      drag(node);
//    }}
            
//             style={{
//                 opacity: isDragging ? .5:1,
//                 border: '1px solid gray',
//                 padding: 8,
//                 marginBottom: 4,
//                 cursor: 'move',
//                 textAlign: 'center',
//             }}
//         >
//             {gate}          
//         </div>    
//     );
// };


// export default function GatePallete() {
//     return (
//         <div style={{width: 100}} >
//             <h3>Gates</h3>
//             {gates.map((g) => (
//                 <GateItem key={g} gate ={g} />
//             ))}
//         </div>
//     );
// }
// src/components/GatePalette.tsx
import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';

const gates = ['H', 'X', 'CNOT'] as const;

export default function GatePalette() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {gates.map((gate) => (
        <Gate key={gate} gate={gate} />
      ))}
    </div>
  );
}

function Gate({ gate }: { gate: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'GATE',
      item: { gate },
      collect: (mon) => ({ isDragging: mon.isDragging() }),
    }),
    [gate]
  );

  // attach the drag source
  drag(ref);

  useEffect(() => {
    if (isDragging) console.log(`✈️ dragging ${gate}`);
  }, [isDragging, gate]);

  return (
    <div
      ref={ref}
      style={{
        width: 60,
        padding: 8,
        background: isDragging ? 'orange' : 'steelblue',
        color: 'white',
        textAlign: 'center',
        cursor: 'grab',
      }}
    >
      {gate}
    </div>
  );
}
